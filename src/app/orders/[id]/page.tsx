'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Calendar, DollarSign, Clock, User, FileText, MessageCircle, 
  CheckCircle, AlertTriangle, Upload, Download, Eye, Star,
  Plus, X, Send
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// 模拟订单数据
const mockOrder = {
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
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '138****8888'
  },
  developer: {
    id: 'dev1',
    name: '李四',
    email: 'lisi@example.com',
    phone: '139****9999'
  },
  deliverables: [
    {
      id: '1',
      title: '首页设计稿',
      description: '包含首页的UI设计稿和交互说明',
      fileUrl: '/files/homepage-design.pdf',
      status: 'APPROVED',
      submittedAt: new Date('2024-01-20'),
      reviewedAt: new Date('2024-01-21')
    },
    {
      id: '2',
      title: '产品页面开发',
      description: '产品展示页面的前端开发',
      fileUrl: '/files/product-page.zip',
      status: 'SUBMITTED',
      submittedAt: new Date('2024-01-25')
    },
    {
      id: '3',
      title: '后台管理系统',
      description: '完整的后台管理功能',
      status: 'PENDING'
    }
  ],
  reviews: [],
  payments: [
    {
      id: '1',
      amount: 15000,
      paymentMethod: 'WECHAT',
      status: 'PAID',
      transactionId: 'WX202401150001',
      createdAt: new Date('2024-01-15')
    }
  ]
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDeliverableDialog, setShowDeliverableDialog] = useState(false)
  const [newDeliverable, setNewDeliverable] = useState({
    title: '',
    description: '',
    fileUrl: ''
  })
  const [userRole, setUserRole] = useState<'CLIENT' | 'DEVELOPER'>('DEVELOPER')

  useEffect(() => {
    // 模拟获取订单详情
    const fetchOrder = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOrder(mockOrder)
      setLoading(false)
    }
    
    fetchOrder()
  }, [params.id])

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

  const getDeliverableStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'secondary'
      case 'SUBMITTED': return 'default'
      case 'APPROVED': return 'default'
      case 'REJECTED': return 'destructive'
      default: return 'outline'
    }
  }

  const getDeliverableStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '待提交'
      case 'SUBMITTED': return '已提交'
      case 'APPROVED': return '已通过'
      case 'REJECTED': return '已拒绝'
      default: return status
    }
  }

  const handleSubmitDeliverable = async () => {
    try {
      console.log('提交交付物:', newDeliverable)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "提交成功",
        description: "交付物已提交，等待项目方审核",
      })
      
      setShowDeliverableDialog(false)
      setNewDeliverable({ title: '', description: '', fileUrl: '' })
      
      // 更新订单数据
      setOrder(prev => ({
        ...prev,
        deliverables: [
          ...prev.deliverables,
          {
            id: Date.now().toString(),
            title: newDeliverable.title,
            description: newDeliverable.description,
            fileUrl: newDeliverable.fileUrl,
            status: 'SUBMITTED',
            submittedAt: new Date()
          }
        ]
      }))
      
    } catch (error) {
      console.error('提交交付物失败:', error)
      toast({
        title: "提交失败",
        description: "交付物提交失败，请重试",
        variant: "destructive",
      })
    }
  }

  const handleApproveDeliverable = async (deliverableId: string) => {
    try {
      console.log('通过交付物:', deliverableId)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "审核通过",
        description: "交付物已审核通过",
      })
      
      // 更新订单数据
      setOrder(prev => ({
        ...prev,
        deliverables: prev.deliverables.map(d => 
          d.id === deliverableId 
            ? { ...d, status: 'APPROVED', reviewedAt: new Date() }
            : d
        )
      }))
      
    } catch (error) {
      console.error('审核失败:', error)
      toast({
        title: "审核失败",
        description: "交付物审核失败，请重试",
        variant: "destructive",
      })
    }
  }

  const handleRejectDeliverable = async (deliverableId: string) => {
    try {
      console.log('拒绝交付物:', deliverableId)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "已拒绝",
        description: "交付物已拒绝，请程序员重新提交",
      })
      
      // 更新订单数据
      setOrder(prev => ({
        ...prev,
        deliverables: prev.deliverables.map(d => 
          d.id === deliverableId 
            ? { ...d, status: 'REJECTED', reviewedAt: new Date() }
            : d
        )
      }))
      
    } catch (error) {
      console.error('拒绝失败:', error)
      toast({
        title: "操作失败",
        description: "交付物拒绝失败，请重试",
        variant: "destructive",
      })
    }
  }

  const handleContact = () => {
    toast({
      title: "联系对方",
      description: "正在跳转到聊天界面...",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">订单不存在</h1>
          <Button onClick={() => router.push('/orders')} className="mt-4">
            返回订单列表
          </Button>
        </div>
      </div>
    )
  }

  const canSubmitDeliverable = userRole === 'DEVELOPER' && order.status === 'IN_PROGRESS'
  const canReviewDeliverable = userRole === 'CLIENT' && order.status === 'IN_PROGRESS'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 订单头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{order.projectTitle}</h1>
                <Badge variant={getStatusColor(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
                <Badge variant="outline">
                  {order.paymentStatus === 'PAID' ? '已支付' : '未支付'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
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
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleContact}>
                <MessageCircle className="w-4 h-4 mr-2" />
                联系
              </Button>
              {canSubmitDeliverable && (
                <Button onClick={() => setShowDeliverableDialog(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  提交交付物
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 项目进度 */}
            <Card>
              <CardHeader>
                <CardTitle>项目进度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>当前进度</span>
                    <span className="font-medium">{order.progress}%</span>
                  </div>
                  <Progress value={order.progress} className="h-3" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span>项目金额: ¥{order.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>剩余时间: {Math.ceil((order.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}天</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 交付物管理 */}
            <Card>
              <CardHeader>
                <CardTitle>交付物管理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.deliverables.map((deliverable: any) => (
                    <div key={deliverable.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{deliverable.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{deliverable.description}</p>
                        </div>
                        <Badge variant={getDeliverableStatusColor(deliverable.status)}>
                          {getDeliverableStatusText(deliverable.status)}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-gray-500">
                          {deliverable.submittedAt && (
                            <span>提交于 {deliverable.submittedAt.toLocaleDateString()}</span>
                          )}
                          {deliverable.reviewedAt && (
                            <span className="ml-4">审核于 {deliverable.reviewedAt.toLocaleDateString()}</span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {deliverable.fileUrl && (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              下载
                            </Button>
                          )}
                          
                          {canReviewDeliverable && deliverable.status === 'SUBMITTED' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handleApproveDeliverable(deliverable.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                通过
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRejectDeliverable(deliverable.id)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                拒绝
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 订单信息 */}
            <Card>
              <CardHeader>
                <CardTitle>订单信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">订单号</Label>
                      <div className="mt-1">{order.orderNo}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">创建时间</Label>
                      <div className="mt-1">{order.createdAt.toLocaleString()}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">项目金额</Label>
                      <div className="mt-1 font-medium">¥{order.amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">支付状态</Label>
                      <div className="mt-1">
                        <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'destructive'}>
                          {order.paymentStatus === 'PAID' ? '已支付' : '未支付'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧信息栏 */}
          <div className="space-y-6">
            {/* 参与方信息 */}
            <Card>
              <CardHeader>
                <CardTitle>参与方信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">项目方</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded">
                    <div className="font-medium">{order.client.name}</div>
                    <div className="text-sm text-gray-600">{order.client.email}</div>
                    <div className="text-sm text-gray-600">{order.client.phone}</div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">程序员</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded">
                    <div className="font-medium">{order.developer.name}</div>
                    <div className="text-sm text-gray-600">{order.developer.email}</div>
                    <div className="text-sm text-gray-600">{order.developer.phone}</div>
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={handleContact}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  联系对方
                </Button>
              </CardContent>
            </Card>

            {/* 支付记录 */}
            <Card>
              <CardHeader>
                <CardTitle>支付记录</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.payments.map((payment: any) => (
                    <div key={payment.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">¥{payment.amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">
                          {payment.paymentMethod === 'WECHAT' ? '微信支付' : '其他'}
                        </div>
                      </div>
                      <Badge variant={payment.status === 'PAID' ? 'default' : 'destructive'}>
                        {payment.status === 'PAID' ? '已支付' : '未支付'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 快捷操作 */}
            <Card>
              <CardHeader>
                <CardTitle>快捷操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" onClick={handleContact}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  联系对方
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  查看合同
                </Button>
                {order.status === 'DISPUTED' && (
                  <Button variant="destructive" className="w-full">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    申请仲裁
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 提交交付物对话框 */}
      <Dialog open={showDeliverableDialog} onOpenChange={setShowDeliverableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>提交交付物</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">交付物标题</Label>
              <Input
                id="title"
                value={newDeliverable.title}
                onChange={(e) => setNewDeliverable(prev => ({ ...prev, title: e.target.value }))}
                placeholder="请输入交付物标题"
              />
            </div>
            
            <div>
              <Label htmlFor="description">交付物描述</Label>
              <Textarea
                id="description"
                value={newDeliverable.description}
                onChange={(e) => setNewDeliverable(prev => ({ ...prev, description: e.target.value }))}
                placeholder="请描述交付物内容和要求"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="file">上传文件</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    // 这里可以处理文件上传
                    console.log('上传文件:', file)
                  }
                }}
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowDeliverableDialog(false)}>
                取消
              </Button>
              <Button onClick={handleSubmitDeliverable}>
                <Send className="w-4 h-4 mr-2" />
                提交
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}