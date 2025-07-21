import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import axios from 'axios';

const prisma = new PrismaClient();

// Mock function to fetch latest price for a coin
async function fetchLatestPrice(coin: { id: string; ticker: string }) {
  // Replace this with real API call to fetch price
  // Example: const res = await axios.get(`https://api.example.com/price?ticker=${coin.ticker}`);
  // return res.data.price;
  return Math.random() * 10; // Mock price
}

async function updateAllCoinPrices() {
  const coins = await prisma.coin.findMany();
  for (const coin of coins) {
    const latestPrice = await fetchLatestPrice(coin);
    // Get the last price entry
    const lastEntry = await prisma.priceHistory.findFirst({
      where: { coinId: coin.id },
      orderBy: { timestamp: 'desc' },
    });
    // Only add if price changed or if no history yet
    if (!lastEntry || Number(lastEntry.price) !== Number(latestPrice)) {
      await prisma.priceHistory.create({
        data: {
          coinId: coin.id,
          price: latestPrice,
          timestamp: new Date(),
        },
      });
      console.log(`Added price history for ${coin.ticker}: $${latestPrice}`);
    }
  }
}

//!!uncomment before prod push
// // Schedule to run every 10 minutes
// cron.schedule('*/10 * * * *', async () => {
//   console.log('Updating coin prices...');
//   await updateAllCoinPrices();
//   console.log('Done updating prices.');
// });

// For manual run
updateAllCoinPrices().then(() => {
  console.log('Initial price update complete.');
  process.exit(0);
});