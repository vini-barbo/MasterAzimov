"use client"
import { Plus, ChefHat, RefreshCw, Eye, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useApi } from "@/hooks/use-api"
import { recipesApi } from "@/lib/api"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LayoutGrid, List } from "lucide-react"
import { useState } from "react"

export default function ReceitasPage() {
  const { t, language } = useI18n()
  const { data: recipes, loading, refetch } = useApi(() => recipesApi.getAll())
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

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
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
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
            <h2 className="text-3xl font-bold tracking-tight">{t("recipes.title")}</h2>
            <p className="text-muted-foreground">{t("recipes.subtitle")}</p>
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
            <Link href="/nova-receita">
              <Plus className="h-4 w-4 mr-2" />
              {t("recipes.newRecipe")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === "cards" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recipes?.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ChefHat className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{recipe.name}</CardTitle>
                  </div>
                  <Badge variant="outline">
                    <Package className="h-3 w-3 mr-1" />
                    {recipe.yield_quantity}
                  </Badge>
                </div>
                <CardDescription>
                  {t("recipes.product")}: {recipe.final_product_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    {t("recipes.ingredients")} ({recipe.ingredients.length})
                  </h4>
                  <div className="space-y-1">
                    {recipe.ingredients.slice(0, 3).map((ingredient) => (
                      <div key={ingredient.id} className="flex justify-between text-sm">
                        <span className="truncate">{ingredient.product_name}</span>
                        <span className="text-muted-foreground">
                          {ingredient.quantity_needed} {ingredient.unit}
                        </span>
                      </div>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <div className="text-sm text-muted-foreground">
                        +{recipe.ingredients.length - 3} {t("recipes.more")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-muted-foreground">
                    {t("recipes.createdOn")}{" "}
                    {new Date(recipe.created_at).toLocaleDateString(language === "pt" ? "pt-BR" : "en-US")}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/receitas/${recipe.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      {t("recipes.viewDetails")}
                    </Link>
                  </Button>
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
                  <TableHead>{t("recipes.title")}</TableHead>
                  <TableHead>{t("recipes.product")}</TableHead>
                  <TableHead>{t("newRecipe.yield")}</TableHead>
                  <TableHead>{t("recipes.ingredients")}</TableHead>
                  <TableHead>{t("recipes.createdOn")}</TableHead>
                  <TableHead className="w-[120px]">{t("actions.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipes?.map((recipe) => (
                  <TableRow key={recipe.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <ChefHat className="h-4 w-4 text-primary" />
                        <span>{recipe.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{recipe.final_product_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        <Package className="h-3 w-3 mr-1" />
                        {recipe.yield_quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {recipe.ingredients.length} {t("recipes.ingredients")}
                        <div className="text-muted-foreground">
                          {recipe.ingredients.slice(0, 2).map((ing, idx) => (
                            <span key={ing.id}>
                              {ing.product_name}
                              {idx < Math.min(1, recipe.ingredients.length - 1) && ", "}
                            </span>
                          ))}
                          {recipe.ingredients.length > 2 && ` +${recipe.ingredients.length - 2} ${t("recipes.more")}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(recipe.created_at).toLocaleDateString(language === "pt" ? "pt-BR" : "en-US")}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/receitas/${recipe.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          {t("recipes.viewDetails")}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {recipes && recipes.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">{t("recipes.noRecipes")}</h3>
          <p className="text-muted-foreground mb-4">{t("recipes.startCreating")}</p>
          <Button asChild>
            <Link href="/nova-receita">
              <Plus className="h-4 w-4 mr-2" />
              {t("recipes.createRecipe")}
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
