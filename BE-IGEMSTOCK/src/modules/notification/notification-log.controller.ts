import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { NotificationLogService } from './notification-log.service';

@ApiTags('notification-logs')
@Controller('notification-logs')
export class NotificationLogController {
  constructor(
    private readonly notificationLogService: NotificationLogService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all notification logs' })
  @ApiResponse({ status: 200, description: 'Return all notification logs.' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
    enum: ['PENDING', 'SENT', 'FAILED'],
  })
  findAll(@Query('status') status?: 'PENDING' | 'SENT' | 'FAILED') {
    if (status) {
      return this.notificationLogService.findByStatus(status);
    }
    return this.notificationLogService.findAll();
  }

  @Get('rule/:ruleId')
  @ApiOperation({ summary: 'Get notification logs by rule' })
  @ApiResponse({
    status: 200,
    description: 'Return notification logs for rule.',
  })
  findByRule(@Param('ruleId', ParseIntPipe) ruleId: number) {
    return this.notificationLogService.findByRule(ruleId);
  }
}
