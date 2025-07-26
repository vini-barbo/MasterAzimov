import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBatchDto {
  @IsNotEmpty()
  @IsString()
  batchCode: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  warehouseId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsDateString()
  expiryDate?: Date;
}
