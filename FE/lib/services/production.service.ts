import { httpClient } from './http-client'
import { ProductionMapper } from '../mappers/production.mapper'
import { Recipe, CreateRecipeDto, UpdateRecipeDto, ProductionBatch, CreateProductionBatchDto, UpdateProductionBatchDto } from '../types/production.types'

export class ProductionService {
  private static readonly BASE_PATH = '/production'

  // Recipe endpoints
  static async getAllRecipes(): Promise<Recipe[]> {
    const response = await httpClient.get<any[]>(`${this.BASE_PATH}/recipes`)
    return response.map(recipe => ProductionMapper.fromApiRecipeResponse(recipe))
  }

  static async getRecipeById(id: string | number): Promise<Recipe> {
    const response = await httpClient.get<any>(`${this.BASE_PATH}/recipes/${id}`)
    return ProductionMapper.fromApiRecipeResponse(response)
  }

  static async createRecipe(recipeData: CreateRecipeDto): Promise<Recipe> {
    const payload = ProductionMapper.toApiRecipeRequest(recipeData)
    const response = await httpClient.post<any>(`${this.BASE_PATH}/recipes`, payload)
    return ProductionMapper.fromApiRecipeResponse(response)
  }

  static async updateRecipe(id: string | number, recipeData: UpdateRecipeDto): Promise<Recipe> {
    const payload = ProductionMapper.toApiRecipeRequest(recipeData)
    const response = await httpClient.patch<any>(`${this.BASE_PATH}/recipes/${id}`, payload)
    return ProductionMapper.fromApiRecipeResponse(response)
  }

  static async deleteRecipe(id: string | number): Promise<void> {
    await httpClient.delete(`${this.BASE_PATH}/recipes/${id}`)
  }

  // Production Batch endpoints
  static async getAllBatches(): Promise<ProductionBatch[]> {
    const response = await httpClient.get<any[]>(`${this.BASE_PATH}/batches`)
    return response.map(batch => ProductionMapper.fromApiBatchResponse(batch))
  }

  static async getBatchById(id: string | number): Promise<ProductionBatch> {
    const response = await httpClient.get<any>(`${this.BASE_PATH}/batches/${id}`)
    return ProductionMapper.fromApiBatchResponse(response)
  }

  static async createBatch(batchData: CreateProductionBatchDto): Promise<ProductionBatch> {
    const payload = ProductionMapper.toApiBatchRequest(batchData)
    const response = await httpClient.post<any>(`${this.BASE_PATH}/batches`, payload)
    return ProductionMapper.fromApiBatchResponse(response)
  }
}
