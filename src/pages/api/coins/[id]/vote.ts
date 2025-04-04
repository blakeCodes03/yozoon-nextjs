// src/pages/api/coins/[id]/vote.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]'; // Adjust the import path as needed

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    res.status(400).json({ message: 'Invalid coin ID' });
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (req.method === 'POST') {
    const { value } = req.body;

    if (value === undefined || ![1, -1].includes(value)) {
      res.status(400).json({ message: 'Invalid vote value' });
      return;
    }

    try {
      // Check if the user has already voted for this coin
      const existingVote = await prisma.vote.findFirst({
        where: { coinId: id, userId: session.user.id },
      });

      let updatedVote;
      if (existingVote) {
        // Update the existing vote
        updatedVote = await prisma.vote.update({
          where: { id: existingVote.id },
          data: { value },
        });
      } else {
        // Create a new vote
        updatedVote = await prisma.vote.create({
          data: {
            userId: session.user.id,
            coinId: id,
            value,
          },
        });
      }

      // Aggregate the total vote count for the coin
      const voteAggregation = await prisma.vote.aggregate({
        where: { coinId: id },
        _sum: { value: true },
      });

      const userVote = updatedVote.value;
      const voteCount = voteAggregation._sum.value || 0;

      res.status(200).json({
        vote: updatedVote,
        voteCount,
        userVote,
      });
    } catch (error) {
      console.error('Error casting vote:', error);
      res.status(500).json({ message: 'Error casting vote' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
