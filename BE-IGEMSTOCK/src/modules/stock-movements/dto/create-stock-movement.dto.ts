import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum StockMovementType {
  IN = 'IN',
  OUT = 'OUT',
  ADJ = 'ADJ',
}

export class CreateStockMovementDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  warehouseId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  batchId?: number;

  @IsNotEmpty()
  @IsEnum(StockMovementType)
  movementType: StockMovementType;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  relatedId?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
