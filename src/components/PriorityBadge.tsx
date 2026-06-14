import { Badge } from '@/components/ui/badge'
import type { TaskPriority } from '@/types'

const labels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const variants: Record<TaskPriority, 'default' | 'secondary' | 'destructive'> = {
  low: 'secondary',
  medium: 'default',
  high: 'destructive',
}

interface Props {
  priority: TaskPriority
}

export function PriorityBadge({ priority }: Props) {
  return <Badge variant={variants[priority]}>{labels[priority]}</Badge>
}
