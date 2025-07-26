import { QueryParams, ApiResponse, ErrorResponse } from '../types/common.types'

export interface HttpClientConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
}

export interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  params?: QueryParams
}

export class HttpClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private timeout: number

  constructor(config: HttpClientConfig) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout || 10000
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    }
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers = { ...this.defaultHeaders, ...config?.headers }

    // Add query parameters
    const urlWithParams = config?.params ? this.addQueryParams(url, config.params) : url

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), config?.timeout || this.timeout)

      const response = await fetch(urlWithParams, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new HttpError(response.status, errorData.message || 'Request failed', errorData)
      }

      const result = await response.json()
      return result
    } catch (error) {
      if (error instanceof HttpError) {
        throw error
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new HttpError(408, 'Request timeout')
      }

      throw new HttpError(500, 'Network error', error)
    }
  }

  private addQueryParams(url: string, params: QueryParams): string {
    const urlObj = new URL(url)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value))
      }
    })
    return urlObj.toString()
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, config)
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('POST', endpoint, data, config)
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('PUT', endpoint, data, config)
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, config)
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, config)
  }

  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  removeAuthToken() {
    delete this.defaultHeaders['Authorization']
  }
}

export class HttpError extends Error {
  public status: number
  public data?: any

  constructor(status: number, message: string, data?: any) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.data = data
  }
}

// Create singleton instance
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const httpClient = new HttpClient({
  baseURL: API_BASE_URL,
  timeout: 10000,
})
