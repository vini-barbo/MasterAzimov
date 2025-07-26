"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState } from "react"
import { Plus, Users, Mail, Phone, MapPin, Edit, RefreshCw, LayoutGrid, List } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useApi } from "@/hooks/use-api"
import { suppliersApi } from "@/lib/api"
import type { Supplier } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/lib/i18n"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function FornecedoresPage() {
  const { t } = useI18n()
  const { data: suppliers, loading, refetch } = useApi(() => suppliersApi.getAll())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingSupplier) {
        await suppliersApi.update(editingSupplier.id, formData)
        toast({
          title: t("suppliers.updated"),
          description: t("suppliers.updateSuccess"),
        })
      } else {
        await suppliersApi.create(formData)
        toast({
          title: t("suppliers.created"),
          description: t("suppliers.createSuccess"),
        })
      }

      setIsDialogOpen(false)
      setEditingSupplier(null)
      setFormData({ name: "", email: "", phone: "", address: "" })
      refetch()
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("suppliers.errorSave"),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
    })
    setIsDialogOpen(true)
  }

  const handleNewSupplier = () => {
    setEditingSupplier(null)
    setFormData({ name: "", email: "", phone: "", address: "" })
    setIsDialogOpen(true)
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("suppliers.title")}</h2>
            <p className="text-muted-foreground">{t("suppliers.subtitle")}</p>
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewSupplier}>
                <Plus className="h-4 w-4 mr-2" />
                {t("suppliers.newSupplier")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSupplier ? t("suppliers.editSupplier") : t("suppliers.newSupplier")}</DialogTitle>
                <DialogDescription>
                  {editingSupplier ? t("suppliers.updateInfo") : t("suppliers.addNew")}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t("suppliers.companyName")}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("placeholder.companyName")}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t("suppliers.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t("placeholder.email")}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t("suppliers.phone")}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t("placeholder.phone")}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">{t("suppliers.address")}</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder={t("placeholder.address")}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t("actions.cancel")}
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t("actions.saving") : editingSupplier ? t("common.update") : t("actions.create")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === "cards" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {suppliers?.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(supplier)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="line-clamp-2">{supplier.address}</span>
                </div>
                <div className="text-xs text-muted-foreground pt-2">
                  {t("suppliers.registeredOn")} {new Date(supplier.created_at).toLocaleDateString("pt-BR")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("suppliers.companyName")}</TableHead>
                  <TableHead>{t("suppliers.email")}</TableHead>
                  <TableHead>{t("suppliers.phone")}</TableHead>
                  <TableHead>{t("suppliers.address")}</TableHead>
                  <TableHead>{t("suppliers.registeredOn")}</TableHead>
                  <TableHead className="w-[100px]">{t("actions.edit")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers?.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{supplier.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{supplier.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{supplier.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="max-w-xs truncate">{supplier.address}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(supplier.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(supplier)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {suppliers && suppliers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">{t("suppliers.noSuppliers")}</h3>
          <p className="text-muted-foreground mb-4">{t("suppliers.startAdding")}</p>
          <Button onClick={handleNewSupplier}>
            <Plus className="h-4 w-4 mr-2" />
            {t("suppliers.addSupplier")}
          </Button>
        </div>
      )}
    </div>
  )
}
