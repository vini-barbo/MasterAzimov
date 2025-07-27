import { httpClient } from './http-client'
import { UserMapper } from '../mappers/user.mapper'
import { User, CreateUserDto, UpdateUserDto } from '../types/user.types'
import { API_ENDPOINTS } from '../config/env'

export class UserService {
  /**
   * Get all users
   */
  static async getAll(): Promise<User[]> {
    const response = await httpClient.get<any[]>(API_ENDPOINTS.USERS.BASE)
    return UserMapper.fromApiResponseArray(response)
  }

  /**
   * Get user by ID
   */
  static async getById(id: string): Promise<User> {
    const response = await httpClient.get<any>(API_ENDPOINTS.USERS.BY_ID(id))
    return UserMapper.fromApiResponse(response)
  }

  /**
   * Create new user
   */
  static async create(userData: CreateUserDto): Promise<User> {
    const payload = UserMapper.toApiRequest(userData)
    const response = await httpClient.post<any>(API_ENDPOINTS.USERS.BASE, payload)
    return UserMapper.fromApiResponse(response)
  }

  /**
   * Update user
   */
  static async update(id: string, userData: UpdateUserDto): Promise<User> {
    const payload = UserMapper.toApiRequest(userData)
    const response = await httpClient.patch<any>(API_ENDPOINTS.USERS.BY_ID(id), payload)
    return UserMapper.fromApiResponse(response)
  }

  /**
   * Delete user
   */
  static async delete(id: string): Promise<void> {
    await httpClient.delete(API_ENDPOINTS.USERS.BY_ID(id))
  }

  /**
   * Deactivate user
   */
  static async deactivate(id: string): Promise<User> {
    const response = await httpClient.patch<any>(`${API_ENDPOINTS.USERS.BY_ID(id)}/deactivate`)
    return UserMapper.fromApiResponse(response)
  }

  /**
   * Activate user
   */
  static async activate(id: string): Promise<User> {
    const response = await httpClient.patch<any>(`${API_ENDPOINTS.USERS.BY_ID(id)}/activate`)
    return UserMapper.fromApiResponse(response)
  }
}
