import { createClient } from 'redis';
import { logger } from '../utils/logger';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

export const connectRedis = async (): Promise<void> => {
  try {
    await client.connect();
    logger.info('✅ Connected to Redis');
  } catch (error) {
    logger.error('❌ Redis connection error:', error);
    throw error;
  }
};

client.on('error', (error) => {
  logger.error('Redis error:', error);
});

export { client as redisClient };