import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return await this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        batches: {
          include: {
            warehouse: true,
          },
        },
        stockMovements: {
          include: {
            warehouse: true,
            batch: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10, // Last 10 movements
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySku(sku: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { sku },
    });

    if (!product) {
      throw new NotFoundException(`Product with SKU ${sku} not found`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // Check if product exists
    await this.findOne(id);

    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number): Promise<Product> {
    // Check if product exists
    await this.findOne(id);

    return await this.prisma.product.delete({
      where: { id },
    });
  }

  // Get current stock levels for a product across all warehouses
  async getStockLevels(productId: number) {
    const stockMovements = await this.prisma.stockMovement.findMany({
      where: { productId },
      include: {
        warehouse: true,
      },
    });

    const stockByWarehouse = stockMovements.reduce(
      (acc, movement) => {
        const warehouseId = movement.warehouseId;
        if (!acc[warehouseId]) {
          acc[warehouseId] = {
            warehouse: movement.warehouse,
            quantity: 0,
          };
        }

        switch (movement.movementType) {
          case 'IN':
            acc[warehouseId].quantity += movement.quantity;
            break;
          case 'OUT':
            acc[warehouseId].quantity -= movement.quantity;
            break;
          case 'ADJ':
            // For adjustments, we need to check if it's positive or negative
            // This might need business logic refinement
            acc[warehouseId].quantity += movement.quantity;
            break;
        }

        return acc;
      },
      {} as Record<number, any>,
    );

    return Object.values(stockByWarehouse);
  }
}
