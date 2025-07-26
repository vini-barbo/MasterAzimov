"use client"
import { Package, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { StockPageSkeleton } from "@/components/skeletons/stock-skeleton"
import { useApi } from "@/hooks/use-api"
import { useI18n } from "@/lib/i18n"

// Simulando dados da view vw_stock_on_hand
const stockData = [
  {
    sku: "HAM001",
    product_name: "Hambúrguer Artesanal",
    warehouse: "Cozinha Principal",
    current_stock: 45,
    min_stock: 20,
    unit: "unidades",
  },
  {
    sku: "PAO002",
    product_name: "Pão de Hambúrguer",
    warehouse: "Estoque Seco",
    current_stock: 12,
    min_stock: 30,
    unit: "pacotes",
  },
  {
    sku: "QUE003",
    product_name: "Queijo Cheddar",
    warehouse: "Refrigerador A",
    current_stock: 8,
    min_stock: 15,
    unit: "kg",
  },
  {
    sku: "CAR004",
    product_name: "Carne Bovina 180g",
    warehouse: "Freezer Principal",
    current_stock: 67,
    min_stock: 25,
    unit: "unidades",
  },
  {
    sku: "ALC005",
    product_name: "Alface Americana",
    warehouse: "Refrigerador B",
    current_stock: 23,
    min_stock: 10,
    unit: "maços",
  },
  {
    sku: "TOM006",
    product_name: "Tomate Salada",
    warehouse: "Refrigerador B",
    current_stock: 5,
    min_stock: 12,
    unit: "kg",
  },
]

async function fetchStockData() {
  return stockData
}

function getStockStatus(current: number, min: number) {
  if (current <= min * 0.5) return { status: "critical", color: "destructive", icon: AlertTriangle }
  if (current <= min) return { status: "low", color: "secondary", icon: AlertTriangle }
  return { status: "good", color: "default", icon: CheckCircle }
}

export default function EstoquePage() {
  const { data, loading, error, refetch } = useApi(fetchStockData)
  const { t } = useI18n()

  const translatedStockData =
    data?.map((item) => ({
      ...item,
      product_name: t(
        `products.${
          item.sku.toLowerCase().slice(0, 3) === "ham"
            ? "hamburger"
            : item.sku.toLowerCase().slice(0, 3) === "pao"
              ? "bread"
              : item.sku.toLowerCase().slice(0, 3) === "que"
                ? "cheese"
                : item.sku.toLowerCase().slice(0, 3) === "car"
                  ? "beef"
                  : item.sku.toLowerCase().slice(0, 3) === "alc"
                    ? "lettuce"
                    : "tomato"
        }`,
      ),
      warehouse: t(
        `warehouse.${
          item.warehouse.toLowerCase().includes("cozinha")
            ? "mainKitchen"
            : item.warehouse.toLowerCase().includes("seco")
              ? "dryStorage"
              : item.warehouse.toLowerCase().includes("refrigerador a")
                ? "refrigeratorA"
                : item.warehouse.toLowerCase().includes("refrigerador b")
                  ? "refrigeratorB"
                  : "mainFreezer"
        }`,
      ),
    })) || []

  if (loading) {
    return <StockPageSkeleton />
  }

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-medium">Erro ao carregar dados</h3>
            <p className="text-muted-foreground">Não foi possível carregar os dados do estoque</p>
          </div>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  const totalProducts = data.length
  const lowStockItems = data.filter((item) => item.current_stock <= item.min_stock).length
  const criticalItems = data.filter((item) => item.current_stock <= item.min_stock * 0.5).length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("stock.title")}</h2>
            <p className="text-muted-foreground">{t("stock.subtitle")}</p>
          </div>
        </div>
        <Button onClick={refetch} variant="outline" size="sm" className="hidden md:flex bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("common.refresh")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stock.totalProducts")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">{t("stock.productsRegistered")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stock.lowStock")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">{t("stock.belowMinimum")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stock.critical")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
            <p className="text-xs text-muted-foreground">{t("stock.criticalSituation")}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("stock.productsInStock")}</CardTitle>
              <CardDescription>{t("stock.completeList")}</CardDescription>
            </div>
            <Button onClick={refetch} variant="outline" size="sm" className="md:hidden bg-transparent">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile view */}
          <div className="md:hidden space-y-4">
            {translatedStockData.map((item) => {
              const stockStatus = getStockStatus(item.current_stock, item.min_stock)
              const StatusIcon = stockStatus.icon

              return (
                <Card key={item.sku}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{item.product_name}</h4>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      </div>
                      <Badge variant={stockStatus.color as any}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {stockStatus.status === "critical"
                          ? t("status.critical")
                          : stockStatus.status === "low"
                            ? t("status.low")
                            : t("status.normal")}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Armazém</p>
                        <p className="font-medium">{item.warehouse}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Estoque</p>
                        <p className="font-medium">
                          {item.current_stock} / {item.min_stock} {item.unit}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Desktop view */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.sku")}</TableHead>
                  <TableHead>{t("table.product")}</TableHead>
                  <TableHead>{t("table.warehouse")}</TableHead>
                  <TableHead>{t("table.currentStock")}</TableHead>
                  <TableHead>{t("table.minStock")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {translatedStockData.map((item) => {
                  const stockStatus = getStockStatus(item.current_stock, item.min_stock)
                  const StatusIcon = stockStatus.icon

                  return (
                    <TableRow key={item.sku}>
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.warehouse}</TableCell>
                      <TableCell>
                        <span className="font-medium">{item.current_stock}</span>
                        <span className="text-muted-foreground"> {item.unit}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">{item.min_stock}</span>
                        <span className="text-muted-foreground"> {item.unit}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.color as any}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {stockStatus.status === "critical"
                            ? t("status.critical")
                            : stockStatus.status === "low"
                              ? t("status.low")
                              : t("status.normal")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
