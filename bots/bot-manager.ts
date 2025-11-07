import { Telegraf } from 'telegraf';
import prisma from "../src/lib/prisma";

import { generateAIResponse } from '../src/lib/ollama';

let telegramBot: Telegraf | null = null;



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

 async function startBots() {
  // Telegram Bot
  if (process.env.TELEGRAM_BOT_TOKEN) {
    console.log("🚀 ~ startBots ~ process.env ")
     telegramBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

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

  
  // ---------- 6. KEEP PROCESS ALIVE (Option A) ----------
  process.on('SIGINT', () => {
    console.log('\nReceived SIGINT – shutting down bots…');
    telegramBot?.stop('SIGINT');
   
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM – shutting down bots…');
    telegramBot?.stop('SIGTERM');
    
    process.exit(0);
  });
  
  // ---------- 7. START ----------
  (async () => {
    try {
      await startBots();
      console.log('Bots are up – process will stay alive. Press Ctrl+C to stop.');
      // Keep the event loop alive forever
      await new Promise(() => {});
    } catch (err) {
      console.error('Fatal error while starting bots:', err);
      process.exit(1);
    }
  })();
}