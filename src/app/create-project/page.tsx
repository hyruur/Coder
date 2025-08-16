'use client'

import { useState } from 'react'
import { ProjectForm, ProjectFormData } from '@/components/project-form'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default function CreateProjectPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (projectData: ProjectFormData) => {
    setIsSubmitting(true)
    
    try {
      // 这里应该调用API来创建项目
      console.log('提交项目数据:', projectData)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "项目发布成功",
        description: "您的项目已成功发布，程序员可以开始投标了",
      })
      
      // 跳转到项目列表页
      router.push('/')
      
    } catch (error) {
      console.error('创建项目失败:', error)
      toast({
        title: "发布失败",
        description: "项目发布失败，请重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ProjectForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}