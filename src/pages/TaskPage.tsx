import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { tasksApi } from '@/api/tasks'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateTask, deleteTask } from '@/store/tasksSlice'
import type { Task, TaskStatus, TaskPriority } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface FieldBlockProps {
  label: string
  children: React.ReactNode
  onConfirm: () => void
  onCancel: () => void
  disabled: boolean
  error?: string | null
}

function FieldBlock({ label, children, onConfirm, onCancel, disabled, error }: FieldBlockProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
        <button
          onClick={onConfirm}
          disabled={disabled}
          className="flex items-center gap-1 hover:text-green-600 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          Подтвердить
        </button>
        <button
          onClick={onCancel}
          disabled={disabled}
          className="flex items-center gap-1 hover:text-red-500 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
          Отмена
        </button>
      </div>
    </div>
  )
}

interface EditorProps {
  task: Task
}

function TaskEditor({ task }: EditorProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [titleVal, setTitleVal] = useState(task.title)
  const [descVal, setDescVal] = useState(task.description)
  const [statusVal, setStatusVal] = useState<TaskStatus>(task.status)
  const [priorityVal, setPriorityVal] = useState<TaskPriority>(task.priority)

  const [savingField, setSavingField] = useState<string | null>(null)
  const [titleError, setTitleError] = useState<string | null>(null)

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isDisabled = savingField !== null || deleting

  const handleSaveField = async (field: string, value: string) => {
    if (field === 'title' && value.trim().length < 3) {
      setTitleError('Минимум 3 символа')
      return
    }
    setTitleError(null)
    setSavingField(field)
    try {
      await dispatch(updateTask({ id: task.id, payload: { [field]: value } })).unwrap()
    } finally {
      setSavingField(null)
    }
  }

  const handleCancelField = (field: string) => {
    if (field === 'title') { setTitleVal(task.title); setTitleError(null) }
    if (field === 'description') setDescVal(task.description)
    if (field === 'status') setStatusVal(task.status)
    if (field === 'priority') setPriorityVal(task.priority)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await dispatch(deleteTask(task.id)).unwrap()
      navigate('/')
    } catch {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-gray-500 mb-1">Task ID: {task.id}</p>
          <h1 className="text-lg font-bold text-gray-900">Редактирование задачи</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          На доску
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <FieldBlock
          label="Название"
          onConfirm={() => handleSaveField('title', titleVal)}
          onCancel={() => handleCancelField('title')}
          disabled={isDisabled}
          error={titleError}
        >
          <Input
            value={titleVal}
            onChange={(e) => setTitleVal(e.target.value)}
            disabled={isDisabled}
            className={titleError ? 'border-red-500' : ''}
          />
        </FieldBlock>

        <FieldBlock
          label="Описание"
          onConfirm={() => handleSaveField('description', descVal)}
          onCancel={() => handleCancelField('description')}
          disabled={isDisabled}
        >
          <Textarea
            value={descVal}
            onChange={(e) => setDescVal(e.target.value)}
            disabled={isDisabled}
          />
        </FieldBlock>

        <FieldBlock
          label="Статус"
          onConfirm={() => handleSaveField('status', statusVal)}
          onCancel={() => handleCancelField('status')}
          disabled={isDisabled}
        >
          <Select
            value={statusVal}
            onValueChange={(v) => setStatusVal(v as TaskStatus)}
            disabled={isDisabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </FieldBlock>

        <FieldBlock
          label="Приоритет"
          onConfirm={() => handleSaveField('priority', priorityVal)}
          onCancel={() => handleCancelField('priority')}
          disabled={isDisabled}
        >
          <Select
            value={priorityVal}
            onValueChange={(v) => setPriorityVal(v as TaskPriority)}
            disabled={isDisabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </FieldBlock>
      </div>

      <div className="mt-6">
        <Button
          variant="destructive"
          automation-id="delete-task-button"
          onClick={() => setConfirmDeleteOpen(true)}
          disabled={isDisabled}
        >
          Удалить задачу
        </Button>
      </div>

      <AlertDialog
        open={confirmDeleteOpen}
        onOpenChange={(v) => { if (!deleting) setConfirmDeleteOpen(v) }}
      >
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

export function TaskPage() {
  const { id } = useParams<{ id: string }>()
  const storeTask = useAppSelector((s) => s.tasks.items.find((t) => t.id === id))

  const [fetchedTask, setFetchedTask] = useState<Task | null>(null)
  const [fetchError, setFetchError] = useState(false)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (storeTask || !id) return
    let cancelled = false
    const load = async () => {
      setFetching(true)
      try {
        const t = await tasksApi.getById(id)
        if (!cancelled) setFetchedTask(t)
      } catch {
        if (!cancelled) setFetchError(true)
      } finally {
        if (!cancelled) setFetching(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [id, storeTask])

  const task = storeTask ?? fetchedTask

  if (fetching) {
    return (
      <div automation-id="task-page" className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    )
  }

  if (fetchError || !task) {
    return (
      <div automation-id="task-page" className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Задача не найдена.</p>
      </div>
    )
  }

  return (
    <div automation-id="task-page" className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <TaskEditor key={task.id} task={task} />
        </div>
      </div>
    </div>
  )
}
