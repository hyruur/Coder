'use client'

import { SnakeGame } from '@/components/snake-game'

export default function SnakePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <SnakeGame />
    </div>
  )
}
