import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';

const rateLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = req.ip || req.connection.remoteAddress || 'unknown';
    await rateLimiter.consume(key);
    next();
  } catch (rejRes) {
    const rateLimiterRes = rejRes as RateLimiterRes;
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000) || 1
    });
  }
};

export { rateLimiter }