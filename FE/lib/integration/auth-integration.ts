/**
 * Integration guide for the new API system with existing authentication
 * This file shows how to integrate the new API layer with the current auth system
 */

import { useEffect } from 'react'
import { useAuth } from '../auth'
import api from '../api'
import { useToast } from '@/hooks/use-toast'

/**
 * Hook to automatically setup API authentication when user logs in
 */
export function useApiAuth() {
  const { token, user, logout } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (token) {
      // Set token in API client
      api.auth.setToken(token)
    } else {
      // Remove token from API client
      api.auth.removeToken()
    }
  }, [token])

  // Setup response interceptor for handling 401 errors
  useEffect(() => {
    const handleUnauthorized = () => {
      toast({
        variant: "destructive",
        title: "Sessão expirada",
        description: "Você será redirecionado para o login",
      })
      logout()
    }

    // You can extend the HTTP client to add response interceptors
    // This is a conceptual example - you'd need to implement the actual interceptor
    // api.client.addResponseInterceptor(
    //   (response) => response,
    //   (error) => {
    //     if (error.status === 401) {
    //       handleUnauthorized()
    //     }
    //     return Promise.reject(error)
    //   }
    // )

    return () => {
      // Cleanup interceptor if needed
    }
  }, [logout, toast])
}

/**
 * Enhanced auth API that integrates with the backend user management
 * This can replace the mock authApi in auth.ts
 */
export const realAuthApi = {
  login: async (email: string, password: string) => {
    try {
      // This would be a real endpoint like POST /auth/login
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error('Credenciais inválidas')
      }

      const data = await response.json()

      return {
        user: data.user,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      }
    } catch (error) {
      throw new Error('Erro no login: ' + (error as Error).message)
    }
  },

  register: async (full_name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, password })
      })

      if (!response.ok) {
        throw new Error('Erro no cadastro')
      }

      const data = await response.json()
      return { user: data.user }
    } catch (error) {
      throw new Error('Erro no cadastro: ' + (error as Error).message)
    }
  },

  refreshToken: async (refresh_token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token })
      })

      if (!response.ok) {
        throw new Error('Token inválido')
      }

      const data = await response.json()
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      }
    } catch (error) {
      throw new Error('Erro ao renovar token')
    }
  },

  logout: async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
    } catch (error) {
      // Ignore logout errors - user will be logged out locally anyway
    }
  },

  getProfile: async (userId: string) => {
    // Use the new API system
    return api.users.getById(userId)
  },

  updateProfile: async (userId: string, data: any) => {
    // Use the new API system
    return api.users.update(userId, data)
  },
}

/**
 * Example of how to update the existing auth.ts file to use the new API system
 */
export const integrationExample = `
// In auth.ts, replace the mock authApi with:

import { realAuthApi } from './integration/auth-integration'
import { useApiAuth } from './integration/auth-integration'

// In AuthProvider component, add:
export function AuthProvider({ children }: { children: ReactNode }) {
  // ... existing state and logic ...
  
  // Add this hook to setup API authentication
  useApiAuth()
  
  // Replace authApi usage with realAuthApi
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await realAuthApi.login(email, password) // Use real API
      
      // ... rest of login logic ...
    } catch (error) {
      // ... error handling ...
    }
  }
  
  // ... rest of the component ...
}
`

/**
 * Example of using the new API in existing components
 */
export const componentMigrationExample = `
// Before (using old API):
import { usersApi } from '@/lib/users-api'

const { data: users, loading } = useApi(() => usersApi.getAll())

// After (using new API):
import { useApiCall } from '@/lib/hooks/use-api-call'
import api from '@/lib/api'

const { data: users, loading } = useApiCall(() => api.users.getAll())

// The new version provides:
// - Better TypeScript support
// - Automatic error handling
// - Consistent data transformation
// - Validation
// - Better error messages
`

/**
 * Migration checklist for existing components
 */
export const migrationChecklist = [
  '1. Replace direct API calls with the new api object',
  '2. Update import statements to use new hooks',
  '3. Replace useApi hook with useApiCall hook',
  '4. Update type imports to use new type system',
  '5. Add error handling with useErrorHandler if needed',
  '6. Update form validation to use mappers',
  '7. Test all CRUD operations',
  '8. Update any hardcoded API URLs',
  '9. Verify authentication token is properly set',
  '10. Test error scenarios (network errors, 401, etc.)'
]
