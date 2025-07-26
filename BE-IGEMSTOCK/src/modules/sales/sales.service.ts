import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) { }

  async create(createSaleDto: CreateSaleDto) {
    return this.prisma.sale.create({
      data: {
        saleDate: createSaleDto.saleDate,
        totalAmount: createSaleDto.totalAmount,
        saleItems: {
          create: createSaleDto.saleItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(startDate && endDate && {
        saleDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    const [sales, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          saleItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          saleDate: 'desc',
        },
      }),
      this.prisma.sale.count({ where }),
    ]);

    return {
      data: sales,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.sale.findUnique({
      where: { id },
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async update(id: number, updateSaleDto: UpdateSaleDto) {
    return this.prisma.sale.update({
      where: { id },
      data: {
        saleDate: updateSaleDto.saleDate,
        totalAmount: updateSaleDto.totalAmount,
      },
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.sale.delete({
      where: { id },
    });
  }

  async getSalesReport(query: any) {
    const { startDate, endDate, productId } = query;

    const where = {
      ...(startDate && endDate && {
        saleDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
      ...(productId && {
        saleItems: {
          some: {
            productId: parseInt(productId),
          },
        },
      }),
    };

    const [totalRevenue, totalSales, topProducts] = await Promise.all([
      this.prisma.sale.aggregate({
        where,
        _sum: {
          totalAmount: true,
        },
      }),
      this.prisma.sale.count({ where }),
      this.prisma.saleItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true,
          unitPrice: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    return {
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalSales,
      topProducts,
    };
  }
}
