// src/pages/api/chat/messages/index.ts

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

    const { coinId, message } = req.body;

    if (!coinId || !message) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    try {
      const chatMessage = await prisma.chatMessage.create({
        data: {
          userId: session.user.id,
          coinId,
          message,
        },
      });

      res.status(201).json(chatMessage);
    } catch (error) {
      res.status(500).json({ message: 'Error sending message' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
