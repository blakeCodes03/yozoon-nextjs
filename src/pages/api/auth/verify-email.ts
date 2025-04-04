// src/pages/api/auth/verify-email.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from '../../../lib/prisma';
import { applyRateLimit } from '../../../middleware/rateLimiter';

const handler = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error('Verify Email API Route Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  },
  onNoMatch(req, res) {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  },
});

// Apply rate limiting: max 10 email verifications per hour per IP
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await applyRateLimit(req, res); // Apply rate limiting

  const { token } = req.query;

  console.log(`Email verification attempt with token: ${token}`);

  // Validate token
  if (!token || typeof token !== 'string') {
    console.log('Invalid or missing token.');
    return res.status(400).json({ message: 'Invalid or missing token.' });
  }

  try {
    // Find the user with the verification token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      console.log('Invalid verification token.');
      return res.status(400).json({ message: 'Invalid verification token.' });
    }

    // Check if the token has expired
    if (user.verificationTokenExpiresAt && user.verificationTokenExpiresAt < new Date()) {
      console.log('Verification token has expired.');
      return res.status(400).json({ message: 'Verification token has expired. Please sign up again.' });
    }

    // Update the user's isVerified status and remove the verification token and expiry
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null, verificationTokenExpiresAt: null },
    });

    console.log('Email verified successfully for user:', user.email);

    return res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.error('Verify Email Error:', error);
    return res.status(500).json({ message: 'Failed to verify email.' });
  }
});

export default handler;
