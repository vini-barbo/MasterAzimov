import type { Supplier, PurchaseOrder, Recipe, Production } from "./types"

// Mock data
const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Fornecedor de Carnes Premium",
    email: "contato@carnespremium.com",
    phone: "(11) 99999-1111",
    address: "Rua das Carnes, 123 - São Paulo, SP",
    created_at: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    name: "Distribuidora de Vegetais Frescos",
    email: "vendas@vegetaisfrescos.com",
    phone: "(11) 88888-2222",
    address: "Av. dos Vegetais, 456 - São Paulo, SP",
    created_at: "2024-01-12T14:30:00Z",
  },
]

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "1",
    supplier_id: "1",
    supplier_name: "Fornecedor de Carnes Premium",
    status: "pending",
    total_amount: 1500.0,
    created_at: "2024-01-15T09:00:00Z",
    items: [
      {
        id: "1",
        product_sku: "CAR004",
        product_name: "Carne Bovina 180g",
        quantity: 50,
        unit_price: 20.0,
        total_price: 1000.0,
      },
      {
        id: "2",
        product_sku: "QUE003",
        product_name: "Queijo Cheddar",
        quantity: 10,
        unit_price: 50.0,
        total_price: 500.0,
      },
    ],
  },
  {
    id: "2",
    supplier_id: "2",
    supplier_name: "Distribuidora de Vegetais Frescos",
    status: "received",
    total_amount: 300.0,
    created_at: "2024-01-14T11:00:00Z",
    received_at: "2024-01-15T16:00:00Z",
    items: [
      {
        id: "3",
        product_sku: "ALC005",
        product_name: "Alface Americana",
        quantity: 50,
        unit_price: 3.0,
        total_price: 150.0,
      },
      {
        id: "4",
        product_sku: "TOM006",
        product_name: "Tomate Salada",
        quantity: 20,
        unit_price: 7.5,
        total_price: 150.0,
      },
    ],
  },
]

const mockRecipes: Recipe[] = [
  {
    id: "1",
    name: "Hambúrguer Completo",
    final_product_sku: "HAM001",
    final_product_name: "Hambúrguer Artesanal",
    yield_quantity: 1,
    created_at: "2024-01-10T10:00:00Z",
    ingredients: [
      {
        id: "1",
        product_sku: "CAR004",
        product_name: "Carne Bovina 180g",
        quantity_needed: 1,
        unit: "unidades",
      },
      {
        id: "2",
        product_sku: "PAO002",
        product_name: "Pão de Hambúrguer",
        quantity_needed: 1,
        unit: "unidades",
      },
      {
        id: "3",
        product_sku: "QUE003",
        product_name: "Queijo Cheddar",
        quantity_needed: 0.05,
        unit: "kg",
      },
      {
        id: "4",
        product_sku: "ALC005",
        product_name: "Alface Americana",
        quantity_needed: 0.1,
        unit: "maços",
      },
      {
        id: "5",
        product_sku: "TOM006",
        product_name: "Tomate Salada",
        quantity_needed: 0.05,
        unit: "kg",
      },
    ],
  },
]

// API functions
export const suppliersApi = {
  getAll: async (): Promise<Supplier[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockSuppliers
  },

  create: async (supplier: Omit<Supplier, "id" | "created_at">): Promise<Supplier> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }
    mockSuppliers.push(newSupplier)
    return newSupplier
  },

  update: async (id: string, supplier: Partial<Supplier>): Promise<Supplier> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const index = mockSuppliers.findIndex((s) => s.id === id)
    if (index === -1) throw new Error("Fornecedor não encontrado")
    mockSuppliers[index] = { ...mockSuppliers[index], ...supplier }
    return mockSuppliers[index]
  },
}

export const purchaseOrdersApi = {
  getAll: async (): Promise<PurchaseOrder[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockPurchaseOrders
  },

  getById: async (id: string): Promise<PurchaseOrder> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const order = mockPurchaseOrders.find((o) => o.id === id)
    if (!order) throw new Error("Pedido não encontrado")
    return order
  },

  create: async (order: Omit<PurchaseOrder, "id" | "created_at">): Promise<PurchaseOrder> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newOrder: PurchaseOrder = {
      ...order,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }
    mockPurchaseOrders.push(newOrder)
    return newOrder
  },

  markAsReceived: async (id: string): Promise<PurchaseOrder> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const index = mockPurchaseOrders.findIndex((o) => o.id === id)
    if (index === -1) throw new Error("Pedido não encontrado")
    mockPurchaseOrders[index] = {
      ...mockPurchaseOrders[index],
      status: "received",
      received_at: new Date().toISOString(),
    }
    return mockPurchaseOrders[index]
  },
}

export const recipesApi = {
  getAll: async (): Promise<Recipe[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockRecipes
  },

  getById: async (id: string): Promise<Recipe> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const recipe = mockRecipes.find((r) => r.id === id)
    if (!recipe) throw new Error("Receita não encontrada")
    return recipe
  },

  create: async (recipe: Omit<Recipe, "id" | "created_at">): Promise<Recipe> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }
    mockRecipes.push(newRecipe)
    return newRecipe
  },
}

export const productionApi = {
  execute: async (recipeId: string, quantity: number): Promise<Production> => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const recipe = mockRecipes.find((r) => r.id === recipeId)
    if (!recipe) throw new Error("Receita não encontrada")

    // Simular verificação de estoque
    if (Math.random() < 0.1) {
      throw new Error("Estoque insuficiente para alguns ingredientes")
    }

    const production: Production = {
      id: Date.now().toString(),
      recipe_id: recipeId,
      recipe_name: recipe.name,
      quantity_produced: quantity,
      status: "completed",
      created_at: new Date().toISOString(),
      ingredients_consumed: recipe.ingredients.map((ing) => ({
        ...ing,
        quantity_needed: ing.quantity_needed * quantity,
      })),
    }

    return production
  },
}
