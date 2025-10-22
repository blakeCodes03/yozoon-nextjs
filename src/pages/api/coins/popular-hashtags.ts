// pages/api/popular-hashtags.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const THRESHOLD = 1; // Set the minimum usage count to consider a hashtag popular

  try {
    const popularHashtags = await prisma.hashtag.findMany({
      where: {
        usageCount: {
          gte: THRESHOLD, // Only retrieve hashtags with usageCount >= THRESHOLD
        },
      },
      orderBy: {
        usageCount: 'desc', // Order by usageCount descending
      },
      take: 10, // Limit the number of hashtags returned
    });

    res.status(200).json(popularHashtags.map((hashtag: any) => hashtag.tag)); // Return only the tag strings
  } catch (error) {
    console.error('Error fetching popular hashtags:', error);
    res.status(500).json({ error: 'Failed to fetch popular hashtags' });
  }
}
