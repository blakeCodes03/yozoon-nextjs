import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '../../../generated/prisma';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]'; // Adjust the path if necessary

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
            const session = await getServerSession(req, res, authOptions);

    // const session = await getSession({ req });
      if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    const { email } = req.body;
      console.log(`Checking if email exists: ${email}`);

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    try {
      // Check if the email is already in the database
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log('Email is already in use.');
        return res.status(400).json({ message: 'Email is already in use.' });
      }else{

        

        const userId = session.user.id;

        // Retrieve the current user's Prisma info
        const currentUser = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!currentUser) {
          return res.status(404).json({ message: 'User not found.' });
        }

        // Update the "confirmedEmail" field with the email from the request body
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { confirmedEmail: email },
        });

        console.log('User email confirmed and updated:', updatedUser);

        return res.status(200).json({ message: 'User email confirmed and updated.' });
     

      }

    } catch (error) {
      console.error('Error checking email:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  if (req.method === 'GET') {
    // const session = await getSession({ req });
            const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
    try {     

      const userId = session.user.id;

      // Retrieve the user's information from Prisma
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Check if the email ends with "@twitter.com" or if "confirmedEmail" is empty
      if (user.email?.endsWith('@twitter.com') && !user.confirmedEmail) {
        return res.status(400).json({ message: 'Email confirmation required.' });
      }

      return res.status(200).json({ message: 'Email is valid and confirmed.' });
  } catch (error) {
      console.error('Error checking session email:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}