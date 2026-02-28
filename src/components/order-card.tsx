'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, DollarSign, User, Eye, MessageCircle, CheckCircle } from 'lucide-react'
import {
  getOrderStatusVariant,
  getOrderStatusLabel,
  getPaymentStatusVariant,
  getPaymentStatusLabel,
} from '@/lib/status-utils'

export interface OrderSummary {
  id: string
  orderNo: string
  projectTitle: string
  amount: number
  status: string
  paymentStatus?: string
  progress: number
  deadline?: Date
  createdAt: Date
  completedAt?: Date
  client: { id: string; name: string }
  developer: { id: string; name: string }
}

interface OrderCardProps {
  order: OrderSummary
  userRole: 'CLIENT' | 'DEVELOPER'
  /** Whether to show the payment status badge */
  showPaymentStatus?: boolean
  onView: (orderId: string) => void
  onContact: (order: OrderSummary) => void
}

/**
 * Reusable order card used in the orders list page.
 * Replaces the three near-identical card blocks that previously existed.
 */
export function OrderCard({
  order,
  userRole,
  showPaymentStatus = false,
  onView,
  onContact,
}: OrderCardProps) {
  const counterpartName =
    userRole === 'CLIENT' ? order.developer.name : order.client.name

  const isActive =
    order.status !== 'COMPLETED' && order.status !== 'CANCELLED'

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {/* Title row */}
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{order.projectTitle}</h3>
              <Badge variant={getOrderStatusVariant(order.status)}>
                {getOrderStatusLabel(order.status)}
              </Badge>
              {showPaymentStatus && order.paymentStatus && (
                <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
                  {getPaymentStatusLabel(order.paymentStatus)}
                </Badge>
              )}
              {order.status === 'REVIEWING' && (
                <span className="text-orange-600 text-sm font-medium">待验收</span>
              )}
              {order.status === 'COMPLETED' && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
              <span>订单号: {order.orderNo}</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>创建于 {order.createdAt.toLocaleDateString()}</span>
              </div>
              {order.deadline && order.status !== 'COMPLETED' && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>截止 {order.deadline.toLocaleDateString()}</span>
                </div>
              )}
              {order.completedAt && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>完成于 {order.completedAt.toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-medium">¥{order.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4 text-blue-600" />
                <span>{counterpartName}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <span>{order.progress}%</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 ml-4">
            <Button variant="outline" size="sm" onClick={() => onView(order.id)}>
              <Eye className="w-4 h-4 mr-1" />
              查看详情
            </Button>
            {isActive && (
              <Button variant="outline" size="sm" onClick={() => onContact(order)}>
                <MessageCircle className="w-4 h-4 mr-1" />
                联系
              </Button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>项目进度</span>
            <span>{order.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${order.progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
