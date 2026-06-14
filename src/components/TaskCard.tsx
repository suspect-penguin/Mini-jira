import { useDraggable } from '@dnd-kit/core'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { PriorityBadge } from './PriorityBadge'
import type { Task } from '@/types'
import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { deleteTask } from '@/store/tasksSlice'

interface Props {
  task: Task
  onClick: () => void
}

export function TaskCardPreview({ task }: { task: Task }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-lg cursor-grabbing">
      <p className="text-sm font-medium text-gray-900 leading-snug">{task.title}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-500">ID: {task.id}</span>
        <PriorityBadge priority={task.priority} />
      </div>
    </div>
  )
}

export function TaskCard({ task, onClick }: Props) {
  const dispatch = useAppDispatch()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id })

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await dispatch(deleteTask(task.id)).unwrap()
      setConfirmOpen(false)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <>
      <div
        ref={setNodeRef}
        automation-id="task-card"
        className={`bg-white rounded-lg border border-gray-200 p-3 cursor-grab select-none ${
          isDragging ? 'opacity-30' : 'hover:shadow-sm'
        }`}
        onClick={onClick}
        {...listeners}
        {...attributes}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-gray-900 leading-snug">{task.title}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 -mr-1"
                automation-id="task-actions-button"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              automation-id="task-actions-menu"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                automation-id="delete-task-menu-item"
                className="text-destructive focus:text-destructive"
                onSelect={() => setConfirmOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500">ID: {task.id}</span>
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={(v) => { if (!deleting) setConfirmOpen(v) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить задачу?</AlertDialogTitle>
            <AlertDialogDescription>
              После подтверждения задача исчезнет с доски.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              automation-id="cancel-delete-button"
              disabled={deleting}
            >
              Отмена
            </AlertDialogCancel>
            <Button
              variant="destructive"
              automation-id="confirm-delete-button"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Удаление...' : 'Удалить'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
