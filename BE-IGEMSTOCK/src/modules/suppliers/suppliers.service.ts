import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto';
import { Supplier } from '@prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    return await this.prisma.supplier.create({
      data: createSupplierDto,
    });
  }

  async findAll(): Promise<Supplier[]> {
    return await this.prisma.supplier.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { purchaseOrders: true },
        },
      },
    });
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        purchaseOrders: {
          orderBy: { orderDate: 'desc' },
          take: 10,
        },
        _count: {
          select: { purchaseOrders: true },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    await this.findOne(id);

    return await this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
    });
  }

  async remove(id: number): Promise<Supplier> {
    await this.findOne(id);

    // Check if supplier has any purchase orders
    const purchaseOrdersCount = await this.prisma.purchaseOrder.count({
      where: { supplierId: id },
    });

    if (purchaseOrdersCount > 0) {
      throw new Error(
        `Cannot delete supplier with existing purchase orders. Found ${purchaseOrdersCount} orders.`,
      );
    }

    return await this.prisma.supplier.delete({
      where: { id },
    });
  }

  async searchByName(name: string): Promise<Supplier[]> {
    return await this.prisma.supplier.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}
