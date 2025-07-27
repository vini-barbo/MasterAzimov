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

import { authApi } from './services/auth-api'
import { httpClient } from './services/http-client'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Interceptor para requisições HTTP
  const setupInterceptor = () => {
    // Configure o token no httpClient se já estiver logado
    if (token) {
      httpClient.setAuthToken(token)
    }
  }

  useEffect(() => {
    // Verificar token armazenado na inicialização
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem("access_token")
      const storedUser = localStorage.getItem("user")

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setToken(storedToken)
          setUser(parsedUser)
          httpClient.setAuthToken(storedToken)
          setupInterceptor()
        } catch (error) {
          // Token ou user corrompido, limpar
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          localStorage.removeItem("user")
        }
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await authApi.login({ email, password })

      setUser(response.user)
      setToken(response.access_token)

      // Configure token no httpClient para requisições futuras
      httpClient.setAuthToken(response.access_token)

      // Armazenar tokens de forma segura
      if (typeof window !== 'undefined') {
        localStorage.setItem("access_token", response.access_token)
        localStorage.setItem("refresh_token", response.refresh_token)
        localStorage.setItem("user", JSON.stringify(response.user))
      }

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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error?.message || "Email ou senha incorretos",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (full_name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      await authApi.register({ full_name, email, password })

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Você pode fazer login agora",
      })

      router.push("/login")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error?.message || "Não foi possível criar a conta",
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

      // Remover token do httpClient
      httpClient.removeAuthToken()

      if (typeof window !== 'undefined') {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
      }

      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      })

      router.push("/login")
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      if (typeof window === 'undefined') return false

      const refresh_token = localStorage.getItem("refresh_token")
      if (!refresh_token) return false

      const response = await authApi.refreshToken({ refresh_token })

      setToken(response.access_token)
      httpClient.setAuthToken(response.access_token)
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
      const updatedData = await authApi.updateProfile(data)
      const updatedUser = { ...user, ...updatedData }

      setUser(updatedUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: error?.message || "Não foi possível salvar as alterações",
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
      value= {{
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
      }
}
    >
  { children }
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
