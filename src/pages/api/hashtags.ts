import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const hashtags = await prisma.hashtag.findMany({
      select: { tag: true },
      orderBy: { tag: 'asc' },
    });
    res.status(200).json(hashtags.map((h) => h.tag));
  } catch (error) {
    console.error('Error fetching hashtags:', error);
    res.status(500).json({ message: 'Failed to fetch hashtags' });
  }
}