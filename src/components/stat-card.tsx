import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  iconClassName?: string
  label: string
  value: string | number
}

/**
 * Reusable statistic card used across dashboard and home-page.
 */
export function StatCard({ icon: Icon, iconClassName, label, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <Icon className={`h-8 w-8 ${iconClassName ?? 'text-gray-600'}`} />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
