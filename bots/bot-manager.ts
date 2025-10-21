import { Telegraf } from 'telegraf';
import { Client as DiscordClient, GatewayIntentBits } from 'discord.js';
import { PrismaClient } from '../src/generated/prisma';
import { generateAIResponse } from '../src/lib/ollama';

const prisma = new PrismaClient();

// Helper to get TokenChatConfig by platform/channel
async function getTokenChatConfig(platform: 'telegram' | 'discord', channelId: string) {
  if (platform === 'telegram') {
    return await prisma.tokenChatConfig.findUnique({
      where: { telegramGroupId: channelId },
      include: { coin: true }, // Include related Coin details
    });
  } else {
    return await prisma.tokenChatConfig.findUnique({
      where: { discordChannelId: channelId },
      include: { coin: true }, // Include related Coin details
    });
  }
}

export async function startBots() {
  // Telegram Bot
  if (process.env.TELEGRAM_BOT_TOKEN) {
    const telegramBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

    telegramBot.on('text', async (ctx) => {
      const channelId = ctx.chat.id.toString();
      const username = ctx.from.username || `user_${ctx.from.id}`;
      const tokenChatConfig = await getTokenChatConfig('telegram', channelId);

      if (!tokenChatConfig) return; // Ignore if no config found

      // Update telegram_group_members if username is not already in the list
      const members = JSON.parse(typeof tokenChatConfig.telegramGroupMembers === 'string' ? tokenChatConfig.telegramGroupMembers : JSON.stringify(tokenChatConfig.telegramGroupMembers || []));
      console.log("🚀 ~ startBots ~ members:", members)
      if (!members.includes(username)) {
        members.push(username);
        await prisma.tokenChatConfig.update({
          where: { telegramGroupId: channelId },
          data: { telegramGroupMembers: JSON.stringify(members) },
        });
      }

      // Retrieve Coin personality fields
      const { personalityBio, personalityTraits, personalityTopics, personalityTemperature, personalityMaxTokens } = tokenChatConfig.coin;

      // Prepare AI response
      const history = JSON.parse(
        typeof tokenChatConfig.conversationMemory === 'string'
          ? tokenChatConfig.conversationMemory
          : JSON.stringify(tokenChatConfig.conversationMemory || [])
      );
      const response = await generateAIResponse(ctx.message.text, history, {
        personality: personalityBio || 'Default Personality',
        traits: personalityTraits || 'Friendly, Helpful',
        lore: personalityTopics || 'General Topics',
      });

      // Send response and update conversation memory
      await ctx.reply(response);
      history.push(ctx.message.text, response);
      if (history.length > 10) history.shift(); // Limit memory to 10 messages
      await prisma.tokenChatConfig.update({
        where: { telegramGroupId: channelId },
        data: { conversationMemory: JSON.stringify(history) },
      });
    });

    await telegramBot.launch();
    console.log('Telegram bot started');
  }

  // Discord Bot
  if (process.env.DISCORD_API_TOKEN) {
    const discordClient = new DiscordClient({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    });

    discordClient.once('ready', () => console.log('Discord bot ready'));

    discordClient.on('messageCreate', async (message) => {
      if (message.author.bot) return;

      const channelId = message.channel.id;
      const tokenChatConfig = await getTokenChatConfig('discord', channelId);

      if (!tokenChatConfig) return; // Ignore if no config found

      // Retrieve Coin personality fields
      const { personalityBio, personalityTraits, personalityTopics, personalityTemperature, personalityMaxTokens } = tokenChatConfig.coin;

      // Prepare AI response
      const history = JSON.parse(
        typeof tokenChatConfig.conversationMemory === 'string'
          ? tokenChatConfig.conversationMemory
          : JSON.stringify(tokenChatConfig.conversationMemory || [])
      );
      const response = await generateAIResponse(message.content, history, {
        personality: personalityBio || 'Default Personality',
        traits: personalityTraits || 'Friendly, Helpful',
        lore: personalityTopics || 'General Topics',
      });

      // Send response and update conversation memory
      await message.reply(response);
      history.push(message.content, response);
      if (history.length > 10) history.shift(); // Limit memory to 10 messages
      await prisma.tokenChatConfig.update({
        where: { discordChannelId: channelId },
        data: { conversationMemory: JSON.stringify(history) },
      });
    });

    await discordClient.login(process.env.DISCORD_API_TOKEN);
  }
}