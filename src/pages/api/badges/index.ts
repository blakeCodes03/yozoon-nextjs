// src/pages/api/badges/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // Get all badges
    try {
      const badges = await prisma.badge.findMany();
      res.status(200).json(badges);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching badges' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
