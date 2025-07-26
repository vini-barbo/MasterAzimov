import { BaseEntity } from './common.types'

export type ProductionBatchStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled'

export interface Recipe extends BaseEntity {
  name: string
  description?: string
  final_product_id: string | number
  final_product_name?: string
  final_product_sku?: string
  yield_quantity: number
  preparation_time_minutes?: number
  is_active: boolean
  ingredients: RecipeIngredient[]
}

export interface RecipeIngredient {
  id: string | number
  recipe_id?: string | number
  product_id: string | number
  product_name?: string
  product_sku?: string
  quantity_needed: number
  unit_of_measure: string
  notes?: string
}

export interface CreateRecipeDto {
  name: string
  description?: string
  final_product_id: string | number
  yield_quantity: number
  preparation_time_minutes?: number
  is_active?: boolean
  ingredients: CreateRecipeIngredientDto[]
}

export interface CreateRecipeIngredientDto {
  product_id: string | number
  quantity_needed: number
  unit_of_measure: string
  notes?: string
}

export interface UpdateRecipeDto {
  name?: string
  description?: string
  final_product_id?: string | number
  yield_quantity?: number
  preparation_time_minutes?: number
  is_active?: boolean
  ingredients?: UpdateRecipeIngredientDto[]
}

export interface UpdateRecipeIngredientDto {
  id?: string | number
  product_id?: string | number
  quantity_needed?: number
  unit_of_measure?: string
  notes?: string
}

export interface ProductionBatch extends BaseEntity {
  recipe_id: string | number
  recipe_name?: string
  planned_quantity: number
  produced_quantity?: number
  status: ProductionBatchStatus
  planned_start_date?: string
  actual_start_date?: string
  planned_end_date?: string
  actual_end_date?: string
  notes?: string
  user_id?: string | number
  user_name?: string
}

export interface CreateProductionBatchDto {
  recipe_id: string | number
  planned_quantity: number
  planned_start_date?: string
  planned_end_date?: string
  notes?: string
  user_id?: string | number
}

export interface UpdateProductionBatchDto {
  planned_quantity?: number
  produced_quantity?: number
  status?: ProductionBatchStatus
  planned_start_date?: string
  actual_start_date?: string
  planned_end_date?: string
  actual_end_date?: string
  notes?: string
}

export interface RecipeResponse extends Recipe {
  // Additional fields that might come from the API
}

export interface ProductionBatchResponse extends ProductionBatch {
  recipe?: Recipe
  ingredients_consumed?: {
    product_id: string | number
    product_name: string
    product_sku: string
    quantity_used: number
    unit_of_measure: string
  }[]
}
