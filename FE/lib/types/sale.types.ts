import { BaseEntity } from './common.types'

export type SaleStatus = 'pending' | 'completed' | 'cancelled' | 'refunded'

export interface Sale extends BaseEntity {
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  status: SaleStatus
  total_amount: number
  discount_amount?: number
  tax_amount?: number
  notes?: string
  sale_date: string
  items: SaleItem[]
}

export interface SaleItem {
  id: string | number
  sale_id?: string | number
  product_id: string | number
  product_name?: string
  product_sku?: string
  quantity: number
  unit_price: number
  total_price: number
  discount_amount?: number
}

export interface CreateSaleDto {
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  discount_amount?: number
  tax_amount?: number
  notes?: string
  sale_date?: string
  items: CreateSaleItemDto[]
}

export interface CreateSaleItemDto {
  product_id: string | number
  quantity: number
  unit_price: number
  discount_amount?: number
}

export interface UpdateSaleDto {
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  status?: SaleStatus
  discount_amount?: number
  tax_amount?: number
  notes?: string
  sale_date?: string
  items?: UpdateSaleItemDto[]
}

export interface UpdateSaleItemDto {
  id?: string | number
  product_id?: string | number
  quantity?: number
  unit_price?: number
  discount_amount?: number
}

export interface SaleQueryParams {
  status?: SaleStatus
  customer_name?: string
  start_date?: string
  end_date?: string
  page?: number
  limit?: number
}

export interface SalesSummary {
  total_sales: number
  total_amount: number
  average_sale_amount: number
  period_start: string
  period_end: string
  top_products: {
    product_id: string | number
    product_name: string
    product_sku: string
    quantity_sold: number
    total_revenue: number
  }[]
}

export interface SalesReport {
  summary: SalesSummary
  daily_sales: {
    date: string
    total_sales: number
    total_amount: number
  }[]
  monthly_sales: {
    month: string
    total_sales: number
    total_amount: number
  }[]
}

export interface SaleResponse extends Sale {
  // Additional fields that might come from the API
}

export interface SaleItemResponse extends SaleItem {
  // Additional fields that might come from the API
}
