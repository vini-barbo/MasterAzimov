"use client"

import { useState } from "react"
import { Users, RefreshCw, Edit, UserX, UserCheck, LayoutGrid, List, Shield, Mail, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useApi } from "@/hooks/use-api"
import { usersApi } from "@/lib/users-api"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function UsersPage() {
  const { data: users, loading, refetch } = useApi(() => usersApi.getAll())
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [processingUser, setProcessingUser] = useState<string | null>(null)

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    if (userId === currentUser?.id) {
      toast({
        variant: "destructive",
        title: "Ação não permitida",
        description: "Você não pode desativar sua própria conta",
      })
      return
    }

    setProcessingUser(userId)
    try {
      await usersApi.toggleActive(userId)
      toast({
        title: currentStatus ? "Usuário desativado" : "Usuário ativado",
        description: `O usuário foi ${currentStatus ? "desativado" : "ativado"} com sucesso`,
      })
      refetch()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível alterar o status do usuário",
      })
    } finally {
      setProcessingUser(null)
    }
  }

  const getRolesBadges = (roles: string[]) => {
    return roles.map((role) => (
      <Badge
        key={role}
        className={`${
          role === "admin"
            ? "bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
            : "bg-blue-500/20 text-blue-200 border-blue-400/30"
        } border text-xs`}
      >
        {role === "admin" ? "Admin" : "Usuário"}
      </Badge>
    ))
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SidebarTrigger />
              <div>
                <div className="h-8 w-48 bg-white/20 animate-pulse rounded" />
                <div className="h-4 w-64 bg-white/20 animate-pulse rounded mt-2" />
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-white/20 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const activeUsers = users?.filter((u) => u.is_active).length || 0
  const inactiveUsers = users?.filter((u) => !u.is_active).length || 0
  const adminUsers = users?.filter((u) => u.roles.includes("admin")).length || 0

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex-1 space-y-6 p-3 md:p-8 pt-4 md:pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-high-contrast">Gerenciar Usuários</h2>
              <p className="text-white/80 text-sm md:text-base">Administre contas de usuário e permissões</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-white/30 rounded-lg bg-white/10">
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className={`rounded-r-none ${
                  viewMode === "cards" ? "bg-white text-green-700" : "text-white hover:bg-white/10"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={`rounded-l-none ${
                  viewMode === "table" ? "bg-white text-green-700" : "text-white hover:bg-white/10"
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={refetch} className="btn-outline-white focus-ring" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
          <Card className="glass-card card-hover border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-high-contrast">Usuários Ativos</CardTitle>
              <UserCheck className="h-5 w-5 text-green-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{activeUsers}</div>
              <p className="text-xs text-white/70">Contas ativas no sistema</p>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover border-red-300/30 bg-red-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-high-contrast">Usuários Inativos</CardTitle>
              <UserX className="h-5 w-5 text-red-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-100">{inactiveUsers}</div>
              <p className="text-xs text-red-200/70">Contas desativadas</p>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover border-yellow-300/30 bg-yellow-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-high-contrast">Administradores</CardTitle>
              <Shield className="h-5 w-5 text-yellow-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-100">{adminUsers}</div>
              <p className="text-xs text-yellow-200/70">Usuários com privilégios admin</p>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        {viewMode === "cards" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users?.map((user) => (
              <Card key={user.id} className="glass-card card-hover border-white/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${user.is_active ? "bg-green-500/20" : "bg-red-500/20"}`}>
                        <Users className={`h-5 w-5 ${user.is_active ? "text-green-300" : "text-red-300"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-high-contrast">{user.full_name}</CardTitle>
                        <CardDescription className="text-white/70">{user.email}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      className={`${
                        user.is_active
                          ? "bg-green-500/20 text-green-200 border-green-400/30"
                          : "bg-red-500/20 text-red-200 border-red-400/30"
                      } border`}
                    >
                      {user.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-white/60" />
                    <span className="text-white/80">
                      Membro desde {new Date(user.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <div>
                    <p className="text-white/60 text-sm mb-2">Permissões</p>
                    <div className="flex flex-wrap gap-1">{getRolesBadges(user.roles)}</div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Button variant="outline" size="sm" asChild className="btn-outline-white focus-ring bg-transparent">
                      <Link href={`/users/${user.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Link>
                    </Button>

                    {user.id !== currentUser?.id && (
                      <Button
                        size="sm"
                        onClick={() => handleToggleActive(user.id, user.is_active)}
                        disabled={processingUser === user.id}
                        className={
                          user.is_active
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }
                      >
                        {processingUser === user.id ? (
                          "Processando..."
                        ) : (
                          <>
                            {user.is_active ? (
                              <UserX className="h-4 w-4 mr-2" />
                            ) : (
                              <UserCheck className="h-4 w-4 mr-2" />
                            )}
                            {user.is_active ? "Desativar" : "Ativar"}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <Card className="glass-card card-hover border-white/20">
            <CardContent className="p-0">
              <div className="table-green-theme rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20 hover:bg-white/5">
                      <TableHead className="text-white font-bold">Usuário</TableHead>
                      <TableHead className="text-white font-bold">Email</TableHead>
                      <TableHead className="text-white font-bold">Permissões</TableHead>
                      <TableHead className="text-white font-bold">Status</TableHead>
                      <TableHead className="text-white font-bold">Cadastro</TableHead>
                      <TableHead className="text-white font-bold w-[200px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className={`p-1 rounded-full ${user.is_active ? "bg-green-500/20" : "bg-red-500/20"}`}>
                              <Users className={`h-4 w-4 ${user.is_active ? "text-green-300" : "text-red-300"}`} />
                            </div>
                            <span className="font-medium text-white">{user.full_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-white/60" />
                            <span className="text-white">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">{getRolesBadges(user.roles)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              user.is_active
                                ? "bg-green-500/20 text-green-200 border-green-400/30"
                                : "bg-red-500/20 text-red-200 border-red-400/30"
                            } border`}
                          >
                            {user.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/80">
                          {new Date(user.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="btn-outline-white focus-ring bg-transparent"
                            >
                              <Link href={`/users/${user.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Link>
                            </Button>

                            {user.id !== currentUser?.id && (
                              <Button
                                size="sm"
                                onClick={() => handleToggleActive(user.id, user.is_active)}
                                disabled={processingUser === user.id}
                                className={
                                  user.is_active
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                                }
                              >
                                {processingUser === user.id ? (
                                  "Processando..."
                                ) : (
                                  <>
                                    {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {users && users.length === 0 && (
          <div className="text-center py-12">
            <div className="glass-card p-8 rounded-xl max-w-md mx-auto">
              <Users className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-lg font-medium text-high-contrast mb-2">Nenhum usuário encontrado</h3>
              <p className="text-white/70 mb-4">Não há usuários cadastrados no sistema</p>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
