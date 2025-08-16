'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, FileText, DollarSign, Star, MessageSquare, Settings,
  TrendingUp, Calendar, Clock, CheckCircle, AlertTriangle,
  Briefcase, Award, CreditCard
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserDashboardProps {
  userRole: 'CLIENT' | 'DEVELOPER'
}

// 模拟统计数据
const mockStats = {
  totalOrders: 12,
  completedOrders: 8,
  inProgressOrders: 3,
  reviewingOrders: 1,
  totalEarnings: 156000,
  pendingEarnings: 45000,
  averageRating: 4.8,
  totalReviews: 15
}

// 模拟最近订单
const recentOrders = [
  {
    id: '1',
    title: '企业官网开发项目',
    status: 'IN_PROGRESS',
    progress: 65,
    amount: 15000,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: '微信小程序开发',
    status: 'REVIEWING',
    progress: 95,
    amount: 25000,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    title: '企业管理系统',
    status: 'COMPLETED',
    progress: 100,
    amount: 50000,
    createdAt: new Date('2024-01-08'),
    completedAt: new Date('2024-01-18')
  }
]

export function UserDashboard({ userRole }: UserDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'default'
      case 'REVIEWING': return 'secondary'
      case 'COMPLETED': return 'default'
      case 'CANCELLED': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return '进行中'
      case 'REVIEWING': return '待验收'
      case 'COMPLETED': return '已完成'
      case 'CANCELLED': return '已取消'
      default: return status
    }
  }

  const handleViewOrders = () => {
    router.push('/orders')
  }

  const handleViewOrderDetail = (orderId: string) => {
    router.push(`/orders/${orderId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {userRole === 'CLIENT' ? '需求方工作台' : '程序员工作台'}
              </h1>
            </div>
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

          {/* 概览页面 */}
          <TabsContent value="overview" className="space-y-6">
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Briefcase className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">总订单</p>
                      <p className="text-2xl font-bold">{mockStats.totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">已完成</p>
                      <p className="text-2xl font-bold">{mockStats.completedOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">进行中</p>
                      <p className="text-2xl font-bold">{mockStats.inProgressOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">平均评分</p>
                      <p className="text-2xl font-bold">{mockStats.averageRating}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 收入统计 (仅程序员可见) */}
            {userRole === 'DEVELOPER' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">总收入</p>
                        <p className="text-2xl font-bold">¥{(mockStats.totalEarnings / 10000).toFixed(1)}万</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <CreditCard className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">待结算</p>
                        <p className="text-2xl font-bold">¥{mockStats.pendingEarnings.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 最近订单 */}
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
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
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
                        <Badge variant={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
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
                        <Button variant="outline" size="sm" onClick={() => handleViewOrderDetail(order.id)}>
                          查看
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 快捷操作 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {userRole === 'CLIENT' ? (
                <>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-medium">发布需求</h3>
                      <p className="text-sm text-gray-600 mt-1">创建新项目</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Briefcase className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-medium">管理项目</h3>
                      <p className="text-sm text-gray-600 mt-1">查看所有项目</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-medium">财务管理</h3>
                      <p className="text-sm text-gray-600 mt-1">查看收支记录</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <MessageSquare className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <h3 className="font-medium">消息中心</h3>
                      <p className="text-sm text-gray-600 mt-1">查看聊天记录</p>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-medium">寻找项目</h3>
                      <p className="text-sm text-gray-600 mt-1">浏览可接项目</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-medium">我的订单</h3>
                      <p className="text-sm text-gray-600 mt-1">管理接单项目</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-medium">收益管理</h3>
                      <p className="text-sm text-gray-600 mt-1">查看收益明细</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <h3 className="font-medium">评价管理</h3>
                      <p className="text-sm text-gray-600 mt-1">查看用户评价</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          {/* 订单管理页面 */}
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
                  <Button onClick={handleViewOrders}>
                    进入订单管理
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 财务管理页面 */}
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
                  <Button>
                    进入财务管理
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 个人资料页面 */}
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
                  <Button>
                    编辑资料
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}