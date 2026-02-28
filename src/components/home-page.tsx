'use client'

import { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectCard } from './project-card'
import { ProjectFilters, ProjectFilters as FiltersType } from './project-filters'
import { StatCard } from './stat-card'
import { Project } from '@/types'
import { Plus, Filter, TrendingUp, Users, Code, DollarSign, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface HomePageProps {
  userRole?: 'CLIENT' | 'DEVELOPER'
}

// ─── Mock data ────────────────────────────────────────────────────────────────

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
      updatedAt: new Date('2024-01-10'),
    },
    tags: [],
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
      updatedAt: new Date('2024-01-05'),
    },
    tags: [],
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
      updatedAt: new Date('2024-01-01'),
    },
    tags: [],
  },
]

const STATS = {
  totalProjects: 1234,
  activeDevelopers: 567,
  completedProjects: 890,
  totalValue: 5678900,
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function ProjectSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HomePage({ userRole }: HomePageProps) {
  const router = useRouter()
  const [projects] = useState<Project[]>(mockProjects)
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(mockProjects)
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = useCallback(
    (query: string) => {
      setLoading(true)
      setTimeout(() => {
        const q = query.toLowerCase()
        setFilteredProjects(
          projects.filter(
            p =>
              p.title.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q),
          ),
        )
        setLoading(false)
      }, 300)
    },
    [projects],
  )

  const handleFilter = useCallback(
    (filters: FiltersType) => {
      setLoading(true)
      setTimeout(() => {
        let result = [...projects]

        if (filters.techStack?.length) {
          result = result.filter(p => {
            const stack: string[] = JSON.parse(p.techStack || '[]')
            return filters.techStack!.some(t => stack.includes(t))
          })
        }
        if (filters.budget) {
          result = result.filter(
            p =>
              p.budget >= filters.budget!.min &&
              p.budget <= filters.budget!.max,
          )
        }
        if (filters.duration) {
          result = result.filter(
            p =>
              p.duration >= filters.duration!.min &&
              p.duration <= filters.duration!.max,
          )
        }
        if (filters.priority?.length) {
          result = result.filter(p => filters.priority!.includes(p.priority))
        }
        if (filters.status?.length) {
          result = result.filter(p => filters.status!.includes(p.status))
        }

        setFilteredProjects(result)
        setLoading(false)
      }, 300)
    },
    [projects],
  )

  const handleClear = useCallback(() => setFilteredProjects(projects), [projects])

  const handleBid = useCallback(
    (projectId: string) => router.push(`/project/${projectId}`),
    [router],
  )

  // Derived tab lists – computed once per filteredProjects change
  const publishedProjects = useMemo(
    () => filteredProjects.filter(p => p.status === 'PUBLISHED'),
    [filteredProjects],
  )
  const biddingProjects = useMemo(
    () => filteredProjects.filter(p => p.status === 'BIDDING'),
    [filteredProjects],
  )
  const urgentProjects = useMemo(
    () => filteredProjects.filter(p => p.priority === 'URGENT'),
    [filteredProjects],
  )

  const bidHandler = userRole === 'DEVELOPER' ? handleBid : undefined

  const renderGrid = (list: Project[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading
        ? Array.from({ length: 6 }, (_, i) => <ProjectSkeleton key={i} />)
        : list.map(project => (
            <ProjectCard key={project.id} project={project} onBid={bidHandler} />
          ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">程序员接单平台</h1>

            <div className="flex items-center gap-4">
              {userRole === 'CLIENT' && (
                <Button onClick={() => router.push('/create-project')}>
                  <Plus className="w-4 h-4 mr-2" />
                  发布需求
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setShowFilters(v => !v)}
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
          {/* Sidebar filters */}
          {showFilters && (
            <div className="lg:col-span-1">
              <ProjectFilters
                onSearch={handleSearch}
                onFilter={handleFilter}
                onClear={handleClear}
              />
            </div>
          )}

          {/* Main content */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon={TrendingUp} iconClassName="text-blue-600"   label="总项目数"  value={STATS.totalProjects} />
              <StatCard icon={Users}      iconClassName="text-green-600"  label="活跃程序员" value={STATS.activeDevelopers} />
              <StatCard icon={Code}       iconClassName="text-purple-600" label="已完成项目" value={STATS.completedProjects} />
              <StatCard
                icon={DollarSign}
                iconClassName="text-orange-600"
                label="总交易额"
                value={`¥${(STATS.totalValue / 10000).toFixed(1)}万`}
              />
            </div>

            {/* Project tabs */}
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">全部项目</TabsTrigger>
                <TabsTrigger value="published">已发布</TabsTrigger>
                <TabsTrigger value="bidding">招标中</TabsTrigger>
                <TabsTrigger value="urgent">紧急项目</TabsTrigger>
              </TabsList>

              <TabsContent value="all"      className="space-y-4">{renderGrid(filteredProjects)}</TabsContent>
              <TabsContent value="published" className="space-y-4">{renderGrid(publishedProjects)}</TabsContent>
              <TabsContent value="bidding"   className="space-y-4">{renderGrid(biddingProjects)}</TabsContent>
              <TabsContent value="urgent"    className="space-y-4">{renderGrid(urgentProjects)}</TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
