"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { User, Mail, Calendar, Shield, Save, Lock, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { usersApi, userValidation } from "@/lib/users-api"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validar nome
    if (!userValidation.validateFullName(formData.full_name)) {
      newErrors.full_name = "Nome deve ter pelo menos 2 caracteres"
    }

    // Validar senha se estiver sendo alterada
    if (formData.new_password) {
      if (!formData.current_password) {
        newErrors.current_password = "Senha atual é obrigatória"
      }

      const passwordValidation = userValidation.validatePassword(formData.new_password)
      if (!passwordValidation.valid) {
        newErrors.new_password = passwordValidation.message || "Senha inválida"
      }

      if (formData.new_password !== formData.confirm_password) {
        newErrors.confirm_password = "Senhas não coincidem"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm() || !user) return

    setIsSaving(true)
    try {
      await usersApi.updateProfile(user.id, {
        full_name: formData.full_name,
        current_password: formData.current_password || undefined,
        new_password: formData.new_password || undefined,
      })

      // Atualizar contexto de autenticação
      await updateProfile({ full_name: formData.full_name })

      setIsEditing(false)
      setFormData((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: "",
      }))
      setErrors({})

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Não foi possível salvar as alterações",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      full_name: user?.full_name || "",
      current_password: "",
      new_password: "",
      confirm_password: "",
    })
    setErrors({})
  }

  if (!user) return null

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
            <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>Seus dados básicos de cadastro</CardDescription>
                  </div>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} size="sm">
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Nome Completo</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                      className={errors.full_name ? "border-destructive" : ""}
                    />
                    {errors.full_name && <p className="text-sm text-destructive mt-1">{errors.full_name}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSave} disabled={isSaving} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Salvando..." : "Salvar"}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-medium">{user.full_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Membro desde</p>
                      <p className="font-medium">{new Date(user.created_at).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Segurança da Conta</CardTitle>
                  <CardDescription>Permissões e configurações de segurança</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Permissões</p>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <Badge key={role} variant={role === "admin" ? "default" : "secondary"}>
                      {role === "admin" ? "Administrador" : "Usuário"}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Status da Conta</p>
                <Badge variant={user.is_active ? "default" : "destructive"}>
                  {user.is_active ? "Ativa" : "Inativa"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          {isEditing && (
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Alterar Senha</CardTitle>
                    <CardDescription>Deixe em branco se não quiser alterar a senha</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Para alterar sua senha, você deve informar sua senha atual por segurança.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="current_password">Senha Atual</Label>
                    <Input
                      id="current_password"
                      type="password"
                      value={formData.current_password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, current_password: e.target.value }))}
                      placeholder="••••••••"
                      className={errors.current_password ? "border-destructive" : ""}
                    />
                    {errors.current_password && (
                      <p className="text-sm text-destructive mt-1">{errors.current_password}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="new_password">Nova Senha</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={formData.new_password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, new_password: e.target.value }))}
                      placeholder="••••••••"
                      className={errors.new_password ? "border-destructive" : ""}
                    />
                    {errors.new_password && <p className="text-sm text-destructive mt-1">{errors.new_password}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={formData.confirm_password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, confirm_password: e.target.value }))}
                      placeholder="••••••••"
                      className={errors.confirm_password ? "border-destructive" : ""}
                    />
                    {errors.confirm_password && (
                      <p className="text-sm text-destructive mt-1">{errors.confirm_password}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
