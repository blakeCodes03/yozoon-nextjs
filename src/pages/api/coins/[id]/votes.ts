// src/pages/api/coins/[id]/votes.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@/generated/prisma";

import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]'; // Adjust the import path as needed

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

  const session = await getServerSession(req, res, authOptions);

  try {
    // Aggregate the total vote count for the coin
    const voteAggregation = await prisma.vote.aggregate({
      where: { coinId: id },
      _sum: { value: true },
    });

    const voteCount = voteAggregation._sum.value || 0;

    // Count upvotes
    const upvotes = await prisma.vote.count({
      where: { coinId: id, value: 1 },
    });

    // Count downvotes
    const downvotes = await prisma.vote.count({
      where: { coinId: id, value: -1 },
    });

    // Retrieve the user's vote if logged in
    let userVote = 0;
    if (session) {
      const vote = await prisma.vote.findFirst({
        where: { coinId: id, userId: session.user.id },
        select: { value: true },
      });
      if (vote) {
        userVote = vote.value;
      }
    }

    res.status(200).json({
      upvotes,
      downvotes,
      voteCount,
      userVote,
    });
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ message: 'Error fetching votes' });
  }
}
