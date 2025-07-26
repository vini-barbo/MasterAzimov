import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StockMovementService } from './stock-movement.service';
import { CreateStockMovementDto } from './dto';

@ApiTags('stock-movements')
@Controller('stock-movements')
export class StockMovementController {
  constructor(private readonly stockMovementService: StockMovementService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new stock movement' })
  @ApiResponse({
    status: 201,
    description: 'Stock movement successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createStockMovementDto: CreateStockMovementDto) {
    return this.stockMovementService.create(createStockMovementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stock movements' })
  @ApiResponse({ status: 200, description: 'Return all stock movements.' })
  findAll() {
    return this.stockMovementService.findAll();
  }

  @Get('stock-on-hand')
  @ApiOperation({ summary: 'Get current stock on hand' })
  @ApiResponse({ status: 200, description: 'Return stock on hand view.' })
  getStockOnHand() {
    return this.stockMovementService.getStockOnHand();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a stock movement by id' })
  @ApiResponse({ status: 200, description: 'Return the stock movement.' })
  @ApiResponse({ status: 404, description: 'Stock movement not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stockMovementService.findOne(id);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get stock movements by product' })
  @ApiResponse({
    status: 200,
    description: 'Return stock movements for product.',
  })
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.stockMovementService.findByProduct(productId);
  }

  @Get('warehouse/:warehouseId')
  @ApiOperation({ summary: 'Get stock movements by warehouse' })
  @ApiResponse({
    status: 200,
    description: 'Return stock movements for warehouse.',
  })
  findByWarehouse(@Param('warehouseId', ParseIntPipe) warehouseId: number) {
    return this.stockMovementService.findByWarehouse(warehouseId);
  }

  @Get('batch/:batchId')
  @ApiOperation({ summary: 'Get stock movements by batch' })
  @ApiResponse({
    status: 200,
    description: 'Return stock movements for batch.',
  })
  findByBatch(@Param('batchId', ParseIntPipe) batchId: number) {
    return this.stockMovementService.findByBatch(batchId);
  }
}
