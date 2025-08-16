'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, DollarSign, User, Eye } from 'lucide-react'
import { Project } from '@/types'
import { useRouter } from 'next/navigation'

interface ProjectCardProps {
  project: Project
  onBid?: (projectId: string) => void
}

export function ProjectCard({ project, onBid }: ProjectCardProps) {
  const router = useRouter()
  const techStack = JSON.parse(project.techStack || '[]')
  
  const handleViewDetails = () => {
    router.push(`/project/${project.id}`)
  }

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold line-clamp-2">{project.title}</h3>
          <Badge variant={project.priority === 'URGENT' ? 'destructive' : 
                         project.priority === 'HIGH' ? 'default' : 
                         project.priority === 'MEDIUM' ? 'secondary' : 'outline'}>
            {project.priority}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description}
        </p>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2 mb-3">
          {techStack.slice(0, 4).map((tech: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
          {techStack.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{techStack.length - 4}
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-medium">¥{project.budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>{project.duration}天</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4 text-purple-600" />
            <span className="text-xs">{project.client.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-gray-600" />
            <span className="text-xs">{project.viewCount}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleViewDetails}
          >
            查看详情
          </Button>
          {onBid && project.status === 'PUBLISHED' && (
            <Button 
              className="flex-1"
              onClick={() => onBid(project.id)}
            >
              立即投标
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}