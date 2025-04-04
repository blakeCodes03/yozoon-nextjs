// src/pages/api/stakes/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { coinId, amount } = req.body;

    if (!coinId || !amount) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    if (amount <= 0) {
      res.status(400).json({ message: 'Amount must be greater than zero' });
      return;
    }

    try {
      // Create a new stake
      const stake = await prisma.stake.create({
        data: {
          userId: session.user.id,
          coinId,
          amount: BigInt(amount),
        },
      });

      // Update VettingProcess if exists
      const vetting = await prisma.vettingProcess.findUnique({
        where: { coinId },
      });

      if (vetting) {
        await prisma.vettingProcess.update({
          where: { coinId },
          data: { bondAmount: { increment: BigInt(amount) } },
        });
      }

      res.status(201).json(stake);
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating stake' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
