// src/pages/api/coins/calculateFee.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import tokenMill from '../../../lib/tokenMill';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const fee = await tokenMill.calculateFee();
    res.status(200).json({ fee });
  } catch (error) {
    console.error('Error calculating fee:', error);
    res.status(500).json({ message: 'Failed to calculate fee.' });
  }
}