// src/pages/api/auth/request-password-reset.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from '../../../lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { sendPasswordResetEmail } from '../../../utils/email';
import { isValidEmail } from '../../../utils/validators';
import { applyRateLimit } from '../../../middleware/rateLimiter';

const handler = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error('Password Reset Request API Route Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  },
  onNoMatch(req, res) {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  },
});

// Handle POST requests to initiate password reset
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Apply rate limiting: max 5 password reset requests per hour per IP
    await applyRateLimit(req, res);
  } catch (error) {
    // Rate limit exceeded or internal error handled in applyRateLimit
    return;
  }

  const { email } = req.body;

  // Validate email
  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    console.log('Invalid or missing email:', email);
    return res.status(400).json({ message: 'Invalid or missing email.' });
  }

  try {
    console.log(`Password reset requested for email: ${email}`);

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`No user found with email: ${email}`);
      // To prevent email enumeration, respond with a generic success message
      return res.status(200).json({
        message: 'If an account with that email exists, a reset link has been sent.',
      });
    }

    // Generate a password reset token and its expiry
    const resetToken = uuidv4();
    const resetTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

    console.log(`Generated reset token: ${resetToken}`);
    console.log(`Reset token expiry: ${resetTokenExpiresAt}`);

    // Update the user with the reset token and expiry
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiresAt,
      },
    });

    console.log('Updated user with reset token:', updatedUser);

    // Send the password reset email
    await sendPasswordResetEmail(email, resetToken);

    console.log('Password reset email sent successfully.');

    return res.status(200).json({
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  } catch (error) {
    console.error('Password Reset Request Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

export default handler;
