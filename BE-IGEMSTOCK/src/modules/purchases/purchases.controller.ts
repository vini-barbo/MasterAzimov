import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) { }

  @Post()
  create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return this.purchasesService.create(createPurchaseOrderDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.purchasesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    return this.purchasesService.update(+id, updatePurchaseOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasesService.remove(+id);
  }

  @Post(':id/receive')
  receive(@Param('id') id: string) {
    return this.purchasesService.receivePurchaseOrder(+id);
  }
}
