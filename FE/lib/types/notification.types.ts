import { BaseEntity } from './common.types'

export type NotificationRuleType = 'LOW_STOCK' | 'EXPIRING_BATCH' | 'SALE_COMPLETED' | 'PURCHASE_RECEIVED'
export type NotificationLogStatus = 'PENDING' | 'SENT' | 'FAILED'

export interface NotificationRule extends BaseEntity {
  name: string
  type: NotificationRuleType
  description?: string
  conditions: NotificationCondition[]
  recipients: string[]
  is_active: boolean
  template?: string
}

export interface NotificationCondition {
  field: string
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains'
  value: string | number
}

export interface CreateNotificationRuleDto {
  name: string
  type: NotificationRuleType
  description?: string
  conditions: NotificationCondition[]
  recipients: string[]
  is_active?: boolean
  template?: string
}

export interface UpdateNotificationRuleDto {
  name?: string
  type?: NotificationRuleType
  description?: string
  conditions?: NotificationCondition[]
  recipients?: string[]
  is_active?: boolean
  template?: string
}

export interface NotificationRuleQueryParams {
  is_active?: boolean
  type?: NotificationRuleType
  page?: number
  limit?: number
}

export interface NotificationLog extends BaseEntity {
  rule_id: string | number
  rule_name?: string
  status: NotificationLogStatus
  recipient: string
  subject?: string
  message: string
  error_message?: string
  sent_at?: string
  retry_count: number
}

export interface NotificationLogQueryParams {
  status?: NotificationLogStatus
  rule_id?: string | number
  recipient?: string
  start_date?: string
  end_date?: string
  page?: number
  limit?: number
}

export interface NotificationRuleResponse extends NotificationRule {
  // Additional fields that might come from the API
  last_executed_at?: string
  execution_count?: number
}

export interface NotificationLogResponse extends NotificationLog {
  // Additional fields that might come from the API
}
