import { httpClient } from './http-client'
import { PurchaseMapper } from '../mappers/purchase.mapper'
import { PurchaseOrder, CreatePurchaseOrderDto, UpdatePurchaseOrderDto, PurchaseOrderQueryParams } from '../types/purchase.types'

export class PurchaseService {
  private static readonly BASE_PATH = '/purchases'

  static async getAll(params?: PurchaseOrderQueryParams): Promise<PurchaseOrder[]> {
    const response = await httpClient.get<any[]>(this.BASE_PATH, { params })
    return response.map(purchase => PurchaseMapper.fromApiResponse(purchase))
  }

  static async getById(id: string | number): Promise<PurchaseOrder> {
    const response = await httpClient.get<any>(`${this.BASE_PATH}/${id}`)
    return PurchaseMapper.fromApiResponse(response)
  }

  static async create(purchaseData: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const payload = PurchaseMapper.toApiRequest(purchaseData)
    const response = await httpClient.post<any>(this.BASE_PATH, payload)
    return PurchaseMapper.fromApiResponse(response)
  }

  static async update(id: string | number, purchaseData: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    const payload = PurchaseMapper.toApiRequest(purchaseData)
    const response = await httpClient.patch<any>(`${this.BASE_PATH}/${id}`, payload)
    return PurchaseMapper.fromApiResponse(response)
  }

  static async delete(id: string | number): Promise<void> {
    await httpClient.delete(`${this.BASE_PATH}/${id}`)
  }

  static async receive(id: string | number): Promise<PurchaseOrder> {
    const response = await httpClient.post<any>(`${this.BASE_PATH}/${id}/receive`)
    return PurchaseMapper.fromApiResponse(response)
  }
}
