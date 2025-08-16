'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, DollarSign, Clock, FileText, AlertCircle } from 'lucide-react'

interface BidDialogProps {
  project: any
  onSubmit: (bidData: BidData) => void
  isOpen: boolean
  onClose: () => void
}

export interface BidData {
  amount: number
  duration: number
  proposal: string
}

export function BidDialog({ project, onSubmit, isOpen, onClose }: BidDialogProps) {
  const [bidData, setBidData] = useState<BidData>({
    amount: project.budget || 0,
    duration: project.duration || 30,
    proposal: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof BidData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Partial<Record<keyof BidData, string>> = {}

    if (bidData.amount <= 0) {
      newErrors.amount = '请输入有效的报价金额'
    }

    if (bidData.duration <= 0) {
      newErrors.duration = '请输入有效的工期'
    }

    if (!bidData.proposal.trim()) {
      newErrors.proposal = '请输入开发方案'
    } else if (bidData.proposal.length < 100) {
      newErrors.proposal = '开发方案至少需要100个字符'
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
      await onSubmit(bidData)
      onClose()
    } catch (error) {
      console.error('投标失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof BidData, value: any) => {
    setBidData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const techStack = JSON.parse(project.techStack || '[]')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>投标项目</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 项目信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">项目信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{project.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm">预算: ¥{project.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">工期: {project.duration}天</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">优先级: {project.priority}</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">技术栈:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {techStack.map((tech: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 投标表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">您的报价 (¥) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={bidData.amount}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className={errors.amount ? 'border-red-500' : ''}
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                <p className="text-gray-500 text-xs mt-1">项目方预算: ¥{project.budget.toLocaleString()}</p>
              </div>

              <div>
                <Label htmlFor="duration">承诺工期 (天) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={bidData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                  placeholder="30"
                  className={errors.duration ? 'border-red-500' : ''}
                />
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                <p className="text-gray-500 text-xs mt-1">项目方期望: {project.duration}天</p>
              </div>
            </div>

            <div>
              <Label htmlFor="proposal">开发方案 *</Label>
              <Textarea
                id="proposal"
                value={bidData.proposal}
                onChange={(e) => handleInputChange('proposal', e.target.value)}
                placeholder="请详细描述您的开发思路、技术方案、项目计划、交付标准等..."
                rows={8}
                className={errors.proposal ? 'border-red-500' : ''}
              />
              {errors.proposal && <p className="text-red-500 text-sm mt-1">{errors.proposal}</p>}
              <p className="text-gray-500 text-sm mt-1">
                建议包含：技术选型理由、开发流程、里程碑计划、质量保证措施等
              </p>
            </div>

            {/* 投标提示 */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="text-sm space-y-1">
                  <li>• 投标后项目方将看到您的报价和方案</li>
                  <li>• 请确保您有能力在承诺的工期内完成项目</li>
                  <li>• 恶意投标或无法完成项目将影响您的信用评分</li>
                  <li>• 投标后可以撤回，但频繁撤回会影响信誉</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* 操作按钮 */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '确认投标'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}