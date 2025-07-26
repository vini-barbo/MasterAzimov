import { IsEnum, IsInt, IsOptional, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationRuleDto {
  @ApiProperty({
    description: 'Rule type',
    enum: ['LOW_STOCK', 'EXPIRY'],
    example: 'LOW_STOCK',
  })
  @IsEnum(['LOW_STOCK', 'EXPIRY'])
  @IsNotEmpty()
  ruleType: 'LOW_STOCK' | 'EXPIRY';

  @ApiPropertyOptional({
    description: 'Product ID (optional for global rules)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  productId?: number;

  @ApiPropertyOptional({
    description: 'Warehouse ID (optional for global rules)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  warehouseId?: number;

  @ApiPropertyOptional({
    description: 'Minimum quantity threshold for LOW_STOCK alerts',
    example: 10,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  threshold?: number;

  @ApiPropertyOptional({
    description: 'Days before expiry to trigger EXPIRY alerts',
    example: 30,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  daysBeforeExpiry?: number;
}
