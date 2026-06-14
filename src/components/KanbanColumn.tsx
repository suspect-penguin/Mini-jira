import { useDroppable } from '@dnd-kit/core'
import { TaskCard } from './TaskCard'
import type { Task, TaskStatus } from '@/types'

const COLUMN_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
}

interface Props {
  status: TaskStatus
  tasks: Task[]
  onCardClick: (task: Task) => void
}

export function KanbanColumn({ status, tasks, onCardClick }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      automation-id="column"
      className={`flex flex-col rounded-xl p-4 min-h-[400px] flex-1 transition-colors ${
        isOver ? 'bg-blue-50 outline outline-2 outline-dashed outline-blue-300' : 'bg-gray-50'
      }`}
    >
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{COLUMN_LABELS[status]}</h3>
      <div className="flex flex-col gap-2 flex-1">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Нет задач</p>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onCardClick(task)} />
          ))
        )}
      </div>
    </div>
  )
}
