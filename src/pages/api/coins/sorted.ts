import type { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";
import prisma from "../../../lib/prisma";


// const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { sortBy , page = "1", pageSize = "12" } = req.query;

  let orderBy: any = undefined;
  if (sortBy === "createdAt") {
    orderBy = [{ createdAt: "desc" as const }];
  } else if (sortBy === "marketCap") {
    orderBy = [{ marketCap: "desc" as const }];
  } else if (sortBy === "none") {
    orderBy = undefined; // No sorting
  }

  const pageNum = parseInt(page as string, 10) || 1;
  const size = parseInt(pageSize as string, 10) || 12;
  const skip = (pageNum - 1) * size;

  try {
    const [coins, total] = await Promise.all([
      prisma.coin.findMany({
        ...(orderBy ? { orderBy } : {}),
        skip,
        take: size,
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
      }),
      prisma.coin.count(),
    ]);

    res.status(200).json({ coins, total });
  } catch (error) {
    console.error("Error fetching sorted coins:", error);
    res.status(500).json({ error: "Failed to fetch sorted coins" });
  }
}