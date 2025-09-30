// src/pages/api/dao/proposals/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@/generated/prisma";

import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const proposals = await prisma.proposal.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json(proposals);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching proposals' });
    }
  } else if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { title, description } = req.body;

    if (!title || !description) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    try {
      const proposal = await prisma.proposal.create({
        data: {
          title,
          description,
          createdBy: { connect: { id: session.user.id } },
        },
      });
      res.status(201).json(proposal);
    } catch (error) {
      res.status(500).json({ message: 'Error creating proposal' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
