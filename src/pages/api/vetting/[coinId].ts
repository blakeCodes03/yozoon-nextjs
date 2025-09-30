// src/pages/api/vetting/[coinId].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@/generated/prisma";


const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { coinId } = req.query;

  if (typeof coinId !== 'string') {
    res.status(400).json({ message: 'Invalid coin ID' });
    return;
  }

  if (req.method === 'GET') {
    // Get vetting status
    try {
      const vetting = await prisma.vettingProcess.findUnique({
        where: { coinId },
      });

      if (vetting) {
        res.status(200).json(vetting);
      } else {
        res.status(404).json({ message: 'Vetting process not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching vetting process' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
