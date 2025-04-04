// src/pages/api/auth/verify-reset-token.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from '../../../lib/prisma';
import { applyRateLimit } from '../../../middleware/rateLimiter';

const handler = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, _, res) {
    console.error('Verify Reset Token API Route Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  },
  onNoMatch(req, res) {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  },
});

// Handle GET requests to verify reset token
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Apply rate limiting: max 10 token verifications per hour per IP
    await applyRateLimit(req, res);
  } catch (error) {
    // Rate limit exceeded or internal error handled in applyRateLimit
    return;
  }

  const { token } = req.query;

  console.log(`Email verification attempt with token: ${token}`);

  // Validate token
  if (!token || typeof token !== 'string') {
    console.log('Invalid or missing token.');
    return res.status(400).json({ message: 'Invalid or missing token.' });
  }

  try {
    // Use findUnique since resetToken is unique
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user) {
      console.log('Invalid verification token. No user found with this token.');
      return res.status(400).json({ message: 'Invalid reset token.' });
    }

    // Check if the token has expired
    if (user.resetTokenExpiresAt && user.resetTokenExpiresAt < new Date()) {
      console.log('Reset token has expired.');
      return res.status(400).json({ message: 'Reset token has expired. Please request a new one.' });
    }

    console.log('Reset token is valid. Proceeding to verify token.');

    return res.status(200).json({ message: 'Valid token.' });
  } catch (error) {
    console.error('Verify Reset Token Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

export default handler;
