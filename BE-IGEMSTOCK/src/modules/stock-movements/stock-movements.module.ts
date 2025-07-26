import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { StockMovementService } from './stock-movement.service';
import { StockMovementController } from './stock-movement.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [StockMovementController],
  providers: [StockMovementService],
  exports: [StockMovementService],
})
export class StockMovementsModule { }
