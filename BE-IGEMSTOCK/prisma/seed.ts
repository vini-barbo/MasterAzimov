import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create users with different roles and passwords
  const users = [
    {
      email: 'admin@igemstock.com',
      username: 'admin',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
    {
      email: 'moderator@igemstock.com',
      username: 'moderator',
      password: 'mod123',
      firstName: 'João',
      lastName: 'Moderador',
      role: 'MODERATOR',
    },
    {
      email: 'user@igemstock.com',
      username: 'user',
      password: 'user123',
      firstName: 'Maria',
      lastName: 'Silva',
      role: 'USER',
    },
    {
      email: 'operador@igemstock.com',
      username: 'operador',
      password: 'op123',
      firstName: 'Carlos',
      lastName: 'Operador',
      role: 'USER',
    },
    {
      email: 'supervisor@igemstock.com',
      username: 'supervisor',
      password: 'super123',
      firstName: 'Ana',
      lastName: 'Supervisora',
      role: 'MODERATOR',
    },
    {
      email: 'gerente@igemstock.com',
      username: 'gerente',
      password: 'ger123',
      firstName: 'Roberto',
      lastName: 'Gerente',
      role: 'ADMIN',
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role as 'ADMIN' | 'USER' | 'MODERATOR',
        isActive: true,
      },
    });

    createdUsers.push(user);
    console.log(
      `Created user: ${user.username} (${user.role}) - Password: ${userData.password}`,
    );
  }

  // For backward compatibility, keep adminUser reference to first admin
  const adminUser = createdUsers.find((user) => user.role === 'ADMIN');
  console.log({ adminUser });

  // Create warehouses
  const mainWarehouse = await prisma.warehouse.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Main Warehouse',
      location: '123 Main St, City, State 12345',
    },
  });

  const secondaryWarehouse = await prisma.warehouse.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Secondary Warehouse',
      location: '456 Secondary Ave, City, State 67890',
    },
  });

  console.log({ mainWarehouse, secondaryWarehouse });

  // Create products
  const products = [
    {
      sku: 'ACET-500',
      name: 'Acetaminophen 500mg',
      description: 'Pain reliever and fever reducer',
      unitCost: 10.5,
    },
    {
      sku: 'IBU-200',
      name: 'Ibuprofen 200mg',
      description: 'Anti-inflammatory pain reliever',
      unitCost: 8.75,
    },
    {
      sku: 'VITA-C',
      name: 'Vitamin C 1000mg',
      description: 'Immune system support',
      unitCost: 15.25,
    },
  ];

  const createdProducts = [];
  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: productData,
    });
    createdProducts.push(product);
    console.log({ product });
  }

  // Create batches
  const batches = [
    {
      productId: createdProducts[0].id,
      warehouseId: mainWarehouse.id,
      batchCode: 'BATCH-001',
      quantity: 100,
      expiryDate: new Date('2025-12-31'),
    },
    {
      productId: createdProducts[1].id,
      warehouseId: mainWarehouse.id,
      batchCode: 'BATCH-002',
      quantity: 75,
      expiryDate: new Date('2025-06-30'),
    },
    {
      productId: createdProducts[2].id,
      warehouseId: secondaryWarehouse.id,
      batchCode: 'BATCH-003',
      quantity: 50,
      expiryDate: new Date('2026-03-15'),
    },
  ];

  const createdBatches = [];
  for (const batchData of batches) {
    const batch = await prisma.batch.create({
      data: batchData,
    });
    createdBatches.push(batch);
    console.log({ batch });
  }

  // Create stock movements
  const stockMovements = [
    {
      productId: createdProducts[0].id,
      warehouseId: mainWarehouse.id,
      batchId: createdBatches[0].id,
      movementType: 'IN' as const,
      quantity: 100,
      notes: 'Initial stock',
    },
    {
      productId: createdProducts[1].id,
      warehouseId: mainWarehouse.id,
      batchId: createdBatches[1].id,
      movementType: 'IN' as const,
      quantity: 75,
      notes: 'Initial stock',
    },
    {
      productId: createdProducts[2].id,
      warehouseId: secondaryWarehouse.id,
      batchId: createdBatches[2].id,
      movementType: 'IN' as const,
      quantity: 50,
      notes: 'Initial stock',
    },
  ];

  for (const movementData of stockMovements) {
    const movement = await prisma.stockMovement.create({
      data: movementData,
    });
    console.log({ movement });
  }

  // Create notification rules
  const notificationRules = [
    {
      ruleType: 'LOW_STOCK' as const,
      threshold: 10,
    },
    {
      ruleType: 'EXPIRY' as const,
      daysBeforeExpiry: 30,
    },
  ];

  for (const ruleData of notificationRules) {
    const rule = await prisma.notificationRule.create({
      data: ruleData,
    });
    console.log({ rule });
  }

  // Create sample sales
  const sale = await prisma.sale.create({
    data: {
      saleDate: new Date(),
      totalAmount: 45.25,
    },
  });

  const saleItems = [
    {
      saleId: sale.id,
      productId: createdProducts[0].id,
      quantity: 2,
      unitPrice: 12.5,
    },
    {
      saleId: sale.id,
      productId: createdProducts[1].id,
      quantity: 1,
      unitPrice: 10.25,
    },
  ];

  for (const itemData of saleItems) {
    const saleItem = await prisma.saleItem.create({
      data: itemData,
    });
    console.log({ saleItem });
  }

  // ===== SUPPLIERS AND PURCHASE ORDERS SEEDS =====

  // Create suppliers
  const suppliers = [
    {
      name: 'Pharmex Distribuidora',
      contactEmail: 'vendas@pharmex.com.br',
      phone: '+55 11 99999-1234',
      address: 'Rua das Indústrias, 123 - São Paulo, SP',
    },
    {
      name: 'MedSupply Ltda',
      contactEmail: 'contato@medsupply.com.br',
      phone: '+55 21 88888-5678',
      address: 'Av. Central, 456 - Rio de Janeiro, RJ',
    },
    {
      name: 'BioFarma Suprimentos',
      contactEmail: 'compras@biofarma.com.br',
      phone: '+55 31 77777-9012',
      address: 'Rua da Saúde, 789 - Belo Horizonte, MG',
    },
  ];

  const createdSuppliers = [];
  for (let i = 0; i < suppliers.length; i++) {
    try {
      // Try to find existing supplier first
      let supplier = await (prisma as any).supplier.findFirst({
        where: { name: suppliers[i].name },
      });

      if (!supplier) {
        supplier = await (prisma as any).supplier.create({
          data: suppliers[i],
        });
      }

      createdSuppliers.push(supplier);
      console.log({ supplier });
    } catch (error) {
      console.log(`Supplier table might not exist yet: ${error.message}`);
    }
  }

  // Create purchase orders (only if suppliers were created)
  if (createdSuppliers.length > 0) {
    const purchaseOrders = [
      {
        supplierId: createdSuppliers[0].id,
        orderDate: new Date('2025-07-20'),
        status: 'PENDING',
        totalAmount: 525,
      },
      {
        supplierId: createdSuppliers[1].id,
        orderDate: new Date('2025-07-18'),
        status: 'RECEIVED',
        totalAmount: 312.5,
      },
      {
        supplierId: createdSuppliers[2].id,
        orderDate: new Date('2025-07-25'),
        status: 'PENDING',
        totalAmount: 760,
      },
    ];

    const createdPurchaseOrders = [];
    for (const orderData of purchaseOrders) {
      try {
        const order = await (prisma as any).purchaseOrder.create({
          data: orderData,
        });
        createdPurchaseOrders.push(order);
        console.log({ purchaseOrder: order });
      } catch (error) {
        console.log(`Purchase order table might not exist yet: ${error.message}`);
      }
    }

    // Create purchase order items (only if purchase orders were created)
    if (createdPurchaseOrders.length > 0) {
      const purchaseOrderItems = [
        // Items for first purchase order
        {
          purchaseOrderId: createdPurchaseOrders[0]?.id,
          productId: createdProducts[0].id, // Acetaminophen
          quantity: 25,
          unitPrice: 10.5,
        },
        {
          purchaseOrderId: createdPurchaseOrders[0]?.id,
          productId: createdProducts[1].id, // Ibuprofen
          quantity: 30,
          unitPrice: 8.75,
        },
        // Items for second purchase order
        {
          purchaseOrderId: createdPurchaseOrders[1]?.id,
          productId: createdProducts[2].id, // Vitamin C
          quantity: 20,
          unitPrice: 15.25,
        },
        // Items for third purchase order
        {
          purchaseOrderId: createdPurchaseOrders[2]?.id,
          productId: createdProducts[0].id, // Acetaminophen
          quantity: 40,
          unitPrice: 10.5,
        },
        {
          purchaseOrderId: createdPurchaseOrders[2]?.id,
          productId: createdProducts[2].id, // Vitamin C
          quantity: 25,
          unitPrice: 15.25,
        },
      ];

      for (const itemData of purchaseOrderItems) {
        if (itemData.purchaseOrderId) {
          try {
            const item = await (prisma as any).purchaseOrderItem.create({
              data: itemData,
            });
            console.log({ purchaseOrderItem: item });
          } catch (error) {
            console.log(`Purchase order item table might not exist yet: ${error.message}`);
          }
        }
      }
    }
  }

  // ===== RECIPES AND PRODUCTION SEEDS =====

  // Create additional products for recipes (ingredients and final products)
  const recipeProducts = [
    {
      sku: 'PAIN-RELIEF-KIT',
      name: 'Kit Alívio da Dor',
      description: 'Kit completo para alívio da dor',
      unitCost: 35,
    },
    {
      sku: 'IMMUNITY-BOOSTER',
      name: 'Kit Reforço Imunológico',
      description: 'Kit para reforçar o sistema imunológico',
      unitCost: 28,
    },
    {
      sku: 'PACKAGING-BOX',
      name: 'Caixa de Embalagem',
      description: 'Caixa para embalagem de kits',
      unitCost: 2.5,
    },
    {
      sku: 'INFO-LEAFLET',
      name: 'Folheto Informativo',
      description: 'Folheto com informações do produto',
      unitCost: 0.5,
    },
  ];

  const createdRecipeProducts = [];
  for (const productData of recipeProducts) {
    const product = await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: productData,
    });
    createdRecipeProducts.push(product);
    console.log({ recipeProduct: product });
  }

  // Create recipes (only if recipe tables exist)
  const recipes = [
    {
      productId: createdRecipeProducts[0].id, // Kit Alívio da Dor
      name: 'Receita Kit Alívio da Dor',
      notes: 'Kit composto por acetaminophen e ibuprofen com embalagem',
    },
    {
      productId: createdRecipeProducts[1].id, // Kit Reforço Imunológico
      name: 'Receita Kit Reforço Imunológico',
      notes: 'Kit composto por vitamina C com embalagem e folheto',
    },
  ];

  const createdRecipes = [];
  for (const recipeData of recipes) {
    try {
      const recipe = await (prisma as any).recipe.create({
        data: recipeData,
      });
      createdRecipes.push(recipe);
      console.log({ recipe });
    } catch (error) {
      console.log(`Recipe table might not exist yet: ${error.message}`);
    }
  }

  // Create recipe ingredients (only if recipes were created)
  if (createdRecipes.length > 0) {
    const recipeIngredients = [
      // Ingredients for Kit Alívio da Dor
      {
        recipeId: createdRecipes[0]?.id,
        ingredientId: createdProducts[0].id, // Acetaminophen
        quantity: 2, // 2 units per kit
      },
      {
        recipeId: createdRecipes[0]?.id,
        ingredientId: createdProducts[1].id, // Ibuprofen
        quantity: 1, // 1 unit per kit
      },
      {
        recipeId: createdRecipes[0]?.id,
        ingredientId: createdRecipeProducts[2].id, // Packaging Box
        quantity: 1, // 1 box per kit
      },
      {
        recipeId: createdRecipes[0]?.id,
        ingredientId: createdRecipeProducts[3].id, // Info Leaflet
        quantity: 1, // 1 leaflet per kit
      },
      // Ingredients for Kit Reforço Imunológico
      {
        recipeId: createdRecipes[1]?.id,
        ingredientId: createdProducts[2].id, // Vitamin C
        quantity: 3, // 3 units per kit
      },
      {
        recipeId: createdRecipes[1]?.id,
        ingredientId: createdRecipeProducts[2].id, // Packaging Box
        quantity: 1, // 1 box per kit
      },
      {
        recipeId: createdRecipes[1]?.id,
        ingredientId: createdRecipeProducts[3].id, // Info Leaflet
        quantity: 1, // 1 leaflet per kit
      },
    ];

    for (const ingredientData of recipeIngredients) {
      if (ingredientData.recipeId) {
        try {
          const ingredient = await (prisma as any).recipeIngredient.create({
            data: ingredientData,
          });
          console.log({ recipeIngredient: ingredient });
        } catch (error) {
          console.log(`Recipe ingredient table might not exist yet: ${error.message}`);
        }
      }
    }

    // Create production batches (only if recipes exist)
    const productionBatches = [
      {
        recipeId: createdRecipes[0]?.id, // Kit Alívio da Dor
        quantityProduced: 10,
        productionDate: new Date('2025-07-24'),
        notes: 'Primeira produção do Kit Alívio da Dor',
      },
      {
        recipeId: createdRecipes[1]?.id, // Kit Reforço Imunológico
        quantityProduced: 8,
        productionDate: new Date('2025-07-25'),
        notes: 'Primeira produção do Kit Reforço Imunológico',
      },
    ];

    for (const batchData of productionBatches) {
      if (batchData.recipeId) {
        try {
          const batch = await (prisma as any).productionBatch.create({
            data: batchData,
          });
          console.log({ productionBatch: batch });
        } catch (error) {
          console.log(`Production batch table might not exist yet: ${error.message}`);
        }
      }
    }
  }

  // Create initial stock for new ingredients
  const additionalStockMovements = [
    {
      productId: createdRecipeProducts[2].id, // Packaging Box
      warehouseId: mainWarehouse.id,
      movementType: 'IN' as const,
      quantity: 100,
      notes: 'Initial stock for packaging boxes',
    },
    {
      productId: createdRecipeProducts[3].id, // Info Leaflet
      warehouseId: mainWarehouse.id,
      movementType: 'IN' as const,
      quantity: 200,
      notes: 'Initial stock for info leaflets',
    },
  ];

  for (const movementData of additionalStockMovements) {
    const movement = await prisma.stockMovement.create({
      data: movementData,
    });
    console.log({ additionalStockMovement: movement });
  }

  // Create some legacy sample stock items for backward compatibility
  const sampleItems = [
    {
      name: 'Sample Item 1',
      description: 'This is a sample item for testing',
      sku: 'SAMPLE-001',
      quantity: 100,
      minQuantity: 10,
      maxQuantity: 500,
      unitPrice: 9.99,
      category: 'Electronics',
      location: 'Warehouse A',
    },
    {
      name: 'Sample Item 2',
      description: 'Another sample item for testing',
      sku: 'SAMPLE-002',
      quantity: 50,
      minQuantity: 5,
      maxQuantity: 200,
      unitPrice: 19.99,
      category: 'Tools',
      location: 'Warehouse B',
    },
  ];

  for (const item of sampleItems) {
    const stockItem = await prisma.stockItem.upsert({
      where: { sku: item.sku },
      update: {},
      create: {
        ...item,
        createdBy: adminUser?.id || createdUsers[0]?.id,
      },
    });
    console.log({ stockItem });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
