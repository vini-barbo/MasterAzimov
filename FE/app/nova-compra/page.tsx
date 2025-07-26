"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useApi } from "@/hooks/use-api"
import { suppliersApi, purchaseOrdersApi } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { PurchaseOrderItem } from "@/lib/types"
import { useI18n } from "@/lib/i18n"

// Mock products for selection
const mockProducts = [
  { sku: "HAM001", name: "Hambúrguer Artesanal", unit: "unidades" },
  { sku: "PAO002", name: "Pão de Hambúrguer", unit: "pacotes" },
  { sku: "QUE003", name: "Queijo Cheddar", unit: "kg" },
  { sku: "CAR004", name: "Carne Bovina 180g", unit: "unidades" },
  { sku: "ALC005", name: "Alface Americana", unit: "maços" },
  { sku: "TOM006", name: "Tomate Salada", unit: "kg" },
]

export default function NovaCompraPage() {
  const { data: suppliers, loading: loadingSuppliers } = useApi(() => suppliersApi.getAll())
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useI18n()

  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [items, setItems] = useState<Omit<PurchaseOrderItem, "id" | "total_price">[]>([
    {
      product_sku: "",
      product_name: "",
      quantity: 0,
      unit_price: 0,
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addItem = () => {
    setItems([
      ...items,
      {
        product_sku: "",
        product_name: "",
        quantity: 0,
        unit_price: 0,
      },
    ])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...items]
    if (field === "product_sku") {
      const product = mockProducts.find((p) => p.sku === value)
      updatedItems[index] = {
        ...updatedItems[index],
        product_sku: value,
        product_name: product?.name || "",
      }
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      }
    }
    setItems(updatedItems)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSupplier) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("newPurchase.selectSupplierError"),
      })
      return
    }

    const validItems = items.filter((item) => item.product_sku && item.quantity > 0 && item.unit_price > 0)
    if (validItems.length === 0) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("newPurchase.addValidItemError"),
      })
      return
    }

    setIsSubmitting(true)
    try {
      const supplier = suppliers?.find((s) => s.id === selectedSupplier)
      const orderItems: PurchaseOrderItem[] = validItems.map((item, index) => ({
        id: (index + 1).toString(),
        ...item,
        total_price: item.quantity * item.unit_price,
      }))

      await purchaseOrdersApi.create({
        supplier_id: selectedSupplier,
        supplier_name: supplier?.name || "",
        status: "pending",
        total_amount: calculateTotal(),
        items: orderItems,
      })

      toast({
        title: t("newPurchase.orderCreated"),
        description: t("newPurchase.orderCreatedSuccess"),
      })

      router.push("/pedidos-compra")
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("newPurchase.errorCreate"),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/pedidos-compra">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("actions.back")}
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("newPurchase.title")}</h2>
          <p className="text-muted-foreground">{t("newPurchase.subtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier Selection */}
        <Card>
          <CardHeader>
            <CardTitle>{t("newPurchase.supplier")}</CardTitle>
            <CardDescription>{t("newPurchase.supplierDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="supplier">{t("newPurchase.supplier")}</Label>
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier} required>
                <SelectTrigger>
                  <SelectValue placeholder={t("newPurchase.selectSupplier")} />
                </SelectTrigger>
                <SelectContent>
                  {suppliers?.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("newPurchase.orderItems")}</CardTitle>
                <CardDescription>{t("newPurchase.addProducts")}</CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                {t("newPurchase.addItem")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>{t("newPurchase.product")}</Label>
                  <Select value={item.product_sku} onValueChange={(value) => updateItem(index, "product_sku", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("newPurchase.selectProduct")} />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((product) => (
                        <SelectItem key={product.sku} value={product.sku}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t("newPurchase.quantity")}</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity || ""}
                    onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 0)}
                    placeholder={t("placeholder.quantity")}
                  />
                </div>

                <div>
                  <Label>{t("newPurchase.unitPrice")}</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price || ""}
                    onChange={(e) => updateItem(index, "unit_price", Number.parseFloat(e.target.value) || 0)}
                    placeholder={t("placeholder.price")}
                  />
                </div>

                <div>
                  <Label>{t("newPurchase.total")}</Label>
                  <div className="h-10 flex items-center px-3 bg-muted rounded-md">
                    {formatCurrency(item.quantity * item.unit_price)}
                  </div>
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4 border-t">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">{t("newPurchase.orderTotal")}</div>
                <div className="text-2xl font-bold">{formatCurrency(calculateTotal())}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" asChild>
            <Link href="/pedidos-compra">{t("newPurchase.cancel")}</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              t("newPurchase.creating")
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t("newPurchase.createOrder")}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
