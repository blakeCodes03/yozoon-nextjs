import type { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import prisma from "../../../lib/prisma";


// const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Secure the endpoint with a secret key
  const secret = req.headers['x-secret-key'];
  if (secret !== process.env.PRICES_API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  async function fetchLatestPrice(coinID: string) {
    // Replace this with real API call to fetch price
    // Example: const res = await axios.get(`https://api.example.com/price?ticker=${coin.ticker}`);
    // return res.data.price;
    return Math.random() * 10; // Mock price
  }

  try {
    const coins = await prisma.coin.findMany();
    for (const coin of coins) {
      const latestPrice = await fetchLatestPrice(coin.id);
      
      await prisma.priceHistory.create({
        data: {
          coinId: coin.id,
          price: latestPrice,
          timestamp: new Date(),
        },
      });
      console.log(`Added price history for ${coin.ticker}: $${latestPrice}`);
    }
    return res.status(200).json({ message: 'Prices updated successfully' });
  } catch (error) {
    console.error('Error updating prices:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
