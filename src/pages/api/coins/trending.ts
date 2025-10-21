// src/pages/api/coins/trending.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, CoinStatus } from '../../../generated/prisma';

// Initialize Prisma Client
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Define the number of trending coins to fetch
    const TRENDING_LIMIT = 10;

    // Fetch coins with status 'voting' or 'bondingCurve', sorted by vote count descending
    const trendingCoins = await prisma.coin.findMany({
      where: {
        status: {
          in: [CoinStatus.voting, CoinStatus.bondingCurve],
        },
      },
      select: {
        id: true,
        name: true,
        ticker: true,
        pictureUrl: true,
        createdAt: true,
        status: true,
        marketCap: true,
        reputationScore: true,
        _count: {
          select: { votes: true, comments: true},
        },
      },
      orderBy: [
        {
          votes: {
            _count: 'desc',
          },
        },
        {
          reputationScore: 'desc',
        },
      ],
      take: TRENDING_LIMIT,
    });

    // Map the data to include necessary fields
    const trendingData = trendingCoins.map((coin) => ({
      id: coin.id,
      name: coin.name,
      ticker: coin.ticker,
      logoUrl: coin.pictureUrl, // Assuming pictureUrl is the logo
      createdAt: coin.createdAt,
      marketCap: coin.marketCap,
      voteCount: coin._count.votes,
      repliesCount: coin._count.comments,
      status: coin.status, // Include status for visual differentiation
      // Placeholder for percentageChange; implement actual logic if needed
      percentageChange: coin.reputationScore, // Using reputationScore as a proxy
    }));

    res.status(200).json(trendingData);
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    res.status(500).json({ error: 'Failed to fetch trending coins.' });
  } finally {
    await prisma.$disconnect();
  }
}
