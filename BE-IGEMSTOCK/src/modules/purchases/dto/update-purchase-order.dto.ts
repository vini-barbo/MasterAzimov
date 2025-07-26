import { PartialType } from '@nestjs/mapped-types';
import {
  CreatePurchaseOrderDto,
  PurchaseOrderStatus,
} from './create-purchase-order.dto';
import { IsOptional, IsNumber, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePurchaseOrderDto extends PartialType(
  CreatePurchaseOrderDto,
) {
  @IsOptional()
  @IsNumber()
  supplierId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  orderDate?: Date;

  @IsOptional()
  @IsEnum(PurchaseOrderStatus)
  status?: PurchaseOrderStatus;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;
}
