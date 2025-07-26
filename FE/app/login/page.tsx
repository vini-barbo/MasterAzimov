"use client"

import { useAuth } from "@/lib/auth"
import { AuthForm } from "@/components/auth/auth-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const { login, isLoading } = useAuth()

  const handleLogin = async (data: { email: string; password: string }) => {
    await login(data.email, data.password)
  }

  return (
    <div className="relative">
      <AuthForm mode="login" onSubmit={handleLogin} isLoading={isLoading} />

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="text-center">
          <p className="text-white/80 text-sm mb-2">Não tem uma conta?</p>
          <Button variant="link" asChild className="text-white hover:text-white/80 underline">
            <Link href="/register">Criar conta</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
