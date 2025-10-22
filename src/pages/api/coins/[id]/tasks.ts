import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    res.status(400).json({ message: 'Invalid coin ID' });
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (req.method === 'POST') {
    const {
      taskType,
      twitterHandle,
      telegramGroupId,
      rewardQuantity,
      instruction,
      rewardClaimEndDate,
    } = req.body;

    // Validate required fields
    if (!taskType || !rewardQuantity || !instruction || !rewardClaimEndDate) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    try {
      // Check if the user is the creator of the coin
      const coin = await prisma.coin.findUnique({
        where: { id },
        select: { creatorId: true },
      });

      if (!coin) {
        res.status(404).json({ message: 'Coin not found' });
        return;
      }

      if (coin.creatorId !== session.user.id) {
        res
          .status(403)
          .json({
            message: 'You are not authorized to create tasks for this coin',
          });
        return;
      }

      // Check if a similar task already exists and is still active
      const existingTask = await prisma.airdropTasks.findFirst({
        where: {
          coinId: id,
          taskType,
          rewardClaimEndDate: { gte: new Date() }, // Check if the task is still active
        },
      });

      if (existingTask) {
        res
          .status(400)
          .json({
            message: 'A similar task already exists and is still active.',
          });
        return;
      }

      // Create the task
      const task = await prisma.airdropTasks.create({
        data: {
          taskType,
          twitterHandle,
          telegramGroupId,
          rewardQuantity,
          instruction,
          rewardClaimEndDate: new Date(rewardClaimEndDate),
          coinId: id,
        },
      });

      res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ message: 'Error creating task' });
    }
  } else if (req.method === 'GET') {
    try {
      // Retrieve active tasks for the coin
      const activeTasks = await prisma.airdropTasks.findMany({
        where: {
          coinId: id,
          rewardClaimEndDate: { gte: new Date() }, // Only include tasks that are still active
        },
      });

      // Generate redirect links for tasks
      const tasksWithLinks = activeTasks.map((task) => {
        let redirectLink = '';
        if (task.taskType === 'twitter-follow' && task.twitterHandle) {
          redirectLink = `https://twitter.com/${task.twitterHandle}`;
        } else if (task.taskType === 'telegram-join' && task.telegramGroupId) {
          redirectLink = `https://t.me/${task.telegramGroupId}`;
        }
        return { ...task, redirectLink };
      });

      res.status(200).json(tasksWithLinks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Error fetching tasks' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
