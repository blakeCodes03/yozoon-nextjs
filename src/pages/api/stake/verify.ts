import { NextApiRequest, NextApiResponse } from 'next';
import { connection } from '@/lib/connection';
import { PublicKey } from '@solana/web3.js';

// GET /api/stake/verify?owner=<pubkey>&mint=<tokenMint>&minAmount=<units>
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const owner = (req.query.owner as string) || (req.query.address as string);
  const mint = (req.query.mint as string) || undefined;
  const minAmount = parseFloat((req.query.minAmount as string) || '0');

  if (!owner || !mint) {
    res
      .status(400)
      .json({ message: 'owner and mint query parameters are required' });
    return;
  }

  try {
    const ownerPub = new PublicKey(owner);
    // fetch parsed token accounts by owner filtered by mint
    const resp = await connection.getParsedTokenAccountsByOwner(ownerPub, {
      mint: new PublicKey(mint),
    });
    let balance = 0;
    resp.value.forEach((acc) => {
      try {
        const amt = acc.account.data.parsed.info.tokenAmount.uiAmount;
        balance += Number(amt || 0);
      } catch (e) {
        // ignore parse errors
      }
    });

    const meets = balance >= minAmount;
    res.status(200).json({ owner, mint, balance, meets });
  } catch (error) {
    console.error('[stake/verify] error', error);
    res
      .status(500)
      .json({
        message: 'Failed to verify stake',
        error: (error as any)?.message,
      });
  }
}
