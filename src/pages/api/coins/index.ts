// src/pages/api/coins/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import { getServerSession } from 'next-auth/next';
import prisma from '../../../lib/prisma';
import { Prisma } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '../auth/[...nextauth]';
import { CustomNextApiRequest } from '../../../../types/index'; // Ensure this type exists

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
      cb(null, `${uniqueSuffix}-${file.fieldname}${path.extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Middleware to handle multipart/form-data
const uploadMiddleware = upload.single('pictureFile');

// Initialize nextConnect
const handler = nextConnect<CustomNextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error('Coin Creation API Route Error:', error);
    res.status(500).json({ message: error.message || 'Internal server error.' });
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

// Handle GET requests to fetch coins with filters
handler.get(async (req: CustomNextApiRequest, res: NextApiResponse) => {
  const { blockchain, rating, createdAt } = req.query;

  try {
    // Build the query based on filters
    const where: Prisma.CoinWhereInput = {};

    if (blockchain && blockchain !== 'blockchain') {
      where.blockchain = blockchain as string;
    }

    if (createdAt && createdAt !== 'created') {
      if (createdAt === 'new') {
        where.createdAt = { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }; // Last 7 days
      } else if (createdAt === 'old') {
        where.createdAt = { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
      }
    }

    // Fetch coins based on the where condition
    let coins = await prisma.coin.findMany({
      where,
      include: {
        creator: true,
        teamMembers: true,
        milestones: true,
        hashtags: true,
      },
      orderBy: {
        createdAt: createdAt === 'old' ? 'asc' : 'desc',
      },
    });

    // Apply rating filters
    if (rating && rating !== 'rating') {
      if (rating === 'high-to-low') {
        coins = coins.sort((a, b) => b.votes.length - a.votes.length);
      } else if (rating === 'low-to-high') {
        coins = coins.sort((a, b) => a.votes.length - b.votes.length);
      }
    }

    res.status(200).json(coins);
  } catch (error: any) {
    console.error('Error fetching coins:', error);
    res.status(500).json({ message: 'Failed to fetch coins' });
  }
});

// New API route to calculate fee
handler.get('/calculateFee', async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {
    // Use tokenMill helper to calculate fee
    const tokenMill = (await import('../../../lib/tokenMill')).default;
    const fee = await tokenMill.calculateFee();
    res.status(200).json({ fee });
  } catch (error) {
    console.error('Error calculating fee:', error);
    res.status(500).json({ message: 'Failed to calculate fee.' });
  }
});

// Handle POST requests to create a new coin with TokenMill integration
handler.post(async (req: CustomNextApiRequest, res: NextApiResponse) => {
  // Check user session
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const {
    blockchain,
    name,
    ticker,
    description,
    airdropAmount,
    vestingDetails,
    stakingPoolAllocation,
    stakingPoolDuration,
    teamMembers,
    fastTrackListing,
    hashtags,
    milestones,
    airdropTasks,
    socialLinks,
  } = req.body;

  // Validate required fields
  if (!name || !ticker) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Parse JSON fields
  let parsedVestingDetails: any = {};
  let parsedSocialLinks: any = {};
  let parsedTeamMembers: any[] = [];
  let parsedHashtags: string[] = [];
  let parsedMilestones: any[] = [];
  let parsedAirdropTasks: any[] = [];

  try {
    if (vestingDetails) {
      parsedVestingDetails = JSON.parse(vestingDetails);
    }

    if (socialLinks) {
      parsedSocialLinks = JSON.parse(socialLinks);
    }

    if (teamMembers) {
      parsedTeamMembers = JSON.parse(teamMembers);
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
    // Calculate fee and verify payment via TokenMill
    const tokenMill = (await import('../../../lib/tokenMill')).default;
    const fee = await tokenMill.calculateFee();
    const userPaidFee = await tokenMill.verifyFeePayment(session.user.walletAddress, fee);

    if (!userPaidFee) {
      return res.status(400).json({ message: 'Fee payment not confirmed.' });
    }

    // Deploy token and market using TokenMill
    const { contractAddress, bondingCurve } = await tokenMill.deployTokenAndMarket({
      name,
      ticker,
      blockchain,
      totalSupply: 1_000_000,
    });

    // Generate unique addresses for coinAddress and dexPoolAddress
    const coinAddress = generateAddress();
    const dexPoolAddress = generateAddress();

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

    // Create the new coin
    const newCoin = await prisma.coin.create({
      data: {
        blockchain: blockchain || null,
        name,
        ticker,
        description: description || '',
        pictureUrl,
        socialLinks: parsedSocialLinks,
        airdropAmount: airdropAmount ? new Prisma.Decimal(airdropAmount) : new Prisma.Decimal(0),
        vestingDetails: parsedVestingDetails,
        coinAddress,
        dexPoolAddress,
        listingPreference: fastTrackListing ? 'fast-paced' : 'voting',
        stakingPoolAllocation: stakingPoolAllocation
          ? new Prisma.Decimal(stakingPoolAllocation)
          : new Prisma.Decimal(0),
        stakingPoolDuration: stakingPoolDuration ? parseInt(stakingPoolDuration, 10) : 0,
        creator: { connect: { id: session.user.id } },
        status: 'voting', // Set initial status
        marketCap: initialMarketCap, // Initialize marketCap
        contractAddress,
        bondingCurve,
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
        // Add airdropTasks if necessary
      },
      include: {
        milestones: true,
        hashtags: true,
        teamMembers: true,
      },
    });

    // Add team members (optional)
    if (parsedTeamMembers.length > 0) {
      await prisma.teamMember.createMany({
        data: parsedTeamMembers.map((member: any) => ({
          coinId: newCoin.id,
          username: member.username,
          avatarUrl: member.avatarUrl || null,
          displayName: member.displayName || null,
          userId: member.userId || session.user.id,
        })),
        skipDuplicates: true,
      });
    }

    // Optionally, initialize BondingCurve here if required

    res.status(201).json({
      message: 'Coin created successfully. Data cannot be changed anymore.',
      coin: JSON.parse(JSON.stringify(newCoin, customJSONSerializer)),
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
