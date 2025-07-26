import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBatchDto, UpdateBatchDto } from './dto';
import { Batch } from '@prisma/client';

@Injectable()
export class BatchService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBatchDto: CreateBatchDto): Promise<Batch> {
    return await this.prisma.batch.create({
      data: {
        ...createBatchDto,
        expiryDate: createBatchDto.expiryDate
          ? new Date(createBatchDto.expiryDate)
          : null,
      },
    });
  }

  async findAll(): Promise<Batch[]> {
    return await this.prisma.batch.findMany({
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<Batch> {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: {
        product: true,
        warehouse: true,
        stockMovements: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }

    return batch;
  }

  async update(id: number, updateBatchDto: UpdateBatchDto): Promise<Batch> {
    // Check if batch exists
    await this.findOne(id);

    return await this.prisma.batch.update({
      where: { id },
      data: {
        ...updateBatchDto,
        expiryDate: updateBatchDto.expiryDate
          ? new Date(updateBatchDto.expiryDate)
          : undefined,
      },
    });
  }

  async remove(id: number): Promise<Batch> {
    // Check if batch exists
    await this.findOne(id);

    return await this.prisma.batch.delete({
      where: { id },
    });
  }

  // Find batches expiring within specified days
  async findExpiringBatches(days: number = 30): Promise<Batch[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.prisma.batch.findMany({
      where: {
        expiryDate: {
          lte: futureDate,
          gte: new Date(),
        },
      },
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: { expiryDate: 'asc' },
    });
  }

  // Find batches by product
  async findByProduct(productId: number): Promise<Batch[]> {
    return await this.prisma.batch.findMany({
      where: { productId },
      include: {
        warehouse: true,
      },
      orderBy: { expiryDate: 'asc' },
    });
  }

  // Find batches by warehouse
  async findByWarehouse(warehouseId: number): Promise<Batch[]> {
    return await this.prisma.batch.findMany({
      where: { warehouseId },
      include: {
        product: true,
      },
      orderBy: { expiryDate: 'asc' },
    });
  }
}
