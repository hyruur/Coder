'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X } from 'lucide-react'
import { TECH_STACKS, PRIORITIES, ORDER_STATUSES } from '@/lib/constants'

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

export function ProjectFilters({ onSearch, onFilter, onClear }: ProjectFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [budgetRange, setBudgetRange] = useState({ min: '', max: '' })
  const [durationRange, setDurationRange] = useState({ min: '', max: '' })

  const handleSearch = () => onSearch(searchQuery)

  const handleFilter = () => {
    const filters: ProjectFilters = {}

    if (selectedTechStacks.length > 0) filters.techStack = selectedTechStacks

    if (budgetRange.min || budgetRange.max) {
      filters.budget = {
        min: budgetRange.min ? parseInt(budgetRange.min) : 0,
        max: budgetRange.max ? parseInt(budgetRange.max) : 999_999,
      }
    }

    if (durationRange.min || durationRange.max) {
      filters.duration = {
        min: durationRange.min ? parseInt(durationRange.min) : 0,
        max: durationRange.max ? parseInt(durationRange.max) : 365,
      }
    }

    if (selectedPriorities.length > 0) filters.priority = selectedPriorities
    if (selectedStatuses.length > 0) filters.status = selectedStatuses

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

  const toggle = <T extends string>(
    value: T,
    setter: React.Dispatch<React.SetStateAction<T[]>>,
  ) =>
    setter(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value],
    )

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索项目标题、描述..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>搜索</Button>
        </div>

        {/* Tech stack */}
        <div>
          <h4 className="text-sm font-medium mb-2">技术栈</h4>
          <div className="flex flex-wrap gap-2">
            {TECH_STACKS.map(tech => (
              <Badge
                key={tech}
                variant={selectedTechStacks.includes(tech) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggle(tech, setSelectedTechStacks)}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Budget range */}
        <div>
          <h4 className="text-sm font-medium mb-2">预算范围 (¥)</h4>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="最小"
              value={budgetRange.min}
              onChange={e => setBudgetRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-24"
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="最大"
              value={budgetRange.max}
              onChange={e => setBudgetRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-24"
            />
          </div>
        </div>

        {/* Duration range */}
        <div>
          <h4 className="text-sm font-medium mb-2">工期范围 (天)</h4>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="最小"
              value={durationRange.min}
              onChange={e => setDurationRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-24"
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="最大"
              value={durationRange.max}
              onChange={e => setDurationRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-24"
            />
          </div>
        </div>

        {/* Priority & status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">优先级</h4>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map(p => (
                <Badge
                  key={p.value}
                  variant={selectedPriorities.includes(p.value) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggle(p.value, setSelectedPriorities)}
                >
                  {p.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">状态</h4>
            <div className="flex flex-wrap gap-2">
              {ORDER_STATUSES.map(s => (
                <Badge
                  key={s.value}
                  variant={selectedStatuses.includes(s.value) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggle(s.value, setSelectedStatuses)}
                >
                  {s.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
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
