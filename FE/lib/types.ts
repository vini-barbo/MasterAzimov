export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  created_at: string
}

export interface PurchaseOrder {
  id: string
  supplier_id: string
  supplier_name: string
  status: "pending" | "received" | "cancelled"
  total_amount: number
  created_at: string
  received_at?: string
  items: PurchaseOrderItem[]
}

export interface PurchaseOrderItem {
  id: string
  product_sku: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Recipe {
  id: string
  name: string
  final_product_sku: string
  final_product_name: string
  yield_quantity: number
  ingredients: RecipeIngredient[]
  created_at: string
}

export interface RecipeIngredient {
  id: string
  product_sku: string
  product_name: string
  quantity_needed: number
  unit: string
}

export interface Production {
  id: string
  recipe_id: string
  recipe_name: string
  quantity_produced: number
  status: "completed" | "failed"
  created_at: string
  ingredients_consumed: RecipeIngredient[]
}
