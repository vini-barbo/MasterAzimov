// Main API export file that provides a centralized interface to all services
import { httpClient } from './services/http-client'
import { UserService } from './services/user.service'
import { ProductService } from './services/product.service'
import { WarehouseService } from './services/warehouse.service'
import { BatchService } from './services/batch.service'
import { StockMovementService } from './services/stock-movement.service'
import { PurchaseService } from './services/purchase.service'
import { SaleService } from './services/sale.service'
import { ProductionService } from './services/production.service'
import { NotificationService } from './services/notification.service'

// Export all types for convenience
export * from './types'
export * from './mappers'
export * from './services'

// Centralized API object
export const api = {
  // HTTP client for direct access if needed
  client: httpClient,

  // Service modules
  users: UserService,
  products: ProductService,
  warehouses: WarehouseService,
  batches: BatchService,
  stockMovements: StockMovementService,
  purchases: PurchaseService,
  sales: SaleService,
  production: ProductionService,
  notifications: NotificationService,

  // Authentication methods
  auth: {
    setToken: (token: string) => {
      httpClient.setAuthToken(token)
    },
    removeToken: () => {
      httpClient.removeAuthToken()
    }
  }
}

// Default export for convenience
export default api

// Individual service exports for tree-shaking
export {
  UserService,
  ProductService,
  WarehouseService,
  BatchService,
  StockMovementService,
  PurchaseService,
  SaleService,
  ProductionService,
  NotificationService
}
