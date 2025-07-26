"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { LoadingDots } from "@/components/ui/animated-skeleton"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  redirectTo?: string
  fallbackComponent?: React.ReactNode
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/login",
  fallbackComponent,
}: ProtectedRouteProps) {
  const { user, token, isLoading, isAuthenticated, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Verificar se está autenticado
      if (!isAuthenticated()) {
        router.push(redirectTo)
        return
      }

      // Verificar se tem a role necessária
      if (requiredRole && !hasRole(requiredRole)) {
        // Redirecionar para página apropriada baseada na role
        if (hasRole("admin")) {
          router.push("/users")
        } else {
          router.push("/profile")
        }
        return
      }

      // Verificar se a conta está ativa
      if (user && !user.is_active) {
        router.push("/login")
        return
      }
    }
  }, [user, token, isLoading, requiredRole, router, redirectTo, isAuthenticated, hasRole])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <LoadingDots />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Não autenticado
  if (!isAuthenticated()) {
    return fallbackComponent || null
  }

  // Sem permissão
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔒</div>
          <div>
            <h3 className="text-lg font-medium">Acesso negado</h3>
            <p className="text-muted-foreground">Você não tem permissão para acessar esta página</p>
          </div>
        </div>
      </div>
    )
  }

  // Conta inativa
  if (user && !user.is_active) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="text-6xl">⚠️</div>
          <div>
            <h3 className="text-lg font-medium">Conta desativada</h3>
            <p className="text-muted-foreground">Sua conta foi desativada. Entre em contato com o administrador.</p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// HOC para páginas protegidas
export function withAuth<P extends object>(Component: React.ComponentType<P>, requiredRole?: string) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}
