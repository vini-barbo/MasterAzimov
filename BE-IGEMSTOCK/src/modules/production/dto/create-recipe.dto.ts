import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RecipeIngredientDto {
  @IsNotEmpty()
  @IsNumber()
  ingredientId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  ingredients: RecipeIngredientDto[];
}
