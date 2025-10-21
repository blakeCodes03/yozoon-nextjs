// src/pages/api/coins/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import { getServerSession } from 'next-auth/next';
// import prisma from '../../../generated/prisma';
import { PrismaClient } from '../../../generated/prisma';
import { Prisma } from '@prisma/client';
// import { PrismaClient } from "@prisma/client";

import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import base64 from 'base-64';
import { authOptions } from '../auth/[...nextauth]';
import { CustomNextApiRequest } from '../../../../types/index'; // Ensure this type exists

const prisma = new PrismaClient();


// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(
        null,
        `${uniqueSuffix}-${file.fieldname}${path.extname(file.originalname)}`
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB
});

// Middleware to handle multipart/form-data
const uploadMiddleware = upload.single('pictureFile');

// Initialize nextConnect
const handler = nextConnect<CustomNextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error('Coin Creation API Route Error:', error);
    res
      .status(500)
      .json({ message: error.message || 'Internal server error.' });
  },
  onNoMatch(req, res) {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  },
});

// Apply the multer middleware
handler.use(uploadMiddleware);

// Function to generate unique addresses
function generateAddress(): string {
  return uuidv4();
}

// Custom JSON serializer to handle Decimal and BigInt types
function customJSONSerializer(key: string, value: any) {
  if (typeof value === 'bigint' || (value && value._isDecimal)) {
    return value.toString();
  }
  return value;
}




// Handle POST requests to create a new coin with TokenMill integration
handler.post(async (req: CustomNextApiRequest, res: NextApiResponse) => {
  // Check user session
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const {
    name,
    ticker,
    description,
    airdropAmount,    
    hashtags,
    milestones,
    airdropTasks,
    socialLinks,
    personality,
  } = req.body;

  // Validate required fields
  if (!name || !ticker) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Parse JSON fields
  let parsedVestingDetails: any = {};
  let parsedSocialLinks: any = {};
  let parsedHashtags: string[] = [];
  let parsedMilestones: any[] = [];
  let parsedAirdropTasks: any[] = [];
    let parsedPersonality: any = {};


  try {
    

    if (socialLinks) {
      parsedSocialLinks = JSON.parse(socialLinks);
    }

    

    if (hashtags) {
      parsedHashtags = JSON.parse(hashtags);
    }

    if (milestones) {
      parsedMilestones = JSON.parse(milestones);
    }

    if (airdropTasks) {
      parsedAirdropTasks = JSON.parse(airdropTasks);
    }
    if (personality) {
      parsedPersonality = JSON.parse(personality);
    }
  } catch (error) {
    console.error('Error parsing JSON fields:', error);
    return res.status(400).json({ message: 'Invalid JSON format' });
  }

  // Handle file upload
  let pictureUrl = '';
  if (req.file) {
    pictureUrl = `/uploads/${req.file.filename}`;
  } else {
    return res.status(400).json({ message: 'Picture file is required' });
  }

  try { 

 

    // Initialize marketCap (initially 0, to be updated as users buy/sell)
    const initialMarketCap = new Prisma.Decimal(0);

    // Create or connect hashtags and increment usage count
    const existingHashtags = await Promise.all(
      parsedHashtags.map(async (tag) => {
        return await prisma.hashtag.upsert({
          where: { tag },
          update: {
            usageCount: {
              increment: 1, // Increment count for each new usage
            },
          },
          create: {
            tag,
            usageCount: 1, // Initialize usage count to 1 for new hashtags
          },
        });
      })
    );
    const agentId = uuidv4(); //generate agentId

    // Generate Telegram startgroup link
    const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const payload = `${agentId}:${timestamp}`;
    const encodedPayload = base64.encode(payload);
    const telegramLink = `https://t.me/YozoonBot?startgroup=${encodedPayload}`;

    // Discord invite link (replace with your bot's client ID)
    const discordLink =
      `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DEVNET_PROGRAM_ID}&permissions=536870912&scope=bot`;

    // Create the new agent
    const newAgent = await prisma.coin.create({
      data: {
        id: agentId,
        name,
        ticker,
        description: description || '',
        pictureUrl,
        socialLinks: parsedSocialLinks,
        telegramLink,
        discordLink,
        airdropAmount: airdropAmount
          ? new Prisma.Decimal(airdropAmount)
          : new Prisma.Decimal(0),

        creator: { connect: { id: session.user.id } },
        status: 'voting', // Set initial status
        marketCap: initialMarketCap, // Initialize marketCap
    

        // bondingCurve,
        milestones: {
          create: parsedMilestones.map((milestone) => ({
            date: new Date(milestone.date),
            description: milestone.description,
          })),
        },
        // hashtags: {
        //   connectOrCreate: parsedHashtags.map((tag: string) => ({
        //     where: { tag },
        //     create: { tag },
        //   })),
        // },
        hashtags: {
          connect: existingHashtags.map((hashtag) => ({ id: hashtag.id })), // Connect hashtags after upserting
        },
        // Personality fields
        // personalityBio: parsedPersonality.bio || null,
        personalityTraits: parsedPersonality.traits || null,
        personalityTopics: parsedPersonality.topics || null,
        personalityTemperature: parsedPersonality.temperature || 0.7,
        personalityMaxTokens: parsedPersonality.maxTokens || 2000,
        personalityMemoryLength: parsedPersonality.memoryLength || 1000,
        
        // Add airdropTasks if necessary
      },
      
      include: {
        milestones: true,
        hashtags: true,
      },
    });

    // Optionally, initialize BondingCurve here if required

    res.status(201).json({
      message: 'Agent created successfully. Data cannot be changed anymore.',
      coin: JSON.parse(JSON.stringify(newAgent, customJSONSerializer)),
    });
  } catch (error: any) {
    console.error('Error creating coin:', error);
    res.status(500).json({ message: 'Failed to create coin.' });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
