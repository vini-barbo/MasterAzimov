"use client"

import { AlertTriangle, Clock, Package, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationsPageSkeleton } from "@/components/skeletons/notifications-skeleton"
import { useApi } from "@/hooks/use-api"
import { useI18n } from "@/lib/i18n"

// Simulando dados da tabela notifications_log
const notifications = [
  {
    id: 1,
    type: "low_stock",
    product_name: "Pão de Hambúrguer",
    sku: "PAO002",
    message: "Estoque abaixo do mínimo (12/30 pacotes)",
    severity: "high",
    created_at: "2024-01-15T10:30:00Z",
    warehouse: "Estoque Seco",
  },
  {
    id: 2,
    type: "expiring_soon",
    product_name: "Queijo Cheddar",
    sku: "QUE003",
    message: "Produto vence em 2 dias (Lote: QUE-240115)",
    severity: "critical",
    created_at: "2024-01-15T09:15:00Z",
    warehouse: "Refrigerador A",
  },
  {
    id: 3,
    type: "low_stock",
    product_name: "Tomate Salada",
    sku: "TOM006",
    message: "Estoque crítico (5/12 kg)",
    severity: "critical",
    created_at: "2024-01-15T08:45:00Z",
    warehouse: "Refrigerador B",
  },
  {
    id: 4,
    type: "expiring_soon",
    product_name: "Alface Americana",
    sku: "ALC005",
    message: "Produto vence em 1 dia (Lote: ALC-240114)",
    severity: "critical",
    created_at: "2024-01-14T16:20:00Z",
    warehouse: "Refrigerador B",
  },
  {
    id: 5,
    type: "low_stock",
    product_name: "Queijo Cheddar",
    sku: "QUE003",
    message: "Estoque baixo (8/15 kg)",
    severity: "medium",
    created_at: "2024-01-14T14:10:00Z",
    warehouse: "Refrigerador A",
  },
]

async function fetchNotifications() {
  return notifications
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "low_stock":
      return Package
    case "expiring_soon":
      return Clock
    default:
      return AlertTriangle
  }
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical":
      return "destructive"
    case "high":
      return "secondary"
    case "medium":
      return "outline"
    default:
      return "default"
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function NotificacoesPage() {
  const { data, loading, error, refetch } = useApi(fetchNotifications)
  const { t } = useI18n()

  if (loading) {
    return <NotificationsPageSkeleton />
  }

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-medium">Erro ao carregar alertas</h3>
            <p className="text-muted-foreground">Não foi possível carregar as notificações</p>
          </div>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  const criticalAlerts = data.filter((n) => n.severity === "critical").length
  const highAlerts = data.filter((n) => n.severity === "high").length
  const totalAlerts = data.length

  return (
    <div className="flex-1 space-y-4 p-3 md:p-8 pt-4 md:pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("notifications.title")}</h2>
            <p className="text-muted-foreground text-sm md:text-base">{t("notifications.subtitle")}</p>
          </div>
        </div>
        <Button onClick={refetch} variant="outline" size="sm" className="hidden md:flex bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("notifications.totalAlerts")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAlerts}</div>
            <p className="text-xs text-muted-foreground">{t("notifications.activeAlerts")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("notifications.critical")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">{t("notifications.immediateAction")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("notifications.highPriority")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{highAlerts}</div>
            <p className="text-xs text-muted-foreground">{t("notifications.attentionNeeded")}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg md:text-xl">{t("notifications.recentAlerts")}</CardTitle>
              <CardDescription className="text-sm">
                Lista de notificações ordenadas por prioridade e data
              </CardDescription>
            </div>
            <Button onClick={refetch} variant="outline" size="sm" className="md:hidden bg-transparent">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {data.map((notification) => {
              const Icon = getNotificationIcon(notification.type)
              const severityColor = getSeverityColor(notification.severity)

              return (
                <div
                  key={notification.id}
                  className="flex items-start space-x-3 md:space-x-4 p-3 md:p-4 border rounded-lg"
                >
                  <div
                    className={`p-2 rounded-full flex-shrink-0 ${
                      notification.severity === "critical"
                        ? "bg-red-100 text-red-600"
                        : notification.severity === "high"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm md:text-base truncate">{notification.product_name}</h4>
                      <Badge variant={severityColor as any} className="flex-shrink-0">
                        {notification.severity === "critical"
                          ? t("severity.critical")
                          : notification.severity === "high"
                            ? t("severity.high")
                            : t("severity.medium")}
                      </Badge>
                    </div>

                    <p className="text-xs md:text-sm text-muted-foreground">
                      SKU: {notification.sku} • {notification.warehouse}
                    </p>

                    <p className="text-sm">{notification.message}</p>

                    <p className="text-xs text-muted-foreground">{formatDate(notification.created_at)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
