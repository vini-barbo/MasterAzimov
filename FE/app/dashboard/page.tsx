"use client"

import { TrendingUp, DollarSign, Package, Award, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardPageSkeleton } from "@/components/skeletons/dashboard-skeleton"
import { useApi } from "@/hooks/use-api"
import { AlertTriangle } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { dashboardApi } from "@/lib/dashboard-stock-notifications-api"

function getTrendIcon(trend: string) {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-green-500" />
    case "down":
      return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    default:
      return <div className="h-4 w-4 bg-gray-400 rounded-full" />
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export default function DashboardPage() {
  const { data, loading, error, refetch } = useApi(() => dashboardApi.getTopSellingProducts())
  const { t } = useI18n()

  if (loading) {
    return <DashboardPageSkeleton />
  }

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-medium">Erro ao carregar dashboard</h3>
            <p className="text-muted-foreground">Não foi possível carregar os dados de vendas</p>
          </div>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  const totalRevenue = data.reduce((sum, product) => sum + product.total_revenue, 0)
  const totalQuantitySold = data.reduce((sum, product) => sum + product.total_quantity_sold, 0)
  const topProduct = data[0]
  const maxQuantity = Math.max(...data.map((p) => p.total_quantity_sold))

  return (
    <div className="flex-1 space-y-4 p-3 md:p-8 pt-4 md:pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("dashboard.title")}</h2>
            <p className="text-muted-foreground text-sm md:text-base">{t("dashboard.subtitle")}</p>
          </div>
        </div>
        <Button onClick={refetch} variant="outline" size="sm" className="hidden md:flex bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">{t("dashboard.totalRevenue")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">{t("dashboard.featuredProducts")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">{t("dashboard.unitsSold")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{totalQuantitySold.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t("dashboard.totalProductsSold")}</p>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">{t("dashboard.topProduct")}</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold truncate">{topProduct?.product_name || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              {topProduct?.total_quantity_sold || 0} {t("dashboard.unitsSoldCount")}
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">{t("dashboard.averageTicket")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{formatCurrency(totalRevenue / totalQuantitySold || 0)}</div>
            <p className="text-xs text-muted-foreground">{t("dashboard.averageValue")}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg md:text-xl">Ranking de Produtos Mais Vendidos</CardTitle>
              <CardDescription className="text-sm">
                Top produtos por quantidade vendida e receita gerada
              </CardDescription>
            </div>
            <Button onClick={refetch} variant="outline" size="sm" className="md:hidden bg-transparent">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 md:space-y-6">
            {data.map((product) => (
              <div key={product.sku} className="flex items-center space-x-3 md:space-x-4">
                <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary text-primary-foreground text-xs md:text-sm font-bold flex-shrink-0">
                  {product.rank}
                </div>

                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-medium text-sm md:text-base truncate">{product.product_name}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {getTrendIcon(product.sales_trend)}
                      <Badge variant="outline" className="text-xs">
                        {product.sales_trend === "up"
                          ? t("trend.rising")
                          : product.sales_trend === "down"
                            ? t("trend.falling")
                            : t("trend.stable")}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
                    <div>
                      <p className="text-muted-foreground">Quantidade</p>
                      <p className="font-medium">{product.total_quantity_sold} unidades</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Receita</p>
                      <p className="font-medium">{formatCurrency(product.total_revenue)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Preço Médio</p>
                      <p className="font-medium">{formatCurrency(product.avg_price)}</p>
                    </div>
                  </div>

                  <Progress value={(product.total_quantity_sold / maxQuantity) * 100} className="h-1.5 md:h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
