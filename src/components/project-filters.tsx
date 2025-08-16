'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, X } from 'lucide-react'

interface ProjectFiltersProps {
  onSearch: (query: string) => void
  onFilter: (filters: ProjectFilters) => void
  onClear: () => void
}

export interface ProjectFilters {
  techStack?: string[]
  budget?: { min: number; max: number }
  duration?: { min: number; max: number }
  priority?: string[]
  status?: string[]
}

const TECH_STACKS = [
  'React', 'Vue', 'Angular', 'Svelte',
  'Node.js', 'Python', 'Java', 'Go', 'PHP',
  'TypeScript', 'JavaScript', 'Python', 'Java',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'AWS', '阿里云',
  '微信小程序', 'iOS', 'Android', 'Flutter'
]

const PRIORITIES = [
  { value: 'LOW', label: '低优先级' },
  { value: 'MEDIUM', label: '中优先级' },
  { value: 'HIGH', label: '高优先级' },
  { value: 'URGENT', label: '紧急' }
]

const STATUSES = [
  { value: 'PUBLISHED', label: '已发布' },
  { value: 'BIDDING', label: '招标中' },
  { value: 'IN_PROGRESS', label: '进行中' }
]

export function ProjectFilters({ onSearch, onFilter, onClear }: ProjectFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [budgetRange, setBudgetRange] = useState({ min: '', max: '' })
  const [durationRange, setDurationRange] = useState({ min: '', max: '' })

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  const handleFilter = () => {
    const filters: ProjectFilters = {}
    
    if (selectedTechStacks.length > 0) {
      filters.techStack = selectedTechStacks
    }
    
    if (budgetRange.min || budgetRange.max) {
      filters.budget = {
        min: budgetRange.min ? parseInt(budgetRange.min) : 0,
        max: budgetRange.max ? parseInt(budgetRange.max) : 999999
      }
    }
    
    if (durationRange.min || durationRange.max) {
      filters.duration = {
        min: durationRange.min ? parseInt(durationRange.min) : 0,
        max: durationRange.max ? parseInt(durationRange.max) : 365
      }
    }
    
    if (selectedPriorities.length > 0) {
      filters.priority = selectedPriorities
    }
    
    if (selectedStatuses.length > 0) {
      filters.status = selectedStatuses
    }
    
    onFilter(filters)
  }

  const handleClear = () => {
    setSearchQuery('')
    setSelectedTechStacks([])
    setSelectedPriorities([])
    setSelectedStatuses([])
    setBudgetRange({ min: '', max: '' })
    setDurationRange({ min: '', max: '' })
    onClear()
  }

  const toggleTechStack = (tech: string) => {
    setSelectedTechStacks(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    )
  }

  const togglePriority = (priority: string) => {
    setSelectedPriorities(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    )
  }

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        {/* 搜索框 */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索项目标题、描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>
            搜索
          </Button>
        </div>

        {/* 技术栈筛选 */}
        <div>
          <h4 className="text-sm font-medium mb-2">技术栈</h4>
          <div className="flex flex-wrap gap-2">
            {TECH_STACKS.map(tech => (
              <Badge
                key={tech}
                variant={selectedTechStacks.includes(tech) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTechStack(tech)}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* 预算范围 */}
        <div>
          <h4 className="text-sm font-medium mb-2">预算范围 (¥)</h4>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="最小"
              value={budgetRange.min}
              onChange={(e) => setBudgetRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-24"
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="最大"
              value={budgetRange.max}
              onChange={(e) => setBudgetRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-24"
            />
          </div>
        </div>

        {/* 工期范围 */}
        <div>
          <h4 className="text-sm font-medium mb-2">工期范围 (天)</h4>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="最小"
              value={durationRange.min}
              onChange={(e) => setDurationRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-24"
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="最大"
              value={durationRange.max}
              onChange={(e) => setDurationRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-24"
            />
          </div>
        </div>

        {/* 优先级和状态 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">优先级</h4>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map(priority => (
                <Badge
                  key={priority.value}
                  variant={selectedPriorities.includes(priority.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => togglePriority(priority.value)}
                >
                  {priority.label}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">状态</h4>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(status => (
                <Badge
                  key={status.value}
                  variant={selectedStatuses.includes(status.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleStatus(status.value)}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <Button onClick={handleFilter} className="flex-1">
            <Filter className="w-4 h-4 mr-2" />
            应用筛选
          </Button>
          <Button onClick={handleClear} variant="outline">
            <X className="w-4 h-4 mr-2" />
            清除
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}