import { Batch, CreateBatchDto, UpdateBatchDto, BatchResponse, ExpiringBatch } from '../types/batch.types'

export class BatchMapper {
  /**
   * Map API response to Batch interface
   */
  static fromApiResponse(apiBatch: any): Batch {
    return {
      id: apiBatch.id,
      batch_number: apiBatch.batch_number,
      product_id: apiBatch.product_id,
      product_name: apiBatch.product_name,
      product_sku: apiBatch.product_sku,
      warehouse_id: apiBatch.warehouse_id,
      warehouse_name: apiBatch.warehouse_name,
      quantity: Number(apiBatch.quantity),
      cost_per_unit: apiBatch.cost_per_unit ? Number(apiBatch.cost_per_unit) : undefined,
      expiration_date: apiBatch.expiration_date,
      production_date: apiBatch.production_date,
      supplier_id: apiBatch.supplier_id,
      supplier_name: apiBatch.supplier_name,
      is_active: apiBatch.is_active ?? true,
      created_at: apiBatch.created_at,
      updated_at: apiBatch.updated_at,
    }
  }

  /**
   * Map Batch to API request payload
   */
  static toApiRequest(batch: CreateBatchDto | UpdateBatchDto): any {
    return {
      batch_number: batch.batch_number,
      product_id: batch.product_id,
      warehouse_id: batch.warehouse_id,
      quantity: batch.quantity,
      cost_per_unit: batch.cost_per_unit,
      expiration_date: batch.expiration_date,
      production_date: batch.production_date,
      supplier_id: batch.supplier_id,
      is_active: batch.is_active,
    }
  }

  /**
   * Map array of API responses to Batch array
   */
  static fromApiResponseArray(apiBatches: any[]): Batch[] {
    return apiBatches.map(batch => this.fromApiResponse(batch))
  }

  /**
   * Map ExpiringBatch from API response
   */
  static fromApiExpiringBatchResponse(apiBatch: any): ExpiringBatch {
    return {
      ...this.fromApiResponse(apiBatch),
      days_to_expire: Number(apiBatch.days_to_expire),
    }
  }

  /**
   * Map Batch for display purposes
   */
  static toDisplayBatch(batch: Batch): {
    id: string | number
    batchNumber: string
    productName: string
    productSku: string
    warehouseName: string
    quantity: string
    expirationDate: string
    status: string
    expirationStatus: string
  } {
    return {
      id: batch.id,
      batchNumber: batch.batch_number,
      productName: batch.product_name || 'N/A',
      productSku: batch.product_sku || 'N/A',
      warehouseName: batch.warehouse_name || 'N/A',
      quantity: batch.quantity.toString(),
      expirationDate: batch.expiration_date
        ? new Date(batch.expiration_date).toLocaleDateString('pt-BR')
        : 'Sem vencimento',
      status: batch.is_active ? 'Ativo' : 'Inativo',
      expirationStatus: this.getExpirationStatus(batch.expiration_date),
    }
  }

  /**
   * Get expiration status for display
   */
  private static getExpirationStatus(expirationDate?: string): string {
    if (!expirationDate) return 'Sem vencimento'

    const today = new Date()
    const expDate = new Date(expirationDate)
    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Vencido'
    if (diffDays === 0) return 'Vence hoje'
    if (diffDays <= 7) return 'Próximo ao vencimento'
    if (diffDays <= 30) return 'Vence em breve'

    return 'No prazo'
  }

  /**
   * Calculate days to expiration
   */
  static calculateDaysToExpiration(expirationDate?: string): number | null {
    if (!expirationDate) return null

    const today = new Date()
    const expDate = new Date(expirationDate)
    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  /**
   * Validate batch data
   */
  static validate(batch: CreateBatchDto | UpdateBatchDto): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if ('batch_number' in batch && batch.batch_number && batch.batch_number.trim().length < 1) {
      errors.push('Número do lote é obrigatório')
    }

    if ('quantity' in batch && batch.quantity !== undefined && batch.quantity <= 0) {
      errors.push('Quantidade deve ser maior que zero')
    }

    if ('cost_per_unit' in batch && batch.cost_per_unit !== undefined && batch.cost_per_unit < 0) {
      errors.push('Custo por unidade deve ser maior ou igual a zero')
    }

    if ('expiration_date' in batch && batch.expiration_date) {
      const expDate = new Date(batch.expiration_date)
      if (isNaN(expDate.getTime())) {
        errors.push('Data de vencimento inválida')
      }
    }

    if ('production_date' in batch && batch.production_date) {
      const prodDate = new Date(batch.production_date)
      if (isNaN(prodDate.getTime())) {
        errors.push('Data de produção inválida')
      }

      if (batch.expiration_date) {
        const expDate = new Date(batch.expiration_date)
        if (prodDate > expDate) {
          errors.push('Data de produção deve ser anterior à data de vencimento')
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
