"use client"

import { useState } from "react"
import { Plus, ShoppingCart, RefreshCw, Eye, Package, CheckCircle, Clock, X, LayoutGrid, List } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useApi } from "@/hooks/use-api"
import { purchaseOrdersApi } from "@/lib/api"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/lib/i18n"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "secondary"
    case "received":
      return "default"
    case "cancelled":
      return "destructive"
    default:
      return "outline"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "pending":
      return Clock
    case "received":
      return CheckCircle
    case "cancelled":
      return X
    default:
      return Package
  }
}

function getStatusText(status: string, t: any) {
  switch (status) {
    case "pending":
      return t("status.pending")
    case "received":
      return t("status.received")
    case "cancelled":
      return t("status.cancelled")
    default:
      return status
  }
}

export default function PedidosCompraPage() {
  const { data: orders, loading, refetch } = useApi(() => purchaseOrdersApi.getAll())
  const { toast } = useToast()
  const { t, language } = useI18n()
  const [processingOrder, setProcessingOrder] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  const handleMarkAsReceived = async (orderId: string) => {
    setProcessingOrder(orderId)
    try {
      await purchaseOrdersApi.markAsReceived(orderId)
      toast({
        title: t("purchaseOrders.received"),
        description: t("purchaseOrders.receivedSuccess"),
      })
      refetch()
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("purchaseOrders.errorReceive"),
      })
    } finally {
      setProcessingOrder(null)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <div>
              <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  const pendingOrders = orders?.filter((order) => order.status === "pending").length || 0
  const receivedOrders = orders?.filter((order) => order.status === "received").length || 0
  const totalValue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("purchaseOrders.title")}</h2>
            <p className="text-muted-foreground">{t("purchaseOrders.subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("common.refresh")}
          </Button>
          <Button asChild>
            <Link href="/nova-compra">
              <Plus className="h-4 w-4 mr-2" />
              {t("purchaseOrders.newPurchase")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("purchaseOrders.pendingOrders")}</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">{t("purchaseOrders.awaitingReceipt")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("purchaseOrders.receivedOrders")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{receivedOrders}</div>
            <p className="text-xs text-muted-foreground">{t("purchaseOrders.alreadyReceived")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("purchaseOrders.totalValue")}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">{t("purchaseOrders.allOrders")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      {viewMode === "cards" && (
        <div className="space-y-4">
          {orders?.map((order) => {
            const StatusIcon = getStatusIcon(order.status)
            const statusText = getStatusText(order.status, t)
            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <StatusIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <CardTitle className="text-lg">
                          {t("purchaseOrders.order")} #{order.id}
                        </CardTitle>
                        <CardDescription>{order.supplier_name}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(order.status) as any}>{statusText}</Badge>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(order.total_amount)}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        {order.items.length} {t("purchaseOrders.items")} •{" "}
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} {t("purchaseOrders.units")}
                      </div>
                      {order.received_at && (
                        <div className="text-sm text-green-600">
                          {t("purchaseOrders.receivedOn")}{" "}
                          {new Date(order.received_at).toLocaleDateString(language === "pt" ? "pt-BR" : "en-US")}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/pedidos-compra/${order.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          {t("purchaseOrders.details")}
                        </Link>
                      </Button>
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsReceived(order.id)}
                          disabled={processingOrder === order.id}
                        >
                          {processingOrder === order.id ? (
                            t("purchaseOrders.processing")
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {t("purchaseOrders.markAsReceived")}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("purchaseOrders.order")}</TableHead>
                  <TableHead>{t("suppliers.companyName")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead>{t("purchaseOrders.totalValue")}</TableHead>
                  <TableHead>{t("purchaseOrders.items")}</TableHead>
                  <TableHead>{t("common.date")}</TableHead>
                  <TableHead className="w-[200px]">{t("actions.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => {
                  const StatusIcon = getStatusIcon(order.status)
                  const statusText = getStatusText(order.status, t)
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="h-4 w-4 text-muted-foreground" />
                          <span>#{order.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>{order.supplier_name}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status) as any}>{statusText}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(order.total_amount)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.items.length} {t("purchaseOrders.items")}
                          <br />
                          <span className="text-muted-foreground">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} {t("purchaseOrders.units")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(order.created_at).toLocaleDateString("pt-BR")}
                          {order.received_at && (
                            <div className="text-green-600">
                              {t("purchaseOrders.receivedOn")}{" "}
                              {new Date(order.received_at).toLocaleDateString(language === "pt" ? "pt-BR" : "en-US")}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/pedidos-compra/${order.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              {t("purchaseOrders.details")}
                            </Link>
                          </Button>
                          {order.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkAsReceived(order.id)}
                              disabled={processingOrder === order.id}
                            >
                              {processingOrder === order.id ? (
                                t("purchaseOrders.processing")
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  {t("purchaseOrders.markAsReceived")}
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {orders && orders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">{t("purchaseOrders.noPurchases")}</h3>
          <p className="text-muted-foreground mb-4">{t("purchaseOrders.startCreating")}</p>
          <Button asChild>
            <Link href="/nova-compra">
              <Plus className="h-4 w-4 mr-2" />
              {t("purchaseOrders.newPurchase")}
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
