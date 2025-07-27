import type { Supplier, PurchaseOrder, PurchaseOrderItem, Recipe, Production } from "./types"
import { httpClient } from "./services/http-client"
import { API_ENDPOINTS } from "./config/env"

// Real API functions using backend endpoints
export const suppliersApi = {
  getAll: async (): Promise<Supplier[]> => {
    const response = await httpClient.get<Supplier[]>(`${API_ENDPOINTS.PRODUCTS.BASE}/suppliers`)
    return response
  },

  create: async (supplier: Omit<Supplier, "id" | "created_at">): Promise<Supplier> => {
    const response = await httpClient.post<Supplier>(`${API_ENDPOINTS.PRODUCTS.BASE}/suppliers`, supplier)
    return response
  },

  update: async (id: string, supplier: Partial<Supplier>): Promise<Supplier> => {
    const response = await httpClient.put<Supplier>(`${API_ENDPOINTS.PRODUCTS.BASE}/suppliers/${id}`, supplier)
    return response
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.PRODUCTS.BASE}/suppliers/${id}`)
  },
}

// Mapping function to adapt backend data to frontend types
const mapPurchaseOrderFromBackend = (backendOrder: any): PurchaseOrder => {
  return {
    id: backendOrder.id.toString(),
    supplier_id: backendOrder.supplierId.toString(),
    supplier_name: backendOrder.supplier?.name || 'Fornecedor desconhecido',
    status: backendOrder.status as "PENDING" | "RECEIVED" | "CANCELLED",
    total_amount: parseFloat(backendOrder.totalAmount || 0),
    notes: backendOrder.notes || '',
    expected_delivery_date: backendOrder.orderDate,
    received_date: backendOrder.receivedAt,
    created_at: backendOrder.createdAt,
    updated_at: backendOrder.updatedAt,
    items: (backendOrder.purchaseOrderItems || []).map((item: any): PurchaseOrderItem => ({
      id: item.id.toString(),
      product_id: item.productId.toString(),
      product_name: item.product?.name || 'Produto desconhecido',
      product_sku: item.product?.sku || '',
      quantity: item.quantity,
      unit_price: parseFloat(item.unitPrice || 0),
      total_price: item.quantity * parseFloat(item.unitPrice || 0),
    })),
  }
}

export const purchaseOrdersApi = {
  getAll: async (): Promise<PurchaseOrder[]> => {
    const response = await httpClient.get<{data: any[], pagination: any}>(API_ENDPOINTS.PURCHASES.BASE)
    return response.data.map(mapPurchaseOrderFromBackend)
  },

  getById: async (id: string): Promise<PurchaseOrder> => {
    const response = await httpClient.get<any>(API_ENDPOINTS.PURCHASES.BY_ID(id))
    return mapPurchaseOrderFromBackend(response)
  },

  create: async (order: Omit<PurchaseOrder, "id" | "created_at">): Promise<PurchaseOrder> => {
    const response = await httpClient.post<any>(API_ENDPOINTS.PURCHASES.BASE, order)
    return mapPurchaseOrderFromBackend(response)
  },

  update: async (id: string, order: Partial<PurchaseOrder>): Promise<PurchaseOrder> => {
    const response = await httpClient.put<any>(API_ENDPOINTS.PURCHASES.BY_ID(id), order)
    return mapPurchaseOrderFromBackend(response)
  },

  markAsReceived: async (id: string): Promise<PurchaseOrder> => {
    const response = await httpClient.post<any>(`${API_ENDPOINTS.PURCHASES.BY_ID(id)}/receive`)
    return mapPurchaseOrderFromBackend(response)
  },

  markAsApproved: async (id: string): Promise<PurchaseOrder> => {
    const response = await httpClient.post<any>(`${API_ENDPOINTS.PURCHASES.BY_ID(id)}/approve`)
    return mapPurchaseOrderFromBackend(response)
  },

  getPending: async (): Promise<PurchaseOrder[]> => {
    const response = await httpClient.get<{data: any[], pagination: any}>(API_ENDPOINTS.PURCHASES.PENDING)
    return response.data.map(mapPurchaseOrderFromBackend)
  },

  getApproved: async (): Promise<PurchaseOrder[]> => {
    const response = await httpClient.get<{data: any[], pagination: any}>(API_ENDPOINTS.PURCHASES.APPROVED)
    return response.data.map(mapPurchaseOrderFromBackend)
  },
}

export const recipesApi = {
  getAll: async (): Promise<Recipe[]> => {
    const response = await httpClient.get<Recipe[]>(`${API_ENDPOINTS.PRODUCTION.BASE}/recipes`)
    return response
  },

  getById: async (id: string): Promise<Recipe> => {
    const response = await httpClient.get<Recipe>(`${API_ENDPOINTS.PRODUCTION.BASE}/recipes/${id}`)
    return response
  },

  create: async (recipe: Omit<Recipe, "id" | "created_at">): Promise<Recipe> => {
    const response = await httpClient.post<Recipe>(`${API_ENDPOINTS.PRODUCTION.BASE}/recipes`, recipe)
    return response
  },

  update: async (id: string, recipe: Partial<Recipe>): Promise<Recipe> => {
    const response = await httpClient.put<Recipe>(`${API_ENDPOINTS.PRODUCTION.BASE}/recipes/${id}`, recipe)
    return response
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.PRODUCTION.BASE}/recipes/${id}`)
  },
}

export const productionApi = {
  execute: async (recipeId: string, quantity: number): Promise<Production> => {
    const response = await httpClient.post<Production>(`${API_ENDPOINTS.PRODUCTION.BASE}/execute`, {
      recipe_id: recipeId,
      quantity
    })
    return response
  },

  getAll: async (): Promise<Production[]> => {
    const response = await httpClient.get<Production[]>(API_ENDPOINTS.PRODUCTION.BASE)
    return response
  },

  getById: async (id: string): Promise<Production> => {
    const response = await httpClient.get<Production>(API_ENDPOINTS.PRODUCTION.BY_ID(id))
    return response
  },

  getActive: async (): Promise<Production[]> => {
    const response = await httpClient.get<Production[]>(API_ENDPOINTS.PRODUCTION.ACTIVE)
    return response
  },

  getCompleted: async (): Promise<Production[]> => {
    const response = await httpClient.get<Production[]>(API_ENDPOINTS.PRODUCTION.COMPLETED)
    return response
  },

  cancel: async (id: string): Promise<Production> => {
    const response = await httpClient.post<Production>(`${API_ENDPOINTS.PRODUCTION.BY_ID(id)}/cancel`)
    return response
  },

  complete: async (id: string): Promise<Production> => {
    const response = await httpClient.post<Production>(`${API_ENDPOINTS.PRODUCTION.BY_ID(id)}/complete`)
    return response
  },
}