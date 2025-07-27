import { BaseEntity } from './common.types'

export interface Supplier extends BaseEntity {
  name: string
  email?: string // Frontend uses 'email', backend uses 'contactEmail'
  phone?: string
  address?: string
  _count?: {
    purchaseOrders: number
  }
}

export interface CreateSupplierDto {
  name: string
  email?: string // Using email instead of contactEmail for frontend consistency
  phone?: string
  address?: string
}

export interface UpdateSupplierDto {
  name?: string
  email?: string // Using email instead of contactEmail for frontend consistency
  phone?: string
  address?: string
}

export interface SupplierWithPurchaseOrders extends Supplier {
  purchaseOrders?: Array<{
    id: number
    orderDate: string
    status: string
    totalAmount: number
  }>
}

export interface SupplierQueryParams {
  search?: string
  page?: number
  limit?: number
}
