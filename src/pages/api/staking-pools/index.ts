// src/pages/api/mining-pools/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getSession } from 'next-auth/react';

// lazy prisma

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { coinId, poolName, stakeAmount } = req.body;

    if (!coinId || !poolName || !stakeAmount) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    try {
      const miningPool = await prisma.miningPool.create({
        data: {
          coinId,
          poolName,
          stakeAmount: BigInt(stakeAmount),
          userId: session.user.id,
        },
      });
      res.status(201).json(miningPool);
    } catch (error) {
      res.status(500).json({ message: 'Error creating mining pool' });
    }
  } else if (req.method === 'GET') {
    try {
      const miningPools = await prisma.miningPool.findMany({
        include: { user: { select: { username: true } } },
      });
      res.status(200).json(miningPools);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching mining pools' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
