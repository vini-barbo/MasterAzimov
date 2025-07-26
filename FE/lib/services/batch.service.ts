import { httpClient } from './http-client'
import { BatchMapper } from '../mappers/batch.mapper'
import { Batch, CreateBatchDto, UpdateBatchDto, ExpiringBatch } from '../types/batch.types'

export class BatchService {
  private static readonly BASE_PATH = '/batches'

  static async getAll(): Promise<Batch[]> {
    const response = await httpClient.get<any[]>(this.BASE_PATH)
    return BatchMapper.fromApiResponseArray(response)
  }

  static async getById(id: string | number): Promise<Batch> {
    const response = await httpClient.get<any>(`${this.BASE_PATH}/${id}`)
    return BatchMapper.fromApiResponse(response)
  }

  static async getExpiring(): Promise<ExpiringBatch[]> {
    const response = await httpClient.get<any[]>(`${this.BASE_PATH}/expiring`)
    return response.map(batch => BatchMapper.fromApiExpiringBatchResponse(batch))
  }

  static async getByProduct(productId: string | number): Promise<Batch[]> {
    const response = await httpClient.get<any[]>(`${this.BASE_PATH}/product/${productId}`)
    return BatchMapper.fromApiResponseArray(response)
  }

  static async getByWarehouse(warehouseId: string | number): Promise<Batch[]> {
    const response = await httpClient.get<any[]>(`${this.BASE_PATH}/warehouse/${warehouseId}`)
    return BatchMapper.fromApiResponseArray(response)
  }

  static async create(batchData: CreateBatchDto): Promise<Batch> {
    const payload = BatchMapper.toApiRequest(batchData)
    const response = await httpClient.post<any>(this.BASE_PATH, payload)
    return BatchMapper.fromApiResponse(response)
  }

  static async update(id: string | number, batchData: UpdateBatchDto): Promise<Batch> {
    const payload = BatchMapper.toApiRequest(batchData)
    const response = await httpClient.patch<any>(`${this.BASE_PATH}/${id}`, payload)
    return BatchMapper.fromApiResponse(response)
  }

  static async delete(id: string | number): Promise<void> {
    await httpClient.delete(`${this.BASE_PATH}/${id}`)
  }
}
