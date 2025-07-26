import { Warehouse, CreateWarehouseDto, UpdateWarehouseDto, WarehouseResponse, WarehouseStockLevel } from '../types/warehouse.types'

export class WarehouseMapper {
  /**
   * Map API response to Warehouse interface
   */
  static fromApiResponse(apiWarehouse: any): Warehouse {
    return {
      id: apiWarehouse.id,
      name: apiWarehouse.name,
      location: apiWarehouse.location,
      description: apiWarehouse.description,
      is_active: apiWarehouse.is_active ?? true,
      created_at: apiWarehouse.created_at,
      updated_at: apiWarehouse.updated_at,
    }
  }

  /**
   * Map Warehouse to API request payload
   */
  static toApiRequest(warehouse: CreateWarehouseDto | UpdateWarehouseDto): any {
    return {
      name: warehouse.name,
      location: warehouse.location,
      description: warehouse.description,
      is_active: warehouse.is_active,
    }
  }

  /**
   * Map array of API responses to Warehouse array
   */
  static fromApiResponseArray(apiWarehouses: any[]): Warehouse[] {
    return apiWarehouses.map(warehouse => this.fromApiResponse(warehouse))
  }

  /**
   * Map WarehouseStockLevel from API response
   */
  static fromApiStockLevelResponse(apiStockLevel: any): WarehouseStockLevel {
    return {
      product_id: apiStockLevel.product_id,
      product_name: apiStockLevel.product_name,
      product_sku: apiStockLevel.product_sku,
      current_stock: Number(apiStockLevel.current_stock),
      available_stock: Number(apiStockLevel.available_stock),
      reserved_stock: Number(apiStockLevel.reserved_stock),
    }
  }

  /**
   * Map Warehouse for display purposes
   */
  static toDisplayWarehouse(warehouse: Warehouse): {
    id: string | number
    name: string
    location: string
    description: string
    status: string
    createdAt: string
  } {
    return {
      id: warehouse.id,
      name: warehouse.name,
      location: warehouse.location,
      description: warehouse.description || 'Sem descrição',
      status: warehouse.is_active ? 'Ativo' : 'Inativo',
      createdAt: new Date(warehouse.created_at).toLocaleDateString('pt-BR'),
    }
  }

  /**
   * Validate warehouse data
   */
  static validate(warehouse: CreateWarehouseDto | UpdateWarehouseDto): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if ('name' in warehouse && warehouse.name && warehouse.name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres')
    }

    if ('location' in warehouse && warehouse.location && warehouse.location.trim().length < 2) {
      errors.push('Localização deve ter pelo menos 2 caracteres')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
