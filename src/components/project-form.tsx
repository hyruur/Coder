'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Plus, X, Upload } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface ProjectFormProps {
  onSubmit: (projectData: ProjectFormData) => void
  onCancel: () => void
}

export interface ProjectFormData {
  title: string
  description: string
  budget: number
  duration: number
  techStack: string[]
  attachments: File[]
  visibility: 'PUBLIC' | 'PRIVATE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  deadline?: Date
}

const TECH_STACKS = [
  'React', 'Vue', 'Angular', 'Svelte',
  'Node.js', 'Python', 'Java', 'Go', 'PHP',
  'TypeScript', 'JavaScript', 'Python', 'Java',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'AWS', '阿里云',
  '微信小程序', 'iOS', 'Android', 'Flutter',
  'HTML/CSS', 'Bootstrap', 'Tailwind CSS',
  'Express.js', 'Django', 'Spring Boot', 'Laravel'
]

export function ProjectForm({ onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    budget: 0,
    duration: 30,
    techStack: [],
    attachments: [],
    visibility: 'PUBLIC',
    priority: 'MEDIUM',
    deadline: undefined
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {}

    if (!formData.title.trim()) {
      newErrors.title = '请输入项目标题'
    }

    if (!formData.description.trim()) {
      newErrors.description = '请输入项目描述'
    } else if (formData.description.length < 50) {
      newErrors.description = '项目描述至少需要50个字符'
    }

    if (formData.budget <= 0) {
      newErrors.budget = '请输入有效的预算金额'
    }

    if (formData.duration <= 0) {
      newErrors.duration = '请输入有效的项目工期'
    }

    if (formData.techStack.length === 0) {
      newErrors.techStack = '请至少选择一个技术栈'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('提交项目失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const toggleTechStack = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }))
    
    if (errors.techStack) {
      setErrors(prev => ({ ...prev, techStack: undefined }))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }))
  }

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">发布新项目</CardTitle>
          <p className="text-gray-600">请详细描述您的项目需求，以便程序员更好地理解您的要求</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">基本信息</h3>
              
              <div>
                <Label htmlFor="title">项目标题 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="请输入简洁明了的项目标题"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="description">项目描述 *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="请详细描述项目需求、功能要求、预期效果等..."
                  rows={6}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                <p className="text-gray-500 text-sm mt-1">建议至少50个字符，详细描述有助于获得更准确的报价</p>
              </div>
            </div>

            {/* 技术要求 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">技术要求</h3>
              
              <div>
                <Label>技术栈 *</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {TECH_STACKS.map(tech => (
                    <Badge
                      key={tech}
                      variant={formData.techStack.includes(tech) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTechStack(tech)}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
                {errors.techStack && <p className="text-red-500 text-sm mt-1">{errors.techStack}</p>}
              </div>
            </div>

            {/* 项目参数 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="budget">预算金额 (¥) *</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className={errors.budget ? 'border-red-500' : ''}
                />
                {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
              </div>

              <div>
                <Label htmlFor="duration">预计工期 (天) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                  placeholder="30"
                  className={errors.duration ? 'border-red-500' : ''}
                />
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
              </div>

              <div>
                <Label htmlFor="priority">优先级</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">低优先级</SelectItem>
                    <SelectItem value="MEDIUM">中优先级</SelectItem>
                    <SelectItem value="HIGH">高优先级</SelectItem>
                    <SelectItem value="URGENT">紧急</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 截止日期 */}
            <div>
              <Label>截止日期 (可选)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? format(formData.deadline, "yyyy年MM月dd日") : "选择截止日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.deadline}
                    onSelect={(date) => handleInputChange('deadline', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 可见性设置 */}
            <div>
              <Label>项目可见性</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value) => handleInputChange('visibility', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">公开 - 所有程序员可见</SelectItem>
                  <SelectItem value="PRIVATE">私密 - 仅邀请的程序员可见</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 附件上传 */}
            <div>
              <Label>附件上传</Label>
              <div className="mt-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        上传需求文档、设计图等附件
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      支持 PDF, DOC, XLS, PPT, JPG, PNG 等格式，单个文件不超过10MB
                    </p>
                  </div>
                </div>
                
                {formData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>已上传文件：</Label>
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? '发布中...' : '发布项目'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}