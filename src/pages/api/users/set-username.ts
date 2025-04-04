// src/pages/api/users/set-username.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getSession } from 'next-auth/react';
import { isValidUsername } from '../../../utils/validators'; // Implement a username validator

export default async function setUsernameHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { username } = req.body;

  if (!username || typeof username !== 'string' || !isValidUsername(username)) {
    return res.status(400).json({ message: 'Invalid username.' });
  }

  try {
    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    // Update user's username
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { username },
    });

    res.status(200).json({ message: 'Username updated successfully!', user: updatedUser });
  } catch (error) {
    console.error('Error setting username:', error);
    res.status(500).json({ message: 'Failed to set username.' });
  }
}
