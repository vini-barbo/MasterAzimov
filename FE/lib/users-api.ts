import type { User } from "@/lib/auth"
import { httpClient } from "./services/http-client"
import { API_ENDPOINTS } from "./config/env"

export interface Role {
  id: string
  name: string
  description: string
}

export interface UpdateUserData {
  full_name?: string
  roles?: string[]
  is_active?: boolean
  password?: string
}

export interface UpdateProfileData {
  full_name?: string
  current_password?: string
  new_password?: string
}

// Real API connecting to backend
export const usersApi = {
  // GET /users - List Users (admin only)
  getAll: async (): Promise<User[]> => {
    const response = await httpClient.get<User[]>(API_ENDPOINTS.USERS.BASE)
    return response
  },

  // GET /users/:id - Get Profile
  getById: async (id: string): Promise<User> => {
    const response = await httpClient.get<User>(API_ENDPOINTS.USERS.BY_ID(id))
    return response
  },

  // PUT /users/:id - Update Profile
  updateProfile: async (id: string, data: UpdateProfileData): Promise<User> => {
    const response = await httpClient.put<User>(API_ENDPOINTS.USERS.BY_ID(id), data)
    return response
  },

  // PUT /users/:id - Update User (admin only)
  update: async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await httpClient.put<User>(API_ENDPOINTS.USERS.BY_ID(id), data)
    return response
  },

  // DELETE /users/:id - Delete/Deactivate User
  delete: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.USERS.BY_ID(id))
  },

  // PUT /users/:id/toggle-active - Toggle Active Status
  toggleActive: async (id: string): Promise<User> => {
    const response = await httpClient.put<User>(`${API_ENDPOINTS.USERS.BY_ID(id)}/toggle-active`)
    return response
  },

  // POST /users - Create User (admin only)
  create: async (userData: Omit<User, "id" | "created_at">): Promise<User> => {
    const response = await httpClient.post<User>(API_ENDPOINTS.USERS.BASE, userData)
    return response
  },
}

// GET /roles - List Roles
export const rolesApi = {
  getAll: async (): Promise<Role[]> => {
    const response = await httpClient.get<Role[]>(API_ENDPOINTS.USERS.ROLES)
    return response
  },
}

// Utilitários para validação
export const userValidation = {
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  validatePassword: (password: string): { valid: boolean; message?: string } => {
    if (password.length < 6) {
      return { valid: false, message: "Senha deve ter pelo menos 6 caracteres" }
    }
    return { valid: true }
  },

  validateFullName: (name: string): boolean => {
    return name.trim().length >= 2
  },
}
