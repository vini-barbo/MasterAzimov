import { NotificationRule, CreateNotificationRuleDto, UpdateNotificationRuleDto, NotificationLog } from '../types/notification.types'

export class NotificationMapper {
  static fromApiRuleResponse(apiRule: any): NotificationRule {
    return {
      id: apiRule.id,
      name: apiRule.name,
      type: apiRule.type,
      description: apiRule.description,
      conditions: apiRule.conditions || [],
      recipients: apiRule.recipients || [],
      is_active: apiRule.is_active ?? true,
      template: apiRule.template,
      created_at: apiRule.created_at,
      updated_at: apiRule.updated_at,
    }
  }

  static fromApiLogResponse(apiLog: any): NotificationLog {
    return {
      id: apiLog.id,
      rule_id: apiLog.rule_id,
      rule_name: apiLog.rule_name,
      status: apiLog.status,
      recipient: apiLog.recipient,
      subject: apiLog.subject,
      message: apiLog.message,
      error_message: apiLog.error_message,
      sent_at: apiLog.sent_at,
      retry_count: Number(apiLog.retry_count),
      created_at: apiLog.created_at,
      updated_at: apiLog.updated_at,
    }
  }

  static toApiRuleRequest(rule: CreateNotificationRuleDto | UpdateNotificationRuleDto): any {
    return {
      name: rule.name,
      type: rule.type,
      description: rule.description,
      conditions: rule.conditions,
      recipients: rule.recipients,
      is_active: rule.is_active,
      template: rule.template,
    }
  }

  static toDisplayRule(rule: NotificationRule) {
    return {
      id: rule.id,
      name: rule.name,
      type: this.getRuleTypeDisplay(rule.type),
      recipientsCount: rule.recipients.length,
      status: rule.is_active ? 'Ativo' : 'Inativo',
      createdAt: new Date(rule.created_at).toLocaleDateString('pt-BR'),
    }
  }

  static toDisplayLog(log: NotificationLog) {
    return {
      id: log.id,
      ruleName: log.rule_name || 'N/A',
      recipient: log.recipient,
      status: this.getLogStatusDisplay(log.status),
      sentAt: log.sent_at ? new Date(log.sent_at).toLocaleDateString('pt-BR') : 'Não enviado',
      retryCount: log.retry_count.toString(),
    }
  }

  private static getRuleTypeDisplay(type: string): string {
    const types: Record<string, string> = {
      'LOW_STOCK': 'Estoque Baixo',
      'EXPIRING_BATCH': 'Lote Vencendo',
      'SALE_COMPLETED': 'Venda Concluída',
      'PURCHASE_RECEIVED': 'Compra Recebida',
    }
    return types[type] || type
  }

  private static getLogStatusDisplay(status: string): string {
    const statuses: Record<string, string> = {
      'PENDING': 'Pendente',
      'SENT': 'Enviado',
      'FAILED': 'Falhou',
    }
    return statuses[status] || status
  }
}
