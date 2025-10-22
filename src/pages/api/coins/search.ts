import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query = '', page = '1', pageSize = '12' } = req.query;

  const pageNum = parseInt(page as string, 10) || 1;
  const size = parseInt(pageSize as string, 10) || 12;
  const skip = (pageNum - 1) * size;

  try {
    const [coins, total] = await Promise.all([
      prisma.coin.findMany({
        where: {
          OR: [
            { name: { contains: query as string, mode: 'insensitive' } },
            { ticker: { contains: query as string, mode: 'insensitive' } },
            {
              hashtags: {
                some: {
                  tag: { contains: query as string, mode: 'insensitive' },
                },
              },
            },
          ],
        },
        skip,
        take: size,
        select: {
          id: true,
          name: true,
          ticker: true,
          tokenMint: true,
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
      }),
      prisma.coin.count({
        where: {
          OR: [
            { name: { contains: query as string, mode: 'insensitive' } },
            { ticker: { contains: query as string, mode: 'insensitive' } },
            {
              hashtags: {
                some: {
                  tag: { contains: query as string, mode: 'insensitive' },
                },
              },
            },
          ],
        },
      }),
    ]);

    res.status(200).json({ coins, total });
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
}
