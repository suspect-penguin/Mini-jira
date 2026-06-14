import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PriorityBadge } from './PriorityBadge'
import type { Task } from '@/types'

const STATUS_LABELS: Record<string, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
}

interface Props {
  task: Task
  onClose: () => void
}

export function TaskDrawer({ task, onClose }: Props) {
  const navigate = useNavigate()

  return (
    <div
      automation-id="task-drawer"
      className="w-72 shrink-0 border-l border-gray-200 bg-white flex flex-col h-full"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Детали задачи</h2>
        <Button
          variant="ghost"
          size="icon"
          automation-id="drawer-close-button"
          onClick={onClose}
          className="h-7 w-7"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto">
        <div>
          <p className="text-xs text-gray-500 mb-1">ID</p>
          <div
            automation-id="drawer-task-id"
            className="text-sm font-medium bg-gray-50 rounded px-3 py-2"
          >
            {task.id}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Название</p>
          <div automation-id="drawer-task-title" className="text-base font-semibold text-gray-900">
            {task.title}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Описание</p>
          <div automation-id="drawer-task-description" className="text-sm text-gray-700">
            {task.description}
          </div>
        </div>

        <div className="flex gap-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Статус</p>
            <div automation-id="drawer-task-status" className="text-sm font-medium">
              {STATUS_LABELS[task.status]}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Приоритет</p>
            <div automation-id="drawer-task-priority">
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button
          className="w-full"
          automation-id="open-task-page-button"
          onClick={() => navigate(`/tasks/${task.id}`)}
        >
          Открыть страницу задачи
        </Button>
      </div>
    </div>
  )
}
