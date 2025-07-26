"use client"

import { useAuth } from "@/lib/auth"
import { AuthForm } from "@/components/auth/auth-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const { register, isLoading } = useAuth()

  const handleRegister = async (data: { full_name: string; email: string; password: string }) => {
    await register(data.full_name, data.email, data.password)
  }

  return (
    <div className="relative">
      <AuthForm mode="register" onSubmit={handleRegister} isLoading={isLoading} />

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="text-center">
          <p className="text-white/80 text-sm mb-2">Já tem uma conta?</p>
          <Button variant="link" asChild className="text-white hover:text-white/80 underline">
            <Link href="/login">Fazer login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
