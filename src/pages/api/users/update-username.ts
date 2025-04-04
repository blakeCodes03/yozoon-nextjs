// src/pages/api/users/update-username.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const session = await getSession({ req });

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { username, pictureUrl } = req.body;

  // Validate input
  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  // Optional: Validate username format (e.g., length, allowed characters)
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: 'Invalid username format. Use 3-30 characters: letters, numbers, underscores.' });
  }

  try {
    // Check if the username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return res.status(409).json({ message: 'Username is already taken.' });
    }

    // Update the user's username and pictureUrl if provided
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        username,
        pictureUrl: pictureUrl || undefined, // Update only if provided
      },
    });

    return res.status(200).json({ message: 'Username updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating username:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export default handler;
