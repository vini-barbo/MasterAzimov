"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useApi } from "@/hooks/use-api"
import { recipesApi, productionApi } from "@/lib/api"
import { api } from "@/lib/api/index"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { RecipeIngredient } from "@/lib/types"
import { useI18n } from "@/lib/i18n"

export default function NovaReceitaPage() {
  const { data: recipesData, loading: loadingRecipes } = useApi(() => recipesApi.getAll())
  const { data: productsData, loading: loadingProducts } = useApi(() => api.products.getAll())
  const products = Array.isArray(productsData) ? productsData : []
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useI18n()

  const [recipeName, setRecipeName] = useState("")
  const [finalProductSku, setFinalProductSku] = useState("")
  const [yieldQuantity, setYieldQuantity] = useState(1)
  const [ingredients, setIngredients] = useState<Omit<RecipeIngredient, "id">[]>([
    {
      product_sku: "",
      product_name: "",
      quantity_needed: 0,
      unit: "",
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        product_sku: "",
        product_name: "",
        quantity_needed: 0,
        unit: "",
      },
    ])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, field: string, value: any) => {
    const updatedIngredients = [...ingredients]
    if (field === "product_sku") {
      const product = products.find((p) => p.sku === value)
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        product_sku: value,
        product_name: product?.name || "",
        unit: "kg",
      }
    } else {
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [field]: value,
      }
    }
    setIngredients(updatedIngredients)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipeName || !finalProductSku) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("newRecipe.fillNameProduct"),
      })
      return
    }

    const validIngredients = ingredients.filter((ing) => ing.product_sku && ing.quantity_needed > 0)
    if (validIngredients.length === 0) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("newRecipe.addValidIngredient"),
      })
      return
    }

    setIsSubmitting(true)
    try {
      const finalProduct = products.find((p) => p.sku === finalProductSku)
      const recipeIngredients: RecipeIngredient[] = validIngredients.map((ing, index) => ({
        id: (index + 1).toString(),
        ...ing,
      }))

      await recipesApi.create({
        name: recipeName,
        final_product_sku: finalProductSku,
        final_product_name: finalProduct?.name || "",
        yield_quantity: yieldQuantity,
        ingredients: recipeIngredients,
      })

      toast({
        title: t("newRecipe.recipeCreated"),
        description: t("newRecipe.recipeCreatedSuccess"),
      })

      router.push("/receitas")
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("newRecipe.errorCreate"),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/receitas">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("actions.back")}
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("newRecipe.title")}</h2>
          <p className="text-muted-foreground">{t("newRecipe.subtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipe Info */}
        <Card>
          <CardHeader>
            <CardTitle>{t("newRecipe.recipeInfo")}</CardTitle>
            <CardDescription>{t("newRecipe.defineNameProduct")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="recipeName">{t("newRecipe.recipeName")}</Label>
              <Input
                id="recipeName"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder={t("newRecipe.recipeNamePlaceholder")}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="finalProduct">{t("newRecipe.finalProduct")}</Label>
                <Select value={finalProductSku} onValueChange={setFinalProductSku} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t("newRecipe.selectFinalProduct")} />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.sku} value={product.sku}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="yield">{t("newRecipe.yield")}</Label>
                <Input
                  id="yield"
                  type="number"
                  min="1"
                  value={yieldQuantity}
                  onChange={(e) => setYieldQuantity(Number.parseInt(e.target.value) || 1)}
                  placeholder="1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("newRecipe.ingredients")}</CardTitle>
                <CardDescription>{t("newRecipe.addIngredients")}</CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addIngredient}>
                <Plus className="h-4 w-4 mr-2" />
                {t("newRecipe.addIngredient")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>{t("newRecipe.product")}</Label>
                  <Select
                    value={ingredient.product_sku}
                    onValueChange={(value: string) => updateIngredient(index, "product_sku", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("newRecipe.selectProduct")} />
                    </SelectTrigger>
                    <SelectContent>
                      {products
                        .filter((p) => p.sku !== finalProductSku)
                        .map((product) => (
                          <SelectItem key={product.sku} value={product.sku}>
                            {product.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t("newRecipe.quantity")}</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={ingredient.quantity_needed || ""}
                    onChange={(e) => updateIngredient(index, "quantity_needed", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label>{t("newRecipe.unit")}</Label>
                  <div className="h-10 flex items-center px-3 bg-muted rounded-md text-sm">
                    {ingredient.unit || t("newRecipe.selectProductUnit")}
                  </div>
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredients.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" asChild>
            <Link href="/receitas">{t("newRecipe.cancel")}</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              t("newRecipe.creating")
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t("newRecipe.createRecipe")}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
