import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SaleService } from './sale.service';
import { SaleItemService } from './sale-item.service';
import { SaleController } from './sale.controller';
import { SaleItemController } from './sale-item.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SaleController, SaleItemController],
  providers: [SaleService, SaleItemService],
  exports: [SaleService, SaleItemService],
})
export class DashboardModule {}
