import { IsNotEmpty, IsNumber, IsDate, IsArray, ValidateNested, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum PurchaseOrderStatus {
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export class CreatePurchaseOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;
}

export class CreatePurchaseOrderDto {
  @IsNotEmpty()
  @IsNumber()
  supplierId: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  orderDate: Date;

  @IsOptional()
  @IsEnum(PurchaseOrderStatus)
  status?: PurchaseOrderStatus;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderItemDto)
  purchaseOrderItems: CreatePurchaseOrderItemDto[];
}
