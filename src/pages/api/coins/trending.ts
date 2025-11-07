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
          description: true,
          marketCap: true,
          createdAt: true,
          pictureUrl: true,
          hashtags: {
            select: {
              tag: true,
            },
          },
          creator: {
            select: {
              username: true,
              pictureUrl: true,
            },
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
      description: coin.description,
      hashtags: coin.hashtags.map((h) => h.tag),

      creator: coin.creator, // Include creator info if nee
    }));

    return res.status(200).json(trendingData);
  } catch (error) {
    console.error('Error fetching trending coins:', error);
   return res.status(500).json({ error: 'Failed to fetch trending coins.' });
  }
}