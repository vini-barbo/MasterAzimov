"use client"

import { useState } from "react"
import { Play, Package, AlertTriangle, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useApi } from "@/hooks/use-api"
import { recipesApi, productionApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"

export default function ProducaoPage() {
  const { t } = useI18n()
  const { data: recipes, loading } = useApi(() => recipesApi.getAll())
  const { toast } = useToast()

  const [selectedRecipeId, setSelectedRecipeId] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isProducing, setIsProducing] = useState(false)

  const selectedRecipe = recipes?.find((r) => r.id === selectedRecipeId)

  const handleProduce = async () => {
    if (!selectedRecipeId || quantity <= 0) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("production.selectRecipeQuantityError"),
      })
      return
    }

    setIsProducing(true)
    try {
      const production = await productionApi.execute(selectedRecipeId, quantity)
      toast({
        title: t("production.completed"),
        description: `${production.quantity_produced} ${t("common.units")} ${t("production.completedSuccess").replace("{recipeName}", production.recipe_name)}`,
      })

      // Reset form
      setSelectedRecipeId("")
      setQuantity(1)
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("production.error"),
        description: error instanceof Error ? error.message : t("production.errorExecute"),
      })
    } finally {
      setIsProducing(false)
    }
  }

  const calculateIngredientNeeds = () => {
    if (!selectedRecipe) return []
    return selectedRecipe.ingredients.map((ingredient) => ({
      ...ingredient,
      total_needed: ingredient.quantity_needed * quantity,
    }))
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("production.title")}</h2>
          <p className="text-muted-foreground">{t("production.subtitle")}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Production Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t("production.executeProduction")}</CardTitle>
            <CardDescription>{t("production.selectRecipeQuantity")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="recipe">{t("production.recipe")}</Label>
              <Select value={selectedRecipeId} onValueChange={setSelectedRecipeId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("production.selectRecipe")} />
                </SelectTrigger>
                <SelectContent>
                  {recipes?.map((recipe) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name} → {recipe.final_product_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">{t("production.quantityToProduce")}</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                placeholder="1"
              />
            </div>

            {selectedRecipe && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">{t("production.productionSummary")}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>{t("production.finalProduct")}:</span>
                    <span className="font-medium">{selectedRecipe.final_product_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("production.quantity")}:</span>
                    <span className="font-medium">
                      {quantity} {t("common.units")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("production.ingredients")}:</span>
                    <span className="font-medium">
                      {selectedRecipe.ingredients.length} {t("production.types")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleProduce}
              disabled={!selectedRecipeId || quantity <= 0 || isProducing}
              className="w-full"
            >
              {isProducing ? (
                t("production.producing")
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  {t("production.execute")}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Ingredients Preview */}
        <Card>
          <CardHeader>
            <CardTitle>{t("production.ingredientsNeeded")}</CardTitle>
            <CardDescription>
              {selectedRecipe ? t("production.ingredientsConsumed") : t("production.selectRecipeToSee")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedRecipe ? (
              <div className="space-y-3">
                {calculateIngredientNeeds().map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{ingredient.product_name}</div>
                        <div className="text-sm text-muted-foreground">SKU: {ingredient.product_sku}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {ingredient.total_needed} {ingredient.unit}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {ingredient.quantity_needed} × {quantity}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">{t("production.attention")}</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">{t("production.checkStock")}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("production.selectRecipeIngredients")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {recipes && recipes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t("production.noRecipesAvailable")}</h3>
            <p className="text-muted-foreground mb-4">{t("production.createRecipesFirst")}</p>
            <Button asChild>
              <Link href="/receitas">
                <Plus className="h-4 w-4 mr-2" />
                {t("production.viewRecipes")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
