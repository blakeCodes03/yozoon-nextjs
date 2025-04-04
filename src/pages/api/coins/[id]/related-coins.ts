import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import prisma from '../../../../lib/prisma'; // Adjust the import path as necessary
// const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const coinWithHashtags = await prisma.coin.findUnique({  
        where: { id: id as string },  
        include: { hashtags: true },  
      });  
    
      if (!coinWithHashtags) {  
        throw new Error("Coin not found");  
      }  
    
      // Get the tags of the selected coin  
      const tags = coinWithHashtags.hashtags.map((hashtag) => hashtag.tag);  
    
      // Fetch related coins that share at least one hashtag  
      const relatedCoins = await prisma.coin.findMany({  
        where: {  
          hashtags: {  
            some: {  
              tag: {  
                in: tags,  
              },  
            },  
          },  
          NOT: {  
            id: id as string , // Exclude the current coin from the results  
          },  
        },  
      });  
    
    //   return relatedCoins;  
    

    res.status(200).json({ relatedCoins });
  } catch (error) {
    console.error('Error fetching similar coins:', error);
    res.status(500).json({ message: 'An error occurred while fetching similar coins' });
  }
}