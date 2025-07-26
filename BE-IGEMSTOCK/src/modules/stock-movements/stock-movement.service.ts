import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateStockMovementDto } from './dto';
import { StockMovement } from '@prisma/client';

@Injectable()
export class StockMovementService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createStockMovementDto: CreateStockMovementDto,
  ): Promise<StockMovement> {
    return await this.prisma.stockMovement.create({
      data: createStockMovementDto,
      include: {
        product: true,
        warehouse: true,
        batch: true,
      },
    });
  }

  async findAll(): Promise<StockMovement[]> {
    return await this.prisma.stockMovement.findMany({
      include: {
        product: true,
        warehouse: true,
        batch: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<StockMovement> {
    const movement = await this.prisma.stockMovement.findUnique({
      where: { id },
      include: {
        product: true,
        warehouse: true,
        batch: true,
      },
    });

    if (!movement) {
      throw new NotFoundException(`Stock movement with ID ${id} not found`);
    }

    return movement;
  }

  async findByProduct(productId: number): Promise<StockMovement[]> {
    return await this.prisma.stockMovement.findMany({
      where: { productId },
      include: {
        warehouse: true,
        batch: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByWarehouse(warehouseId: number): Promise<StockMovement[]> {
    return await this.prisma.stockMovement.findMany({
      where: { warehouseId },
      include: {
        product: true,
        batch: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByBatch(batchId: number): Promise<StockMovement[]> {
    return await this.prisma.stockMovement.findMany({
      where: { batchId },
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get stock on hand view
  async getStockOnHand() {
    const movements = await this.prisma.stockMovement.findMany({
      include: {
        product: true,
        warehouse: true,
      },
    });

    const stockByProductWarehouse = movements.reduce(
      (acc, movement) => {
        const key = `${movement.productId}-${movement.warehouseId}`;

        if (!acc[key]) {
          acc[key] = {
            productId: movement.productId,
            product: movement.product,
            warehouseId: movement.warehouseId,
            warehouse: movement.warehouse,
            onHand: 0,
          };
        }

        switch (movement.movementType) {
          case 'IN':
            acc[key].onHand += movement.quantity;
            break;
          case 'OUT':
            acc[key].onHand -= movement.quantity;
            break;
          case 'ADJ':
            // For adjustments, the quantity could be positive or negative
            // This needs business logic clarification
            acc[key].onHand += movement.quantity;
            break;
        }

        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(stockByProductWarehouse);
  }
}
