import { User, CreateUserDto, UpdateUserDto, UserResponse } from '../types/user.types'

export class UserMapper {
  /**
   * Map API response to User interface
   */
  static fromApiResponse(apiUser: any): User {
    return {
      id: apiUser.id,
      email: apiUser.email,
      full_name: apiUser.full_name,
      roles: apiUser.roles || [],
      is_active: apiUser.is_active ?? true,
      created_at: apiUser.created_at,
      updated_at: apiUser.updated_at,
    }
  }

  /**
   * Map User to API request payload
   */
  static toApiRequest(user: CreateUserDto | UpdateUserDto): any {
    return {
      email: user.email,
      full_name: user.full_name,
      password: 'password' in user ? user.password : undefined,
      roles: user.roles,
      is_active: user.is_active,
    }
  }

  /**
   * Map array of API responses to User array
   */
  static fromApiResponseArray(apiUsers: any[]): User[] {
    return apiUsers.map(user => this.fromApiResponse(user))
  }

  /**
   * Map User for display purposes
   */
  static toDisplayUser(user: User): {
    id: string | number
    name: string
    email: string
    status: string
    roles: string
    createdAt: string
  } {
    return {
      id: user.id,
      name: user.full_name,
      email: user.email,
      status: user.is_active ? 'Ativo' : 'Inativo',
      roles: user.roles.join(', '),
      createdAt: new Date(user.created_at).toLocaleDateString('pt-BR'),
    }
  }

  /**
   * Validate user data
   */
  static validate(user: CreateUserDto | UpdateUserDto): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if ('email' in user && user.email && !this.isValidEmail(user.email)) {
      errors.push('Email inválido')
    }

    if ('full_name' in user && user.full_name && user.full_name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres')
    }

    if ('password' in user && user.password && user.password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
