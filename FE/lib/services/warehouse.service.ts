import { httpClient } from './http-client'
import { WarehouseMapper } from '../mappers/warehouse.mapper'
import { Warehouse, CreateWarehouseDto, UpdateWarehouseDto, WarehouseStockLevel } from '../types/warehouse.types'

export class WarehouseService {
  private static readonly BASE_PATH = '/warehouses'

  static async getAll(): Promise<Warehouse[]> {
    const response = await httpClient.get<any[]>(this.BASE_PATH)
    return WarehouseMapper.fromApiResponseArray(response)
  }

  static async getById(id: string | number): Promise<Warehouse> {
    const response = await httpClient.get<any>(`${this.BASE_PATH}/${id}`)
    return WarehouseMapper.fromApiResponse(response)
  }

  static async getStockLevels(id: string | number): Promise<WarehouseStockLevel[]> {
    const response = await httpClient.get<any[]>(`${this.BASE_PATH}/${id}/stock`)
    return response.map(stock => WarehouseMapper.fromApiStockLevelResponse(stock))
  }

  static async create(warehouseData: CreateWarehouseDto): Promise<Warehouse> {
    const payload = WarehouseMapper.toApiRequest(warehouseData)
    const response = await httpClient.post<any>(this.BASE_PATH, payload)
    return WarehouseMapper.fromApiResponse(response)
  }

  static async update(id: string | number, warehouseData: UpdateWarehouseDto): Promise<Warehouse> {
    const payload = WarehouseMapper.toApiRequest(warehouseData)
    const response = await httpClient.patch<any>(`${this.BASE_PATH}/${id}`, payload)
    return WarehouseMapper.fromApiResponse(response)
  }

  static async delete(id: string | number): Promise<void> {
    await httpClient.delete(`${this.BASE_PATH}/${id}`)
  }
}
