'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BidDialog, BidData } from '@/components/bid-dialog'
import { useToast } from '@/hooks/use-toast'
import { 
  Calendar, DollarSign, Clock, User, Eye, MessageCircle, 
  FileText, Share, AlertTriangle, CheckCircle, XCircle 
} from 'lucide-react'

// 模拟项目数据
const mockProject = {
  id: '1',
  title: '企业官网开发项目',
  description: '需要开发一个现代化的企业官网，包含产品展示、新闻动态、联系我们等模块。要求响应式设计，支持SEO优化。\n\n主要功能需求：\n1. 首页轮播图展示\n2. 产品/服务展示页面\n3. 新闻动态模块\n4. 关于我们页面\n5. 联系我们表单\n6. 后台管理系统\n\n技术要求：\n- 响应式设计，支持移动端\n- SEO友好\n- 页面加载速度优化\n- 后台管理功能完善',
  budget: 15000,
  duration: 30,
  techStack: JSON.stringify(['React', 'TypeScript', 'Tailwind CSS', 'Next.js']),
  status: 'PUBLISHED',
  visibility: 'PUBLIC',
  priority: 'MEDIUM',
  clientId: 'client1',
  viewCount: 156,
  bidCount: 8,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  client: {
    id: 'client1',
    name: '张三',
    role: 'CLIENT',
    status: 'ACTIVE',
    verified: true,
    creditScore: 95,
    balance: 50000,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-10')
  },
  tags: [],
  bids: [
    {
      id: '1',
      amount: 12000,
      duration: 25,
      proposal: '我有丰富的企业官网开发经验，可以高质量完成项目...',
      status: 'PENDING',
      createdAt: new Date('2024-01-16'),
      developer: {
        id: 'dev1',
        name: '李四',
        developerProfile: {
          level: 'SENIOR',
          experience: 5,
          skills: JSON.stringify(['React', 'TypeScript', 'Node.js'])
        }
      }
    }
  ]
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showBidDialog, setShowBidDialog] = useState(false)
  const [userRole, setUserRole] = useState<'CLIENT' | 'DEVELOPER'>('DEVELOPER')

  useEffect(() => {
    // 模拟获取项目详情
    const fetchProject = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProject(mockProject)
      setLoading(false)
    }
    
    fetchProject()
  }, [params.id])

  const handleBidSubmit = async (bidData: BidData) => {
    try {
      console.log('提交投标:', bidData)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "投标成功",
        description: "您的投标已提交，等待项目方确认",
      })
      
      // 更新项目数据
      setProject(prev => ({
        ...prev,
        bidCount: prev.bidCount + 1
      }))
      
    } catch (error) {
      console.error('投标失败:', error)
      toast({
        title: "投标失败",
        description: "投标提交失败，请重试",
        variant: "destructive",
      })
    }
  }

  const handleContactClient = () => {
    toast({
      title: "联系项目方",
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

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">项目不存在</h1>
          <Button onClick={() => router.push('/')} className="mt-4">
            返回首页
          </Button>
        </div>
      </div>
    )
  }

  const techStack = JSON.parse(project.techStack || '[]')
  const canBid = userRole === 'DEVELOPER' && project.status === 'PUBLISHED'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 项目头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <Badge variant={project.priority === 'URGENT' ? 'destructive' : 
                               project.priority === 'HIGH' ? 'default' : 
                               project.priority === 'MEDIUM' ? 'secondary' : 'outline'}>
                  {project.priority}
                </Badge>
                <Badge variant="outline">
                  {project.status === 'PUBLISHED' ? '已发布' : 
                   project.status === 'BIDDING' ? '招标中' : 
                   project.status === 'IN_PROGRESS' ? '进行中' : project.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{project.viewCount} 浏览</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>{project.bidCount} 投标</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>发布于 {project.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {canBid && (
                <Button onClick={() => setShowBidDialog(true)}>
                  立即投标
                </Button>
              )}
              <Button variant="outline" onClick={handleContactClient}>
                <MessageCircle className="w-4 h-4 mr-2" />
                联系项目方
              </Button>
              <Button variant="outline" size="icon">
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 项目详情 */}
            <Card>
              <CardHeader>
                <CardTitle>项目详情</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {project.description.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 技术要求 */}
            <Card>
              <CardHeader>
                <CardTitle>技术要求</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 投标列表 */}
            <Card>
              <CardHeader>
                <CardTitle>投标列表 ({project.bids.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {project.bids.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">暂无投标</p>
                ) : (
                  <div className="space-y-4">
                    {project.bids.map((bid: any) => (
                      <div key={bid.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{bid.developer.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>等级: {bid.developer.developerProfile.level}</span>
                              <span>经验: {bid.developer.developerProfile.experience}年</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-lg">¥{bid.amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">{bid.duration}天</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                          {bid.proposal}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant={
                            bid.status === 'ACCEPTED' ? 'default' :
                            bid.status === 'REJECTED' ? 'destructive' : 'secondary'
                          }>
                            {bid.status === 'ACCEPTED' ? '已接受' :
                             bid.status === 'REJECTED' ? '已拒绝' : '待处理'}
                          </Badge>
                          <Button variant="outline" size="sm">
                            查看详情
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右侧信息栏 */}
          <div className="space-y-6">
            {/* 项目信息 */}
            <Card>
              <CardHeader>
                <CardTitle>项目信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">预算</span>
                  <span className="font-medium">¥{project.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">工期</span>
                  <span className="font-medium">{project.duration}天</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">优先级</span>
                  <Badge variant={
                    project.priority === 'URGENT' ? 'destructive' :
                    project.priority === 'HIGH' ? 'default' :
                    project.priority === 'MEDIUM' ? 'secondary' : 'outline'
                  }>
                    {project.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">状态</span>
                  <Badge variant="outline">
                    {project.status === 'PUBLISHED' ? '已发布' : project.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* 项目方信息 */}
            <Card>
              <CardHeader>
                <CardTitle>项目方信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium">{project.client.name}</div>
                    <div className="text-sm text-gray-600">
                      信用分: {project.client.creditScore}
                    </div>
                  </div>
                </div>
                
                {project.client.verified && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>已认证</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    查看资料
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleContactClient}>
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 项目统计 */}
            <Card>
              <CardHeader>
                <CardTitle>项目统计</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">浏览次数</span>
                  <span className="font-medium">{project.viewCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">投标次数</span>
                  <span className="font-medium">{project.bidCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">发布时间</span>
                  <span className="font-medium">
                    {project.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 投标对话框 */}
      <BidDialog
        project={project}
        onSubmit={handleBidSubmit}
        isOpen={showBidDialog}
        onClose={() => setShowBidDialog(false)}
      />
    </div>
  )
}