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
import { NotificationRuleService } from './notification-rule.service';
import { CreateNotificationRuleDto, UpdateNotificationRuleDto } from './dto';

@ApiTags('notification-rules')
@Controller('notification-rules')
export class NotificationRuleController {
  constructor(
    private readonly notificationRuleService: NotificationRuleService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification rule' })
  @ApiResponse({
    status: 201,
    description: 'Notification rule successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createNotificationRuleDto: CreateNotificationRuleDto) {
    return this.notificationRuleService.create(createNotificationRuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notification rules' })
  @ApiResponse({ status: 200, description: 'Return all notification rules.' })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by rule type',
    enum: ['LOW_STOCK', 'EXPIRY'],
  })
  findAll(@Query('type') type?: 'LOW_STOCK' | 'EXPIRY') {
    if (type) {
      return this.notificationRuleService.findByType(type);
    }
    return this.notificationRuleService.findAll();
  }

  @Get('alerts/low-stock')
  @ApiOperation({ summary: 'Check for low stock alerts' })
  @ApiResponse({ status: 200, description: 'Return low stock alerts.' })
  checkLowStockAlerts() {
    return this.notificationRuleService.checkLowStockAlerts();
  }

  @Get('alerts/expiry')
  @ApiOperation({ summary: 'Check for expiry alerts' })
  @ApiResponse({ status: 200, description: 'Return expiry alerts.' })
  checkExpiryAlerts() {
    return this.notificationRuleService.checkExpiryAlerts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a notification rule by id' })
  @ApiResponse({ status: 200, description: 'Return the notification rule.' })
  @ApiResponse({ status: 404, description: 'Notification rule not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationRuleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a notification rule' })
  @ApiResponse({
    status: 200,
    description: 'Notification rule successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Notification rule not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationRuleDto: UpdateNotificationRuleDto,
  ) {
    return this.notificationRuleService.update(id, updateNotificationRuleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification rule' })
  @ApiResponse({
    status: 200,
    description: 'Notification rule successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Notification rule not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notificationRuleService.remove(id);
  }
}
