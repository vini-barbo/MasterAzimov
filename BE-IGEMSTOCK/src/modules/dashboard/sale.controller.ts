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
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto';

@ApiTags('sales')
@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale' })
  @ApiResponse({ status: 201, description: 'Sale successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.saleService.create(createSaleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sales' })
  @ApiResponse({ status: 200, description: 'Return all sales.' })
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
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (startDate && endDate) {
      return this.saleService.findByDateRange(
        new Date(startDate),
        new Date(endDate),
      );
    }
    return this.saleService.findAll();
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get sales summary' })
  @ApiResponse({ status: 200, description: 'Return sales summary.' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for summary',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for summary',
  })
  getSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.saleService.getSalesSummary(start, end);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sale by id' })
  @ApiResponse({ status: 200, description: 'Return the sale.' })
  @ApiResponse({ status: 404, description: 'Sale not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.saleService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sale' })
  @ApiResponse({ status: 200, description: 'Sale successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Sale not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.saleService.remove(id);
  }
}
