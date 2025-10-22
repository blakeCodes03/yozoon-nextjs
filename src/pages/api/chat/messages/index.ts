// src/pages/api/chat/messages/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';

// lazy prisma

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

    const { coinId, message } = req.body;

    if (!coinId || !message) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    try {
      const chatMessage = await prisma.chatMessage.create({
        data: {
          coinId,
          message,
          createdAt: new Date(),
          userId: session.user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              pictureUrl: true, // Include pictureUrl here
            },
          },
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
