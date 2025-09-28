import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '../../../../generated/prisma'; // Adjust the import path based on your project structure


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res, userId);
    case 'PUT':
      return handlePut(req, res, userId);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// GET: Retrieve proposals for a specific coin
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { coinId } = req.body;

  if (!coinId) {
    return res.status(400).json({ error: 'coinId is required' });
  }

  try {
    const proposals = await prisma.proposal.findMany({
      where: { coinId },
    });

    return res.status(200).json(proposals);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve proposals' });
  }
}

// POST: Create a new proposal
async function handlePost(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { title, description, votingEnds, coinId } = req.body;

  if (!title || !description || !votingEnds || !coinId) {
    return res.status(400).json({ error: 'title, description, voting_Ends, and coinId are required' });
  }

  

  try {  

    // Create the proposal
    const newProposal = await prisma.proposal.create({
      data: {
        title,
        description,
        votingEnds: new Date(votingEnds),
        createdById: userId,
        coinId,
      },
    });

    // Record the transaction
    await prisma.transaction.create({
      data: {
        userId,
        coinId,
        proposalId: newProposal.id,
        type: 'proposal',
        amount: process.env.CREATE_PROPOSAL_FEE || '0', //
        price: process.env.YOZOON_PRICE || '0', // Assuming you have a YOZOON_PRICE env variable
      },
    });

    return res.status(201).json(newProposal);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create proposal' });
  }
}

// PUT: Vote on a proposal
async function handlePut(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { proposalId, vote, coinId } = req.body;

  if (!proposalId || typeof vote !== 'number') {
    return res.status(400).json({ error: 'proposalId and vote (1 for "for", -1 for "against") are required' });
  }

  
  try {   

    // Update the proposal votes
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    if (vote === 1) {
      await prisma.proposal.update({
        where: { id: proposalId },
        data: { votesFor: proposal.votesFor + 1 },
      });
    } else if (vote === -1) {
      await prisma.proposal.update({
        where: { id: proposalId },
        data: { votesAgainst: proposal.votesAgainst + 1 },
      });
    } else {
      return res.status(400).json({ error: 'Invalid vote value. Use 1 for "for" and -1 for "against".' });
    }

    // Record the transaction
    await prisma.transaction.create({
      data: {
        userId,
        coinId,
        type: 'Proposal',
        price: process.env.YOZOON_PRICE || '0',
        amount: process.env.VOTE_PROPOSAL_FEE || '0',
      },
    });

    return res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to record vote' });
  }
}