"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export interface User {
  id: string
  email: string
  full_name: string
  roles: string[]
  is_active: boolean
  created_at: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (full_name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<boolean>
  updateProfile: (data: Partial<User>) => Promise<void>
  hasRole: (role: string) => boolean
  isAdmin: () => boolean
  isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock API functions seguindo o guia
const authApi = {
  login: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simular erro de credenciais inválidas ocasionalmente
    if (Math.random() < 0.1) {
      throw new Error("Email ou senha incorretos")
    }

    const isAdmin = email.includes("admin")
    const mockUser: User = {
      id: "1",
      email,
      full_name: isAdmin ? "Administrador Sistema" : "Usuário Comum",
      roles: isAdmin ? ["admin", "user"] : ["user"],
      is_active: true,
      created_at: new Date().toISOString(),
    }

    return {
      user: mockUser,
      access_token: "mock-jwt-token-" + Date.now(),
      refresh_token: "mock-refresh-token-" + Date.now(),
    }
  },

  register: async (full_name: string, email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simular erro de email já existente
    if (email === "admin@sistema.com") {
      throw new Error("Este email já está em uso")
    }

    const mockUser: User = {
      id: Date.now().toString(),
      email,
      full_name,
      roles: ["user"],
      is_active: true,
      created_at: new Date().toISOString(),
    }

    return { user: mockUser }
  },

  refreshToken: async (refresh_token: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simular falha ocasional do refresh
    if (Math.random() < 0.05) {
      throw new Error("Refresh token inválido")
    }

    return {
      access_token: "new-mock-jwt-token-" + Date.now(),
      refresh_token: "new-mock-refresh-token-" + Date.now(),
    }
  },

  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    // Invalidar token no servidor
  },

  getProfile: async (userId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      id: userId,
      email: "user@example.com",
      full_name: "Usuário Exemplo",
      roles: ["user"],
      is_active: true,
      created_at: new Date().toISOString(),
    }
  },

  updateProfile: async (userId: string, data: Partial<User>) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { ...data, id: userId }
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Interceptor para requisições HTTP
  const setupInterceptor = () => {
    // Em uma implementação real, configuraria interceptors do Axios aqui
    // para adicionar token automaticamente e tratar 401s
  }

  useEffect(() => {
    // Verificar token armazenado na inicialização
    const storedToken = localStorage.getItem("access_token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(parsedUser)
        setupInterceptor()
      } catch (error) {
        // Token ou user corrompido, limpar
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await authApi.login(email, password)

      setUser(response.user)
      setToken(response.access_token)

      // Armazenar tokens de forma segura
      localStorage.setItem("access_token", response.access_token)
      localStorage.setItem("refresh_token", response.refresh_token)
      localStorage.setItem("user", JSON.stringify(response.user))

      setupInterceptor()

      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${response.user.full_name}!`,
      })

      // Redirect baseado na role
      if (response.user.roles.includes("admin")) {
        router.push("/users")
      } else {
        router.push("/profile")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Email ou senha incorretos",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (full_name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      await authApi.register(full_name, email, password)

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Você pode fazer login agora",
      })

      router.push("/login")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error instanceof Error ? error.message : "Não foi possível criar a conta",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      // Ignorar erros de logout no servidor
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user")

      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      })

      router.push("/login")
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refresh_token = localStorage.getItem("refresh_token")
      if (!refresh_token) return false

      const response = await authApi.refreshToken(refresh_token)

      setToken(response.access_token)
      localStorage.setItem("access_token", response.access_token)
      localStorage.setItem("refresh_token", response.refresh_token)

      return true
    } catch (error) {
      logout()
      return false
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return

    try {
      setIsLoading(true)
      const updatedData = await authApi.updateProfile(user.id, data)
      const updatedUser = { ...user, ...updatedData }

      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false
  }

  const isAdmin = (): boolean => {
    return hasRole("admin")
  }

  const isAuthenticated = (): boolean => {
    return !!(token && user && user.is_active)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
        updateProfile,
        hasRole,
        isAdmin,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
