// src/pages/api/coins/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    res.status(400).json({ message: 'Invalid coin ID' });
    return;
  }

  const session = await getSession({ req });

  if (req.method === 'GET') {
    // Get coin details
    try {
      const coin = await prisma.coin.findUnique({
        where: { id },
        include: {
          chatMessages: true,
          bondingCurve: { include: { feeStructure: true } },
        },
      });

      if (coin) {
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
          holders, // Correctly calculated holders          
          chatMessages: await prisma.chatMessage.count({
            where: { coinId: id },
          }),
        });
      } else {
        res.status(404).json({ message: 'Coin not found' });
      }
    } catch (error) {
      console.error('Error fetching coin:', error);
      res.status(500).json({ message: 'Error fetching coin' });
    }
  } else if (req.method === 'PUT') {
    // Update coin
    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    res.status(405).json({ message: 'Not Allowed' });
    return;

    // // Verify that the user is the creator
    // const coin = await prisma.coin.findUnique({ where: { id } });
    // if (!coin) {
    //   res.status(404).json({ message: 'Coin not found' });
    //   return;
    // }

    // if (coin.creatorId !== session.user.id) {
    //   res.status(403).json({ message: 'Forbidden' });
    //   return;
    // }

    // const { name, ticker, description, pictureUrl, socialLinks, airdropAmount, status } = req.body;

    // try {
    //   const updatedCoin = await prisma.coin.update({
    //     where: { id },
    //     data: {
    //       name,
    //       ticker,
    //       description,
    //       pictureUrl,
    //       socialLinks,
    //       airdropAmount: airdropAmount ? new Prisma.Decimal(airdropAmount) : new Prisma.Decimal(0),
    //       status, // Update status if provided
    //     },
    //   });
    //   res.status(200).json(updatedCoin);
    // } catch (error: any) {
    //   console.error('Error updating coin:', error);
    //   if (error.code === 'P2025') {
    //     res.status(404).json({ message: 'Coin not found' });
    //   } else if (error.code === 'P2002') {
    //     res.status(409).json({ message: 'Ticker already exists' });
    //   } else {
    //     res.status(500).json({ message: 'Error updating coin' });
    //   }
    // }
  } else if (req.method === 'DELETE') {
    // Delete coin
    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    //prevent deleting coins from the frontend
    res.status(405).json({ message: 'Not Allowed' });
    return;

    // // Verify that the user is the creator
    // const coin = await prisma.coin.findUnique({ where: { id } });
    // if (!coin) {
    //   res.status(404).json({ message: 'Coin not found' });
    //   return;
    // }

    // if (coin.creatorId !== session.user.id) {
    //   res.status(403).json({ message: 'Forbidden' });
    //   return;
    // }

    // try {
    //   await prisma.coin.delete({
    //     where: { id },
    //   });
    //   res.status(200).json({ message: 'Coin deleted successfully' });
    // } catch (error: any) {
    //   console.error('Error deleting coin:', error);
    //   if (error.code === 'P2025') {
    //     res.status(404).json({ message: 'Coin not found' });
    //   } else {
    //     res.status(500).json({ message: 'Error deleting coin' });
    //   }
    // }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
