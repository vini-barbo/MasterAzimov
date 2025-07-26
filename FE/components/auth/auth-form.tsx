"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Warehouse, Lock, User, Mail } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { LoadingDots } from "@/components/ui/animated-skeleton"

interface AuthFormProps {
  mode: "login" | "register"
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function AuthForm({ mode, onSubmit, isLoading = false }: AuthFormProps) {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === "register" && formData.password !== formData.confirmPassword) {
      return
    }

    await onSubmit(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Warehouse className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">{t("app.name")}</h1>
          </div>
          <CardTitle className="text-2xl">{mode === "login" ? t("login.title") : "Criar Conta"}</CardTitle>
          <CardDescription>
            {mode === "login" ? t("login.subtitle") : "Preencha os dados para criar sua conta"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    placeholder="Seu nome completo"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
                {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                  <p className="text-destructive text-sm">As senhas não coincidem</p>
                )}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingDots />
                  {mode === "login" ? "Entrando..." : "Criando conta..."}
                </div>
              ) : mode === "login" ? (
                t("login.signIn")
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
