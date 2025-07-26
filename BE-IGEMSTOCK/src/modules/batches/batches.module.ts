import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [BatchController],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchesModule { }
