'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatCard } from './stat-card'
import {
  User, FileText, DollarSign, Star, MessageSquare, Settings,
  Calendar, CheckCircle,
  Briefcase, Award, CreditCard, Clock,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getOrderStatusVariant, getOrderStatusLabel } from '@/lib/status-utils'

interface UserDashboardProps {
  userRole: 'CLIENT' | 'DEVELOPER'
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockStats = {
  totalOrders: 12,
  completedOrders: 8,
  inProgressOrders: 3,
  reviewingOrders: 1,
  totalEarnings: 156000,
  pendingEarnings: 45000,
  averageRating: 4.8,
  totalReviews: 15,
}

const recentOrders = [
  {
    id: '1',
    title: '企业官网开发项目',
    status: 'IN_PROGRESS',
    progress: 65,
    amount: 15000,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: '微信小程序开发',
    status: 'REVIEWING',
    progress: 95,
    amount: 25000,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    title: '企业管理系统',
    status: 'COMPLETED',
    progress: 100,
    amount: 50000,
    createdAt: new Date('2024-01-08'),
    completedAt: new Date('2024-01-18'),
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function UserDashboard({ userRole }: UserDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const handleViewOrders = useCallback(() => router.push('/orders'), [router])
  const handleViewOrderDetail = useCallback(
    (orderId: string) => router.push(`/orders/${orderId}`),
    [router],
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              {userRole === 'CLIENT' ? '需求方工作台' : '程序员工作台'}
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                设置
              </Button>
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                消息
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="orders">订单管理</TabsTrigger>
            <TabsTrigger value="finance">财务管理</TabsTrigger>
            <TabsTrigger value="profile">个人资料</TabsTrigger>
          </TabsList>

          {/* ── Overview ── */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Briefcase}    iconClassName="text-blue-600"   label="总订单"  value={mockStats.totalOrders} />
              <StatCard icon={CheckCircle}  iconClassName="text-green-600"  label="已完成"  value={mockStats.completedOrders} />
              <StatCard icon={Clock}        iconClassName="text-orange-600" label="进行中"  value={mockStats.inProgressOrders} />
              <StatCard icon={Star}         iconClassName="text-yellow-600" label="平均评分" value={mockStats.averageRating} />
            </div>

            {/* Earnings (developer only) */}
            {userRole === 'DEVELOPER' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard
                  icon={DollarSign}
                  iconClassName="text-green-600"
                  label="总收入"
                  value={`¥${(mockStats.totalEarnings / 10000).toFixed(1)}万`}
                />
                <StatCard
                  icon={CreditCard}
                  iconClassName="text-purple-600"
                  label="待结算"
                  value={`¥${mockStats.pendingEarnings.toLocaleString()}`}
                />
              </div>
            )}

            {/* Recent orders */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>最近订单</CardTitle>
                  <Button variant="outline" onClick={handleViewOrders}>
                    查看全部
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map(order => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{order.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>¥{order.amount.toLocaleString()}</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{order.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={getOrderStatusVariant(order.status)}>
                          {getOrderStatusLabel(order.status)}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-medium">{order.progress}%</div>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${order.progress}%` }}
                            />
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrderDetail(order.id)}
                        >
                          查看
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {userRole === 'CLIENT' ? (
                <>
                  <QuickActionCard icon={FileText}     iconClassName="text-blue-600"   title="发布需求" desc="创建新项目" />
                  <QuickActionCard icon={Briefcase}    iconClassName="text-green-600"  title="管理项目" desc="查看所有项目" />
                  <QuickActionCard icon={DollarSign}   iconClassName="text-purple-600" title="财务管理" desc="查看收支记录" />
                  <QuickActionCard icon={MessageSquare} iconClassName="text-orange-600" title="消息中心" desc="查看聊天记录" />
                </>
              ) : (
                <>
                  <QuickActionCard icon={Briefcase}    iconClassName="text-blue-600"   title="寻找项目" desc="浏览可接项目" />
                  <QuickActionCard icon={FileText}     iconClassName="text-green-600"  title="我的订单" desc="管理接单项目" />
                  <QuickActionCard icon={DollarSign}   iconClassName="text-purple-600" title="收益管理" desc="查看收益明细" />
                  <QuickActionCard icon={Award}        iconClassName="text-yellow-600" title="评价管理" desc="查看用户评价" />
                </>
              )}
            </div>
          </TabsContent>

          {/* ── Orders ── */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>订单管理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">订单管理</h3>
                  <p className="text-gray-600 mb-4">查看和管理您的所有订单</p>
                  <Button onClick={handleViewOrders}>进入订单管理</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Finance ── */}
          <TabsContent value="finance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>财务管理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">财务管理</h3>
                  <p className="text-gray-600 mb-4">查看收支记录和提现管理</p>
                  <Button>进入财务管理</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Profile ── */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>个人资料</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">个人资料</h3>
                  <p className="text-gray-600 mb-4">管理您的个人信息和设置</p>
                  <Button>编辑资料</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ─── Internal helper ──────────────────────────────────────────────────────────

interface QuickActionCardProps {
  icon: React.ComponentType<{ className?: string }>
  iconClassName?: string
  title: string
  desc: string
}

function QuickActionCard({ icon: Icon, iconClassName, title, desc }: QuickActionCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-6 text-center">
        <Icon className={`h-8 w-8 mx-auto mb-2 ${iconClassName ?? 'text-gray-600'}`} />
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{desc}</p>
      </CardContent>
    </Card>
  )
}
