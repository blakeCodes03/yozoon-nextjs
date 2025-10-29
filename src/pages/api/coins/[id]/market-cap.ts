import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { connection } from '@/lib/connection';
import { PublicKey } from '@solana/web3.js';

// GET /api/coins/[id]/market-cap?treasuryAddresses=addr1,addr2
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (typeof id !== 'string')
    return res.status(400).json({ message: 'Invalid coin id' });

  try {
    const coin = await prisma.coin.findUnique({
      where: { id },
      include: { bondingCurve: true },
    });
    if (!coin) return res.status(404).json({ message: 'Coin not found' });

    // Determine supply
    let supplyTokens: number | null = null;
    const mint = coin.tokenMint;

    if (mint) {
      try {
        const supply = await connection.getTokenSupply(new PublicKey(mint));
        // supply.value.amount is a string in base units
        const amountBase = BigInt(supply.value.amount ?? '0');
        const decimals = supply.value.decimals ?? 0;
        // Convert to token units (float)
        supplyTokens = Number(amountBase) / Math.pow(10, decimals);

        // Optionally subtract treasury addresses to compute circulating supply
        const treasuryParam = (req.query.treasuryAddresses as string) || '';
        const treasuryAddrs = treasuryParam
          ? treasuryParam
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
        if (treasuryAddrs.length > 0) {
          // sum balances for those owners (parsed token accounts)
          let treasuryTotalBase = BigInt(0);
          for (const addr of treasuryAddrs) {
            try {
              const parsed = await connection.getParsedTokenAccountsByOwner(
                new PublicKey(addr),
                { mint: new PublicKey(mint) }
              );
              for (const acc of parsed.value) {
                try {
                  const ui = acc.account.data.parsed.info.tokenAmount.amount; // base units string
                  treasuryTotalBase += BigInt(ui ?? '0');
                } catch (e) {
                  // ignore parsing errors
                }
              }
            } catch (e) {
              // ignore per-address failures
            }
          }
          const treasuryTokens =
            Number(treasuryTotalBase) / Math.pow(10, decimals);
          supplyTokens = Math.max(0, supplyTokens - treasuryTokens);
        }
      } catch (e) {
        console.warn(
          '[market-cap] failed to fetch on-chain supply, falling back to DB totalSupply',
          e
        );
      }
    }

    if (supplyTokens == null) {
      // fallback to DB totalSupply
      supplyTokens = Number(coin.totalSupply || 0);
    }

    // Determine price: prefer recent DB priceHistory, then bondingCurve heuristic
    let price: number | null = null;
    try {
      const lastPrice = await prisma.priceHistory.findFirst({
        where: { coinId: id },
        orderBy: { timestamp: 'desc' },
      });
      if (lastPrice) price = Number(lastPrice.price);
    } catch (e) {
      console.warn('[market-cap] priceHistory lookup failed', e);
    }

    // If price still null and bondingCurve exists, try to estimate from curveDetail.pricePoints
    if (price == null && coin.bondingCurve) {
      try {
        const detail = coin.bondingCurve.curveDetail as any;
        if (
          detail &&
          Array.isArray(detail.pricePoints) &&
          detail.pricePoints.length > 0
        ) {
          // take last pricePoint as approximate price (assumes pricePoints are in base units)
          const last = detail.pricePoints[detail.pricePoints.length - 1];
          price = Number(last) / 1; // best-effort; adjust if curve stores in base units
        }
      } catch (e) {
        console.warn('[market-cap] bonding curve heuristic failed', e);
      }
    }

    const marketCap = price != null ? supplyTokens * price : null;

    res
      .status(200)
      .json({ coinId: id, supply: supplyTokens, price, marketCap });
  } catch (error) {
    console.error('[market-cap] error', error);
    res
      .status(500)
      .json({
        message: 'Failed to compute market cap',
        error: (error as any)?.message,
      });
  }
}
