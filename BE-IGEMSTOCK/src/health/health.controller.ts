import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) { }

  @Get()
  async check() {
    try {
      // Test database connection with a simple query that should always work
      await this.prismaService.$queryRaw`SELECT 1`;

      // Test Redis connection
      const isRedisConnected = await this.redisService.isConnected();

      if (isRedisConnected) {
        // Test basic Redis operations
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
      } else {
        return {
          status: 'degraded',
          timestamp: new Date().toISOString(),
          services: {
            database: 'connected',
            redis: 'disconnected',
          },
        };
      }
    } catch (error) {
      console.error('Health check error:', error);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        services: {
          database: 'unknown',
          redis: 'unknown',
        },
      };
    }
  }
}
