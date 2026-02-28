/**
 * Shared status utility functions for orders, deliverables, and payments.
 * Centralizes status-to-label and status-to-variant mappings to avoid duplication.
 */

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

// ─── Order Status ────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'REVIEWING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED'

export function getOrderStatusVariant(status: string): BadgeVariant {
  switch (status as OrderStatus) {
    case 'PENDING':    return 'secondary'
    case 'CONFIRMED':  return 'default'
    case 'IN_PROGRESS': return 'default'
    case 'REVIEWING':  return 'secondary'
    case 'COMPLETED':  return 'default'
    case 'CANCELLED':  return 'destructive'
    case 'DISPUTED':   return 'destructive'
    default:           return 'outline'
  }
}

export function getOrderStatusLabel(status: string): string {
  switch (status as OrderStatus) {
    case 'PENDING':    return '待确认'
    case 'CONFIRMED':  return '已确认'
    case 'IN_PROGRESS': return '进行中'
    case 'REVIEWING':  return '待验收'
    case 'COMPLETED':  return '已完成'
    case 'CANCELLED':  return '已取消'
    case 'DISPUTED':   return '争议中'
    default:           return status
  }
}

// ─── Payment Status ──────────────────────────────────────────────────────────

export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED' | 'PARTIAL'

export function getPaymentStatusVariant(status: string): BadgeVariant {
  switch (status as PaymentStatus) {
    case 'PAID':     return 'default'
    case 'UNPAID':   return 'destructive'
    case 'PARTIAL':  return 'secondary'
    case 'REFUNDED': return 'outline'
    default:         return 'outline'
  }
}

export function getPaymentStatusLabel(status: string): string {
  switch (status as PaymentStatus) {
    case 'PAID':     return '已支付'
    case 'UNPAID':   return '未支付'
    case 'PARTIAL':  return '部分支付'
    case 'REFUNDED': return '已退款'
    default:         return status
  }
}

// ─── Deliverable Status ──────────────────────────────────────────────────────

export type DeliverableStatus = 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'

export function getDeliverableStatusVariant(status: string): BadgeVariant {
  switch (status as DeliverableStatus) {
    case 'PENDING':   return 'secondary'
    case 'SUBMITTED': return 'default'
    case 'APPROVED':  return 'default'
    case 'REJECTED':  return 'destructive'
    default:          return 'outline'
  }
}

export function getDeliverableStatusLabel(status: string): string {
  switch (status as DeliverableStatus) {
    case 'PENDING':   return '待提交'
    case 'SUBMITTED': return '已提交'
    case 'APPROVED':  return '已通过'
    case 'REJECTED':  return '已拒绝'
    default:          return status
  }
}

// ─── Project Priority ────────────────────────────────────────────────────────

export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export function getPriorityVariant(priority: string): BadgeVariant {
  switch (priority as ProjectPriority) {
    case 'URGENT': return 'destructive'
    case 'HIGH':   return 'default'
    case 'MEDIUM': return 'secondary'
    case 'LOW':    return 'outline'
    default:       return 'outline'
  }
}

export function getPriorityLabel(priority: string): string {
  switch (priority as ProjectPriority) {
    case 'URGENT': return '紧急'
    case 'HIGH':   return '高优先级'
    case 'MEDIUM': return '中优先级'
    case 'LOW':    return '低优先级'
    default:       return priority
  }
}

// ─── Project Status ──────────────────────────────────────────────────────────

export type ProjectStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'BIDDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'SUSPENDED'

export function getProjectStatusLabel(status: string): string {
  switch (status as ProjectStatus) {
    case 'DRAFT':       return '草稿'
    case 'PUBLISHED':   return '已发布'
    case 'BIDDING':     return '招标中'
    case 'IN_PROGRESS': return '进行中'
    case 'COMPLETED':   return '已完成'
    case 'CANCELLED':   return '已取消'
    case 'SUSPENDED':   return '已暂停'
    default:            return status
  }
}
