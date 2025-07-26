import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SaleItemService } from './sale-item.service';
import { CreateSaleItemDto } from './dto';

@ApiTags('sale-items')
@Controller('sale-items')
export class SaleItemController {
  constructor(private readonly saleItemService: SaleItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale item' })
  @ApiResponse({ status: 201, description: 'Sale item successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createSaleItemDto: CreateSaleItemDto) {
    return this.saleItemService.create(createSaleItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sale items' })
  @ApiResponse({ status: 200, description: 'Return all sale items.' })
  findAll() {
    return this.saleItemService.findAll();
  }

  @Get('top-selling')
  @ApiOperation({ summary: 'Get top selling products' })
  @ApiResponse({ status: 200, description: 'Return top selling products.' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of top products to return (default: 10)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for filtering',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for filtering',
  })
  getTopSellingProducts(
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.saleItemService.getTopSellingProducts(limitNum, start, end);
  }

  @Get('sale/:saleId')
  @ApiOperation({ summary: 'Get sale items by sale' })
  @ApiResponse({ status: 200, description: 'Return sale items for sale.' })
  findBySale(@Param('saleId', ParseIntPipe) saleId: number) {
    return this.saleItemService.findBySale(saleId);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get sale items by product' })
  @ApiResponse({ status: 200, description: 'Return sale items for product.' })
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.saleItemService.findByProduct(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sale item by id' })
  @ApiResponse({ status: 200, description: 'Return the sale item.' })
  @ApiResponse({ status: 404, description: 'Sale item not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.saleItemService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sale item' })
  @ApiResponse({ status: 200, description: 'Sale item successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Sale item not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.saleItemService.remove(id);
  }
}
