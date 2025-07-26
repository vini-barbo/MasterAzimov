"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, Trash2, UserIcon, Mail, Shield, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useApi } from "@/hooks/use-api"
import { usersApi, rolesApi } from "@/lib/users-api"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const userId = params.id as string

  const { data: user, loading: userLoading } = useApi(() => usersApi.getById(userId))
  const { data: roles, loading: rolesLoading } = useApi(() => rolesApi.getAll())

  const [formData, setFormData] = useState({
    full_name: "",
    roles: [] as string[],
    is_active: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name,
        roles: user.roles,
        is_active: user.is_active,
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      await usersApi.update(userId, formData)

      toast({
        title: "Usuário atualizado",
        description: "As informações foram salvas com sucesso",
      })

      router.push("/users")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRoleChange = (roleId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      roles: checked ? [...prev.roles, roleId] : prev.roles.filter((r) => r !== roleId),
    }))
  }

  const handleDelete = async () => {
    if (userId === currentUser?.id) {
      toast({
        variant: "destructive",
        title: "Ação não permitida",
        description: "Você não pode excluir sua própria conta",
      })
      return
    }

    if (confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
      try {
        await usersApi.delete(userId)
        toast({
          title: "Usuário excluído",
          description: "O usuário foi removido do sistema",
        })
        router.push("/users")
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao excluir",
          description: "Não foi possível excluir o usuário",
        })
      }
    }
  }

  if (userLoading || rolesLoading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <div>
              <div className="h-8 w-48 bg-white/20 animate-pulse rounded" />
              <div className="h-4 w-64 bg-white/20 animate-pulse rounded mt-2" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-96 bg-white/20 animate-pulse rounded-lg" />
            <div className="h-96 bg-white/20 animate-pulse rounded-lg" />
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!user) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4 glass-card p-8 rounded-xl">
            <UserIcon className="h-12 w-12 text-white mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-high-contrast">Usuário não encontrado</h3>
              <p className="text-white/80">O usuário solicitado não existe</p>
            </div>
            <Button asChild className="btn-white focus-ring">
              <Link href="/users">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex-1 space-y-6 p-3 md:p-8 pt-4 md:pt-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10">
            <Link href="/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-high-contrast">Editar Usuário</h2>
            <p className="text-white/80 text-sm md:text-base">Altere as informações e permissões do usuário</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* User Information */}
            <Card className="glass-card card-hover border-white/20">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <UserIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-high-contrast">Informações do Usuário</CardTitle>
                    <CardDescription className="text-white/70">Dados básicos da conta</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="full_name" className="text-white font-medium">
                    Nome Completo
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-medium">Email</Label>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/20">
                    <Mail className="h-5 w-5 text-white/60" />
                    <span className="text-white">{user.email}</span>
                    <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30 border text-xs">
                      Não editável
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-medium">Data de Cadastro</Label>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/20">
                    <Calendar className="h-5 w-5 text-white/60" />
                    <span className="text-white">{new Date(user.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Conta Ativa</Label>
                    <p className="text-white/60 text-sm">
                      {userId === currentUser?.id
                        ? "Você não pode desativar sua própria conta"
                        : "Desative para bloquear o acesso do usuário"}
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                    disabled={userId === currentUser?.id}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card className="glass-card card-hover border-white/20">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-high-contrast">Permissões</CardTitle>
                    <CardDescription className="text-white/70">Defina os níveis de acesso do usuário</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white font-medium mb-3 block">Funções do Sistema</Label>
                  <div className="space-y-3">
                    {roles?.map((role) => (
                      <div key={role.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={role.id}
                          checked={formData.roles.includes(role.name)}
                          onCheckedChange={(checked) => handleRoleChange(role.name, checked as boolean)}
                          className="mt-1 border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-green-700"
                        />
                        <div className="flex-1">
                          <Label htmlFor={role.id} className="text-white font-medium cursor-pointer">
                            {role.name === "admin" ? "Administrador" : "Usuário"}
                          </Label>
                          <p className="text-white/60 text-sm">{role.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <Label className="text-white font-medium mb-2 block">Permissões Atuais</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.roles.map((role) => (
                      <Badge
                        key={role}
                        className={`${
                          role === "admin"
                            ? "bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
                            : "bg-blue-500/20 text-blue-200 border-blue-400/30"
                        } border`}
                      >
                        {role === "admin" ? "Administrador" : "Usuário"}
                      </Badge>
                    ))}
                    {formData.roles.length === 0 && (
                      <span className="text-white/60 text-sm">Nenhuma permissão selecionada</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <Button type="submit" disabled={isSubmitting} className="btn-white focus-ring">
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="loading-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        Salvando...
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="btn-outline-white focus-ring bg-transparent"
                  >
                    <Link href="/users">Cancelar</Link>
                  </Button>
                </div>

                {userId !== currentUser?.id && (
                  <Button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-4 focus:ring-red-500/30"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Usuário
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </ProtectedRoute>
  )
}
