import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDecimal,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateProductDto {
  @ApiProperty({
    description: 'Stock Keeping Unit - unique identifier for the product',
    example: 'SKU-001',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Acetaminophen 500mg',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Pain reliever and fever reducer',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Standard unit cost',
    example: 10.5,
    type: 'number',
  })
  @IsDecimal()
  @IsNotEmpty()
  unitCost: Decimal;
}
