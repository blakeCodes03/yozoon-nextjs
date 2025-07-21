// src/pages/api/users/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }

  const session = await getSession({ req });

  if (req.method === 'GET') {
    // Get user profile
    if (!session || session.user.id !== id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          pictureUrl: true,
          referralCode: true, // Add this line
          coinsCreated: {
            select: { id: true, name: true, ticker: true },
          },
          reputation: {
            select: {
              score: true,
            },
          },
          votes: {
            select: {
              proposalId: true,
              value: true,
              createdAt: true,
            },
          },
          referrals: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      if (user) {
        // Ensure Reputation exists
        if (!user.reputation) {
          // Create Reputation record if missing
          await prisma.reputation.create({
            data: {
              userId: user.id,
              score: 0,
            },
          });
          user.reputation = { score: 0 };
        }
        
        res.status(200).json({
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            pictureUrl: user.pictureUrl,
          },
          reputation: user.reputation,
          ownedCoins: user.coinsCreated,          
          referrals: user.referrals,
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Error fetching user profile' });
    }
  } else if (req.method === 'PUT') {
    // Update user profile
    if (!session || session.user.id !== id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { username, email, password } = req.body;

    let updatedData: any = {};

    if (username) updatedData.username = username;
    if (email) updatedData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.passwordHash = await bcrypt.hash(password, salt);
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updatedData,
        select: {
          id: true,
          username: true,
          email: true,
        },
      });
      res.status(200).json({ user: updatedUser });
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ message: 'User not found' });
      } else if (error.code === 'P2002') {
        res.status(409).json({ message: 'Username or email already exists' });
      } else {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating user profile' });
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
