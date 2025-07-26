import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductionController],
  providers: [ProductionService],
  exports: [ProductionService],
})
export class ProductionModule { }
