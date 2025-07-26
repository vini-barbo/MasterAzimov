import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStockMovementDto {
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

  @ApiPropertyOptional({
    description: 'Batch ID (optional)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  batchId?: number;

  @ApiProperty({
    description: 'Movement type',
    enum: ['IN', 'OUT', 'ADJ'],
    example: 'IN',
  })
  @IsEnum(['IN', 'OUT', 'ADJ'])
  @IsNotEmpty()
  movementType: 'IN' | 'OUT' | 'ADJ';

  @ApiProperty({
    description: 'Movement amount (must be positive)',
    example: 50,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Related ID (e.g. sale_id or purchase_id)',
    example: 123,
  })
  @IsOptional()
  @IsInt()
  relatedId?: number;

  @ApiPropertyOptional({
    description: 'Additional information',
    example: 'Received from supplier ABC',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
