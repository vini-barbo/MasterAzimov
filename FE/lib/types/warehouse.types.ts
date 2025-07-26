import { BaseEntity } from './common.types'

export interface Warehouse extends BaseEntity {
  name: string
  location: string
  description?: string
  is_active: boolean
}

export interface CreateWarehouseDto {
  name: string
  location: string
  description?: string
  is_active?: boolean
}

export interface UpdateWarehouseDto {
  name?: string
  location?: string
  description?: string
  is_active?: boolean
}

export interface WarehouseStockLevel {
  product_id: string | number
  product_name: string
  product_sku: string
  current_stock: number
  available_stock: number
  reserved_stock: number
}

export interface WarehouseResponse extends Warehouse {
  stock_levels?: WarehouseStockLevel[]
}
