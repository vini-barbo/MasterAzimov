import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { NotificationLog } from '@prisma/client';

@Injectable()
export class NotificationLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(notificationData: {
    ruleId?: number;
    productId?: number;
    warehouseId?: number;
    batchId?: number;
    status: 'PENDING' | 'SENT' | 'FAILED';
    channel: 'EMAIL' | 'SMS' | 'PUSH';
    payload?: any;
    errorMsg?: string;
  }): Promise<NotificationLog> {
    return await this.prisma.notificationLog.create({
      data: notificationData,
    });
  }

  async findAll(): Promise<NotificationLog[]> {
    return await this.prisma.notificationLog.findMany({
      include: {
        rule: true,
        product: true,
        warehouse: true,
        batch: true,
      },
      orderBy: { triggeredAt: 'desc' },
    });
  }

  async findByStatus(
    status: 'PENDING' | 'SENT' | 'FAILED',
  ): Promise<NotificationLog[]> {
    return await this.prisma.notificationLog.findMany({
      where: { status },
      include: {
        rule: true,
        product: true,
        warehouse: true,
        batch: true,
      },
      orderBy: { triggeredAt: 'desc' },
    });
  }

  async updateStatus(
    id: number,
    status: 'PENDING' | 'SENT' | 'FAILED',
    errorMsg?: string,
  ): Promise<NotificationLog> {
    return await this.prisma.notificationLog.update({
      where: { id },
      data: {
        status,
        ...(errorMsg && { errorMsg }),
      },
    });
  }

  async findByRule(ruleId: number): Promise<NotificationLog[]> {
    return await this.prisma.notificationLog.findMany({
      where: { ruleId },
      include: {
        product: true,
        warehouse: true,
        batch: true,
      },
      orderBy: { triggeredAt: 'desc' },
    });
  }
}
