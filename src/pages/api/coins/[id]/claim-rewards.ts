import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { TwitterApi } from 'twitter-api-v2';
import { Telegraf } from 'telegraf';
import axios from 'axios';

// lazy prisma imported above
const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!);
const telegramBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

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
    const { taskType, userHandle, agentHandle, walletAddress } = req.body;

    if (!taskType || !userHandle || !agentHandle || !walletAddress) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    try {
      // Fetch the task
      const task = await prisma.airdropTasks.findUnique({
        where: { id },
      });

      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      // Check if the user has already been rewarded
      const alreadyRewarded = task.rewardedUsers.some(
        (user: any) =>
          user.userId === session.user.id && user.taskType === taskType
      );

      if (alreadyRewarded) {
        res
          .status(400)
          .json({ message: 'You have already claimed this reward.' });
        return;
      }

      // Verify the task
      let isVerified = false;

      if (taskType === 'twitter-follow') {
        // Verify Twitter task
        const user = await twitterClient.v2.userByUsername(userHandle);
        const agent = await twitterClient.v2.userByUsername(agentHandle);

        if (!user || !agent) {
          res.status(400).json({ message: 'Invalid Twitter handles.' });
          return;
        }

        // Check if the user follows the agent using Apify (https://apify.com/powerai/twitter-followers-scraper/api)

        const follows = await axios
          .post(
            `https://api.apify.com/v2/acts/powerai~twitter-followers-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_API_KEY}`,
            {
              screenname: agentHandle,
              maxResults: 50,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            }
          )
          .then((response) => {
            return response.data.some(
              (follower: any) =>
                follower.screen_name.toLowerCase() === userHandle.toLowerCase()
            );
          })
          .catch((error) => {
            console.error('Error fetching followers from Apify:', error);
            throw new Error('Failed to verify Twitter follow task.');
          });

        //   let inputData = JSON.stringify({});
        // let config = {
        //   method: 'post',
        //   maxBodyLength: Infinity,
        //   url: 'https://api.apify.com/v2/acts/:actorId/run-sync-get-dataset-items',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Accept': 'application/json',
        //     'Authorization': 'Bearer <token>'
        //   },
        //   data : inputData
        // };

        // const isFollowing = axios.request(config)
        // .then((response) => {
        //   console.log(JSON.stringify(response.data));
        // })
        // .catch((error) => {
        //   console.error('Error fetching followers from Apify:', error);
        // });

        // Check if the user mentioned @yozoonbot in their recent tweets..
        // !!!Note it is rate limited for free-tier accounts

        const url = `https://api.x.com/2/tweets/search/recent?max_results=50&query=(from%3A${userHandle})%20-is%3Aretweet&sort_order=recency`;
        const options = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        };

        const response = await fetch(url, options).catch((error) => {
          console.error('Error fetching tweets from Twitter API:', error);
          throw new Error('Failed to verify Twitter mention task.');
        });

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
          res.status(400).json({
            message: 'Please mention the handle in a tweet and try again.',
          });
          return;
        }

        const mentionedYozoonBot = data.data.some((tweet: any) =>
          tweet.text.includes(
            agentHandle.startsWith('@') ? agentHandle : `@${agentHandle}`
          )
        );

        if (!mentionedYozoonBot) {
          res.status(400).json({
            message:
              'The user has not mentioned the agent handle in their tweets.',
          });
          return;
        }

        isVerified = follows && mentionedYozoonBot;
      } else if (taskType === 'telegram-join') {
        // Verify Telegram task
        const tokenChatConfig = await prisma.tokenChatConfig.findUnique({
          where: { telegramGroupId: task.telegramGroupId! },
        });

        if (!tokenChatConfig) {
          res
            .status(404)
            .json({ message: 'Telegram group configuration not found.' });
          return;
        }

        // Parse the telegramGroupMembers field
        const members = JSON.parse(
          typeof tokenChatConfig.telegramGroupMembers === 'string'
            ? tokenChatConfig.telegramGroupMembers
            : JSON.stringify(tokenChatConfig.telegramGroupMembers || [])
        );

        // Check if the userHandle exists in the group members
        isVerified = members.includes(userHandle);
      }

      if (!isVerified) {
        res.status(400).json({
          message: 'Task verification failed. Please complete task and confirm',
        });
        return;
      }

      // Add the user to the rewardedUsers list
      const updatedTask = await prisma.airdropTasks.update({
        where: { id },
        data: {
          rewardedUsers: {
            push: {
              userId: session.user.id,
              username: session.user.name,
              pictureUrl: session.user.image,
              walletAddress,
              taskType,
            },
          },
        },
      });

      res
        .status(200)
        .json({ message: 'Reward claimed successfully.', task: updatedTask });
    } catch (error) {
      console.error('Error claiming reward:', error);
      res.status(500).json({ message: 'Error claiming reward.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
