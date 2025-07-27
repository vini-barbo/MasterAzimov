"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "../hooks/use-toast"
import { httpClient } from "./services/http-client"
import { API_ENDPOINTS, STORAGE_KEYS } from "./config/env"

export interface User {
  id: string
  email: string
  full_name: string
  roles: string[]
  is_active: boolean
  created_at: string
}

export interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
}

export interface RefreshResponse {
  access_token: string
  refresh_token: string
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

// Real API functions connecting to backend
const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    })
    return response
  },

  register: async (full_name: string, email: string, password: string): Promise<{ user: User }> => {
    const response = await httpClient.post<{ user: User }>(API_ENDPOINTS.AUTH.REGISTER, {
      full_name,
      email,
      password,
    })
    return response
  },

  refreshToken: async (refresh_token: string): Promise<RefreshResponse> => {
    const response = await httpClient.post<RefreshResponse>(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token,
    })
    return response
  },

  logout: async (): Promise<void> => {
    await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT)
  },

  getProfile: async (): Promise<User> => {
    const response = await httpClient.get<User>(API_ENDPOINTS.AUTH.PROFILE)
    return response
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await httpClient.put<User>(API_ENDPOINTS.AUTH.PROFILE, data)
    return response
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
    // Token já está configurado no httpClient através do setAuthToken
    // Aqui podemos adicionar logic adicional se necessário, como auto-refresh
  }

  useEffect(() => {
    // Verificar token armazenado na inicialização
    const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER)

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(parsedUser)
        httpClient.setAuthToken(storedToken)
        setupInterceptor()
      } catch (error) {
        // Token ou user corrompido, limpar
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
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
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))

      httpClient.setAuthToken(response.access_token)
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
      httpClient.removeAuthToken()
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)

      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      })

      router.push("/login")
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refresh_token = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      if (!refresh_token) return false

      const response = await authApi.refreshToken(refresh_token)

      setToken(response.access_token)
      httpClient.setAuthToken(response.access_token)
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token)

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
      const updatedUser = await authApi.updateProfile(data)

      setUser(updatedUser)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser))

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
