import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class WarehousesModule { }
