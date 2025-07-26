import { Sale, CreateSaleDto, UpdateSaleDto, SaleItem, SalesReport, SalesSummary } from '../types/sale.types'

export class SaleMapper {
  static fromApiResponse(apiSale: any): Sale {
    return {
      id: apiSale.id,
      customer_name: apiSale.customer_name,
      customer_email: apiSale.customer_email,
      customer_phone: apiSale.customer_phone,
      status: apiSale.status,
      total_amount: Number(apiSale.total_amount),
      discount_amount: apiSale.discount_amount ? Number(apiSale.discount_amount) : undefined,
      tax_amount: apiSale.tax_amount ? Number(apiSale.tax_amount) : undefined,
      notes: apiSale.notes,
      sale_date: apiSale.sale_date,
      items: apiSale.items?.map((item: any) => this.fromApiItemResponse(item)) || [],
      created_at: apiSale.created_at,
      updated_at: apiSale.updated_at,
    }
  }

  static fromApiItemResponse(apiItem: any): SaleItem {
    return {
      id: apiItem.id,
      sale_id: apiItem.sale_id,
      product_id: apiItem.product_id,
      product_name: apiItem.product_name,
      product_sku: apiItem.product_sku,
      quantity: Number(apiItem.quantity),
      unit_price: Number(apiItem.unit_price),
      total_price: Number(apiItem.total_price),
      discount_amount: apiItem.discount_amount ? Number(apiItem.discount_amount) : undefined,
    }
  }

  static toApiRequest(sale: CreateSaleDto | UpdateSaleDto): any {
    return {
      customer_name: sale.customer_name,
      customer_email: sale.customer_email,
      customer_phone: sale.customer_phone,
      status: 'status' in sale ? sale.status : undefined,
      discount_amount: sale.discount_amount,
      tax_amount: sale.tax_amount,
      notes: sale.notes,
      sale_date: sale.sale_date,
      items: sale.items?.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_amount: item.discount_amount,
      })),
    }
  }

  static fromApiResponseArray(apiSales: any[]): Sale[] {
    return apiSales.map(sale => this.fromApiResponse(sale))
  }

  static fromApiSummaryResponse(apiSummary: any): SalesSummary {
    return {
      total_sales: Number(apiSummary.total_sales),
      total_amount: Number(apiSummary.total_amount),
      average_sale_amount: Number(apiSummary.average_sale_amount),
      period_start: apiSummary.period_start,
      period_end: apiSummary.period_end,
      top_products: apiSummary.top_products?.map((product: any) => ({
        product_id: product.product_id,
        product_name: product.product_name,
        product_sku: product.product_sku,
        quantity_sold: Number(product.quantity_sold),
        total_revenue: Number(product.total_revenue),
      })) || [],
    }
  }

  static toDisplaySale(sale: Sale) {
    return {
      id: sale.id,
      customerName: sale.customer_name || 'Cliente não informado',
      status: this.getStatusDisplay(sale.status),
      totalAmount: this.formatCurrency(sale.total_amount),
      saleDate: new Date(sale.sale_date).toLocaleDateString('pt-BR'),
      itemsCount: sale.items.length,
    }
  }

  private static getStatusDisplay(status: string): string {
    const statuses: Record<string, string> = {
      'pending': 'Pendente',
      'completed': 'Concluída',
      'cancelled': 'Cancelada',
      'refunded': 'Estornada',
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
