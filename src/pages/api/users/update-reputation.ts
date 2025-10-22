// src/pages/api/users/update-reputation.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getSession } from 'next-auth/react';

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

    const { delta } = req.body;

    if (typeof delta !== 'number') {
      res.status(400).json({ message: 'Invalid delta value' });
      return;
    }

    try {
      const reputation = await prisma.reputation.upsert({
        where: { userId: session.user.id },
        update: { score: { increment: delta } },
        create: { userId: session.user.id, score: delta },
        select: { score: true },
      });

      res.status(200).json({ reputation: reputation.score });
    } catch (error) {
      console.error('Error updating reputation:', error);
      res.status(500).json({ message: 'Error updating reputation' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
