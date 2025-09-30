import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export interface CandlestickData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

export async function getOHLCData(priceHistory: { timestamp: Date; price: number }[]): Promise<CandlestickData[]> {
  

  const simplifiedData = priceHistory.map(record => ({
    timestamp: record.timestamp,
    price: Number(record.price), // Convert Prisma.Decimal to number
  }));

  return aggregateToFifteenMinutes(simplifiedData);
}

function aggregateToFifteenMinutes(data: { timestamp: Date; price: number }[]): CandlestickData[] {
  if (!data.length) return [];

  const intervalMs = 15 * 60 * 1000; // 15 minutes in milliseconds
  const result: CandlestickData[] = [];

  let currentIntervalStart = Math.floor(data[0].timestamp.getTime() / intervalMs) * intervalMs;
  let bucket: { timestamp: Date; price: number }[] = [];

  for (const entry of data) {
    const entryTime = entry.timestamp.getTime();
    if (entryTime >= currentIntervalStart + intervalMs) {
      if (bucket.length > 0) {
        result.push({
          timestamp: new Date(currentIntervalStart),
          open: bucket[0].price,
          high: Math.max(...bucket.map(b => b.price)),
          low: Math.min(...bucket.map(b => b.price)),
          close: bucket[bucket.length - 1].price,
        });
      }
      currentIntervalStart += intervalMs;
      bucket = [];
    }
    bucket.push(entry);
  }

  if (bucket.length > 0) {
    result.push({
      timestamp: new Date(currentIntervalStart),
      open: bucket[0].price,
      high: Math.max(...bucket.map(b => b.price)),
      low: Math.min(...bucket.map(b => b.price)),
      close: bucket[bucket.length - 1].price,
    });
  }

  return result;
}