import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BatchService } from './batch.service';
import { CreateBatchDto, UpdateBatchDto } from './dto';

@ApiTags('batches')
@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new batch' })
  @ApiResponse({ status: 201, description: 'Batch successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createBatchDto: CreateBatchDto) {
    return this.batchService.create(createBatchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all batches' })
  @ApiResponse({ status: 200, description: 'Return all batches.' })
  findAll() {
    return this.batchService.findAll();
  }

  @Get('expiring')
  @ApiOperation({ summary: 'Get batches expiring soon' })
  @ApiResponse({ status: 200, description: 'Return expiring batches.' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to look ahead (default: 30)',
  })
  findExpiringBatches(@Query('days') days?: string) {
    const daysAhead = days ? parseInt(days, 10) : 30;
    return this.batchService.findExpiringBatches(daysAhead);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get batches by product' })
  @ApiResponse({ status: 200, description: 'Return batches for product.' })
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.batchService.findByProduct(productId);
  }

  @Get('warehouse/:warehouseId')
  @ApiOperation({ summary: 'Get batches by warehouse' })
  @ApiResponse({ status: 200, description: 'Return batches in warehouse.' })
  findByWarehouse(@Param('warehouseId', ParseIntPipe) warehouseId: number) {
    return this.batchService.findByWarehouse(warehouseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a batch by id' })
  @ApiResponse({ status: 200, description: 'Return the batch.' })
  @ApiResponse({ status: 404, description: 'Batch not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.batchService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a batch' })
  @ApiResponse({ status: 200, description: 'Batch successfully updated.' })
  @ApiResponse({ status: 404, description: 'Batch not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBatchDto: UpdateBatchDto,
  ) {
    return this.batchService.update(id, updateBatchDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a batch' })
  @ApiResponse({ status: 200, description: 'Batch successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Batch not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.batchService.remove(id);
  }
}
