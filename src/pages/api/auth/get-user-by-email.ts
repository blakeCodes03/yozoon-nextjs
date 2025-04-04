// src/pages/api/auth/get-user-by-email.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from '../../../lib/prisma';

const handler = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error('Get User By Email API Route Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  },
  onNoMatch(req, res) {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  },
});

// Handle GET requests to get user by email
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing email.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { email: true, resetToken: true, resetTokenExpiresAt: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log('User found:', user);

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Get User By Email Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

export default handler;
