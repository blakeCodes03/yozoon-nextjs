// src/pages/api/chat/messages/[coinId].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { coinId } = req.query;

  if (typeof coinId !== 'string') {
    res.status(400).json({ message: 'Invalid coin ID' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const messages = await prisma.chatMessage.findMany({
        where: { coinId },
        include: { user: { select: { username: true } } },
        orderBy: { createdAt: 'asc' },
      });

      const formattedMessages = messages.map((msg: { id: string, user: { username: string }, coinId: string, message: string, createdAt: Date }) => ({
        id: msg.id,
        userId: msg.user.username,
        coinId: msg.coinId,
        message: msg.message,
        createdAt: msg.createdAt.toISOString(),
      }));

      res.status(200).json(formattedMessages);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching chat messages' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
