// pages/api/coins-by-hashtag.ts  
import { NextApiRequest, NextApiResponse } from "next";  
import { PrismaClient } from "@/generated/prisma";


const prisma = new PrismaClient();  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {  
  const { tag } = req.query;  

  try {  
    const relatedCoins = await prisma.coin.findMany({  
      where: {  
        hashtags: {  
          some: {  
            tag: tag as string, // Ensure tag is a string
          },  
        },  
      },  
    });  
    res.status(200).json(relatedCoins);  
  } catch (error) {  
      console.error("Error fetching coins by hashtag:", error);  
    res.status(500).json({ error: "Failed to fetch coins by hashtag" });
  }  
}  