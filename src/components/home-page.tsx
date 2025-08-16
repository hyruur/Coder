'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectCard } from './project-card'
import { ProjectFilters, ProjectFilters as FiltersType } from './project-filters'
import { Project } from '@/types'
import { Plus, Search, Filter, TrendingUp, Users, Code, DollarSign, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface HomePageProps {
  userRole?: 'CLIENT' | 'DEVELOPER'
  onCreateProject?: () => void
}

// 模拟数据
const mockProjects: Project[] = [
  {
    id: '1',
    title: '企业官网开发项目',
    description: '需要开发一个现代化的企业官网，包含产品展示、新闻动态、联系我们等模块。要求响应式设计，支持SEO优化。',
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
    tags: []
  },
  {
    id: '2',
    title: '微信小程序开发',
    description: '开发一个电商类微信小程序，包含商品展示、购物车、订单管理、支付等功能。需要对接微信支付。',
    budget: 25000,
    duration: 45,
    techStack: JSON.stringify(['微信小程序', 'JavaScript', 'Node.js', 'MongoDB']),
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    priority: 'HIGH',
    clientId: 'client2',
    viewCount: 234,
    bidCount: 12,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    client: {
      id: 'client2',
      name: '李四',
      role: 'CLIENT',
      status: 'ACTIVE',
      verified: true,
      creditScore: 88,
      balance: 80000,
      createdAt: new Date('2023-11-15'),
      updatedAt: new Date('2024-01-05')
    },
    tags: []
  },
  {
    id: '3',
    title: '企业管理系统',
    description: '开发一个完整的企业管理系统，包含人事管理、财务管理、项目管理等模块。要求权限管理完善。',
    budget: 50000,
    duration: 90,
    techStack: JSON.stringify(['Vue.js', 'Java', 'Spring Boot', 'MySQL']),
    status: 'BIDDING',
    visibility: 'PUBLIC',
    priority: 'URGENT',
    clientId: 'client3',
    viewCount: 89,
    bidCount: 5,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    client: {
      id: 'client3',
      name: '王五',
      role: 'CLIENT',
      status: 'ACTIVE',
      verified: true,
      creditScore: 92,
      balance: 120000,
      createdAt: new Date('2023-10-20'),
      updatedAt: new Date('2024-01-01')
    },
    tags: []
  }
]

export function HomePage({ userRole }: HomePageProps) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(mockProjects)
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = (query: string) => {
    setLoading(true)
    // 模拟搜索延迟
    setTimeout(() => {
      const filtered = projects.filter(project => 
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredProjects(filtered)
      setLoading(false)
    }, 300)
  }

  const handleFilter = (filters: FiltersType) => {
    setLoading(true)
    setTimeout(() => {
      let filtered = [...projects]

      if (filters.techStack && filters.techStack.length > 0) {
        filtered = filtered.filter(project => {
          const projectTechStack = JSON.parse(project.techStack || '[]')
          return filters.techStack!.some(tech => projectTechStack.includes(tech))
        })
      }

      if (filters.budget) {
        filtered = filtered.filter(project => 
          project.budget >= filters.budget!.min && 
          project.budget <= filters.budget!.max
        )
      }

      if (filters.duration) {
        filtered = filtered.filter(project => 
          project.duration >= filters.duration!.min && 
          project.duration <= filters.duration!.max
        )
      }

      if (filters.priority && filters.priority.length > 0) {
        filtered = filtered.filter(project => 
          filters.priority!.includes(project.priority)
        )
      }

      if (filters.status && filters.status.length > 0) {
        filtered = filtered.filter(project => 
          filters.status!.includes(project.status)
        )
      }

      setFilteredProjects(filtered)
      setLoading(false)
    }, 300)
  }

  const handleClear = () => {
    setFilteredProjects(projects)
  }

  const handleBid = (projectId: string) => {
    console.log('投标项目:', projectId)
    // 这里可以打开投标对话框
    router.push(`/project/${projectId}`)
  }

  const stats = {
    totalProjects: 1234,
    activeDevelopers: 567,
    completedProjects: 890,
    totalValue: 5678900
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">程序员接单平台</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {userRole === 'CLIENT' && (
                <Button onClick={() => router.push('/create-project')}>
                  <Plus className="w-4 h-4 mr-2" />
                  发布需求
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
              
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                <User className="w-4 h-4 mr-2" />
                个人中心
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧筛选栏 */}
          {showFilters && (
            <div className="lg:col-span-1">
              <ProjectFilters
                onSearch={handleSearch}
                onFilter={handleFilter}
                onClear={handleClear}
              />
            </div>
          )}

          {/* 右侧内容区 */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">总项目数</p>
                      <p className="text-2xl font-bold">{stats.totalProjects}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">活跃程序员</p>
                      <p className="text-2xl font-bold">{stats.activeDevelopers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Code className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">已完成项目</p>
                      <p className="text-2xl font-bold">{stats.completedProjects}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">总交易额</p>
                      <p className="text-2xl font-bold">¥{(stats.totalValue / 10000).toFixed(1)}万</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 项目列表 */}
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">全部项目</TabsTrigger>
                <TabsTrigger value="published">已发布</TabsTrigger>
                <TabsTrigger value="bidding">招标中</TabsTrigger>
                <TabsTrigger value="urgent">紧急项目</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    // 加载状态
                    Array.from({ length: 6 }).map((_, index) => (
                      <Card key={index} className="animate-pulse">
                        <CardHeader>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    filteredProjects.map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onBid={userRole === 'DEVELOPER' ? handleBid : undefined}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="published" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects
                    .filter(p => p.status === 'PUBLISHED')
                    .map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onBid={userRole === 'DEVELOPER' ? handleBid : undefined}
                      />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="bidding" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects
                    .filter(p => p.status === 'BIDDING')
                    .map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onBid={userRole === 'DEVELOPER' ? handleBid : undefined}
                      />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="urgent" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects
                    .filter(p => p.priority === 'URGENT')
                    .map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onBid={userRole === 'DEVELOPER' ? handleBid : undefined}
                      />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}