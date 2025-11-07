import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { connection } from '@/lib/connection';
import { PublicKey } from '@solana/web3.js';

// POST /api/airdrops/allocate
// body: { coinId, strategy: 'equal'|'proportional', totalAmount? }
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { coinId, strategy = 'proportional', totalAmount } = req.body;
  if (!coinId) {
    res.status(400).json({ message: 'coinId is required' });
    return;
  }

  try {
    const coin = await prisma.coin.findUnique({ where: { id: coinId } });
    if (!coin) {
      res.status(404).json({ message: 'Coin not found' });
      return;
    }

    const mint = coin.contractAddress;
    if (!mint) {
      res.status(400).json({ message: 'Coin has no tokenMint configured' });
      return;
    }

    const total =
      totalAmount != null
        ? Number(totalAmount)
        : Number(coin.airdropAmount || 0);
    if (!total || total <= 0) {
      res.status(400).json({ message: 'Airdrop total amount must be > 0' });
      return;
    }

    // Gather eligible holders (prefer DB TokenHolding if available)
    let holders: Array<{ address: string; amount: number }> = [];
    const dbHoldings = await prisma.tokenHolding.findMany({
      where: { coinId },
    });
    if (dbHoldings && dbHoldings.length > 0) {
      holders = dbHoldings.map((h) => ({
        address: h.userId,
        amount: Number(h.amount),
      }));
      // Note: db holdings store userId and coinId; mapping to wallet addresses may be required in UI
    } else {
      // Fallback: use RPC to get largest token accounts for mint and fetch balances
      const largest = await connection.getTokenLargestAccounts(
        new PublicKey(mint)
      );
      const pubkeys = largest.value.map((v) => v.address);
      const infos = await connection.getAccountInfo(pubkeys.map((p) => new PublicKey(p)) as any)
        .catch(() => null);
      // If parsed accounts aren't available, use the largest amounts directly
      holders = largest.value.map((v) => ({
        address: v.address.toBase58(),
        amount: Number(v.amount),
      }));
    }

    if (holders.length === 0) {
      res.status(200).json({ allocations: [] });
      return;
    }

    let allocations: Array<{ address: string; amount: number }> = [];
    if (strategy === 'equal') {
      const each = Math.floor(total / holders.length);
      allocations = holders.map((h) => ({ address: h.address, amount: each }));
      // distribute remainder
      let rem = total - each * holders.length;
      let idx = 0;
      while (rem > 0) {
        allocations[idx].amount += 1;
        rem -= 1;
        idx = (idx + 1) % allocations.length;
      }
    } else {
      // proportional
      const totalHold =
        holders.reduce((s, h) => s + Number(h.amount || 0), 0) || 1;
      allocations = holders.map((h) => ({
        address: h.address,
        amount: Math.floor((Number(h.amount) / totalHold) * total),
      }));
      // fix rounding remainder
      const allocated = allocations.reduce((s, a) => s + a.amount, 0);
      let rem = total - allocated;
      // sort holders by amount desc to assign remainder to largest holders
      allocations.sort((a, b) => b.amount - a.amount);
      let idx = 0;
      while (rem > 0 && allocations.length > 0) {
        allocations[idx].amount += 1;
        rem -= 1;
        idx = (idx + 1) % allocations.length;
      }
    }

    res.status(200).json({ coinId, total, strategy, allocations });
  } catch (error) {
    console.error('[airdrops/allocate] error', error);
    res
      .status(500)
      .json({
        message: 'Failed to compute allocations',
        error: (error as any)?.message,
      });
  }
}