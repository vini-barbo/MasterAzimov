import { IsNotEmpty, IsNumber, IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductionBatchDto {
  @IsNotEmpty()
  @IsNumber()
  recipeId: number;

  @IsNotEmpty()
  @IsNumber()
  quantityProduced: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  productionDate: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}
