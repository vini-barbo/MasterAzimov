import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSaleDto } from './dto';
import { Sale } from '@prisma/client';

@Injectable()
export class SaleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    return await this.prisma.sale.create({
      data: {
        ...createSaleDto,
        saleDate: new Date(createSaleDto.saleDate),
      },
    });
  }

  async findAll(): Promise<Sale[]> {
    return await this.prisma.sale.findMany({
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { saleDate: 'desc' },
    });
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return sale;
  }

  async remove(id: number): Promise<Sale> {
    await this.findOne(id);

    return await this.prisma.sale.delete({
      where: { id },
    });
  }

  // Get sales by date range
  async findByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return await this.prisma.sale.findMany({
      where: {
        saleDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { saleDate: 'desc' },
    });
  }

  // Get sales summary
  async getSalesSummary(startDate?: Date, endDate?: Date) {
    const whereClause =
      startDate && endDate
        ? {
            saleDate: {
              gte: startDate,
              lte: endDate,
            },
          }
        : {};

    const sales = await this.prisma.sale.findMany({
      where: whereClause,
      include: {
        saleItems: true,
      },
    });

    const totalSales = sales.length;
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + Number(sale.totalAmount),
      0,
    );
    const totalItemsSold = sales.reduce(
      (sum, sale) =>
        sum +
        sale.saleItems.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0,
    );

    return {
      totalSales,
      totalRevenue,
      totalItemsSold,
      averageOrderValue: totalSales > 0 ? totalRevenue / totalSales : 0,
    };
  }
}
