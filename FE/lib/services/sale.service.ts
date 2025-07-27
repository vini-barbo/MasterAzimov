import { httpClient } from './http-client'
import { API_ENDPOINTS } from '../config/env'
import { SaleMapper } from '../mappers/sale.mapper'
import { Sale, CreateSaleDto, UpdateSaleDto, SaleItem, SalesReport, SalesSummary, SaleQueryParams } from '../types/sale.types'

export class SaleService {
  private static readonly SALE_ITEMS_PATH = '/sale-items'

  // Sales endpoints
  static async getAll(params?: SaleQueryParams): Promise<Sale[]> {
    const response = await httpClient.get<any[]>(API_ENDPOINTS.SALES.BASE, { params })
    return SaleMapper.fromApiResponseArray(response)
  }

  static async getById(id: string | number): Promise<Sale> {
    const response = await httpClient.get<any>(`${API_ENDPOINTS.SALES.BASE}/${id}`)
    return SaleMapper.fromApiResponse(response)
  }

  static async create(saleData: CreateSaleDto): Promise<Sale> {
    const payload = SaleMapper.toApiRequest(saleData)
    const response = await httpClient.post<any>(API_ENDPOINTS.SALES.BASE, payload)
    return SaleMapper.fromApiResponse(response)
  }

  static async update(id: string | number, saleData: UpdateSaleDto): Promise<Sale> {
    const payload = SaleMapper.toApiRequest(saleData)
    const response = await httpClient.patch<any>(`${API_ENDPOINTS.SALES.BASE}/${id}`, payload)
    return SaleMapper.fromApiResponse(response)
  }

  static async delete(id: string | number): Promise<void> {
    await httpClient.delete(`${API_ENDPOINTS.SALES.BASE}/${id}`)
  }

  // Dashboard endpoints (alternative sales controller)
  static async getSummary(params?: { startDate?: string; endDate?: string }): Promise<SalesSummary> {
    const response = await httpClient.get<any>(`${API_ENDPOINTS.SALES.BASE}/summary`, { params })
    return SaleMapper.fromApiSummaryResponse(response)
  }

  // Reports
  static async getReport(params?: SaleQueryParams): Promise<SalesReport> {
    const response = await httpClient.get<any>(`${API_ENDPOINTS.SALES.BASE}/reports/summary`, { params })
    return response // Assuming the API returns the report in the expected format
  }

  // Sale Items endpoints
  static async getAllItems(): Promise<SaleItem[]> {
    const response = await httpClient.get<any[]>(this.SALE_ITEMS_PATH)
    return response.map(item => SaleMapper.fromApiItemResponse(item))
  }

  static async getItemById(id: string | number): Promise<SaleItem> {
    const response = await httpClient.get<any>(`${this.SALE_ITEMS_PATH}/${id}`)
    return SaleMapper.fromApiItemResponse(response)
  }

  static async getItemsBySale(saleId: string | number): Promise<SaleItem[]> {
    const response = await httpClient.get<any[]>(`${this.SALE_ITEMS_PATH}/sale/${saleId}`)
    return response.map(item => SaleMapper.fromApiItemResponse(item))
  }

  static async getItemsByProduct(productId: string | number): Promise<SaleItem[]> {
    const response = await httpClient.get<any[]>(`${this.SALE_ITEMS_PATH}/product/${productId}`)
    return response.map(item => SaleMapper.fromApiItemResponse(item))
  }

  static async createItem(itemData: any): Promise<SaleItem> {
    const response = await httpClient.post<any>(this.SALE_ITEMS_PATH, itemData)
    return SaleMapper.fromApiItemResponse(response)
  }

  static async deleteItem(id: string | number): Promise<void> {
    await httpClient.delete(`${this.SALE_ITEMS_PATH}/${id}`)
  }
}
