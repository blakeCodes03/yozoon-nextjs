import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@/generated/prisma";

import { sub } from 'date-fns'; // Import date-fns for date manipulation


const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  // Secure the endpoint with a secret key
  const secret = req.headers['x-secret-key'];
  if (secret !== process.env.PRICES_API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const now = new Date();
    const twentyFourHoursAgo = sub(now, { hours: 24 });

  try {
    const priceHistory = await prisma.priceHistory.findMany({
      where: {
        coinId: id as string,
        timestamp: {
          gte: twentyFourHoursAgo,
          lte: now,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });
    return res.status(200).json({
      priceHistory: priceHistory.map((entry) => ({
        price: Number(entry.price),
        timestamp: entry.timestamp.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Failed to fetch price', error);
    return res.status(500).json({ error: 'Failed to fetch price' });
  }
}
