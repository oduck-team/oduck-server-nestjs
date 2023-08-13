import { Logger } from '@nestjs/common';
import { createClient } from 'redis';

export const redisClient = createClient({
  url: `redis://redis:${process.env.REDIS_PORT}`,
});

redisClient.on('error', (err) => {
  Logger.error(`Redis Client Error ${err.message}`);
});

redisClient.on('connect', () => Logger.log('Redis Client Connected'));

redisClient.connect();
