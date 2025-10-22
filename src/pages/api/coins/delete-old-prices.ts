import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

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

  try {
    // Calculate the cutoff date (3 days ago from now)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 3);

    // Delete PriceHistory records older than 3 days
    const deletionResult = await prisma.priceHistory.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate, // Less than 3 days ago
        },
      },
    });

    // Log the number of deleted records
    console.log(
      `Deleted ${deletionResult.count} PriceHistory records older than ${cutoffDate.toISOString()}`
    );

    return res.status(200).json({
      message: 'Old price history records deleted successfully',
      deletedCount: deletionResult.count,
    });
  } catch (error) {
    console.error('Error deleting old price history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    // keep connection open for reuse in dev mode via lazy client
  }
}
