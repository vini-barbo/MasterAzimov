import { IsNotEmpty, IsNumber, IsDate, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSaleItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;
}

export class CreateSaleDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  saleDate: Date;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  saleItems: CreateSaleItemDto[];
}
