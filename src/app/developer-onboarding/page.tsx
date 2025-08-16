'use client'

import { useState } from 'react'
import { DeveloperOnboarding, DeveloperProfileData } from '@/components/developer-onboarding'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default function DeveloperOnboardingPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (profileData: DeveloperProfileData) => {
    setIsSubmitting(true)
    
    try {
      // 这里应该调用API来提交程序员资料
      console.log('提交程序员资料:', profileData)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "申请提交成功",
        description: "您的入驻申请已提交，我们将在1-3个工作日内审核",
      })
      
      // 跳转到首页
      router.push('/')
      
    } catch (error) {
      console.error('提交申请失败:', error)
      toast({
        title: "提交失败",
        description: "申请提交失败，请重试",
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
      <DeveloperOnboarding
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}