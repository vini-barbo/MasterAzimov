import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty({
    description: 'Warehouse name',
    example: 'Main Warehouse',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Human-readable address or description',
    example: '123 Main St, City, State 12345',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;
}
