import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private redis: Redis;

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get<string>(
      'REDIS_URL',
      'redis://localhost:6379',
    );

    this.redis = new Redis(redisUrl);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(
    key: string,
    value: string,
    expirationMode?: 'EX' | 'PX',
    time?: number,
  ): Promise<void> {
    if (expirationMode && time) {
      if (expirationMode === 'EX') {
        await this.redis.setex(key, time, value);
      } else {
        await this.redis.psetex(key, time, value);
      }
    } else {
      await this.redis.set(key, value);
    }
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.redis.exists(key);
  }

  async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.redis.expire(key, seconds);
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    return this.redis.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.redis.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.redis.hgetall(key);
  }

  async hdel(key: string, field: string): Promise<number> {
    return this.redis.hdel(key, field);
  }

  getClient(): Redis {
    return this.redis;
  }
}
