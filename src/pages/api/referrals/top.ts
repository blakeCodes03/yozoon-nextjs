// src/pages/api/referrals/top.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // Fetch top 10 referrers based on number of referrals
      const topReferrers = await prisma.user.findMany({
        where: {
          referrals: {
            some: {},
          },
        },
        include: {
          referrals: true,
        },
        orderBy: {
          referrals: {
            _count: 'desc',
          },
        },
        take: 10,
      });

      const referrers = topReferrers.map((user: any) => ({
        username: user.username,
        // rewards: user.reputation?.score || 0,
      }));

      res.status(200).json(referrers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching top referrers' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
