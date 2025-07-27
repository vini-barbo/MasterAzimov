import { httpClient } from "./services/http-client"
import { API_ENDPOINTS } from "./config/env"
import type { 
  DashboardData, 
  TopSellingProduct, 
  SalesAnalytics, 
  StockSummary as DashboardStockSummary, 
  PerformanceMetrics 
} from "./types/dashboard.types"
import type { 
  StockOnHand, 
  StockSummary, 
  LowStockAlert, 
  StockMovementSummary 
} from "./types/stock.types"
import type { 
  Notification, 
  NotificationSummary, 
  CreateNotificationDto, 
  UpdateNotificationDto,
  NotificationFilters 
} from "./types/notification.types"

// Dashboard API
export const dashboardApi = {
  getTopSellingProducts: async (): Promise<TopSellingProduct[]> => {
    const response = await httpClient.get<TopSellingProduct[]>(API_ENDPOINTS.DASHBOARD.TOP_SELLING_PRODUCTS)
    return response
  },

  getSalesAnalytics: async (): Promise<SalesAnalytics> => {
    const response = await httpClient.get<SalesAnalytics>(API_ENDPOINTS.DASHBOARD.SALES_ANALYTICS)
    return response
  },

  getStockSummary: async (): Promise<DashboardStockSummary> => {
    const response = await httpClient.get<DashboardStockSummary>(API_ENDPOINTS.DASHBOARD.STOCK_SUMMARY)
    return response
  },

  getPerformanceMetrics: async (): Promise<PerformanceMetrics> => {
    const response = await httpClient.get<PerformanceMetrics>(API_ENDPOINTS.DASHBOARD.PERFORMANCE_METRICS)
    return response
  },

  getDashboardData: async (): Promise<DashboardData> => {
    // Fetch all dashboard data in parallel
    const [salesAnalytics, stockSummary, topSellingProducts, performanceMetrics] = await Promise.all([
      dashboardApi.getSalesAnalytics(),
      dashboardApi.getStockSummary(),
      dashboardApi.getTopSellingProducts(),
      dashboardApi.getPerformanceMetrics(),
    ])

    return {
      sales_analytics: salesAnalytics,
      stock_summary: stockSummary,
      top_selling_products: topSellingProducts,
      performance_metrics: performanceMetrics,
    }
  },
}

// Stock API
export const stockApi = {
  getStockOnHand: async (): Promise<StockOnHand[]> => {
    const response = await httpClient.get<StockOnHand[]>(API_ENDPOINTS.STOCK.ON_HAND)
    return response
  },

  getStockSummary: async (): Promise<StockSummary> => {
    const response = await httpClient.get<StockSummary>(API_ENDPOINTS.STOCK.SUMMARY)
    return response
  },

  getLowStockItems: async (): Promise<LowStockAlert[]> => {
    const response = await httpClient.get<LowStockAlert[]>(API_ENDPOINTS.STOCK.LOW_STOCK)
    return response
  },

  getCriticalStockItems: async (): Promise<LowStockAlert[]> => {
    const response = await httpClient.get<LowStockAlert[]>(API_ENDPOINTS.STOCK.CRITICAL_STOCK)
    return response
  },

  getStockByWarehouse: async (warehouseId: string): Promise<StockOnHand[]> => {
    const response = await httpClient.get<StockOnHand[]>(API_ENDPOINTS.STOCK.BY_WAREHOUSE(warehouseId))
    return response
  },

  getStockByProduct: async (productId: string): Promise<StockOnHand[]> => {
    const response = await httpClient.get<StockOnHand[]>(API_ENDPOINTS.STOCK.BY_PRODUCT(productId))
    return response
  },
}

// Notifications API
export const notificationsApi = {
  getAll: async (filters?: NotificationFilters): Promise<Notification[]> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    
    const url = `${API_ENDPOINTS.NOTIFICATIONS.BASE}${params.toString() ? `?${params.toString()}` : ''}`
    const response = await httpClient.get<Notification[]>(url)
    return response
  },

  getById: async (id: string): Promise<Notification> => {
    const response = await httpClient.get<Notification>(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id))
    return response
  },

  getUnread: async (): Promise<Notification[]> => {
    const response = await httpClient.get<Notification[]>(API_ENDPOINTS.NOTIFICATIONS.UNREAD)
    return response
  },

  getSummary: async (): Promise<NotificationSummary> => {
    const response = await httpClient.get<NotificationSummary>(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/summary`)
    return response
  },

  create: async (notification: CreateNotificationDto): Promise<Notification> => {
    const response = await httpClient.post<Notification>(API_ENDPOINTS.NOTIFICATIONS.BASE, notification)
    return response
  },

  update: async (id: string, notification: UpdateNotificationDto): Promise<Notification> => {
    const response = await httpClient.patch<Notification>(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id), notification)
    return response
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await httpClient.post<Notification>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id))
    return response
  },

  markAllAsRead: async (): Promise<void> => {
    await httpClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id))
  },
}
