import { NextApiRequest, NextApiResponse } from 'next';
import { connection } from '@/lib/connection';
import { PublicKey } from '@solana/web3.js';

// GET /api/wallet/history?address=<pubkey>&limit=25
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const address = (req.query.address as string) || (req.query.addr as string);
  const limit = parseInt((req.query.limit as string) || '25', 10);
  const filterMint = (req.query.mint as string) || undefined;
  const bondingProgramId = (req.query.programId as string) || undefined; // optional program id to classify buy/sell

  if (!address) {
    res.status(400).json({ message: 'Missing address query parameter' });
    return;
  }

  try {
    const pub = new PublicKey(address);
    // Fetch recent signatures for the address
    const sigs = await connection.getSignaturesForAddress(pub, { limit });

    // Fetch full txs in parallel (bounded)
    const txPromises = sigs.map((s) =>
      connection.getTransaction(s.signature, { commitment: 'confirmed' })
    );
    const txs = await Promise.all(txPromises);
    const results: any[] = [];

    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i];
      const sig = sigs[i].signature;
      if (!tx) {
        results.push({ signature: sig, error: 'not found' });
        continue;
      }

      const accountKeys: string[] = tx.transaction.message.accountKeys.map(
        (k: any) =>
          typeof k === 'string' ? k : k.pubkey?.toBase58?.() || k.toBase58()
      );

      const events: any[] = [];

      // SOL balance change for the provided address (if present in accountKeys)
      try {
        const preBalances = tx.meta?.preBalances || [];
        const postBalances = tx.meta?.postBalances || [];
        const addrIndex = accountKeys.findIndex((k) => k === address);
        if (addrIndex >= 0) {
          const pre = preBalances[addrIndex] ?? 0;
          const post = postBalances[addrIndex] ?? 0;
          const delta = post - pre;
          if (delta !== 0) {
            events.push({
              type: 'sol_balance_change',
              amount: delta,
              account: address,
              direction: delta > 0 ? 'in' : 'out',
            });
          }
        }
      } catch (e) {
        // ignore
      }

      // Token balance deltas (SPL)
      const preToken = tx.meta?.preTokenBalances || [];
      const postToken = tx.meta?.postTokenBalances || [];
      // collect unique (accountIndex, mint) pairs
      const tokenKeys = new Map<
        string,
        { pre: any | null; post: any | null }
      >();

      preToken.forEach((t: any) => {
        const key = `${t.accountIndex}:${t.mint}`;
        tokenKeys.set(key, { pre: t, post: null });
      });
      postToken.forEach((t: any) => {
        const key = `${t.accountIndex}:${t.mint}`;
        const existing = tokenKeys.get(key);
        if (existing) existing.post = t;
        else tokenKeys.set(key, { pre: null, post: t });
      });

      tokenKeys.forEach((pair, key) => {
        const [accountIndexStr, mint] = key.split(':');
        if (filterMint && filterMint !== mint) return; // filter by mint if requested
        const accountIndex = Number(accountIndexStr);
        const accountPubkey = accountKeys[accountIndex];

        const preAmt = Number(pair.pre?.uiTokenAmount?.amount ?? 0);
        const postAmt = Number(pair.post?.uiTokenAmount?.amount ?? 0);
        const delta = postAmt - preAmt;
        if (delta === 0) return;

        // Determine if the affected account is (or is owned by) the address
        const owner = pair.post?.owner ?? pair.pre?.owner ?? null; // owner may be present in some RPC versions
        const isOwnedByAddress = owner === address || accountPubkey === address;

        // classify event type
        let evtType = 'transfer';
        if (bondingProgramId) {
          // if the transaction involves the bonding program id in top-level instructions, label buy/sell
          const insts = tx.transaction.message.instructions || [];
          const involvesBonding = insts.some((ins: any) => {
            const pid =
              typeof ins.programId === 'string'
                ? ins.programId
                : ins.programId?.toBase58?.();
            return pid === bondingProgramId || pid === bondingProgramId;
          });
          if (involvesBonding && isOwnedByAddress) {
            evtType = delta > 0 ? 'buy' : 'sell';
          }
        }

        events.push({
          type: evtType,
          mint,
          account: accountPubkey,
          owner: owner || null,
          amount: Math.abs(delta),
          direction: delta > 0 ? 'in' : 'out',
          confidence: isOwnedByAddress ? 'high' : 'low',
        });
      });

      results.push({
        signature: sig,
        slot: tx.slot,
        err: tx.meta?.err || null,
        timestamp: sigs[i].blockTime || null,
        fee: tx.meta?.fee || null,
        events,
        meta: tx.meta || null,
      });
    }

    res.status(200).json({ address, results });
  } catch (error) {
    console.error('[wallet/history] error', error);
    res.status(500).json({
      message: 'Failed to fetch wallet history',
      error: (error as any)?.message,
    });
  }
}