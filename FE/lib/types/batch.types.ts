import { BaseEntity } from './common.types'

export interface Batch extends BaseEntity {
  batch_number: string
  product_id: string | number
  product_name?: string
  product_sku?: string
  warehouse_id: string | number
  warehouse_name?: string
  quantity: number
  cost_per_unit?: number
  expiration_date?: string
  production_date?: string
  supplier_id?: string | number
  supplier_name?: string
  is_active: boolean
}

export interface CreateBatchDto {
  batch_number: string
  product_id: string | number
  warehouse_id: string | number
  quantity: number
  cost_per_unit?: number
  expiration_date?: string
  production_date?: string
  supplier_id?: string | number
  is_active?: boolean
}

export interface UpdateBatchDto {
  batch_number?: string
  product_id?: string | number
  warehouse_id?: string | number
  quantity?: number
  cost_per_unit?: number
  expiration_date?: string
  production_date?: string
  supplier_id?: string | number
  is_active?: boolean
}

export interface ExpiringBatch extends Batch {
  days_to_expire: number
}

export interface BatchResponse extends Batch {
  // Additional fields that might come from the API
}
