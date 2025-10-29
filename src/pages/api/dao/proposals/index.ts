// src/pages/api/dao/proposals/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';
import { connection } from '../../../../lib/connection';
import { PublicKey } from '@solana/web3.js';

// lazy prisma

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const proposals = await prisma.proposal.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json(proposals);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching proposals' });
    }
  } else if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Require paymentTxSig (a signed on-chain transaction that paid the proposal fee)
    // This simple implementation verifies that the provided txSig contains a SOL transfer
    // to the configured DAO treasury address. It also checks that the payerPubkey is
    // one of the authenticated user's stored wallet addresses.

    const { title, description, votingEnds, coin, paymentTxSig, payerPubkey } =
      req.body;

    if (!title || !description || !votingEnds || !coin) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Require a payment transaction for creating proposals
    if (!paymentTxSig || !payerPubkey) {
      res.status(402).json({
        message:
          'Payment required: include paymentTxSig and payerPubkey in request body',
      });
      return;
    }

    const DAO_TREASURY = process.env.DAO_TREASURY_PUBKEY;
    if (!DAO_TREASURY) {
      res
        .status(500)
        .json({ message: 'DAO_TREASURY_PUBKEY not configured on server' });
      return;
    }

    try {
      // Ensure the authenticated user actually controls the payerPubkey
      const userWallet = await prisma.walletAddress.findFirst({
        where: { userId: session.user.id, address: payerPubkey },
      });
      if (!userWallet) {
        res.status(403).json({
          message:
            'Provided payerPubkey is not associated with authenticated user',
        });
        return;
      }

      // Fetch the transaction from RPC
      const tx = await connection.getTransaction(paymentTxSig, {
        commitment: 'confirmed',
      });
      if (!tx || !tx.meta || !tx.transaction) {
        res.status(400).json({
          message: 'Payment transaction not found or not confirmed on-chain',
        });
        return;
      }

      // Prevent reuse of the same payment transaction
      if (paymentTxSig) {
        const existing = await prisma.proposal.findFirst({
          where: { paymentTxSig: paymentTxSig } as any,
        });
        if (existing) {
          res.status(409).json({
            message:
              'This payment transaction has already been used to create a proposal',
          });
          return;
        }
      }

      // Map account keys to strings for balance diffs
      const accountKeys = tx.transaction.message.accountKeys.map((k: any) =>
        typeof k === 'string' ? k : k.pubkey?.toBase58?.() || k.toBase58()
      );
      const pre = tx.meta.preBalances || [];
      const post = tx.meta.postBalances || [];

      // By default, check SOL transfer to DAO_TREASURY_PUBKEY
      let paidToTreasury = false;
      if (DAO_TREASURY) {
        const treasuryIndex = accountKeys.findIndex(
          (k: string) => k === DAO_TREASURY
        );
        paidToTreasury =
          treasuryIndex >= 0 &&
          post[treasuryIndex] - (pre[treasuryIndex] || 0) > 0;
      }

      // If a paymentTokenMint was provided, also allow SPL-token payments to a configured DAO token account
      const { paymentTokenMint } = req.body;
      const DAO_TREASURY_TOKEN_ACCOUNT = process.env.DAO_TREASURY_TOKEN_ACCOUNT; // optional

      let paidToTreasuryToken = false;
      if (
        paymentTokenMint &&
        (DAO_TREASURY_TOKEN_ACCOUNT || req.body.daoTokenAccount)
      ) {
        const daoTokenAccount =
          req.body.daoTokenAccount || DAO_TREASURY_TOKEN_ACCOUNT;
        // find the index of the dao token account in accounts
        const treasuryTokenIndex = accountKeys.findIndex(
          (k: string) => k === daoTokenAccount
        );
        const preToken = tx.meta.preTokenBalances || [];
        const postToken = tx.meta.postTokenBalances || [];

        // token balance entries use accountIndex to point into accountKeys
        const treasuryPre = preToken.find(
          (t: any) =>
            String(t.accountIndex) === String(treasuryTokenIndex) &&
            t.mint === paymentTokenMint
        );
        const treasuryPost = postToken.find(
          (t: any) =>
            String(t.accountIndex) === String(treasuryTokenIndex) &&
            t.mint === paymentTokenMint
        );
        if (treasuryPre && treasuryPost) {
          // compare uiAmount or amount fields
          const preAmt =
            (treasuryPre.uiTokenAmount?.uiAmount ??
              parseInt(treasuryPre.uiTokenAmount?.amount || '0')) ||
            0;
          const postAmt =
            (treasuryPost.uiTokenAmount?.uiAmount ??
              parseInt(treasuryPost.uiTokenAmount?.amount || '0')) ||
            0;
          paidToTreasuryToken = postAmt > preAmt;
        }
      }

      if (!paidToTreasury && !paidToTreasuryToken) {
        res.status(400).json({
          message:
            'Payment transaction does not include a transfer to the DAO treasury (SOL or SPL token)',
        });
        return;
      }

      // Ensure the payerPubkey signed / participated in the transaction (is present in accountKeys and had a balance decrease or token decrease)
      const payerIndex = accountKeys.findIndex(
        (k: string) => k === payerPubkey
      );
      let payerSpent = false;
      if (payerIndex >= 0) {
        payerSpent = pre[payerIndex] - (post[payerIndex] || 0) > 0;
      }

      // If SPL payment was used, check token balances for payer as well
      if (!payerSpent && paymentTokenMint) {
        const preToken = tx.meta.preTokenBalances || [];
        const postToken = tx.meta.postTokenBalances || [];
        const payerTokenPre = preToken.find(
          (t: any) =>
            String(t.accountIndex) === String(payerIndex) &&
            t.mint === paymentTokenMint
        );
        const payerTokenPost = postToken.find(
          (t: any) =>
            String(t.accountIndex) === String(payerIndex) &&
            t.mint === paymentTokenMint
        );
        if (payerTokenPre && payerTokenPost) {
          const preAmt =
            (payerTokenPre.uiTokenAmount?.uiAmount ??
              parseInt(payerTokenPre.uiTokenAmount?.amount || '0')) ||
            0;
          const postAmt =
            (payerTokenPost.uiTokenAmount?.uiAmount ??
              parseInt(payerTokenPost.uiTokenAmount?.amount || '0')) ||
            0;
          payerSpent = preAmt > postAmt;
        }
      }

      if (!payerSpent) {
        res.status(400).json({
          message:
            'Provided payerPubkey did not pay in the provided transaction',
        });
        return;
      }

      // Create proposal, payment record, and transaction atomically
      try {
        const lamportsSpent =
          payerIndex >= 0 ? pre[payerIndex] - (post[payerIndex] || 0) : 0;
        // Attempt to derive token amount for SPL payments (if available)
        let tokenAmount: number | null = null;
        if (paymentTokenMint) {
          const preToken = tx.meta.preTokenBalances || [];
          const postToken = tx.meta.postTokenBalances || [];
          const payerTokenPre = preToken.find(
            (t: any) =>
              String(t.accountIndex) === String(payerIndex) &&
              t.mint === paymentTokenMint
          );
          const payerTokenPost = postToken.find(
            (t: any) =>
              String(t.accountIndex) === String(payerIndex) &&
              t.mint === paymentTokenMint
          );
          if (payerTokenPre && payerTokenPost) {
            const preAmt = Number(payerTokenPre.uiTokenAmount?.amount ?? 0);
            const postAmt = Number(payerTokenPost.uiTokenAmount?.amount ?? 0);
            tokenAmount = preAmt - postAmt;
          }
        }

        const created = await prisma.$transaction(async (txClient) => {
          const proposal = await txClient.proposal.create({
            data: {
              title,
              description,
              votingEnds,
              coin,
              paymentTxSig: paymentTxSig || null,
              paymentTokenMint: (req.body.paymentTokenMint as string) || null,
              createdBy: { connect: { id: session.user.id } },
            },
          });

          await txClient.payment.create({
            data: {
              txSig: paymentTxSig,
              payerPubkey: payerPubkey,
              coinId: coin,
              lamports: lamportsSpent || undefined,
              tokenMint: paymentTokenMint || undefined,
              tokenAmount: tokenAmount || undefined,
              proposalId: proposal.id,
            },
          });

          await txClient.transaction.create({
            data: {
              userId: session.user.id,
              coinId: coin,
              type: 'proposal',
              proposalId: proposal.id,
              amount: 0,
              price: 0,
            },
          });

          return proposal;
        });

        res.status(201).json(created);
      } catch (dbErr) {
        console.error('[proposals] transactional create failed', dbErr);
        res
          .status(500)
          .json({
            message: 'Failed to create proposal',
            error: (dbErr as any)?.message,
          });
      }
    } catch (error) {
      console.error('[proposals] create error', error);
      res.status(500).json({
        message: 'Error creating proposal',
        error: (error as any)?.message,
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
