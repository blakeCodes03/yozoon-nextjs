// src/pages/api/vetting/index.ts

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

    const { coinId, submissionDetails } = req.body;

    if (!coinId || !submissionDetails) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    try {
      const vetting = await prisma.vettingProcess.create({
        data: {
          coinId,
          submissionId: submissionDetails.id,
          status: 'pending',
          communityVotes: 0,
          bondAmount: submissionDetails.bondAmount || 1000, // Default bond amount
        },
      });
      res.status(201).json(vetting);
    } catch (error: any) {
      if (error.code === 'P2002') {
        res.status(409).json({ message: 'Vetting process already exists for this coin' });
      } else {
        res.status(500).json({ message: 'Error submitting for vetting' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
