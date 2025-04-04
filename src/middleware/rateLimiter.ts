// src/middleware/rateLimiter.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';

/**
 * Initialize rate limiter with memory store.
 * For production, consider using a Redis store for distributed rate limiting.
 */
const rateLimiter = new RateLimiterMemory({
  points: 10, // Number of points
  duration: 60 * 60, // Per hour
});

/**
 * Middleware to rate limit API routes.
 * @param req Next.js API Request
 * @param res Next.js API Response
 * @returns Promise<void>
 */
export const applyRateLimit = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Extract IP address from request
    const ip =
      (Array.isArray(req.headers['x-forwarded-for']) ? req.headers['x-forwarded-for'][0] : req.headers['x-forwarded-for']?.split(',').shift()) ||
      req.socket.remoteAddress ||
      'unknown';

    // Consume 1 point per request
    await rateLimiter.consume(ip);

    // If successful, proceed
  } catch (rlRejected) {
    if (rlRejected instanceof RateLimiterRes) {
      // Rate limit exceeded
      console.warn(`Rate limit exceeded for IP: ${rlRejected.consumedPoints}`);

      res.setHeader('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || '60');
      res.status(429).json({ message: 'Too many requests. Please try again later.' });
    } else {
      // Other errors
      console.error('Rate limiter error:', rlRejected);
      res.status(500).json({ message: 'Internal server error.' });
    }
    throw new Error('Rate limit exceeded');
  }
};
