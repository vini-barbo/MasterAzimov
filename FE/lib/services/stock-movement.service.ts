import { httpClient } from './http-client'
import { API_ENDPOINTS } from '../config/env'
import { StockMovementMapper } from '../mappers/stock-movement.mapper'
import { StockMovement, CreateStockMovementDto, StockOnHand } from '../types/stock-movement.types'

export class StockMovementService {

  static async getAll(): Promise<StockMovement[]> {
    const response = await httpClient.get<any[]>(API_ENDPOINTS.STOCK_MOVEMENTS.BASE)
    return StockMovementMapper.fromApiResponseArray(response)
  }

  static async getById(id: string | number): Promise<StockMovement> {
    const response = await httpClient.get<any>(`${API_ENDPOINTS.STOCK_MOVEMENTS.BASE}/${id}`)
    return StockMovementMapper.fromApiResponse(response)
  }

  static async getStockOnHand(): Promise<StockOnHand[]> {
    const response = await httpClient.get<any[]>(`${API_ENDPOINTS.STOCK_MOVEMENTS.BASE}/stock-on-hand`)
    return response.map(stock => StockMovementMapper.fromApiStockOnHandResponse(stock))
  }

  static async getByProduct(productId: string | number): Promise<StockMovement[]> {
    const response = await httpClient.get<any[]>(`${API_ENDPOINTS.STOCK_MOVEMENTS.BASE}/product/${productId}`)
    return StockMovementMapper.fromApiResponseArray(response)
  }

  static async getByWarehouse(warehouseId: string | number): Promise<StockMovement[]> {
    const response = await httpClient.get<any[]>(`${API_ENDPOINTS.STOCK_MOVEMENTS.BASE}/warehouse/${warehouseId}`)
    return StockMovementMapper.fromApiResponseArray(response)
  }

  static async getByBatch(batchId: string | number): Promise<StockMovement[]> {
    const response = await httpClient.get<any[]>(`${API_ENDPOINTS.STOCK_MOVEMENTS.BASE}/batch/${batchId}`)
    return StockMovementMapper.fromApiResponseArray(response)
  }

  static async create(movementData: CreateStockMovementDto): Promise<StockMovement> {
    const payload = StockMovementMapper.toApiRequest(movementData)
    const response = await httpClient.post<any>(API_ENDPOINTS.STOCK_MOVEMENTS.BASE, payload)
    return StockMovementMapper.fromApiResponse(response)
  }
}
