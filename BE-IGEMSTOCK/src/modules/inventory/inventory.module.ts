import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ProductService } from './product.service';
import { WarehouseService } from './warehouse.service';
import { BatchService } from './batch.service';
import { StockMovementService } from './stock-movement.service';
import { ProductController } from './product.controller';
import { WarehouseController } from './warehouse.controller';
import { BatchController } from './batch.controller';
import { StockMovementController } from './stock-movement.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    ProductController,
    WarehouseController,
    BatchController,
    StockMovementController,
  ],
  providers: [
    ProductService,
    WarehouseService,
    BatchService,
    StockMovementService,
  ],
  exports: [
    ProductService,
    WarehouseService,
    BatchService,
    StockMovementService,
  ],
})
export class InventoryModule {}
