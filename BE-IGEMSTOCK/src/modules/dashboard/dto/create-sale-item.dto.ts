import { IsInt, IsNotEmpty, IsDecimal, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateSaleItemDto {
  @ApiProperty({
    description: 'Sale ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  saleId: number;

  @ApiProperty({
    description: 'Product ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    description: 'Units sold',
    example: 5,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Sale price per unit',
    example: 25.5,
    type: 'number',
  })
  @IsDecimal()
  @IsNotEmpty()
  unitPrice: Decimal;
}
