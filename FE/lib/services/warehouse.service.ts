import { httpClient } from './http-client'
import { API_ENDPOINTS } from '../config/env'
import { WarehouseMapper } from '../mappers/warehouse.mapper'
import { Warehouse, CreateWarehouseDto, UpdateWarehouseDto, WarehouseStockLevel } from '../types/warehouse.types'

export class WarehouseService {
  

  static async getAll(): Promise<Warehouse[]> {
    const response = await httpClient.get<any[]>(API_ENDPOINTS.WAREHOUSES.BASE)
    return WarehouseMapper.fromApiResponseArray(response)
  }

  static async getById(id: string | number): Promise<Warehouse> {
    const response = await httpClient.get<any>(`${API_ENDPOINTS.WAREHOUSES.BASE}/${id}`)
    return WarehouseMapper.fromApiResponse(response)
  }

  static async getStockLevels(id: string | number): Promise<WarehouseStockLevel[]> {
    const response = await httpClient.get<any[]>(`${API_ENDPOINTS.WAREHOUSES.BASE}/${id}/stock`)
    return response.map(stock => WarehouseMapper.fromApiStockLevelResponse(stock))
  }

  static async create(warehouseData: CreateWarehouseDto): Promise<Warehouse> {
    const payload = WarehouseMapper.toApiRequest(warehouseData)
    const response = await httpClient.post<any>(API_ENDPOINTS.WAREHOUSES.BASE, payload)
    return WarehouseMapper.fromApiResponse(response)
  }

  static async update(id: string | number, warehouseData: UpdateWarehouseDto): Promise<Warehouse> {
    const payload = WarehouseMapper.toApiRequest(warehouseData)
    const response = await httpClient.patch<any>(`${API_ENDPOINTS.WAREHOUSES.BASE}/${id}`, payload)
    return WarehouseMapper.fromApiResponse(response)
  }

  static async delete(id: string | number): Promise<void> {
    await httpClient.delete(`${API_ENDPOINTS.WAREHOUSES.BASE}/${id}`)
  }
}
