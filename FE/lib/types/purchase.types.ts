import { BaseEntity } from './common.types'

export type PurchaseOrderStatus = 'pending' | 'approved' | 'received' | 'cancelled'

export interface PurchaseOrder extends BaseEntity {
  supplier_id: string | number
  supplier_name?: string
  status: PurchaseOrderStatus
  total_amount: number
  notes?: string
  expected_delivery_date?: string
  received_date?: string
  items: PurchaseOrderItem[]
}

export interface PurchaseOrderItem {
  id: string | number
  product_id: string | number
  product_name?: string
  product_sku?: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface CreatePurchaseOrderDto {
  supplier_id: string | number
  notes?: string
  expected_delivery_date?: string
  items: CreatePurchaseOrderItemDto[]
}

export interface CreatePurchaseOrderItemDto {
  product_id: string | number
  quantity: number
  unit_price: number
}

export interface UpdatePurchaseOrderDto {
  supplier_id?: string | number
  status?: PurchaseOrderStatus
  notes?: string
  expected_delivery_date?: string
  items?: UpdatePurchaseOrderItemDto[]
}

export interface UpdatePurchaseOrderItemDto {
  id?: string | number
  product_id?: string | number
  quantity?: number
  unit_price?: number
}

export interface PurchaseOrderQueryParams {
  status?: PurchaseOrderStatus
  supplier_id?: string | number
  start_date?: string
  end_date?: string
  page?: number
  limit?: number
}

export interface PurchaseOrderResponse extends PurchaseOrder {
  // Additional fields that might come from the API
}
