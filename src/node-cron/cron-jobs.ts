import { PrismaClient } from "@/generated/prisma";

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
    // if (!lastEntry || Number(lastEntry.price) !== Number(latestPrice)) {
      await prisma.priceHistory.create({
        data: {
          coinId: coin.id,
          price: latestPrice,
          timestamp: new Date(),
        },
      });
      console.log(`Added price history for ${coin.ticker}: $${latestPrice}`);
    // }
  }
}



//!!uncomment before prod push
// Schedule to run every 10 minutes
cron.schedule('*/2 * * * *', async () => {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/update-prices',
      {}, // Pass an empty object as the body for a POST request
      {
        headers: {
          'x-secret-key': process.env.PRICES_API_SECRET,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log('Prices updated');
  } catch (error) {
    console.error('Error updating prices', error);
  }
});



// Schedule deletion every Sunday at midnight
cron.schedule('0 0 * * 0', async () => {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/delete-old-prices',
      {}, // Pass an empty object as the body for a POST request
      {
        headers: {
          'x-secret-key': process.env.PRICES_API_SECRET,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log('Cron job deletion done:');
  } catch (error) {
    console.error('Error running delete-old-prices cron job:', error);
  }
});




