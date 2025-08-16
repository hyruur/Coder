'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, DollarSign, Clock, User, Search, Filter, 
  FileText, MessageCircle, CheckCircle, AlertTriangle, Eye
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// 模拟订单数据
const mockOrders = [
  {
    id: '1',
    orderNo: 'ORD20240115001',
    projectId: '1',
    projectTitle: '企业官网开发项目',
    amount: 15000,
    status: 'IN_PROGRESS',
    paymentStatus: 'PAID',
    progress: 65,
    deadline: new Date('2024-02-15'),
    createdAt: new Date('2024-01-15'),
    client: {
      id: 'client1',
      name: '张三'
    },
    developer: {
      id: 'dev1',
      name: '李四'
    }
  },
  {
    id: '2',
    orderNo: 'ORD20240110001',
    projectId: '2',
    projectTitle: '微信小程序开发',
    amount: 25000,
    status: 'REVIEWING',
    paymentStatus: 'PAID',
    progress: 95,
    deadline: new Date('2024-01-25'),
    createdAt: new Date('2024-01-10'),
    client: {
      id: 'client2',
      name: '王五'
    },
    developer: {
      id: 'dev2',
      name: '赵六'
    }
  },
  {
    id: '3',
    orderNo: 'ORD20240108001',
    projectId: '3',
    projectTitle: '企业管理系统',
    amount: 50000,
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    progress: 100,
    deadline: new Date('2024-01-20'),
    completedAt: new Date('2024-01-18'),
    createdAt: new Date('2024-01-08'),
    client: {
      id: 'client3',
      name: '孙七'
    },
    developer: {
      id: 'dev3',
      name: '周八'
    }
  }
]

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState(mockOrders)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [userRole, setUserRole] = useState<'CLIENT' | 'DEVELOPER'>('DEVELOPER')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'secondary'
      case 'CONFIRMED': return 'default'
      case 'IN_PROGRESS': return 'default'
      case 'REVIEWING': return 'secondary'
      case 'COMPLETED': return 'default'
      case 'CANCELLED': return 'destructive'
      case 'DISPUTED': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '待确认'
      case 'CONFIRMED': return '已确认'
      case 'IN_PROGRESS': return '进行中'
      case 'REVIEWING': return '待验收'
      case 'COMPLETED': return '已完成'
      case 'CANCELLED': return '已取消'
      case 'DISPUTED': return '争议中'
      default: return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'default'
      case 'UNPAID': return 'destructive'
      case 'PARTIAL': return 'secondary'
      case 'REFUNDED': return 'outline'
      default: return 'outline'
    }
  }

  const handleSearch = () => {
    setLoading(true)
    setTimeout(() => {
      let filtered = orders

      if (searchQuery) {
        filtered = filtered.filter(order => 
          order.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      if (statusFilter !== 'all') {
        filtered = filtered.filter(order => order.status === statusFilter)
      }

      setFilteredOrders(filtered)
      setLoading(false)
    }, 300)
  }

  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`)
  }

  const handleContact = (order: any) => {
    console.log('联系对方:', order)
    // 这里可以跳转到聊天界面
  }

  const filterOrdersByStatus = (status: string) => {
    return status === 'all' ? orders : orders.filter(order => order.status === status)
  }

  const orderStats = {
    total: orders.length,
    inProgress: orders.filter(o => o.status === 'IN_PROGRESS').length,
    reviewing: orders.filter(o => o.status === 'REVIEWING').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
    totalAmount: orders.reduce((sum, order) => sum + order.amount, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{orderStats.total}</div>
                <div className="text-sm text-gray-600">总订单</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{orderStats.inProgress}</div>
                <div className="text-sm text-gray-600">进行中</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{orderStats.reviewing}</div>
                <div className="text-sm text-gray-600">待验收</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{orderStats.completed}</div>
                <div className="text-sm text-gray-600">已完成</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  ¥{(orderStats.totalAmount / 10000).toFixed(1)}万
                </div>
                <div className="text-sm text-gray-600">总金额</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索和筛选 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索订单号、项目名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
              <Button onClick={handleSearch}>
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 订单列表 */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">全部订单</TabsTrigger>
            <TabsTrigger value="in_progress">进行中</TabsTrigger>
            <TabsTrigger value="reviewing">待验收</TabsTrigger>
            <TabsTrigger value="completed">已完成</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {filteredOrders.map(order => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{order.projectTitle}</h3>
                          <Badge variant={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                          <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
                            {order.paymentStatus === 'PAID' ? '已支付' : 
                             order.paymentStatus === 'UNPAID' ? '未支付' : 
                             order.paymentStatus === 'PARTIAL' ? '部分支付' : '已退款'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                          <span>订单号: {order.orderNo}</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>创建于 {order.createdAt.toLocaleDateString()}</span>
                          </div>
                          {order.deadline && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>截止 {order.deadline.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-medium">¥{order.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-blue-600" />
                            <span>{userRole === 'CLIENT' ? order.developer.name : order.client.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4">
                              <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-600 transition-all duration-300"
                                  style={{ width: `${order.progress}%` }}
                                />
                              </div>
                            </div>
                            <span>{order.progress}%</span>
                          </div>
                          {order.completedAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>完成于 {order.completedAt.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          查看详情
                        </Button>
                        {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContact(order)}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            联系
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* 进度条 */}
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
              ))}
            </div>
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            <div className="grid gap-4">
              {filterOrdersByStatus('IN_PROGRESS').map(order => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{order.projectTitle}</h3>
                          <Badge variant={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                          <span>订单号: {order.orderNo}</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>创建于 {order.createdAt.toLocaleDateString()}</span>
                          </div>
                          {order.deadline && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>截止 {order.deadline.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-medium">¥{order.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-blue-600" />
                            <span>{userRole === 'CLIENT' ? order.developer.name : order.client.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4">
                              <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-600 transition-all duration-300"
                                  style={{ width: `${order.progress}%` }}
                                />
                              </div>
                            </div>
                            <span>{order.progress}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          查看详情
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContact(order)}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          联系
                        </Button>
                      </div>
                    </div>

                    {/* 进度条 */}
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
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviewing" className="space-y-4">
            <div className="grid gap-4">
              {filterOrdersByStatus('REVIEWING').map(order => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{order.projectTitle}</h3>
                          <Badge variant={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                          <span>订单号: {order.orderNo}</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>创建于 {order.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-medium">¥{order.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-blue-600" />
                            <span>{userRole === 'CLIENT' ? order.developer.name : order.client.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4">
                              <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-orange-600 transition-all duration-300"
                                  style={{ width: `${order.progress}%` }}
                                />
                              </div>
                            </div>
                            <span>{order.progress}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          查看详情
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContact(order)}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          联系
                        </Button>
                      </div>
                    </div>

                    {/* 进度条 */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>项目进度</span>
                        <span>{order.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4">
              {filterOrdersByStatus('COMPLETED').map(order => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{order.projectTitle}</h3>
                          <Badge variant={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                          <span>订单号: {order.orderNo}</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>创建于 {order.createdAt.toLocaleDateString()}</span>
                          </div>
                          {order.completedAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>完成于 {order.completedAt.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-medium">¥{order.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-blue-600" />
                            <span>{userRole === 'CLIENT' ? order.developer.name : order.client.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4">
                              <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-600 transition-all duration-300"
                                  style={{ width: `${order.progress}%` }}
                                />
                              </div>
                            </div>
                            <span>{order.progress}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          查看详情
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContact(order)}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          联系
                        </Button>
                      </div>
                    </div>

                    {/* 进度条 */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>项目进度</span>
                        <span>{order.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}