// Common types used across the application
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined
}

export interface BaseEntity {
  id: string | number
  created_at: string
  updated_at?: string
}

export interface TimestampFields {
  created_at: string
  updated_at?: string
}

export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'failed'

export interface ErrorResponse {
  error: string
  message: string
  statusCode: number
  timestamp: string
}
