/**
 * Environment configuration for API endpoints
 */

// Backend API base URL - adjust according to your docker setup
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  // Users management
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    ROLES: '/users/roles',
  },

  // Products
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    CATEGORIES: '/products/categories',
    SUPPLIERS: '/products/suppliers',
  },

  // Warehouses
  WAREHOUSES: {
    BASE: '/warehouses',
    BY_ID: (id: string) => `/warehouses/${id}`,
    PRODUCTS: (id: string) => `/warehouses/${id}/products`,
  },

  // Batches
  BATCHES: {
    BASE: '/batches',
    BY_ID: (id: string) => `/batches/${id}`,
    BY_PRODUCT: (productId: string) => `/batches/product/${productId}`,
    EXPIRING: '/batches/expiring',
  },

  // Stock movements
  STOCK_MOVEMENTS: {
    BASE: '/stock-movements',
    BY_ID: (id: string) => `/stock-movements/${id}`,
    BY_PRODUCT: (productId: string) => `/stock-movements/product/${productId}`,
    BY_WAREHOUSE: (warehouseId: string) => `/stock-movements/warehouse/${warehouseId}`,
  },

  // Purchases
  PURCHASES: {
    BASE: '/purchases',
    BY_ID: (id: string) => `/purchases/${id}`,
    ITEMS: (id: string) => `/purchases/${id}/items`,
    PENDING: '/purchases/pending',
    APPROVED: '/purchases/approved',
  },

  // Sales
  SALES: {
    BASE: '/sales',
    BY_ID: (id: string) => `/sales/${id}`,
    ITEMS: (id: string) => `/sales/${id}/items`,
    PENDING: '/sales/pending',
    COMPLETED: '/sales/completed',
  },

  // Production
  PRODUCTION: {
    BASE: '/production',
    BY_ID: (id: string) => `/production/${id}`,
    ITEMS: (id: string) => `/production/${id}/items`,
    ACTIVE: '/production/active',
    COMPLETED: '/production/completed',
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    UNREAD: '/notifications/unread',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
  },

  // Health check
  HEALTH: '/health',
} as const

// Request timeout configuration
export const REQUEST_TIMEOUT = 30000 // 30 seconds

// Token storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const
