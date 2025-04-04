// src/pages/api/forum/posts.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const posts = await prisma.forumPost.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { username: true } } },
      });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching forum posts' });
    }
  } else if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    try {
      const post = await prisma.forumPost.create({
        data: {
          title,
          content,
          userId: session.user.id,
        },
      });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Error creating forum post' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
