import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) { }

  async create(createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return this.prisma.purchaseOrder.create({
      data: {
        supplierId: createPurchaseOrderDto.supplierId,
        orderDate: createPurchaseOrderDto.orderDate,
        status: createPurchaseOrderDto.status,
        totalAmount: createPurchaseOrderDto.totalAmount,
        purchaseOrderItems: {
          create: createPurchaseOrderDto.purchaseOrderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        supplier: true,
        purchaseOrderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, supplierId, status } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(supplierId && { supplierId: parseInt(supplierId) }),
      ...(status && { status }),
    };

    const [purchaseOrders, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          supplier: true,
          purchaseOrderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          orderDate: 'desc',
        },
      }),
      this.prisma.purchaseOrder.count({ where }),
    ]);

    return {
      data: purchaseOrders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        purchaseOrderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: {
        supplierId: updatePurchaseOrderDto.supplierId,
        orderDate: updatePurchaseOrderDto.orderDate,
        status: updatePurchaseOrderDto.status,
        totalAmount: updatePurchaseOrderDto.totalAmount,
      },
      include: {
        supplier: true,
        purchaseOrderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.purchaseOrder.delete({
      where: { id },
    });
  }

  async receivePurchaseOrder(id: number) {
    // Update status to RECEIVED and create stock movements
    const purchaseOrder = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        purchaseOrderItems: true,
      },
    });

    if (!purchaseOrder) {
      throw new Error('Purchase order not found');
    }

    // Update status
    await this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: 'RECEIVED' },
    });

    // Create stock movements for each item
    for (const item of purchaseOrder.purchaseOrderItems) {
      await this.prisma.stockMovement.create({
        data: {
          productId: item.productId,
          warehouseId: 1, // Default warehouse, this should be configurable
          movementType: 'IN',
          quantity: item.quantity,
          relatedId: purchaseOrder.id,
          notes: `Purchase order #${purchaseOrder.id} received`,
        },
      });
    }

    return this.findOne(id);
  }
}
