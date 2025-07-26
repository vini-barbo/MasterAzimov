import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  async check() {
    try {
      // Test database connection with a simple query
      await this.prismaService.user.findMany({ take: 1 });

      // Test Redis connection
      await this.redisService.set('health-check', 'ok', 'EX', 10);
      const redisResult = await this.redisService.get('health-check');

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          redis: redisResult === 'ok' ? 'connected' : 'error',
        },
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
