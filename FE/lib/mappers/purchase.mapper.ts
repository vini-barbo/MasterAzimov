import { PurchaseOrder, CreatePurchaseOrderDto, UpdatePurchaseOrderDto, PurchaseOrderItem } from '../types/purchase.types'

export class PurchaseMapper {
  static fromApiResponse(apiPurchase: any): PurchaseOrder {
    return {
      id: apiPurchase.id,
      supplier_id: apiPurchase.supplier_id,
      supplier_name: apiPurchase.supplier_name,
      status: apiPurchase.status,
      total_amount: Number(apiPurchase.total_amount),
      notes: apiPurchase.notes,
      expected_delivery_date: apiPurchase.expected_delivery_date,
      received_date: apiPurchase.received_date,
      items: apiPurchase.items?.map((item: any) => this.fromApiItemResponse(item)) || [],
      created_at: apiPurchase.created_at,
      updated_at: apiPurchase.updated_at,
    }
  }

  static fromApiItemResponse(apiItem: any): PurchaseOrderItem {
    return {
      id: apiItem.id,
      product_id: apiItem.product_id,
      product_name: apiItem.product_name,
      product_sku: apiItem.product_sku,
      quantity: Number(apiItem.quantity),
      unit_price: Number(apiItem.unit_price),
      total_price: Number(apiItem.total_price),
    }
  }

  static toApiRequest(purchase: CreatePurchaseOrderDto | UpdatePurchaseOrderDto): any {
    return {
      supplier_id: purchase.supplier_id,
      status: 'status' in purchase ? purchase.status : undefined,
      notes: purchase.notes,
      expected_delivery_date: purchase.expected_delivery_date,
      items: purchase.items?.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
    }
  }

  static fromApiResponseArray(apiPurchases: any[]): PurchaseOrder[] {
    return apiPurchases.map(purchase => this.fromApiResponse(purchase))
  }

  static toDisplayPurchase(purchase: PurchaseOrder) {
    return {
      id: purchase.id,
      supplierName: purchase.supplier_name || 'N/A',
      status: this.getStatusDisplay(purchase.status),
      totalAmount: this.formatCurrency(purchase.total_amount),
      createdAt: new Date(purchase.created_at).toLocaleDateString('pt-BR'),
      itemsCount: purchase.items.length,
    }
  }

  private static getStatusDisplay(status: string): string {
    const statuses: Record<string, string> = {
      'pending': 'Pendente',
      'approved': 'Aprovado',
      'received': 'Recebido',
      'cancelled': 'Cancelado',
    }
    return statuses[status] || status
  }

  private static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }
}
