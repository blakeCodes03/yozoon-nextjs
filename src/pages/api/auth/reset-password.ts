// src/pages/api/auth/reset-password.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { isValidPassword } from '../../../utils/validators';
import { applyRateLimit } from '../../../middleware/rateLimiter';

const handler = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error('Reset Password API Route Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  },
  onNoMatch(req, res) {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  },
});

// Handle POST requests to reset password
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Apply rate limiting: max 5 password reset attempts per hour per IP
    await applyRateLimit(req, res);
  } catch (error) {
    // Rate limit exceeded or internal error handled in applyRateLimit
    return;
  }

  const { token, password } = req.body;

  // Validate token
  if (!token || typeof token !== 'string') {
    console.log('Invalid or missing token in password reset request.');
    return res.status(400).json({ message: 'Invalid or missing token.' });
  }

  // Validate password
  if (!password || typeof password !== 'string' || !isValidPassword(password)) {
    console.log('Invalid password provided.');
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    console.log(`Password reset attempt with token: ${token}`);

    // Find the user with the reset token
    const user = await prisma.user.findFirst({
      where: { resetToken: token },
    });

    if (!user) {
      console.log('Invalid reset token. No user found with this token.');
      return res.status(400).json({ message: 'Invalid reset token.' });
    }

    // Check if the token has expired
    if (user.resetTokenExpiresAt && user.resetTokenExpiresAt < new Date()) {
      console.log('Reset token has expired.');
      return res.status(400).json({ message: 'Reset token has expired. Please request a new one.' });
    }

    console.log(`Reset token is valid for user: ${user.email}`);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and remove the reset token and its expiry
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    console.log(`Password reset successful for user: ${updatedUser.email}`);

    return res.status(200).json({ message: 'Password reset successful!' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({ message: 'Failed to reset password.' });
  }
});

export default handler;
