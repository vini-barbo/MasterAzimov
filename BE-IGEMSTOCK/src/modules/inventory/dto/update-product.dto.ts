import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { Decimal } from '@prisma/client/runtime/library';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({
    description: 'Stock Keeping Unit - unique identifier for the product',
    example: 'SKU-001',
    maxLength: 50,
  })
  sku?: string;

  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Acetaminophen 500mg',
    maxLength: 255,
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Pain reliever and fever reducer',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Standard unit cost',
    example: 10.5,
    type: 'number',
  })
  unitCost?: Decimal;
}
