// src/pages/api/votes/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

import prisma from '../../../lib/prisma';

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

    const { coinId, value } = req.body;

    if (!coinId || value === undefined) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    if (![1, -1].includes(value)) {
      res.status(400).json({ message: 'Invalid vote value' });
      return;
    }

    try {
      const existingVote = await prisma.vote.findFirst({
        where: { userId: session.user.id, coinId },
      });

      if (existingVote) {
        const updatedVote = await prisma.vote.update({
          where: { id: existingVote.id },
          data: { value },
        });
        res.status(200).json(updatedVote);
      } else {
        const newVote = await prisma.vote.create({
          data: {
            userId: session.user.id,
            coinId,
            value,
          },
        });
        res.status(201).json(newVote);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error casting vote' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
