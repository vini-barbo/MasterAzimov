import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto';
import { Warehouse } from '@prisma/client';

@Injectable()
export class WarehouseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    return await this.prisma.warehouse.create({
      data: createWarehouseDto,
    });
  }

  async findAll(): Promise<Warehouse[]> {
    return await this.prisma.warehouse.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<Warehouse> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        batches: {
          include: {
            product: true,
          },
        },
        stockMovements: {
          include: {
            product: true,
            batch: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10, // Last 10 movements
        },
      },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return warehouse;
  }

  async update(
    id: number,
    updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<Warehouse> {
    // Check if warehouse exists
    await this.findOne(id);

    return await this.prisma.warehouse.update({
      where: { id },
      data: updateWarehouseDto,
    });
  }

  async remove(id: number): Promise<Warehouse> {
    // Check if warehouse exists
    await this.findOne(id);

    return await this.prisma.warehouse.delete({
      where: { id },
    });
  }

  // Get current stock levels in this warehouse
  async getStockLevels(warehouseId: number) {
    const stockMovements = await this.prisma.stockMovement.findMany({
      where: { warehouseId },
      include: {
        product: true,
      },
    });

    const stockByProduct = stockMovements.reduce(
      (acc, movement) => {
        const productId = movement.productId;
        if (!acc[productId]) {
          acc[productId] = {
            product: movement.product,
            quantity: 0,
          };
        }

        switch (movement.movementType) {
          case 'IN':
            acc[productId].quantity += movement.quantity;
            break;
          case 'OUT':
            acc[productId].quantity -= movement.quantity;
            break;
          case 'ADJ':
            acc[productId].quantity += movement.quantity;
            break;
        }

        return acc;
      },
      {} as Record<number, any>,
    );

    return Object.values(stockByProduct);
  }
}
