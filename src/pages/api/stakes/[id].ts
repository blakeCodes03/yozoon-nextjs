// src/pages/api/stakes/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getSession } from 'next-auth/react';

// lazy prisma

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    res.status(400).json({ message: 'Invalid stake ID' });
    return;
  }

  if (req.method === 'GET') {
    // Get staking details
    try {
      const stake = await prisma.stake.findUnique({
        where: { id },
        select: {
          id: true,
          userId: true,
          coinId: true,
          amount: true,
          createdAt: true,
        },
      });
      if (stake) {
        res.status(200).json(stake);
      } else {
        res.status(404).json({ message: 'Stake not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching stake' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
