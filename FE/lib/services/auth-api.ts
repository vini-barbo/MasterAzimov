import { httpClient } from './http-client'
import { API_ENDPOINTS } from '../config/env'
import type { User } from '../auth'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  full_name: string
  password: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
}

export interface RegisterResponse {
  user: User
}

export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
}

export interface ProfileResponse {
  id: string
  email: string
  full_name: string
  roles: string[]
  is_active: boolean
  created_at: string
}

export const authApi = {
  login: async (loginData: LoginRequest): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      loginData
    )
    return response
  },

  register: async (registerData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await httpClient.post<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      registerData
    )
    return response
  },

  refreshToken: async (refreshData: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await httpClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      refreshData
    )
    return response
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await httpClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.LOGOUT
    )
    return response
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await httpClient.get<ProfileResponse>(
      API_ENDPOINTS.AUTH.PROFILE
    )
    return response
  },

  updateProfile: async (updateData: Partial<User>): Promise<ProfileResponse> => {
    const response = await httpClient.put<ProfileResponse>(
      API_ENDPOINTS.AUTH.PROFILE,
      updateData
    )
    return response
  },
}
