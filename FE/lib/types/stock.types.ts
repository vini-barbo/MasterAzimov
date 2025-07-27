export interface StockOnHand {
  sku: string
  product_name: string
  warehouse: string
  warehouse_id: string
  current_stock: number
  min_stock: number
  max_stock?: number
  unit: string
  last_movement_date?: string
  status: 'good' | 'low' | 'critical' | 'out_of_stock'
}

export interface StockSummary {
  total_products: number
  low_stock_items: number
  critical_items: number
  out_of_stock_items: number
  total_warehouses: number
  last_updated: string
}

export interface LowStockAlert {
  product_id: string
  sku: string
  product_name: string
  warehouse_id: string
  warehouse_name: string
  current_stock: number
  min_stock: number
  percentage_remaining: number
  days_until_empty?: number
}

export interface StockMovementSummary {
  product_id: string
  sku: string
  product_name: string
  warehouse_id: string
  warehouse_name: string
  movements_in: number
  movements_out: number
  net_movement: number
  period: string // 'today', 'week', 'month'
}
