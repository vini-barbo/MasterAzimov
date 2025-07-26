import { httpClient } from './http-client'
import { StockMovementMapper } from '../mappers/stock-movement.mapper'
import { StockMovement, CreateStockMovementDto, StockOnHand } from '../types/stock-movement.types'

export class StockMovementService {
  private static readonly BASE_PATH = '/stock-movements'

  static async getAll(): Promise<StockMovement[]> {
    const response = await httpClient.get<any[]>(this.BASE_PATH)
    return StockMovementMapper.fromApiResponseArray(response)
  }

  static async getById(id: string | number): Promise<StockMovement> {
    const response = await httpClient.get<any>(`${this.BASE_PATH}/${id}`)
    return StockMovementMapper.fromApiResponse(response)
  }

  static async getStockOnHand(): Promise<StockOnHand[]> {
    const response = await httpClient.get<any[]>(`${this.BASE_PATH}/stock-on-hand`)
    return response.map(stock => StockMovementMapper.fromApiStockOnHandResponse(stock))
  }

  static async getByProduct(productId: string | number): Promise<StockMovement[]> {
    const response = await httpClient.get<any[]>(`${this.BASE_PATH}/product/${productId}`)
    return StockMovementMapper.fromApiResponseArray(response)
  }

  static async getByWarehouse(warehouseId: string | number): Promise<StockMovement[]> {
    const response = await httpClient.get<any[]>(`${this.BASE_PATH}/warehouse/${warehouseId}`)
    return StockMovementMapper.fromApiResponseArray(response)
  }

  static async getByBatch(batchId: string | number): Promise<StockMovement[]> {
    const response = await httpClient.get<any[]>(`${this.BASE_PATH}/batch/${batchId}`)
    return StockMovementMapper.fromApiResponseArray(response)
  }

  static async create(movementData: CreateStockMovementDto): Promise<StockMovement> {
    const payload = StockMovementMapper.toApiRequest(movementData)
    const response = await httpClient.post<any>(this.BASE_PATH, payload)
    return StockMovementMapper.fromApiResponse(response)
  }
}
