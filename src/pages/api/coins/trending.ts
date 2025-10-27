import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma'; // Use the singleton Prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Define the number of trending coins to fetch
    const TRENDING_LIMIT = 10;

    // Fetch coins sorted by vote count and comment count
    const trendingCoins = await prisma.coin.findMany({
      select: {
        id: true,
        name: true,
        ticker: true,
        pictureUrl: true,
        createdAt: true,
        marketCap: true,
        _count: {
          select: { votes: true, comments: true }, // Fetch vote and comment counts
        },
      },
      orderBy: [
        {
          votes: {
            _count: 'desc', // Sort by vote count (descending)
          },
        },
        {
          comments: {
            _count: 'desc', // Sort by comment count (descending)
          },
        },
      ],
      take: TRENDING_LIMIT, // Limit the number of results
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
      commentCount: coin._count.comments,
    }));

    res.status(200).json(trendingData);
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    res.status(500).json({ error: 'Failed to fetch trending coins.' });
  }
}