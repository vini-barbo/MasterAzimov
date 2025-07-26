import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { NotificationRuleService } from './notification-rule.service';
import { NotificationLogService } from './notification-log.service';
import { NotificationRuleController } from './notification-rule.controller';
import { NotificationLogController } from './notification-log.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationRuleController, NotificationLogController],
  providers: [NotificationRuleService, NotificationLogService],
  exports: [NotificationRuleService, NotificationLogService],
})
export class NotificationModule {}
