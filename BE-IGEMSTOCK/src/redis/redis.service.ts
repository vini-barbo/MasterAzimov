import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';

interface RedisConfig {
  host?: string;
  port?: number;
  password?: string;
  url?: string;
  ttl?: number;
}

@Injectable()
export class RedisService implements OnModuleDestroy {
  private redis: Redis;

  constructor(private configService: ConfigService) {
    this.initializeRedis();
  }

  private initializeRedis() {
    const redisConfig = this.configService.get<RedisConfig>('redis');
    const redisUrl = this.configService.get<string>('REDIS_URL');
    const redisPassword = this.configService.get<string>('REDIS_PASSWORD');

    let connectionOptions: RedisOptions;

    if (redisUrl) {
      // If REDIS_URL is provided, parse it and add password if needed
      connectionOptions = {
        ...this.parseRedisUrl(redisUrl),
        ...(redisPassword && { password: redisPassword }),
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        connectTimeout: 10000,
        commandTimeout: 5000,
      };
    } else {
      // Use individual config options
      connectionOptions = {
        host:
          redisConfig?.host ||
          this.configService.get<string>('REDIS_HOST', 'localhost'),
        port:
          redisConfig?.port ||
          this.configService.get<number>('REDIS_PORT', 6379),
        password: redisPassword || redisConfig?.password,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        connectTimeout: 10000,
        commandTimeout: 5000,
      };
    }

    this.redis = new Redis(connectionOptions);

    // Handle connection events
    this.redis.on('connect', () => {
      console.log('Redis connected successfully');
    });

    this.redis.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    this.redis.on('ready', () => {
      console.log('Redis is ready to accept commands');
    });

    this.redis.on('close', () => {
      console.log('Redis connection closed');
    });
  }

  private parseRedisUrl(url: string): Partial<RedisOptions> {
    try {
      const parsedUrl = new URL(url);
      return {
        host: parsedUrl.hostname,
        port: parseInt(parsedUrl.port) || 6379,
        ...(parsedUrl.password && { password: parsedUrl.password }),
      };
    } catch {
      console.warn('Failed to parse Redis URL, using default localhost:6379');
      return { host: 'localhost', port: 6379 };
    }
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      throw error;
    }
  }

  async set(
    key: string,
    value: string,
    expirationMode?: 'EX' | 'PX',
    time?: number,
  ): Promise<void> {
    try {
      if (expirationMode && time) {
        if (expirationMode === 'EX') {
          await this.redis.setex(key, time, value);
        } else {
          await this.redis.psetex(key, time, value);
        }
      } else {
        await this.redis.set(key, value);
      }
    } catch (error) {
      console.error('Redis SET error:', error);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.redis.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
      throw error;
    }
  }

  async exists(key: string): Promise<number> {
    try {
      return await this.redis.exists(key);
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      throw error;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      return await this.redis.incr(key);
    } catch (error) {
      console.error('Redis INCR error:', error);
      throw error;
    }
  }

  async expire(key: string, seconds: number): Promise<number> {
    try {
      return await this.redis.expire(key, seconds);
    } catch (error) {
      console.error('Redis EXPIRE error:', error);
      throw error;
    }
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    try {
      return await this.redis.hset(key, field, value);
    } catch (error) {
      console.error('Redis HSET error:', error);
      throw error;
    }
  }

  async hget(key: string, field: string): Promise<string | null> {
    try {
      return await this.redis.hget(key, field);
    } catch (error) {
      console.error('Redis HGET error:', error);
      throw error;
    }
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    try {
      return await this.redis.hgetall(key);
    } catch (error) {
      console.error('Redis HGETALL error:', error);
      throw error;
    }
  }

  async hdel(key: string, field: string): Promise<number> {
    try {
      return await this.redis.hdel(key, field);
    } catch (error) {
      console.error('Redis HDEL error:', error);
      throw error;
    }
  }

  getClient(): Redis {
    return this.redis;
  }

  async ping(): Promise<string> {
    try {
      return await this.redis.ping();
    } catch (error) {
      console.error('Redis PING error:', error);
      throw error;
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }
}
