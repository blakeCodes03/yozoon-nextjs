// src/pages/api/community/community-stats.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const userCount = await prisma.user.count();
      const coinCount = await prisma.coin.count();
      const activeVotes = await prisma.vote.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      });

      res.status(200).json({ userCount, coinCount, activeVotes });
    } catch (error) {
      console.error('Error fetching community stats:', error);
      res.status(500).json({ message: 'Failed to fetch community stats' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
