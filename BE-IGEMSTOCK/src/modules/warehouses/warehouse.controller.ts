import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto';

@ApiTags('warehouses')
@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiResponse({ status: 201, description: 'Warehouse successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all warehouses' })
  @ApiResponse({ status: 200, description: 'Return all warehouses.' })
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a warehouse by id' })
  @ApiResponse({ status: 200, description: 'Return the warehouse.' })
  @ApiResponse({ status: 404, description: 'Warehouse not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseService.findOne(id);
  }

  @Get(':id/stock')
  @ApiOperation({ summary: 'Get stock levels in a warehouse' })
  @ApiResponse({ status: 200, description: 'Return stock levels.' })
  @ApiResponse({ status: 404, description: 'Warehouse not found.' })
  getStockLevels(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseService.getStockLevels(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a warehouse' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Warehouse not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehouseService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a warehouse' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Warehouse not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseService.remove(id);
  }
}
