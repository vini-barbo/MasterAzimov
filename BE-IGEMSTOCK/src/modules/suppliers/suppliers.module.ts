import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SuppliersService],
  exports: [SuppliersService],
})
export class SuppliersModule {}
