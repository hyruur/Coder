'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, X, Plus, Github, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DeveloperOnboardingProps {
  onSubmit: (profileData: DeveloperProfileData) => void
  onCancel: () => void
}

export interface DeveloperProfileData {
  bio: string
  experience: number
  skills: string[]
  portfolio: PortfolioItem[]
  github: string
  hourlyRate: number
  availability: boolean
  level: 'JUNIOR' | 'MIDDLE' | 'SENIOR' | 'EXPERT'
}

interface PortfolioItem {
  title: string
  description: string
  imageUrl?: string
  projectUrl?: string
  technologies: string[]
}

const SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'PHP', 'C++', 'C#',
  'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js',
  'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Laravel',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
  'Docker', 'Kubernetes', 'AWS', '阿里云', '腾讯云', 'Google Cloud',
  'Git', 'CI/CD', 'Linux', 'Nginx', '微服务', 'RESTful API',
  '微信小程序', 'iOS', 'Android', 'Flutter', 'React Native',
  'HTML/CSS', 'Tailwind CSS', 'Bootstrap', 'Sass/Less',
  'Webpack', 'Vite', 'TypeScript', 'Jest', 'Cypress'
]

export function DeveloperOnboarding({ onSubmit, onCancel }: DeveloperOnboardingProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [formData, setFormData] = useState<DeveloperProfileData>({
    bio: '',
    experience: 0,
    skills: [],
    portfolio: [],
    github: '',
    hourlyRate: 0,
    availability: true,
    level: 'JUNIOR'
  })

  const [errors, setErrors] = useState<Partial<Record<keyof DeveloperProfileData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Partial<Record<keyof DeveloperProfileData, string>> = {}

    if (!formData.bio.trim()) {
      newErrors.bio = '请输入个人简介'
    } else if (formData.bio.length < 50) {
      newErrors.bio = '个人简介至少需要50个字符'
    }

    if (formData.experience <= 0) {
      newErrors.experience = '请输入有效的工作经验'
    }

    if (formData.skills.length === 0) {
      newErrors.skills = '请至少选择一个技能'
    }

    if (formData.hourlyRate <= 0) {
      newErrors.hourlyRate = '请输入有效的时薪'
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
      console.error('提交资料失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof DeveloperProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
    
    if (errors.skills) {
      setErrors(prev => ({ ...prev, skills: undefined }))
    }
  }

  const addPortfolioItem = () => {
    const newItem: PortfolioItem = {
      title: '',
      description: '',
      technologies: []
    }
    setFormData(prev => ({
      ...prev,
      portfolio: [...prev.portfolio, newItem]
    }))
  }

  const updatePortfolioItem = (index: number, field: keyof PortfolioItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const removePortfolioItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index)
    }))
  }

  const togglePortfolioTech = (itemIndex: number, tech: string) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.map((item, index) => {
        if (index === itemIndex) {
          return {
            ...item,
            technologies: item.technologies.includes(tech)
              ? item.technologies.filter(t => t !== tech)
              : [...item.technologies, tech]
          }
        }
        return item
      })
    }))
  }

  const canProceedToNext = () => {
    switch (activeTab) {
      case 'basic':
        return formData.bio.trim() && formData.experience > 0 && formData.skills.length > 0
      case 'portfolio':
        return true // 作品集是可选的
      case 'pricing':
        return formData.hourlyRate > 0
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">程序员入驻申请</CardTitle>
          <p className="text-gray-600">请完善您的个人资料，让需求方更好地了解您的能力</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="portfolio">作品集</TabsTrigger>
                <TabsTrigger value="pricing">服务设置</TabsTrigger>
              </TabsList>

              {/* 基本信息标签页 */}
              <TabsContent value="basic" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bio">个人简介 *</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="请介绍您的专业技能、工作经验、项目经验等..."
                      rows={6}
                      className={errors.bio ? 'border-red-500' : ''}
                    />
                    {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                    <p className="text-gray-500 text-sm mt-1">建议至少50个字符，详细描述有助于获得更多项目机会</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience">工作经验 (年) *</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className={errors.experience ? 'border-red-500' : ''}
                      />
                      {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                    </div>

                    <div>
                      <Label htmlFor="level">开发者等级</Label>
                      <Select
                        value={formData.level}
                        onValueChange={(value) => handleInputChange('level', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JUNIOR">初级 (0-2年)</SelectItem>
                          <SelectItem value="MIDDLE">中级 (2-5年)</SelectItem>
                          <SelectItem value="SENIOR">高级 (5-10年)</SelectItem>
                          <SelectItem value="EXPERT">专家 (10年以上)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>技能标签 *</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {SKILLS.map(skill => (
                        <Badge
                          key={skill}
                          variant={formData.skills.includes(skill) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleSkill(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                    <p className="text-gray-500 text-sm mt-1">选择您擅长的技术栈，最多选择10个</p>
                  </div>

                  <div>
                    <Label htmlFor="github">GitHub 地址</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="github"
                        value={formData.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                        placeholder="https://github.com/username"
                        className="pl-10"
                      />
                    </div>
                    <p className="text-gray-500 text-sm mt-1">提供GitHub地址可以展示您的代码质量和项目经验</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setActiveTab('portfolio')}
                    disabled={!canProceedToNext()}
                  >
                    下一步
                  </Button>
                </div>
              </TabsContent>

              {/* 作品集标签页 */}
              <TabsContent value="portfolio" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">作品集展示</h3>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addPortfolioItem}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      添加作品
                    </Button>
                  </div>

                  {formData.portfolio.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>还没有添加作品集，点击上方按钮添加您的作品</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.portfolio.map((item, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-medium">作品 {index + 1}</h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePortfolioItem(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Label>项目名称</Label>
                                <Input
                                  value={item.title}
                                  onChange={(e) => updatePortfolioItem(index, 'title', e.target.value)}
                                  placeholder="项目名称"
                                />
                              </div>

                              <div>
                                <Label>项目描述</Label>
                                <Textarea
                                  value={item.description}
                                  onChange={(e) => updatePortfolioItem(index, 'description', e.target.value)}
                                  placeholder="描述项目功能、您的贡献、使用的技术等..."
                                  rows={3}
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>项目链接</Label>
                                  <Input
                                    value={item.projectUrl || ''}
                                    onChange={(e) => updatePortfolioItem(index, 'projectUrl', e.target.value)}
                                    placeholder="https://example.com"
                                  />
                                </div>
                                <div>
                                  <Label>项目图片</Label>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        // 这里可以处理图片上传
                                        console.log('上传图片:', file)
                                      }
                                    }}
                                  />
                                </div>
                              </div>

                              <div>
                                <Label>使用技术</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {SKILLS.slice(0, 12).map(tech => (
                                    <Badge
                                      key={tech}
                                      variant={item.technologies.includes(tech) ? "default" : "outline"}
                                      className="cursor-pointer text-xs"
                                      onClick={() => togglePortfolioTech(index, tech)}
                                    >
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('basic')}
                  >
                    上一步
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab('pricing')}
                  >
                    下一步
                  </Button>
                </div>
              </TabsContent>

              {/* 服务设置标签页 */}
              <TabsContent value="pricing" className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hourlyRate">时薪 (¥/小时) *</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => handleInputChange('hourlyRate', parseFloat(e.target.value) || 0)}
                        placeholder="100"
                        className={errors.hourlyRate ? 'border-red-500' : ''}
                      />
                      {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
                      <p className="text-gray-500 text-sm mt-1">根据您的经验和技能水平合理定价</p>
                    </div>

                    <div>
                      <Label htmlFor="availability">接单状态</Label>
                      <Select
                        value={formData.availability ? 'true' : 'false'}
                        onValueChange={(value) => handleInputChange('availability', value === 'true')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">可接单</SelectItem>
                          <SelectItem value="false">暂停接单</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 预览卡片 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">资料预览</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">等级：</span>
                          <Badge variant="outline">{formData.level}</Badge>
                        </div>
                        <div>
                          <span className="font-medium">经验：</span>
                          {formData.experience} 年
                        </div>
                        <div>
                          <span className="font-medium">时薪：</span>
                          ¥{formData.hourlyRate}/小时
                        </div>
                        <div>
                          <span className="font-medium">状态：</span>
                          <Badge variant={formData.availability ? "default" : "secondary"}>
                            {formData.availability ? "可接单" : "暂停接单"}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">技能：</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {formData.skills.slice(0, 6).map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {formData.skills.length > 6 && (
                              <Badge variant="outline" className="text-xs">
                                +{formData.skills.length - 6}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('portfolio')}
                  >
                    上一步
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                    >
                      取消
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !canProceedToNext()}
                    >
                      {isSubmitting ? '提交中...' : '提交申请'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}