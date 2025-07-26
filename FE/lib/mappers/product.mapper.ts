import { Product, CreateProductDto, UpdateProductDto, ProductResponse, ProductStockLevel } from '../types/product.types'

export class ProductMapper {
  /**
   * Map API response to Product interface
   */
  static fromApiResponse(apiProduct: any): Product {
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      sku: apiProduct.sku,
      description: apiProduct.description,
      category: apiProduct.category,
      unit_price: Number(apiProduct.unit_price),
      cost_price: apiProduct.cost_price ? Number(apiProduct.cost_price) : undefined,
      unit_of_measure: apiProduct.unit_of_measure,
      is_active: apiProduct.is_active ?? true,
      min_stock_level: apiProduct.min_stock_level ? Number(apiProduct.min_stock_level) : undefined,
      max_stock_level: apiProduct.max_stock_level ? Number(apiProduct.max_stock_level) : undefined,
      created_at: apiProduct.created_at,
      updated_at: apiProduct.updated_at,
    }
  }

  /**
   * Map Product to API request payload
   */
  static toApiRequest(product: CreateProductDto | UpdateProductDto): any {
    return {
      name: product.name,
      sku: product.sku,
      description: product.description,
      category: product.category,
      unit_price: product.unit_price,
      cost_price: product.cost_price,
      unit_of_measure: product.unit_of_measure,
      is_active: product.is_active,
      min_stock_level: product.min_stock_level,
      max_stock_level: product.max_stock_level,
    }
  }

  /**
   * Map array of API responses to Product array
   */
  static fromApiResponseArray(apiProducts: any[]): Product[] {
    return apiProducts.map(product => this.fromApiResponse(product))
  }

  /**
   * Map ProductStockLevel from API response
   */
  static fromApiStockLevelResponse(apiStockLevel: any): ProductStockLevel {
    return {
      product_id: apiStockLevel.product_id,
      warehouse_id: apiStockLevel.warehouse_id,
      warehouse_name: apiStockLevel.warehouse_name,
      current_stock: Number(apiStockLevel.current_stock),
      available_stock: Number(apiStockLevel.available_stock),
      reserved_stock: Number(apiStockLevel.reserved_stock),
    }
  }

  /**
   * Map Product for display purposes
   */
  static toDisplayProduct(product: Product): {
    id: string | number
    name: string
    sku: string
    category: string
    price: string
    status: string
    stockLevel: string
  } {
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category || 'Sem categoria',
      price: this.formatCurrency(product.unit_price),
      status: product.is_active ? 'Ativo' : 'Inativo',
      stockLevel: this.getStockLevelStatus(product),
    }
  }

  /**
   * Get stock level status for display
   */
  private static getStockLevelStatus(product: Product): string {
    if (!product.min_stock_level) return 'N/A'

    // This would need actual stock data to be meaningful
    // For now, returning a placeholder
    return 'Verificar estoque'
  }

  /**
   * Format currency for display
   */
  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  /**
   * Validate product data
   */
  static validate(product: CreateProductDto | UpdateProductDto): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if ('name' in product && product.name && product.name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres')
    }

    if ('sku' in product && product.sku && product.sku.trim().length < 2) {
      errors.push('SKU deve ter pelo menos 2 caracteres')
    }

    if ('unit_price' in product && product.unit_price !== undefined && product.unit_price < 0) {
      errors.push('Preço unitário deve ser maior ou igual a zero')
    }

    if ('cost_price' in product && product.cost_price !== undefined && product.cost_price < 0) {
      errors.push('Preço de custo deve ser maior ou igual a zero')
    }

    if ('min_stock_level' in product && product.min_stock_level !== undefined && product.min_stock_level < 0) {
      errors.push('Nível mínimo de estoque deve ser maior ou igual a zero')
    }

    if ('max_stock_level' in product && product.max_stock_level !== undefined && product.max_stock_level !== undefined) {
      if (product.max_stock_level < 0) {
        errors.push('Nível máximo de estoque deve ser maior ou igual a zero')
      }

      if (product.min_stock_level !== undefined && product.max_stock_level < product.min_stock_level) {
        errors.push('Nível máximo deve ser maior que o nível mínimo')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
