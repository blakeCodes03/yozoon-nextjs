// src/pages/api/auth/resend-verification.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from '../../../lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '../../../utils/email';
import { isValidEmail } from '../../../utils/validators';
import { applyRateLimit } from '../../../middleware/rateLimiter';

const handler = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error('Resend Verification API Route Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  },
  onNoMatch(req, res) {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  },
});

// Handle POST requests to resend verification email
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Apply rate limiting: max 5 resend attempts per hour per IP
    await applyRateLimit(req, res);
  } catch (error) {
    // Rate limit exceeded or internal error handled in applyRateLimit
    return;
  }

  const { email } = req.body;

  // Validate email
  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid or missing email.' });
  }

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // To prevent email enumeration, respond with a generic success message
      return res.status(200).json({
        message: 'If an account with that email exists, a verification link has been sent.',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'This account is already verified. Please log in.' });
    }

    // Generate a new verification token and its expiry
    const verificationToken = uuidv4();
    const verificationTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

    // Update the user with the new token and expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpiresAt,
      },
    });

    // Send the new verification email
    await sendVerificationEmail(email, verificationToken);

    return res.status(200).json({
      message: 'Verification email resent! Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Resend Verification Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

export default handler;
