import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@igemstock.com' },
    update: {},
    create: {
      email: 'admin@igemstock.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log({ adminUser });

  // Create some sample stock items
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
        createdBy: adminUser.id,
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
