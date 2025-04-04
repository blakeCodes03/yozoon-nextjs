// src/pages/api/badges/assign.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    // Only allow admins to assign badges (assuming admin role)
    if (!session || session.user.role !== 'admin') { // Ensure 'role' is part of the user model
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { userId, badgeId } = req.body;

    if (!userId || !badgeId) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const badge = await prisma.badge.findUnique({ where: { id: badgeId } });

      if (!user || !badge) {
        res.status(404).json({ message: 'User or Badge not found' });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { badges: { connect: { id: badgeId } } },
        select: {
          id: true,
          username: true,
          badges: true,
        },
      });

      res.status(200).json({ user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Error assigning badge' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
