"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Language = "pt" | "en"

interface Translations {
  [key: string]: {
    pt: string
    en: string
  }
}

const translations: Translations = {
  // Navigation
  "nav.stock": { pt: "Estoque Atual", en: "Current Stock" },
  "nav.alerts": { pt: "Alertas", en: "Alerts" },
  "nav.dashboard": { pt: "Dashboard", en: "Dashboard" },
  "nav.login": { pt: "Login", en: "Login" },

  // Common
  "common.loading": { pt: "Carregando", en: "Loading" },
  "common.error": { pt: "Erro", en: "Error" },
  "common.refresh": { pt: "Atualizar", en: "Refresh" },
  "common.tryAgain": { pt: "Tentar novamente", en: "Try again" },
  "common.update": { pt: "Atualizar", en: "Update" },
  "common.units": { pt: "unidades", en: "units" },
  "common.packages": { pt: "pacotes", en: "packages" },
  "common.kg": { pt: "kg", en: "kg" },
  "common.bunches": { pt: "maços", en: "bunches" },
  "common.date": { pt: "Data", en: "Date" },

  // App Title
  "app.title": { pt: "Sistema de Gerenciamento de Estoque", en: "Inventory Management System" },
  "app.subtitle": { pt: "Sistema de Estoque", en: "Stock System" },
  "app.name": { pt: "StockManager", en: "StockManager" },

  // Stock Page
  "stock.title": { pt: "Estoque Atual", en: "Current Stock" },
  "stock.subtitle": { pt: "Monitore seus produtos em tempo real", en: "Monitor your products in real time" },
  "stock.totalProducts": { pt: "Total de Produtos", en: "Total Products" },
  "stock.productsRegistered": { pt: "Produtos cadastrados", en: "Registered products" },
  "stock.lowStock": { pt: "Estoque Baixo", en: "Low Stock" },
  "stock.belowMinimum": { pt: "Produtos abaixo do mínimo", en: "Products below minimum" },
  "stock.critical": { pt: "Crítico", en: "Critical" },
  "stock.criticalSituation": { pt: "Produtos em situação crítica", en: "Products in critical situation" },
  "stock.productsInStock": { pt: "Produtos em Estoque", en: "Products in Stock" },
  "stock.completeList": {
    pt: "Lista completa de produtos com seus respectivos níveis de estoque",
    en: "Complete list of products with their respective stock levels",
  },
  "stock.loadingStock": { pt: "Carregando estoque", en: "Loading stock" },
  "stock.errorLoading": { pt: "Erro ao carregar dados", en: "Error loading data" },
  "stock.couldNotLoad": { pt: "Não foi possível carregar os dados do estoque", en: "Could not load stock data" },

  // Table Headers
  "table.sku": { pt: "SKU", en: "SKU" },
  "table.product": { pt: "Produto", en: "Product" },
  "table.warehouse": { pt: "Armazém", en: "Warehouse" },
  "table.currentStock": { pt: "Estoque Atual", en: "Current Stock" },
  "table.minimumStock": { pt: "Estoque Mínimo", en: "Minimum Stock" },
  "table.status": { pt: "Status", en: "Status" },

  // Status
  "status.normal": { pt: "Normal", en: "Normal" },
  "status.low": { pt: "Baixo", en: "Low" },
  "status.critical": { pt: "Crítico", en: "Critical" },

  // Notifications Page
  "notifications.title": { pt: "Alertas e Notificações", en: "Alerts and Notifications" },
  "notifications.subtitle": {
    pt: "Monitore alertas críticos do seu estoque",
    en: "Monitor critical alerts from your stock",
  },
  "notifications.totalAlerts": { pt: "Total de Alertas", en: "Total Alerts" },
  "notifications.activeAlerts": { pt: "Alertas ativos", en: "Active alerts" },
  "notifications.critical": { pt: "Críticos", en: "Critical" },
  "notifications.immediateAction": { pt: "Requerem ação imediata", en: "Require immediate action" },
  "notifications.highPriority": { pt: "Alta Prioridade", en: "High Priority" },
  "notifications.attentionNeeded": { pt: "Atenção necessária", en: "Attention needed" },
  "notifications.recentAlerts": { pt: "Alertas Recentes", en: "Recent Alerts" },
  "notifications.orderedList": {
    pt: "Lista de notificações ordenadas por prioridade e data",
    en: "List of notifications ordered by priority and date",
  },
  "notifications.loadingAlerts": { pt: "Carregando alertas", en: "Loading alerts" },
  "notifications.errorLoading": { pt: "Erro ao carregar alertas", en: "Error loading alerts" },
  "notifications.couldNotLoad": { pt: "Não foi possível carregar as notificações", en: "Could not load notifications" },

  // Alert Severity
  "severity.critical": { pt: "Crítico", en: "Critical" },
  "severity.high": { pt: "Alto", en: "High" },
  "severity.medium": { pt: "Médio", en: "Medium" },

  // Dashboard Page
  "dashboard.title": { pt: "Dashboard de Vendas", en: "Sales Dashboard" },
  "dashboard.subtitle": {
    pt: "Acompanhe o desempenho dos seus produtos mais vendidos",
    en: "Track the performance of your best-selling products",
  },
  "dashboard.totalRevenue": { pt: "Receita Total", en: "Total Revenue" },
  "dashboard.featuredProducts": { pt: "Dos produtos em destaque", en: "From featured products" },
  "dashboard.unitsSold": { pt: "Unidades Vendidas", en: "Units Sold" },
  "dashboard.totalProductsSold": { pt: "Total de produtos vendidos", en: "Total products sold" },
  "dashboard.topProduct": { pt: "Produto Top", en: "Top Product" },
  "dashboard.unitsSoldCount": { pt: "unidades vendidas", en: "units sold" },
  "dashboard.averageTicket": { pt: "Ticket Médio", en: "Average Ticket" },
  "dashboard.averageValue": { pt: "Valor médio por produto", en: "Average value per product" },
  "dashboard.topSellingRanking": { pt: "Ranking de Produtos Mais Vendidos", en: "Top Selling Products Ranking" },
  "dashboard.topProductsByQuantity": {
    pt: "Top produtos por quantidade vendida e receita gerada",
    en: "Top products by quantity sold and revenue generated",
  },
  "dashboard.loadingDashboard": { pt: "Carregando dashboard", en: "Loading dashboard" },
  "dashboard.errorLoading": { pt: "Erro ao carregar dashboard", en: "Error loading dashboard" },
  "dashboard.couldNotLoad": { pt: "Não foi possível carregar os dados de vendas", en: "Could not load sales data" },

  // Product Details
  "product.quantity": { pt: "Quantidade", en: "Quantity" },
  "product.revenue": { pt: "Receita", en: "Revenue" },
  "product.averagePrice": { pt: "Preço Médio", en: "Average Price" },

  // Trends
  "trend.rising": { pt: "Em alta", en: "Rising" },
  "trend.falling": { pt: "Em queda", en: "Falling" },
  "trend.stable": { pt: "Estável", en: "Stable" },

  // Login Page
  "login.title": { pt: "Fazer Login", en: "Sign In" },
  "login.subtitle": {
    pt: "Entre com suas credenciais para acessar o sistema",
    en: "Enter your credentials to access the system",
  },
  "login.email": { pt: "Email", en: "Email" },
  "login.password": { pt: "Senha", en: "Password" },
  "login.signIn": { pt: "Entrar no Sistema", en: "Sign In to System" },
  "login.forgotPassword": { pt: "Esqueceu sua senha?", en: "Forgot your password?" },

  // Error Messages
  "error.connectionError": { pt: "Erro de conexão com o servidor", en: "Server connection error" },
  "error.unknownError": { pt: "Erro desconhecido", en: "Unknown error" },
  "error.loadingData": { pt: "Erro ao carregar dados", en: "Error loading data" },

  // Products (for demo data)
  "products.hamburger": { pt: "Hambúrguer Artesanal", en: "Artisan Burger" },
  "products.bread": { pt: "Pão de Hambúrguer", en: "Burger Bun" },
  "products.cheese": { pt: "Queijo Cheddar", en: "Cheddar Cheese" },
  "products.beef": { pt: "Carne Bovina 180g", en: "Beef 180g" },
  "products.lettuce": { pt: "Alface Americana", en: "Iceberg Lettuce" },
  "products.tomato": { pt: "Tomate Salada", en: "Salad Tomato" },

  // Warehouses
  "warehouse.mainKitchen": { pt: "Cozinha Principal", en: "Main Kitchen" },
  "warehouse.dryStorage": { pt: "Estoque Seco", en: "Dry Storage" },
  "warehouse.refrigeratorA": { pt: "Refrigerador A", en: "Refrigerator A" },
  "warehouse.refrigeratorB": { pt: "Refrigerador B", en: "Refrigerator B" },
  "warehouse.mainFreezer": { pt: "Freezer Principal", en: "Main Freezer" },

  // Language Selector
  "language.portuguese": { pt: "Português", en: "Portuguese" },
  "language.english": { pt: "Inglês", en: "English" },
  "language.changeLanguage": { pt: "Alterar idioma", en: "Change language" },

  // Suppliers
  "suppliers.title": { pt: "Fornecedores", en: "Suppliers" },
  "suppliers.subtitle": { pt: "Gerencie seus fornecedores e contatos", en: "Manage your suppliers and contacts" },
  "suppliers.newSupplier": { pt: "Novo Fornecedor", en: "New Supplier" },
  "suppliers.editSupplier": { pt: "Editar Fornecedor", en: "Edit Supplier" },
  "suppliers.addSupplier": { pt: "Adicionar Fornecedor", en: "Add Supplier" },
  "suppliers.companyName": { pt: "Nome da Empresa", en: "Company Name" },
  "suppliers.email": { pt: "Email", en: "Email" },
  "suppliers.phone": { pt: "Telefone", en: "Phone" },
  "suppliers.address": { pt: "Endereço", en: "Address" },
  "suppliers.registeredOn": { pt: "Cadastrado em", en: "Registered on" },
  "suppliers.noSuppliers": { pt: "Nenhum fornecedor cadastrado", en: "No suppliers registered" },
  "suppliers.startAdding": {
    pt: "Comece adicionando seu primeiro fornecedor",
    en: "Start by adding your first supplier",
  },
  "suppliers.created": { pt: "Fornecedor criado", en: "Supplier created" },
  "suppliers.updated": { pt: "Fornecedor atualizado", en: "Supplier updated" },
  "suppliers.createSuccess": { pt: "Novo fornecedor adicionado com sucesso!", en: "New supplier added successfully!" },
  "suppliers.updateSuccess": { pt: "Fornecedor atualizado com sucesso!", en: "Supplier updated successfully!" },
  "suppliers.updateInfo": { pt: "Atualize as informações do fornecedor", en: "Update supplier information" },
  "suppliers.addNew": { pt: "Adicione um novo fornecedor ao sistema", en: "Add a new supplier to the system" },
  "suppliers.errorSave": { pt: "Não foi possível salvar o fornecedor", en: "Could not save supplier" },

  // Purchase Orders
  "purchaseOrders.title": { pt: "Pedidos de Compra", en: "Purchase Orders" },
  "purchaseOrders.subtitle": {
    pt: "Gerencie seus pedidos de compra e recebimentos",
    en: "Manage your purchase orders and receipts",
  },
  "purchaseOrders.newPurchase": { pt: "Nova Compra", en: "New Purchase" },
  "purchaseOrders.pendingOrders": { pt: "Pedidos Pendentes", en: "Pending Orders" },
  "purchaseOrders.receivedOrders": { pt: "Pedidos Recebidos", en: "Received Orders" },
  "purchaseOrders.totalValue": { pt: "Valor Total", en: "Total Value" },
  "purchaseOrders.awaitingReceipt": { pt: "Aguardando recebimento", en: "Awaiting receipt" },
  "purchaseOrders.alreadyReceived": { pt: "Já recebidos", en: "Already received" },
  "purchaseOrders.allOrders": { pt: "Todos os pedidos", en: "All orders" },
  "purchaseOrders.order": { pt: "Pedido", en: "Order" },
  "purchaseOrders.items": { pt: "item(s)", en: "item(s)" },
  "purchaseOrders.units": { pt: "unidades", en: "units" },
  "purchaseOrders.receivedOn": { pt: "Recebido em", en: "Received on" },
  "purchaseOrders.details": { pt: "Detalhes", en: "Details" },
  "purchaseOrders.markAsReceived": { pt: "Marcar como Recebido", en: "Mark as Received" },
  "purchaseOrders.processing": { pt: "Processando...", en: "Processing..." },
  "purchaseOrders.noPurchases": { pt: "Nenhum pedido de compra", en: "No purchase orders" },
  "purchaseOrders.startCreating": {
    pt: "Comece criando seu primeiro pedido de compra",
    en: "Start by creating your first purchase order",
  },
  "purchaseOrders.received": { pt: "Pedido recebido", en: "Order received" },
  "purchaseOrders.receivedSuccess": {
    pt: "Pedido marcado como recebido e estoque atualizado!",
    en: "Order marked as received and stock updated!",
  },
  "purchaseOrders.errorReceive": {
    pt: "Não foi possível marcar o pedido como recebido",
    en: "Could not mark order as received",
  },

  // Purchase Order Status
  "status.pending": { pt: "Pendente", en: "Pending" },
  "status.received": { pt: "Recebido", en: "Received" },
  "status.cancelled": { pt: "Cancelado", en: "Cancelled" },

  // New Purchase
  "newPurchase.title": { pt: "Nova Compra", en: "New Purchase" },
  "newPurchase.subtitle": { pt: "Crie um novo pedido de compra", en: "Create a new purchase order" },
  "newPurchase.supplier": { pt: "Fornecedor", en: "Supplier" },
  "newPurchase.selectSupplier": { pt: "Selecione um fornecedor", en: "Select a supplier" },
  "newPurchase.supplierDescription": {
    pt: "Selecione o fornecedor para este pedido",
    en: "Select the supplier for this order",
  },
  "newPurchase.orderItems": { pt: "Itens do Pedido", en: "Order Items" },
  "newPurchase.addProducts": {
    pt: "Adicione os produtos que deseja comprar",
    en: "Add the products you want to purchase",
  },
  "newPurchase.addItem": { pt: "Adicionar Item", en: "Add Item" },
  "newPurchase.product": { pt: "Produto", en: "Product" },
  "newPurchase.quantity": { pt: "Quantidade", en: "Quantity" },
  "newPurchase.unitPrice": { pt: "Preço Unitário", en: "Unit Price" },
  "newPurchase.total": { pt: "Total", en: "Total" },
  "newPurchase.orderTotal": { pt: "Total do Pedido", en: "Order Total" },
  "newPurchase.selectProduct": { pt: "Selecione", en: "Select" },
  "newPurchase.cancel": { pt: "Cancelar", en: "Cancel" },
  "newPurchase.createOrder": { pt: "Criar Pedido", en: "Create Order" },
  "newPurchase.creating": { pt: "Criando...", en: "Creating..." },
  "newPurchase.selectSupplierError": { pt: "Selecione um fornecedor", en: "Select a supplier" },
  "newPurchase.addValidItemError": { pt: "Adicione pelo menos um item válido", en: "Add at least one valid item" },
  "newPurchase.orderCreated": { pt: "Pedido criado", en: "Order created" },
  "newPurchase.orderCreatedSuccess": {
    pt: "Pedido de compra criado com sucesso!",
    en: "Purchase order created successfully!",
  },
  "newPurchase.errorCreate": { pt: "Não foi possível criar o pedido", en: "Could not create order" },

  // Recipes
  "recipes.title": { pt: "Receitas", en: "Recipes" },
  "recipes.subtitle": { pt: "Gerencie suas receitas de produção", en: "Manage your production recipes" },
  "recipes.newRecipe": { pt: "Nova Receita", en: "New Recipe" },
  "recipes.product": { pt: "Produto", en: "Product" },
  "recipes.ingredients": { pt: "Ingredientes", en: "Ingredients" },
  "recipes.more": { pt: "mais...", en: "more..." },
  "recipes.createdOn": { pt: "Criada em", en: "Created on" },
  "recipes.viewDetails": { pt: "Ver Detalhes", en: "View Details" },
  "recipes.noRecipes": { pt: "Nenhuma receita cadastrada", en: "No recipes registered" },
  "recipes.startCreating": {
    pt: "Comece criando sua primeira receita de produção",
    en: "Start by creating your first production recipe",
  },
  "recipes.createRecipe": { pt: "Criar Receita", en: "Create Recipe" },

  // New Recipe
  "newRecipe.title": { pt: "Nova Receita", en: "New Recipe" },
  "newRecipe.subtitle": { pt: "Crie uma nova receita de produção", en: "Create a new production recipe" },
  "newRecipe.recipeInfo": { pt: "Informações da Receita", en: "Recipe Information" },
  "newRecipe.defineNameProduct": {
    pt: "Defina o nome e produto final da receita",
    en: "Define the name and final product of the recipe",
  },
  "newRecipe.recipeName": { pt: "Nome da Receita", en: "Recipe Name" },
  "newRecipe.recipeNamePlaceholder": { pt: "Ex: Hambúrguer Completo", en: "Ex: Complete Burger" },
  "newRecipe.finalProduct": { pt: "Produto Final", en: "Final Product" },
  "newRecipe.selectFinalProduct": { pt: "Selecione o produto final", en: "Select the final product" },
  "newRecipe.yield": { pt: "Rendimento (unidades)", en: "Yield (units)" },
  "newRecipe.ingredients": { pt: "Ingredientes", en: "Ingredients" },
  "newRecipe.addIngredients": {
    pt: "Adicione os ingredientes necessários para a receita",
    en: "Add the ingredients needed for the recipe",
  },
  "newRecipe.addIngredient": { pt: "Adicionar Ingrediente", en: "Add Ingredient" },
  "newRecipe.product": { pt: "Produto", en: "Product" },
  "newRecipe.quantity": { pt: "Quantidade", en: "Quantity" },
  "newRecipe.unit": { pt: "Unidade", en: "Unit" },
  "newRecipe.selectProduct": { pt: "Selecione", en: "Select" },
  "newRecipe.selectProductUnit": { pt: "Selecione produto", en: "Select product" },
  "newRecipe.cancel": { pt: "Cancelar", en: "Cancel" },
  "newRecipe.createRecipe": { pt: "Criar Receita", en: "Create Recipe" },
  "newRecipe.creating": { pt: "Criando...", en: "Creating..." },
  "newRecipe.fillNameProduct": {
    pt: "Preencha o nome da receita e produto final",
    en: "Fill in the recipe name and final product",
  },
  "newRecipe.addValidIngredient": {
    pt: "Adicione pelo menos um ingrediente válido",
    en: "Add at least one valid ingredient",
  },
  "newRecipe.recipeCreated": { pt: "Receita criada", en: "Recipe created" },
  "newRecipe.recipeCreatedSuccess": { pt: "Nova receita criada com sucesso!", en: "New recipe created successfully!" },
  "newRecipe.errorCreate": { pt: "Não foi possível criar a receita", en: "Could not create recipe" },

  // Production
  "production.title": { pt: "Produção", en: "Production" },
  "production.subtitle": {
    pt: "Execute a produção de produtos baseado em receitas",
    en: "Execute product production based on recipes",
  },
  "production.executeProduction": { pt: "Executar Produção", en: "Execute Production" },
  "production.selectRecipeQuantity": {
    pt: "Selecione uma receita e quantidade para produzir",
    en: "Select a recipe and quantity to produce",
  },
  "production.recipe": { pt: "Receita", en: "Recipe" },
  "production.selectRecipe": { pt: "Selecione uma receita", en: "Select a recipe" },
  "production.quantityToProduce": { pt: "Quantidade a Produzir", en: "Quantity to Produce" },
  "production.productionSummary": { pt: "Resumo da Produção", en: "Production Summary" },
  "production.finalProduct": { pt: "Produto Final", en: "Final Product" },
  "production.quantity": { pt: "Quantidade", en: "Quantity" },
  "production.ingredients": { pt: "Ingredientes", en: "Ingredients" },
  "production.types": { pt: "tipos", en: "types" },
  "production.execute": { pt: "Executar Produção", en: "Execute Production" },
  "production.producing": { pt: "Produzindo...", en: "Producing..." },
  "production.ingredientsNeeded": { pt: "Ingredientes Necessários", en: "Ingredients Needed" },
  "production.ingredientsConsumed": {
    pt: "Ingredientes que serão consumidos",
    en: "Ingredients that will be consumed",
  },
  "production.selectRecipeToSee": {
    pt: "Selecione uma receita para ver os ingredientes",
    en: "Select a recipe to see ingredients",
  },
  "production.attention": { pt: "Atenção", en: "Attention" },
  "production.checkStock": {
    pt: "Verifique se há estoque suficiente dos ingredientes antes de executar a produção.",
    en: "Check if there is sufficient stock of ingredients before executing production.",
  },
  "production.selectRecipeIngredients": {
    pt: "Selecione uma receita para ver os ingredientes necessários",
    en: "Select a recipe to see the required ingredients",
  },
  "production.noRecipesAvailable": { pt: "Nenhuma receita disponível", en: "No recipes available" },
  "production.createRecipesFirst": {
    pt: "Crie receitas primeiro para poder executar a produção",
    en: "Create recipes first to be able to execute production",
  },
  "production.viewRecipes": { pt: "Ver Receitas", en: "View Recipes" },
  "production.selectRecipeQuantityError": {
    pt: "Selecione uma receita e quantidade válida",
    en: "Select a recipe and valid quantity",
  },
  "production.completed": { pt: "Produção concluída", en: "Production completed" },
  "production.completedSuccess": {
    pt: "unidades de {recipeName} produzidas com sucesso!",
    en: "units of {recipeName} produced successfully!",
  },
  "production.error": { pt: "Erro na produção", en: "Production error" },
  "production.errorExecute": { pt: "Não foi possível executar a produção", en: "Could not execute production" },

  // Navigation updates
  "nav.suppliers": { pt: "Fornecedores", en: "Suppliers" },
  "nav.purchaseOrders": { pt: "Pedidos de Compra", en: "Purchase Orders" },
  "nav.recipes": { pt: "Receitas", en: "Recipes" },
  "nav.production": { pt: "Produção", en: "Production" },

  // Section labels
  "section.stock": { pt: "Estoque", en: "Stock" },
  "section.purchases": { pt: "Compras", en: "Purchases" },
  "section.production": { pt: "Produção", en: "Production" },
  "section.navigation": { pt: "Navegação", en: "Navigation" },

  // Common actions
  "actions.actions": { pt: "Ações", en: "Actions" },
  "actions.back": { pt: "Voltar", en: "Back" },
  "actions.save": { pt: "Salvar", en: "Save" },
  "actions.create": { pt: "Criar", en: "Create" },
  "actions.edit": { pt: "Editar", en: "Edit" },
  "actions.delete": { pt: "Excluir", en: "Delete" },
  "actions.cancel": { pt: "Cancelar", en: "Cancel" },
  "actions.confirm": { pt: "Confirmar", en: "Confirm" },
  "actions.saving": { pt: "Salvando...", en: "Saving..." },
  "actions.loading": { pt: "Carregando...", en: "Loading..." },

  // View modes
  "view.cards": { pt: "Cards", en: "Cards" },
  "view.table": { pt: "Tabela", en: "Table" },
  "view.switchView": { pt: "Alternar visualização", en: "Switch view" },

  // Form placeholders
  "placeholder.companyName": { pt: "Nome do fornecedor", en: "Supplier name" },
  "placeholder.email": { pt: "contato@fornecedor.com", en: "contact@supplier.com" },
  "placeholder.phone": { pt: "(11) 99999-9999", en: "(11) 99999-9999" },
  "placeholder.address": { pt: "Endereço completo", en: "Complete address" },
  "placeholder.select": { pt: "Selecione", en: "Select" },
  "placeholder.quantity": { pt: "0", en: "0" },
  "placeholder.price": { pt: "0,00", en: "0.00" },
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "pt" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    return translation[language] || key
  }

  return <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
