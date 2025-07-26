import { BaseEntity } from './common.types'

export interface Product extends BaseEntity {
  name: string
  sku: string
  description?: string
  category?: string
  unit_price: number
  cost_price?: number
  unit_of_measure: string
  is_active: boolean
  min_stock_level?: number
  max_stock_level?: number
}

export interface CreateProductDto {
  name: string
  sku: string
  description?: string
  category?: string
  unit_price: number
  cost_price?: number
  unit_of_measure: string
  is_active?: boolean
  min_stock_level?: number
  max_stock_level?: number
}

export interface UpdateProductDto {
  name?: string
  sku?: string
  description?: string
  category?: string
  unit_price?: number
  cost_price?: number
  unit_of_measure?: string
  is_active?: boolean
  min_stock_level?: number
  max_stock_level?: number
}

export interface ProductStockLevel {
  product_id: string | number
  warehouse_id: string | number
  warehouse_name: string
  current_stock: number
  available_stock: number
  reserved_stock: number
}

export interface ProductResponse extends Product {
  stock_levels?: ProductStockLevel[]
}
