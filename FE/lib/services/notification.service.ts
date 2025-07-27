import { httpClient } from './http-client'
import { API_ENDPOINTS } from '../config/env'
import { NotificationMapper } from '../mappers/notification.mapper'
import { NotificationRule, CreateNotificationRuleDto, UpdateNotificationRuleDto, NotificationLog, NotificationRuleQueryParams, NotificationLogQueryParams } from '../types/notification.types'

export class NotificationService {
  private static readonly RULES_PATH = '/notification-rules'
  private static readonly LOGS_PATH = '/notification-logs'

  // Notification Rules endpoints
  static async getAllRules(params?: NotificationRuleQueryParams): Promise<NotificationRule[]> {
    const response = await httpClient.get<any[]>(this.RULES_PATH, { params })
    return response.map(rule => NotificationMapper.fromApiRuleResponse(rule))
  }

  static async getRuleById(id: string | number): Promise<NotificationRule> {
    const response = await httpClient.get<any>(`${this.RULES_PATH}/${id}`)
    return NotificationMapper.fromApiRuleResponse(response)
  }

  static async createRule(ruleData: CreateNotificationRuleDto): Promise<NotificationRule> {
    const payload = NotificationMapper.toApiRuleRequest(ruleData)
    const response = await httpClient.post<any>(this.RULES_PATH, payload)
    return NotificationMapper.fromApiRuleResponse(response)
  }

  static async updateRule(id: string | number, ruleData: UpdateNotificationRuleDto): Promise<NotificationRule> {
    const payload = NotificationMapper.toApiRuleRequest(ruleData)
    const response = await httpClient.patch<any>(`${this.RULES_PATH}/${id}`, payload)
    return NotificationMapper.fromApiRuleResponse(response)
  }

  static async deleteRule(id: string | number): Promise<void> {
    await httpClient.delete(`${this.RULES_PATH}/${id}`)
  }

  // Notification Logs endpoints
  static async getAllLogs(params?: NotificationLogQueryParams): Promise<NotificationLog[]> {
    const response = await httpClient.get<any[]>(this.LOGS_PATH, { params })
    return response.map(log => NotificationMapper.fromApiLogResponse(log))
  }

  static async getLogById(id: string | number): Promise<NotificationLog> {
    const response = await httpClient.get<any>(`${this.LOGS_PATH}/${id}`)
    return NotificationMapper.fromApiLogResponse(response)
  }

  static async getLogsByRule(ruleId: string | number): Promise<NotificationLog[]> {
    const response = await httpClient.get<any[]>(`${this.LOGS_PATH}/rule/${ruleId}`)
    return response.map(log => NotificationMapper.fromApiLogResponse(log))
  }
}
