import { BaseEntity } from './common.types'

export interface User extends BaseEntity {
  email: string
  full_name: string
  roles: string[]
  is_active: boolean
}

export interface CreateUserDto {
  email: string
  full_name: string
  password: string
  roles: string[]
  is_active?: boolean
}

export interface UpdateUserDto {
  email?: string
  full_name?: string
  roles?: string[]
  is_active?: boolean
}

export interface UserResponse extends User {
  // Additional fields that might come from the API
}

export interface UserListResponse {
  users: User[]
  total: number
}
