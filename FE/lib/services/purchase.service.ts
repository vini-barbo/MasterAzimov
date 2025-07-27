import { httpClient } from './http-client'
import { API_ENDPOINTS } from '../config/env'
import { PurchaseMapper } from '../mappers/purchase.mapper'
import { PurchaseOrder, CreatePurchaseOrderDto, UpdatePurchaseOrderDto, PurchaseOrderQueryParams } from '../types/purchase.types'

export class PurchaseService {

  static async getAll(params?: PurchaseOrderQueryParams): Promise<PurchaseOrder[]> {
    const response = await httpClient.get<any[]>(API_ENDPOINTS.PURCHASES.BASE, { params })
    return response.map(purchase => PurchaseMapper.fromApiResponse(purchase))
  }

  static async getById(id: string | number): Promise<PurchaseOrder> {
    const response = await httpClient.get<any>(`${API_ENDPOINTS.PURCHASES.BASE}/${id}`)
    return PurchaseMapper.fromApiResponse(response)
  }

  static async create(purchaseData: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const payload = PurchaseMapper.toApiRequest(purchaseData)
    const response = await httpClient.post<any>(API_ENDPOINTS.PURCHASES.BASE, payload)
    return PurchaseMapper.fromApiResponse(response)
  }

  static async update(id: string | number, purchaseData: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    const payload = PurchaseMapper.toApiRequest(purchaseData)
    const response = await httpClient.patch<any>(`${API_ENDPOINTS.PURCHASES.BASE}/${id}`, payload)
    return PurchaseMapper.fromApiResponse(response)
  }

  static async delete(id: string | number): Promise<void> {
    await httpClient.delete(`${API_ENDPOINTS.PURCHASES.BASE}/${id}`)
  }

  static async receive(id: string | number): Promise<PurchaseOrder> {
    const response = await httpClient.post<any>(`${API_ENDPOINTS.PURCHASES.BASE}/${id}/receive`)
    return PurchaseMapper.fromApiResponse(response)
  }
}
