// src/pages/api/votes/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    res.status(400).json({ message: 'Invalid vote ID' });
    return;
  }

  if (req.method === 'GET') {
    // Get a specific vote by id
    try {
      const vote = await prisma.vote.findUnique({
        where: { id },
        select: {
          id: true,
          userId: true,
          coinId: true,
          createdAt: true,
        },
      });
      if (vote) {
        res.status(200).json(vote);
      } else {
        res.status(404).json({ message: 'Vote not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching vote' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
