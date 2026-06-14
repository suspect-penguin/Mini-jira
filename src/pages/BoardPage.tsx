import { useEffect, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { AlertCircle, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchTasks, updateTask, moveTaskLocally, selectTask, clearError } from '@/store/tasksSlice'
import type { Task, TaskStatus } from '@/types'
import { KanbanColumn } from '@/components/KanbanColumn'
import { TaskCardPreview } from '@/components/TaskCard'
import { TaskDrawer } from '@/components/TaskDrawer'
import { CreateTaskModal } from '@/components/CreateTaskModal'
import { BoardSkeleton } from '@/components/BoardSkeleton'
import { Button } from '@/components/ui/button'

const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done']

export function BoardPage() {
  const dispatch = useAppDispatch()
  const { items, loading, error, selectedTaskId } = useAppSelector((s) => s.tasks)
  const [modalOpen, setModalOpen] = useState(false)
  const [draggingTask, setDraggingTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  )

  useEffect(() => {
    void dispatch(fetchTasks())
  }, [dispatch])

  const selectedTask = items.find((t) => t.id === selectedTaskId) ?? null

  const handleCardClick = (task: Task) => {
    dispatch(selectTask(task.id))
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = items.find((t) => t.id === String(event.active.id))
    setDraggingTask(task ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setDraggingTask(null)
    if (!over) return
    const taskId = String(active.id)
    const newStatus = String(over.id) as TaskStatus
    const task = items.find((t) => t.id === taskId)
    if (!task || task.status === newStatus) return
    dispatch(moveTaskLocally({ id: taskId, status: newStatus }))
    void dispatch(updateTask({ id: taskId, payload: { status: newStatus } }))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-200">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Kanban Board</h1>
              <p className="text-sm text-gray-500">Mini Jira с Redux Toolkit и shadcn/ui</p>
            </div>
            <Button
              automation-id="create-task-button"
              onClick={() => setModalOpen(true)}
            >
              Создать задачу
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 flex items-start gap-3 bg-white border border-red-200 rounded-lg p-4 shadow-sm max-w-sm ml-auto">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Ошибка.</p>
                  <p className="text-sm text-gray-500">{error}</p>
                </div>
                <button
                  onClick={() => dispatch(clearError())}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {loading ? (
              <BoardSkeleton />
            ) : (
              <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div
                  automation-id="board"
                  className="flex gap-4 h-full"
                >
                  {STATUSES.map((status) => (
                    <KanbanColumn
                      key={status}
                      status={status}
                      tasks={items.filter((t) => t.status === status)}
                      onCardClick={handleCardClick}
                    />
                  ))}
                </div>
                <DragOverlay>
                  {draggingTask && <TaskCardPreview task={draggingTask} />}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>

        {selectedTask && (
          <TaskDrawer
            task={selectedTask}
            onClose={() => dispatch(selectTask(null))}
          />
        )}
      </div>

      <CreateTaskModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
