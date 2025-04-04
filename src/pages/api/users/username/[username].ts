// src/pages/api/users/username/[username].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username } = req.query;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { username: true, pictureUrl: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by username:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;
