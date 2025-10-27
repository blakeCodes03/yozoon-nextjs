import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import prisma from "../../../lib/prisma";


// const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    res.status(400).json({ message: 'Invalid coin ID' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const coin = await prisma.coin.findUnique({
        where: { id },
        include: {
          chatMessages: true,
          bondingCurve: { include: { feeStructure: true } },
          tokenHoldings: true, // Include token holders
          hashtags: true, // Include hashtags
          priceHistory: true, // Include price history
        },
      });

      if (!coin) {
        res.status(404).json({ message: 'Coin not found' });
        return;
      }

      // Calculate holders by counting TokenHolding records with amount > 0
      const holders = await prisma.tokenHolding.count({
        where: {
          coinId: id,
          amount: {
            gt: 0,
          },
        },
      });

      res.status(200).json({
        ...coin,
        totalSupply: Number(coin.totalSupply),
        airdropAmount: Number(coin.airdropAmount),
        marketCap: Number(coin.marketCap),
        holders, // Include holders count
        chatMessages: await prisma.chatMessage.count({ where: { coinId: id } }),
      });
    } catch (error) {
      console.error('Error fetching coin:', error);
      res.status(500).json({ message: 'Error fetching coin' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}