import { IsDateString, IsNotEmpty, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateSaleDto {
  @ApiProperty({
    description: 'Date and time of sale',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  saleDate: string;

  @ApiProperty({
    description: 'Total sale value',
    example: 150.75,
    type: 'number',
  })
  @IsDecimal()
  @IsNotEmpty()
  totalAmount: Decimal;
}
