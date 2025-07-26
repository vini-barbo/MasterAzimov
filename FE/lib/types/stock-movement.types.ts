import { BaseEntity } from './common.types'

export type StockMovementType = 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT'

export interface StockMovement extends BaseEntity {
  type: StockMovementType
  product_id: string | number
  product_name?: string
  product_sku?: string
  warehouse_id: string | number
  warehouse_name?: string
  batch_id?: string | number
  batch_number?: string
  quantity: number
  unit_cost?: number
  total_cost?: number
  reference_number?: string
  notes?: string
  user_id?: string | number
  user_name?: string
}

export interface CreateStockMovementDto {
  type: StockMovementType
  product_id: string | number
  warehouse_id: string | number
  batch_id?: string | number
  quantity: number
  unit_cost?: number
  total_cost?: number
  reference_number?: string
  notes?: string
  user_id?: string | number
}

export interface StockOnHand {
  product_id: string | number
  product_name: string
  product_sku: string
  warehouse_id: string | number
  warehouse_name: string
  batch_id?: string | number
  batch_number?: string
  current_stock: number
  available_stock: number
  reserved_stock: number
  last_movement_date: string
}

export interface StockMovementResponse extends StockMovement {
  // Additional fields that might come from the API
}
