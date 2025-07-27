import { httpClient } from './http-client'
import { API_ENDPOINTS } from '../config/env'
import { BatchMapper } from '../mappers/batch.mapper'
import { Batch, CreateBatchDto, UpdateBatchDto, ExpiringBatch } from '../types/batch.types'

export class BatchService {

  static async getAll(): Promise<Batch[]> {
    const response = await httpClient.get<any[]>(API_ENDPOINTS.BATCHES.BASE)
    return BatchMapper.fromApiResponseArray(response)
  }

  static async getById(id: string | number): Promise<Batch> {
    const response = await httpClient.get<any>(`${API_ENDPOINTS.BATCHES.BASE}/${id}`)
    return BatchMapper.fromApiResponse(response)
  }

  static async getExpiring(): Promise<ExpiringBatch[]> {
    const response = await httpClient.get<any[]>(`${API_ENDPOINTS.BATCHES.BASE}/expiring`)
    return response.map(batch => BatchMapper.fromApiExpiringBatchResponse(batch))
  }

  static async getByProduct(productId: string | number): Promise<Batch[]> {
    const response = await httpClient.get<any[]>(`${API_ENDPOINTS.BATCHES.BASE}/product/${productId}`)
    return BatchMapper.fromApiResponseArray(response)
  }

  static async getByWarehouse(warehouseId: string | number): Promise<Batch[]> {
    const response = await httpClient.get<any[]>(`${API_ENDPOINTS.BATCHES.BASE}/warehouse/${warehouseId}`)
    return BatchMapper.fromApiResponseArray(response)
  }

  static async create(batchData: CreateBatchDto): Promise<Batch> {
    const payload = BatchMapper.toApiRequest(batchData)
    const response = await httpClient.post<any>(API_ENDPOINTS.BATCHES.BASE, payload)
    return BatchMapper.fromApiResponse(response)
  }

  static async update(id: string | number, batchData: UpdateBatchDto): Promise<Batch> {
    const payload = BatchMapper.toApiRequest(batchData)
    const response = await httpClient.patch<any>(`${API_ENDPOINTS.BATCHES.BASE}/${id}`, payload)
    return BatchMapper.fromApiResponse(response)
  }

  static async delete(id: string | number): Promise<void> {
    await httpClient.delete(`${API_ENDPOINTS.BATCHES.BASE}/${id}`)
  }
}
