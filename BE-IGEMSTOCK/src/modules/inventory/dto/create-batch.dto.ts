import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBatchDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    description: 'Warehouse ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  warehouseId: number;

  @ApiProperty({
    description: 'Batch or lot code',
    example: 'BATCH-001',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  batchCode: string;

  @ApiProperty({
    description: 'Current quantity in batch',
    example: 100,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Expiration date for perishable goods',
    example: '2024-12-31',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}
