export interface TopSellingProduct {
  rank: number
  sku: string
  product_name: string
  total_quantity_sold: number
  total_revenue: number
  avg_price: number
  sales_trend: 'up' | 'down' | 'stable'
}

export interface SalesAnalytics {
  total_revenue: number
  total_quantity_sold: number
  average_ticket: number
  top_product: TopSellingProduct
  revenue_trend: number // percentage change
  volume_trend: number // percentage change
}

export interface StockSummary {
  total_products: number
  low_stock_items: number
  critical_items: number
  out_of_stock_items: number
  total_warehouses: number
}

export interface PerformanceMetrics {
  response_time_avg: number
  error_rate: number
  active_users: number
  cache_hit_rate: number
  database_health: 'healthy' | 'warning' | 'critical'
}

export interface DashboardData {
  sales_analytics: SalesAnalytics
  stock_summary: StockSummary
  top_selling_products: TopSellingProduct[]
  performance_metrics: PerformanceMetrics
}
