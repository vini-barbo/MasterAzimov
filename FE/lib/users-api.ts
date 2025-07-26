import type { User } from "@/lib/auth"

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

// Mock data expandido
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@sistema.com",
    full_name: "Administrador Sistema",
    roles: ["admin", "user"],
    is_active: true,
    created_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "2",
    email: "usuario@empresa.com",
    full_name: "João Silva",
    roles: ["user"],
    is_active: true,
    created_at: "2024-01-15T14:30:00Z",
  },
  {
    id: "3",
    email: "maria@empresa.com",
    full_name: "Maria Santos",
    roles: ["user"],
    is_active: false,
    created_at: "2024-02-01T09:15:00Z",
  },
  {
    id: "4",
    email: "gestor@empresa.com",
    full_name: "Carlos Oliveira",
    roles: ["admin", "user"],
    is_active: true,
    created_at: "2024-02-10T16:45:00Z",
  },
  {
    id: "5",
    email: "ana@empresa.com",
    full_name: "Ana Costa",
    roles: ["user"],
    is_active: true,
    created_at: "2024-02-15T11:20:00Z",
  },
]

const mockRoles: Role[] = [
  {
    id: "1",
    name: "admin",
    description: "Administrador do sistema com acesso total",
  },
  {
    id: "2",
    name: "user",
    description: "Usuário comum com acesso básico",
  },
  {
    id: "3",
    name: "manager",
    description: "Gerente com acesso intermediário",
  },
]

// API seguindo o guia conceitual
export const usersApi = {
  // GET /users - List Users (admin only)
  getAll: async (): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simular erro ocasional
    if (Math.random() < 0.05) {
      throw new Error("Erro ao carregar usuários")
    }

    return [...mockUsers]
  },

  // GET /users/:id - Get Profile
  getById: async (id: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = mockUsers.find((u) => u.id === id)
    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    return { ...user }
  },

  // PUT /users/:id - Update Profile
  updateProfile: async (id: string, data: UpdateProfileData): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const index = mockUsers.findIndex((u) => u.id === id)
    if (index === -1) {
      throw new Error("Usuário não encontrado")
    }

    // Simular validação de senha atual
    if (data.new_password && !data.current_password) {
      throw new Error("Senha atual é obrigatória para alterar a senha")
    }

    // Simular senha atual incorreta
    if (data.current_password && Math.random() < 0.1) {
      throw new Error("Senha atual incorreta")
    }

    const updateData: Partial<User> = {}
    if (data.full_name) updateData.full_name = data.full_name

    mockUsers[index] = { ...mockUsers[index], ...updateData }
    return { ...mockUsers[index] }
  },

  // PUT /users/:id - Update User (admin only)
  update: async (id: string, data: UpdateUserData): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const index = mockUsers.findIndex((u) => u.id === id)
    if (index === -1) {
      throw new Error("Usuário não encontrado")
    }

    // Validações
    if (data.roles && data.roles.length === 0) {
      throw new Error("Usuário deve ter pelo menos uma role")
    }

    mockUsers[index] = { ...mockUsers[index], ...data }
    return { ...mockUsers[index] }
  },

  // DELETE /users/:id - Delete/Deactivate User
  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const index = mockUsers.findIndex((u) => u.id === id)
    if (index === -1) {
      throw new Error("Usuário não encontrado")
    }

    // Soft delete - apenas desativar
    mockUsers[index].is_active = false
  },

  // PUT /users/:id - Toggle Active Status
  toggleActive: async (id: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const index = mockUsers.findIndex((u) => u.id === id)
    if (index === -1) {
      throw new Error("Usuário não encontrado")
    }

    mockUsers[index].is_active = !mockUsers[index].is_active
    return { ...mockUsers[index] }
  },

  // POST /users - Create User (admin only)
  create: async (userData: Omit<User, "id" | "created_at">): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verificar se email já existe
    if (mockUsers.some((u) => u.email === userData.email)) {
      throw new Error("Este email já está em uso")
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }

    mockUsers.push(newUser)
    return { ...newUser }
  },
}

// GET /roles - List Roles
export const rolesApi = {
  getAll: async (): Promise<Role[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return [...mockRoles]
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
