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

// New notification interfaces for frontend notifications
export interface Notification {
  id: string
  type: 'low_stock' | 'expiring_soon' | 'stock_out' | 'system' | 'production' | 'purchase' | 'sale'
  title?: string
  product_name?: string
  sku?: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'unread' | 'read' | 'archived'
  created_at: string
  read_at?: string
  
  // Related entities
  product_id?: string
  warehouse_id?: string
  warehouse?: string
  batch_id?: string
  user_id?: string
  
  // Additional metadata
  metadata?: {
    current_stock?: number
    min_stock?: number
    expiry_date?: string
    action_required?: boolean
    priority?: number
  }
}

export interface NotificationSummary {
  total_count: number
  unread_count: number
  critical_count: number
  high_priority_count: number
  types: {
    low_stock: number
    expiring_soon: number
    stock_out: number
    system: number
    production: number
    purchase: number
    sale: number
  }
}

export interface CreateNotificationDto {
  type: Notification['type']
  title?: string
  message: string
  severity: Notification['severity']
  product_id?: string
  warehouse_id?: string
  batch_id?: string
  metadata?: Notification['metadata']
}

export interface UpdateNotificationDto {
  status?: Notification['status']
  read_at?: string
}

export interface NotificationFilters {
  status?: 'unread' | 'read' | 'archived'
  type?: Notification['type']
  severity?: Notification['severity']
  product_id?: string
  warehouse_id?: string
  date_from?: string
  date_to?: string
}
