/**
 * Configuration file for API setup
 * This file contains environment-specific settings and API configuration
 */

// API Configuration
export const API_CONFIG = {
  // Base URL for the API - can be overridden by environment variable
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',

  // Request timeout in milliseconds
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),

  // API version (if versioned)
  VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1',

  // Enable/disable API logging
  ENABLE_LOGGING: process.env.NODE_ENV === 'development',

  // Retry configuration
  RETRY: {
    attempts: 3,
    delay: 1000, // milliseconds
  },

  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

// Authentication Configuration
export const AUTH_CONFIG = {
  // Token storage keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
  },

  // Token expiration buffer (refresh token before it expires)
  REFRESH_BUFFER_MINUTES: 5,

  // Auto-logout on token expiration
  AUTO_LOGOUT: true,
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  TIMEOUT_ERROR: 'Timeout na requisição. Tente novamente.',
  UNAUTHORIZED: 'Acesso negado. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para esta ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro interno do servidor.',
  VALIDATION_ERROR: 'Dados inválidos.',
  UNKNOWN_ERROR: 'Erro desconhecido.',
}

// Cache Configuration
export const CACHE_CONFIG = {
  // Enable/disable caching
  ENABLED: true,

  // Default cache duration in milliseconds
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes

  // Cache keys
  KEYS: {
    USERS: 'users',
    PRODUCTS: 'products',
    WAREHOUSES: 'warehouses',
    BATCHES: 'batches',
    SALES: 'sales',
  }
}

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  SKU_MIN_LENGTH: 2,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
}

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
}

// Date formats
export const DATE_FORMATS = {
  API: 'YYYY-MM-DD',
  DISPLAY: 'DD/MM/YYYY',
  DATETIME_DISPLAY: 'DD/MM/YYYY HH:mm',
}

// Feature flags
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_BATCH_OPERATIONS: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_ANALYTICS: process.env.NODE_ENV === 'production',
}

// Export all configurations
export default {
  API_CONFIG,
  AUTH_CONFIG,
  ERROR_MESSAGES,
  CACHE_CONFIG,
  VALIDATION_RULES,
  PAGINATION_DEFAULTS,
  DATE_FORMATS,
  FEATURES,
}
