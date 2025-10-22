import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';

// Use lazy prisma client

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }

  const session = await getSession({ req });

  if (!session || session.user.id !== id) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const transactions = await prisma.transaction.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' }, // Sort transactions by most recent
      });

      res.status(200).json({ transactions });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: 'Error fetching transactions' });
    }
  } else if (req.method === 'POST') {
    const { coinId, type, amount, price } = req.body;

    if (!coinId || !type || !amount || !price) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    try {
      const total = parseFloat(amount) * parseFloat(price);

      const transaction = await prisma.transaction.create({
        data: {
          userId: id,
          coinId,
          type,
          amount: parseFloat(amount),
          price: parseFloat(price),
        },
      });

      res.status(201).json({ transaction });
    } catch (error) {
      console.error('Error adding transaction:', error);
      res.status(500).json({ message: 'Error adding transaction' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
