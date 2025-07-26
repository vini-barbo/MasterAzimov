import { httpClient } from './http-client'
import { UserMapper } from '../mappers/user.mapper'
import { User, CreateUserDto, UpdateUserDto } from '../types/user.types'

export class UserService {
  private static readonly BASE_PATH = '/users'

  /**
   * Get all users
   */
  static async getAll(): Promise<User[]> {
    const response = await httpClient.get<any[]>(this.BASE_PATH)
    return UserMapper.fromApiResponseArray(response)
  }

  /**
   * Get user by ID
   */
  static async getById(id: string): Promise<User> {
    const response = await httpClient.get<any>(`${this.BASE_PATH}/${id}`)
    return UserMapper.fromApiResponse(response)
  }

  /**
   * Create new user
   */
  static async create(userData: CreateUserDto): Promise<User> {
    const payload = UserMapper.toApiRequest(userData)
    const response = await httpClient.post<any>(this.BASE_PATH, payload)
    return UserMapper.fromApiResponse(response)
  }

  /**
   * Update user
   */
  static async update(id: string, userData: UpdateUserDto): Promise<User> {
    const payload = UserMapper.toApiRequest(userData)
    const response = await httpClient.patch<any>(`${this.BASE_PATH}/${id}`, payload)
    return UserMapper.fromApiResponse(response)
  }

  /**
   * Delete user
   */
  static async delete(id: string): Promise<void> {
    await httpClient.delete(`${this.BASE_PATH}/${id}`)
  }

  /**
   * Deactivate user
   */
  static async deactivate(id: string): Promise<User> {
    const response = await httpClient.patch<any>(`${this.BASE_PATH}/${id}/deactivate`)
    return UserMapper.fromApiResponse(response)
  }

  /**
   * Activate user
   */
  static async activate(id: string): Promise<User> {
    const response = await httpClient.patch<any>(`${this.BASE_PATH}/${id}/activate`)
    return UserMapper.fromApiResponse(response)
  }
}
