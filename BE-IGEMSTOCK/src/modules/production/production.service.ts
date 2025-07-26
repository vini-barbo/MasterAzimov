import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';

@Injectable()
export class ProductionService {
  constructor(private prisma: PrismaService) { }

  // Recipe methods
  async createRecipe(createRecipeDto: CreateRecipeDto) {
    return this.prisma.recipe.create({
      data: {
        productId: createRecipeDto.productId,
        name: createRecipeDto.name,
        notes: createRecipeDto.notes,
        recipeIngredients: {
          create: createRecipeDto.ingredients.map((ingredient) => ({
            ingredientId: ingredient.ingredientId,
            quantity: ingredient.quantity,
          })),
        },
      },
      include: {
        product: true,
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  async findAllRecipes() {
    return this.prisma.recipe.findMany({
      include: {
        product: true,
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  async findRecipe(id: number) {
    return this.prisma.recipe.findUnique({
      where: { id },
      include: {
        product: true,
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
        productionBatches: true,
      },
    });
  }

  async updateRecipe(id: number, updateRecipeDto: UpdateRecipeDto) {
    return this.prisma.recipe.update({
      where: { id },
      data: {
        name: updateRecipeDto.name,
        notes: updateRecipeDto.notes,
      },
      include: {
        product: true,
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  async removeRecipe(id: number) {
    return this.prisma.recipe.delete({
      where: { id },
    });
  }

  // Production batch methods
  async createProductionBatch(createProductionBatchDto: CreateProductionBatchDto): Promise<any> {
    // Get recipe with ingredients
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: createProductionBatchDto.recipeId },
      include: {
        recipeIngredients: true,
      },
    });

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    // Check ingredient availability
    for (const ingredient of recipe.recipeIngredients) {
      const requiredQuantity = Number(ingredient.quantity) * createProductionBatchDto.quantityProduced;

      // Here you would check stock availability
      // This is a simplified version
    }

    // Create production batch
    const productionBatch = await this.prisma.productionBatch.create({
      data: {
        recipeId: createProductionBatchDto.recipeId,
        quantityProduced: createProductionBatchDto.quantityProduced,
        productionDate: createProductionBatchDto.productionDate,
        notes: createProductionBatchDto.notes,
      },
      include: {
        recipe: {
          include: {
            product: true,
            recipeIngredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    });

    // Create stock movements for ingredients (OUT) and final product (IN)
    for (const ingredient of recipe.recipeIngredients) {
      const usedQuantity = Number(ingredient.quantity) * createProductionBatchDto.quantityProduced;

      await this.prisma.stockMovement.create({
        data: {
          productId: ingredient.ingredientId,
          warehouseId: 1, // Default warehouse
          movementType: 'OUT',
          quantity: Math.round(usedQuantity),
          relatedId: productionBatch.id,
          notes: `Production batch #${productionBatch.id} - ingredient consumed`,
        },
      });
    }

    // Add final product to stock
    await this.prisma.stockMovement.create({
      data: {
        productId: recipe.productId,
        warehouseId: 1, // Default warehouse
        movementType: 'IN',
        quantity: createProductionBatchDto.quantityProduced,
        relatedId: productionBatch.id,
        notes: `Production batch #${productionBatch.id} - final product`,
      },
    });

    return productionBatch;
  }

  async findAllProductionBatches() {
    return this.prisma.productionBatch.findMany({
      include: {
        recipe: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        productionDate: 'desc',
      },
    });
  }

  async findProductionBatch(id: number) {
    return this.prisma.productionBatch.findUnique({
      where: { id },
      include: {
        recipe: {
          include: {
            product: true,
            recipeIngredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    });
  }
}
