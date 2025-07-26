import { Recipe, CreateRecipeDto, UpdateRecipeDto, ProductionBatch, CreateProductionBatchDto } from '../types/production.types'

export class ProductionMapper {
  static fromApiRecipeResponse(apiRecipe: any): Recipe {
    return {
      id: apiRecipe.id,
      name: apiRecipe.name,
      description: apiRecipe.description,
      final_product_id: apiRecipe.final_product_id,
      final_product_name: apiRecipe.final_product_name,
      final_product_sku: apiRecipe.final_product_sku,
      yield_quantity: Number(apiRecipe.yield_quantity),
      preparation_time_minutes: apiRecipe.preparation_time_minutes ? Number(apiRecipe.preparation_time_minutes) : undefined,
      is_active: apiRecipe.is_active ?? true,
      ingredients: apiRecipe.ingredients?.map((ingredient: any) => ({
        id: ingredient.id,
        recipe_id: ingredient.recipe_id,
        product_id: ingredient.product_id,
        product_name: ingredient.product_name,
        product_sku: ingredient.product_sku,
        quantity_needed: Number(ingredient.quantity_needed),
        unit_of_measure: ingredient.unit_of_measure,
        notes: ingredient.notes,
      })) || [],
      created_at: apiRecipe.created_at,
      updated_at: apiRecipe.updated_at,
    }
  }

  static fromApiBatchResponse(apiBatch: any): ProductionBatch {
    return {
      id: apiBatch.id,
      recipe_id: apiBatch.recipe_id,
      recipe_name: apiBatch.recipe_name,
      planned_quantity: Number(apiBatch.planned_quantity),
      produced_quantity: apiBatch.produced_quantity ? Number(apiBatch.produced_quantity) : undefined,
      status: apiBatch.status,
      planned_start_date: apiBatch.planned_start_date,
      actual_start_date: apiBatch.actual_start_date,
      planned_end_date: apiBatch.planned_end_date,
      actual_end_date: apiBatch.actual_end_date,
      notes: apiBatch.notes,
      user_id: apiBatch.user_id,
      user_name: apiBatch.user_name,
      created_at: apiBatch.created_at,
      updated_at: apiBatch.updated_at,
    }
  }

  static toApiRecipeRequest(recipe: CreateRecipeDto | UpdateRecipeDto): any {
    return {
      name: recipe.name,
      description: recipe.description,
      final_product_id: recipe.final_product_id,
      yield_quantity: recipe.yield_quantity,
      preparation_time_minutes: recipe.preparation_time_minutes,
      is_active: recipe.is_active,
      ingredients: recipe.ingredients?.map(ingredient => ({
        product_id: ingredient.product_id,
        quantity_needed: ingredient.quantity_needed,
        unit_of_measure: ingredient.unit_of_measure,
        notes: ingredient.notes,
      })),
    }
  }

  static toApiBatchRequest(batch: CreateProductionBatchDto): any {
    return {
      recipe_id: batch.recipe_id,
      planned_quantity: batch.planned_quantity,
      planned_start_date: batch.planned_start_date,
      planned_end_date: batch.planned_end_date,
      notes: batch.notes,
      user_id: batch.user_id,
    }
  }

  static toDisplayRecipe(recipe: Recipe) {
    return {
      id: recipe.id,
      name: recipe.name,
      finalProduct: recipe.final_product_name || 'N/A',
      yield: recipe.yield_quantity.toString(),
      ingredientsCount: recipe.ingredients.length,
      status: recipe.is_active ? 'Ativo' : 'Inativo',
      createdAt: new Date(recipe.created_at).toLocaleDateString('pt-BR'),
    }
  }

  static toDisplayBatch(batch: ProductionBatch) {
    return {
      id: batch.id,
      recipeName: batch.recipe_name || 'N/A',
      plannedQuantity: batch.planned_quantity.toString(),
      producedQuantity: batch.produced_quantity?.toString() || 'N/A',
      status: this.getBatchStatusDisplay(batch.status),
      createdAt: new Date(batch.created_at).toLocaleDateString('pt-BR'),
    }
  }

  private static getBatchStatusDisplay(status: string): string {
    const statuses: Record<string, string> = {
      'planned': 'Planejado',
      'in_progress': 'Em andamento',
      'completed': 'Concluído',
      'cancelled': 'Cancelado',
    }
    return statuses[status] || status
  }
}
