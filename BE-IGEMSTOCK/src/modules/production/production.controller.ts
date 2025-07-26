import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductionService } from './production.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';

@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) { }

  // Recipe endpoints
  @Post('recipes')
  createRecipe(@Body() createRecipeDto: CreateRecipeDto) {
    return this.productionService.createRecipe(createRecipeDto);
  }

  @Get('recipes')
  findAllRecipes() {
    return this.productionService.findAllRecipes();
  }

  @Get('recipes/:id')
  findRecipe(@Param('id') id: string) {
    return this.productionService.findRecipe(+id);
  }

  @Patch('recipes/:id')
  updateRecipe(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.productionService.updateRecipe(+id, updateRecipeDto);
  }

  @Delete('recipes/:id')
  removeRecipe(@Param('id') id: string) {
    return this.productionService.removeRecipe(+id);
  }

  // Production batch endpoints
  @Post('batches')
  createProductionBatch(@Body() createProductionBatchDto: CreateProductionBatchDto) {
    return this.productionService.createProductionBatch(createProductionBatchDto);
  }

  @Get('batches')
  findAllProductionBatches() {
    return this.productionService.findAllProductionBatches();
  }

  @Get('batches/:id')
  findProductionBatch(@Param('id') id: string) {
    return this.productionService.findProductionBatch(+id);
  }
}
