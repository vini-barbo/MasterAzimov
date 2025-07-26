import { httpClient } from './http-client'
import { ProductMapper } from '../mappers/product.mapper'
import { Product, CreateProductDto, UpdateProductDto, ProductStockLevel } from '../types/product.types'

export class ProductService {
  private static readonly BASE_PATH = '/products'

  /**
   * Get all products
   */
  static async getAll(): Promise<Product[]> {
    const response = await httpClient.get<any[]>(this.BASE_PATH)
    return ProductMapper.fromApiResponseArray(response)
  }

  /**
   * Get product by ID
   */
  static async getById(id: string | number): Promise<Product> {
    const response = await httpClient.get<any>(`${this.BASE_PATH}/${id}`)
    return ProductMapper.fromApiResponse(response)
  }

  /**
   * Get product by SKU
   */
  static async getBySku(sku: string): Promise<Product> {
    const response = await httpClient.get<any>(`${this.BASE_PATH}/sku/${sku}`)
    return ProductMapper.fromApiResponse(response)
  }

  /**
   * Get stock levels for a product
   */
  static async getStockLevels(id: string | number): Promise<ProductStockLevel[]> {
    const response = await httpClient.get<any[]>(`${this.BASE_PATH}/${id}/stock`)
    return response.map(stock => ProductMapper.fromApiStockLevelResponse(stock))
  }

  /**
   * Create new product
   */
  static async create(productData: CreateProductDto): Promise<Product> {
    const payload = ProductMapper.toApiRequest(productData)
    const response = await httpClient.post<any>(this.BASE_PATH, payload)
    return ProductMapper.fromApiResponse(response)
  }

  /**
   * Update product
   */
  static async update(id: string | number, productData: UpdateProductDto): Promise<Product> {
    const payload = ProductMapper.toApiRequest(productData)
    const response = await httpClient.patch<any>(`${this.BASE_PATH}/${id}`, payload)
    return ProductMapper.fromApiResponse(response)
  }

  /**
   * Delete product
   */
  static async delete(id: string | number): Promise<void> {
    await httpClient.delete(`${this.BASE_PATH}/${id}`)
  }
}
