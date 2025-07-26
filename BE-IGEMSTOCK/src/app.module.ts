import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';
import configs from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    RedisModule,
    HealthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
