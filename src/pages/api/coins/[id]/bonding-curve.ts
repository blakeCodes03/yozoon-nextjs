// src/pages/api/coins/[id]/bonding-curve.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    res.status(400).json({ message: 'Invalid coin ID' });
    return;
  }

  const session = await getSession({ req });

  if (req.method === 'POST') {
    // Start Bonding Curve
    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Verify that the user is the creator
    const coin = await prisma.coin.findUnique({ where: { id } });
    if (!coin) {
      res.status(404).json({ message: 'Coin not found' });
      return;
    }

    if (coin.creatorId !== session.user.id) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const { curveDetail, feeStructure } = req.body;

    try {
      // Create FeeStructure if provided
      let feeStructureId: string | null = null;
      if (feeStructure) {
        const newFeeStructure = await prisma.feeStructure.create({
          data: {
            tradeFee: feeStructure.tradeFee,
            memecoinFee: feeStructure.memecoinFee,
            feeDescription: feeStructure.feeDescription,
          },
        });
        feeStructureId = newFeeStructure.id;
      }

      // Create BondingCurve
      const bondingCurve = await prisma.bondingCurve.create({
        data: {
          coinId: id,
          curveDetail: curveDetail, // Ensure curveDetail matches your defined structure
          feeStructureId: feeStructureId,
        },
      });

      // Update Coin Status
      await prisma.coin.update({
        where: { id },
        data: { status: 'bondingCurve' },
      });

      res
        .status(200)
        .json({ message: 'Bonding curve started successfully.', bondingCurve });
    } catch (error: any) {
      console.error('Error starting bonding curve:', error);
      res.status(500).json({ message: 'Failed to start bonding curve.' });
    }
  } else if (req.method === 'PUT') {
    // Update Bonding Curve
    // Implement as needed
    res.status(501).json({ message: 'Not implemented.' });
  } else if (req.method === 'DELETE') {
    // Complete Bonding Curve
    // Implement as needed
    res.status(501).json({ message: 'Not implemented.' });
  } else {
    res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
