// src/pages/api/users/save-wallet-address.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function saveWalletAddressHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const session = await getSession({ req });
  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { address, chain } = req.body;

  if (!address || typeof address !== 'string' || !chain || (chain !== 'evm' && chain !== 'solana')) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    await prisma.walletAddress.upsert({
      where: {
        userId_network: {
          userId: session.user.id,
          network: chain,
        },
      },
      update: {
        address,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        address,
        network: chain,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    res.status(200).json({ message: 'Wallet address saved successfully' });
  } catch (error) {
    console.error('Error saving wallet address:', error);
    res.status(500).json({ message: 'Failed to save wallet address' });
  }
}
