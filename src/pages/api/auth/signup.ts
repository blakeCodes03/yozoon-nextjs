// src/pages/api/auth/signup.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '../../../utils/email';
import { isValidEmail, isValidPassword } from '../../../utils/validators';
import { applyRateLimit } from '../../../middleware/rateLimiter';
import { nanoid } from 'nanoid'; // For generating short unique codes

const handler = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error('Signup API Route Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  },
  onNoMatch(req, res) {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  },
});

// Apply rate limiting: max 5 signup attempts per hour per IP
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await applyRateLimit(req, res); // Apply rate limiting

  const { email, password } = req.body; // Removed confirmPassword
  const referralCodeFromURL = req.query.ref as string | undefined; // Capture referral code from query params

  console.log(`Signup attempt for email: ${email}`);

  // Validate required fields
  if (!email || !password) { // Updated validation
    console.log('Missing required fields.');
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Validate password strength
  if (!isValidPassword(password)) {
    console.log('Password does not meet strength requirements.');
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    console.log('Invalid email format.');
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists.');
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully.');

    // Generate a unique username (optional)
    const username = `user_${uuidv4().split('-')[0]}`;
    console.log(`Generated username: ${username}`);

    // Generate a unique referral code
    let referralCode = nanoid(8); // Generates an 8-character unique code
    // Ensure referralCode is unique
    let isUnique = false;
    while (!isUnique) {
      const existingCode = await prisma.user.findUnique({
        where: { referralCode },
      });
      if (!existingCode) {
        isUnique = true;
      } else {
        referralCode = nanoid(8);
      }
    }
    console.log(`Generated referral code: ${referralCode}`);

    // Generate a verification token and its expiry
    const verificationToken = uuidv4();
    const verificationTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    console.log(`Generated verification token: ${verificationToken}`);

    // Handle referral association
    let referrerId: string | null = null;
    if (referralCodeFromURL) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: referralCodeFromURL },
      });
      if (referrer) {
        referrerId = referrer.id;
        console.log(`Associated referrer ID: ${referrerId}`);
      } else {
        console.log('Invalid referral code provided.');
      }
    }

    // Create the new user along with a Reputation record
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        isVerified: false,
        verificationToken,
        verificationTokenExpiresAt,
        username,
        referralCode,
        referrerId, // Associate with referrer if applicable
        reputation: {
          create: {
            score: 0,
          },
        },
      },
    });
    console.log('New user created successfully:', newUser);

    // Send verification email
    await sendVerificationEmail(email, verificationToken);
    console.log('Verification email sent successfully.');

    return res.status(200).json({
      message: 'Signup successful! Please verify your email within 30 minutes.',
    });
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

export default handler;
