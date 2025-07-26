import { StockMovement, CreateStockMovementDto, StockOnHand, StockMovementResponse } from '../types/stock-movement.types'

export class StockMovementMapper {
  static fromApiResponse(apiMovement: any): StockMovement {
    return {
      id: apiMovement.id,
      type: apiMovement.type,
      product_id: apiMovement.product_id,
      product_name: apiMovement.product_name,
      product_sku: apiMovement.product_sku,
      warehouse_id: apiMovement.warehouse_id,
      warehouse_name: apiMovement.warehouse_name,
      batch_id: apiMovement.batch_id,
      batch_number: apiMovement.batch_number,
      quantity: Number(apiMovement.quantity),
      unit_cost: apiMovement.unit_cost ? Number(apiMovement.unit_cost) : undefined,
      total_cost: apiMovement.total_cost ? Number(apiMovement.total_cost) : undefined,
      reference_number: apiMovement.reference_number,
      notes: apiMovement.notes,
      user_id: apiMovement.user_id,
      user_name: apiMovement.user_name,
      created_at: apiMovement.created_at,
      updated_at: apiMovement.updated_at,
    }
  }

  static toApiRequest(movement: CreateStockMovementDto): any {
    return {
      type: movement.type,
      product_id: movement.product_id,
      warehouse_id: movement.warehouse_id,
      batch_id: movement.batch_id,
      quantity: movement.quantity,
      unit_cost: movement.unit_cost,
      total_cost: movement.total_cost,
      reference_number: movement.reference_number,
      notes: movement.notes,
      user_id: movement.user_id,
    }
  }

  static fromApiResponseArray(apiMovements: any[]): StockMovement[] {
    return apiMovements.map(movement => this.fromApiResponse(movement))
  }

  static fromApiStockOnHandResponse(apiStock: any): StockOnHand {
    return {
      product_id: apiStock.product_id,
      product_name: apiStock.product_name,
      product_sku: apiStock.product_sku,
      warehouse_id: apiStock.warehouse_id,
      warehouse_name: apiStock.warehouse_name,
      batch_id: apiStock.batch_id,
      batch_number: apiStock.batch_number,
      current_stock: Number(apiStock.current_stock),
      available_stock: Number(apiStock.available_stock),
      reserved_stock: Number(apiStock.reserved_stock),
      last_movement_date: apiStock.last_movement_date,
    }
  }

  static toDisplayMovement(movement: StockMovement) {
    return {
      id: movement.id,
      type: this.getMovementTypeDisplay(movement.type),
      productName: movement.product_name || 'N/A',
      warehouseName: movement.warehouse_name || 'N/A',
      quantity: movement.quantity.toString(),
      date: new Date(movement.created_at).toLocaleDateString('pt-BR'),
    }
  }

  private static getMovementTypeDisplay(type: string): string {
    const types: Record<string, string> = {
      'IN': 'Entrada',
      'OUT': 'Saída',
      'TRANSFER': 'Transferência',
      'ADJUSTMENT': 'Ajuste',
    }
    return types[type] || type
  }
}
