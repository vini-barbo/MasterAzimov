import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateNotificationRuleDto, UpdateNotificationRuleDto } from './dto';
import { NotificationRule } from '@prisma/client';

@Injectable()
export class NotificationRuleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createNotificationRuleDto: CreateNotificationRuleDto,
  ): Promise<NotificationRule> {
    return await this.prisma.notificationRule.create({
      data: createNotificationRuleDto,
    });
  }

  async findAll(): Promise<NotificationRule[]> {
    return await this.prisma.notificationRule.findMany({
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<NotificationRule> {
    const rule = await this.prisma.notificationRule.findUnique({
      where: { id },
      include: {
        product: true,
        warehouse: true,
        notificationsLog: {
          orderBy: { triggeredAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!rule) {
      throw new NotFoundException(`Notification rule with ID ${id} not found`);
    }

    return rule;
  }

  async update(
    id: number,
    updateNotificationRuleDto: UpdateNotificationRuleDto,
  ): Promise<NotificationRule> {
    await this.findOne(id);

    return await this.prisma.notificationRule.update({
      where: { id },
      data: updateNotificationRuleDto,
    });
  }

  async remove(id: number): Promise<NotificationRule> {
    await this.findOne(id);

    return await this.prisma.notificationRule.delete({
      where: { id },
    });
  }

  // Find rules by type
  async findByType(
    ruleType: 'LOW_STOCK' | 'EXPIRY',
  ): Promise<NotificationRule[]> {
    return await this.prisma.notificationRule.findMany({
      where: { ruleType },
      include: {
        product: true,
        warehouse: true,
      },
    });
  }

  // Check for low stock alerts
  async checkLowStockAlerts() {
    const lowStockRules = await this.findByType('LOW_STOCK');
    const alerts = [];

    for (const rule of lowStockRules) {
      // Get current stock levels
      const stockMovements = await this.prisma.stockMovement.findMany({
        where: {
          ...(rule.productId && { productId: rule.productId }),
          ...(rule.warehouseId && { warehouseId: rule.warehouseId }),
        },
        include: {
          product: true,
          warehouse: true,
        },
      });

      // Calculate current stock by product/warehouse combination
      const stockLevels = stockMovements.reduce(
        (acc, movement) => {
          const key = `${movement.productId}-${movement.warehouseId}`;
          if (!acc[key]) {
            acc[key] = {
              productId: movement.productId,
              warehouseId: movement.warehouseId,
              product: movement.product,
              warehouse: movement.warehouse,
              quantity: 0,
            };
          }

          switch (movement.movementType) {
            case 'IN':
              acc[key].quantity += movement.quantity;
              break;
            case 'OUT':
              acc[key].quantity -= movement.quantity;
              break;
            case 'ADJ':
              acc[key].quantity += movement.quantity;
              break;
          }

          return acc;
        },
        {} as Record<string, any>,
      );

      // Check against thresholds
      for (const stockLevel of Object.values(stockLevels)) {
        const stock = stockLevel as any;
        if (rule.threshold && stock.quantity <= rule.threshold) {
          alerts.push({
            rule,
            productId: stock.productId,
            warehouseId: stock.warehouseId,
            currentStock: stock.quantity,
            threshold: rule.threshold,
          });
        }
      }
    }

    return alerts;
  }

  // Check for expiry alerts
  async checkExpiryAlerts() {
    const expiryRules = await this.findByType('EXPIRY');
    const alerts = [];

    for (const rule of expiryRules) {
      const daysAhead = rule.daysBeforeExpiry || 30;
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const expiringBatches = await this.prisma.batch.findMany({
        where: {
          expiryDate: {
            lte: futureDate,
            gte: new Date(),
          },
          ...(rule.productId && { productId: rule.productId }),
          ...(rule.warehouseId && { warehouseId: rule.warehouseId }),
        },
        include: {
          product: true,
          warehouse: true,
        },
      });

      for (const batch of expiringBatches) {
        alerts.push({
          rule,
          batch,
          productId: batch.productId,
          warehouseId: batch.warehouseId,
          batchId: batch.id,
          expiryDate: batch.expiryDate,
          daysUntilExpiry: Math.ceil(
            (new Date(batch.expiryDate!).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        });
      }
    }

    return alerts;
  }
}
