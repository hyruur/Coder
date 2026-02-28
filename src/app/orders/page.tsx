'use client'

import { useState, useCallback, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Filter, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { OrderCard, OrderSummary } from '@/components/order-card'
import { StatCard } from '@/components/stat-card'
import { Briefcase, Clock, CheckCircle, DollarSign } from 'lucide-react'

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockOrders: OrderSummary[] = [
  {
    id: '1',
    orderNo: 'ORD20240115001',
    projectTitle: '企业官网开发项目',
    amount: 15000,
    status: 'IN_PROGRESS',
    paymentStatus: 'PAID',
    progress: 65,
    deadline: new Date('2024-02-15'),
    createdAt: new Date('2024-01-15'),
    client: { id: 'client1', name: '张三' },
    developer: { id: 'dev1', name: '李四' },
  },
  {
    id: '2',
    orderNo: 'ORD20240110001',
    projectTitle: '微信小程序开发',
    amount: 25000,
    status: 'REVIEWING',
    paymentStatus: 'PAID',
    progress: 95,
    deadline: new Date('2024-01-25'),
    createdAt: new Date('2024-01-10'),
    client: { id: 'client2', name: '王五' },
    developer: { id: 'dev2', name: '赵六' },
  },
  {
    id: '3',
    orderNo: 'ORD20240108001',
    projectTitle: '企业管理系统',
    amount: 50000,
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    progress: 100,
    deadline: new Date('2024-01-20'),
    completedAt: new Date('2024-01-18'),
    createdAt: new Date('2024-01-08'),
    client: { id: 'client3', name: '孙七' },
    developer: { id: 'dev3', name: '周八' },
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const router = useRouter()
  const [orders] = useState<OrderSummary[]>(mockOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [userRole] = useState<'CLIENT' | 'DEVELOPER'>('DEVELOPER')

  // Derived filtered list – recomputed only when deps change
  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return orders.filter(order => {
      const matchesSearch =
        !q ||
        order.orderNo.toLowerCase().includes(q) ||
        order.projectTitle.toLowerCase().includes(q)
      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, statusFilter])

  const filterByStatus = useCallback(
    (status: string) =>
      status === 'all'
        ? filteredOrders
        : filteredOrders.filter(o => o.status === status),
    [filteredOrders],
  )

  const orderStats = useMemo(
    () => ({
      total: orders.length,
      inProgress: orders.filter(o => o.status === 'IN_PROGRESS').length,
      reviewing: orders.filter(o => o.status === 'REVIEWING').length,
      completed: orders.filter(o => o.status === 'COMPLETED').length,
      totalAmount: orders.reduce((sum, o) => sum + o.amount, 0),
    }),
    [orders],
  )

  const handleViewOrder = useCallback(
    (orderId: string) => router.push(`/orders/${orderId}`),
    [router],
  )

  const handleContact = useCallback((order: OrderSummary) => {
    console.log('联系对方:', order)
  }, [])

  const renderOrderList = (statusKey: string) =>
    filterByStatus(statusKey).map(order => (
      <OrderCard
        key={order.id}
        order={order}
        userRole={userRole}
        showPaymentStatus={statusKey === 'all'}
        onView={handleViewOrder}
        onContact={handleContact}
      />
    ))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <StatCard icon={Briefcase}  iconClassName="text-blue-600"   label="总订单"  value={orderStats.total} />
          <StatCard icon={Clock}      iconClassName="text-orange-600" label="进行中"  value={orderStats.inProgress} />
          <StatCard icon={CheckCircle} iconClassName="text-purple-600" label="待验收" value={orderStats.reviewing} />
          <StatCard icon={CheckCircle} iconClassName="text-green-600"  label="已完成" value={orderStats.completed} />
          <StatCard
            icon={DollarSign}
            iconClassName="text-gray-800"
            label="总金额"
            value={`¥${(orderStats.totalAmount / 10000).toFixed(1)}万`}
          />
        </div>

        {/* Search & filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索订单号、项目名称..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="PENDING">待确认</SelectItem>
                  <SelectItem value="CONFIRMED">已确认</SelectItem>
                  <SelectItem value="IN_PROGRESS">进行中</SelectItem>
                  <SelectItem value="REVIEWING">待验收</SelectItem>
                  <SelectItem value="COMPLETED">已完成</SelectItem>
                  <SelectItem value="CANCELLED">已取消</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Order tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">全部订单</TabsTrigger>
            <TabsTrigger value="in_progress">进行中</TabsTrigger>
            <TabsTrigger value="reviewing">待验收</TabsTrigger>
            <TabsTrigger value="completed">已完成</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">{renderOrderList('all')}</div>
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            <div className="grid gap-4">{renderOrderList('IN_PROGRESS')}</div>
          </TabsContent>

          <TabsContent value="reviewing" className="space-y-4">
            <div className="grid gap-4">{renderOrderList('REVIEWING')}</div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4">{renderOrderList('COMPLETED')}</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
