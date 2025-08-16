'use client'

import { HomePage } from '@/components/home-page'

export default function Home() {
  return (
    <HomePage 
      userRole="DEVELOPER" // 可以根据实际用户角色动态设置
    />
  )
}