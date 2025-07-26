import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSaleItemDto } from './dto';
import { SaleItem } from '@prisma/client';

@Injectable()
export class SaleItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSaleItemDto: CreateSaleItemDto): Promise<SaleItem> {
    return await this.prisma.saleItem.create({
      data: createSaleItemDto,
      include: {
        product: true,
        sale: true,
      },
    });
  }

  async findAll(): Promise<SaleItem[]> {
    return await this.prisma.saleItem.findMany({
      include: {
        product: true,
        sale: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<SaleItem> {
    const saleItem = await this.prisma.saleItem.findUnique({
      where: { id },
      include: {
        product: true,
        sale: true,
      },
    });

    if (!saleItem) {
      throw new NotFoundException(`Sale item with ID ${id} not found`);
    }

    return saleItem;
  }

  async findBySale(saleId: number): Promise<SaleItem[]> {
    return await this.prisma.saleItem.findMany({
      where: { saleId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByProduct(productId: number): Promise<SaleItem[]> {
    return await this.prisma.saleItem.findMany({
      where: { productId },
      include: {
        sale: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: number): Promise<SaleItem> {
    await this.findOne(id);

    return await this.prisma.saleItem.delete({
      where: { id },
    });
  }

  // Get top selling products
  async getTopSellingProducts(
    limit: number = 10,
    startDate?: Date,
    endDate?: Date,
  ) {
    const whereClause =
      startDate && endDate
        ? {
            sale: {
              saleDate: {
                gte: startDate,
                lte: endDate,
              },
            },
          }
        : {};

    const saleItems = await this.prisma.saleItem.findMany({
      where: whereClause,
      include: {
        product: true,
      },
    });

    // Group by product and calculate totals
    const productSales = saleItems.reduce(
      (acc, item) => {
        const productId = item.productId;
        if (!acc[productId]) {
          acc[productId] = {
            productId,
            product: item.product,
            totalSold: 0,
            totalRevenue: 0,
          };
        }

        acc[productId].totalSold += item.quantity;
        acc[productId].totalRevenue += Number(item.unitPrice) * item.quantity;

        return acc;
      },
      {} as Record<number, any>,
    );

    // Sort by total sold and return top products
    return Object.values(productSales)
      .sort((a: any, b: any) => b.totalSold - a.totalSold)
      .slice(0, limit);
  }
}
