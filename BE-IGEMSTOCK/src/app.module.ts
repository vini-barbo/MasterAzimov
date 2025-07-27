import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';

// Authentication module
import { AuthModule } from './modules/auth/auth.module';

// New modular structure
import { ProductsModule } from './modules/products/products.module';
import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { BatchesModule } from './modules/batches/batches.module';
import { StockMovementsModule } from './modules/stock-movements/stock-movements.module';
import { SalesModule } from './modules/sales/sales.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { ProductionModule } from './modules/production/production.module';
import { UsersModule } from './modules/users/users.module';
import { NotificationModule } from './modules/notification/notification.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';

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

    // Authentication module
    AuthModule,

    // Business domain modules
    ProductsModule,
    WarehousesModule,
    BatchesModule,
    StockMovementsModule,
    SalesModule,
    PurchasesModule,
    ProductionModule,
    UsersModule,
    NotificationModule,
    DashboardModule,
    SuppliersModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
