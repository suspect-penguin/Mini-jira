import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { createTask } from '@/store/tasksSlice'
import type { TaskStatus, TaskPriority } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormErrors {
  title?: string
}

export function CreateTaskModal({ open, onOpenChange }: Props) {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!title || title.trim().length < 3) {
      newErrors.title = 'Минимум 3 символа.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await dispatch(createTask({ title: title.trim(), description, status, priority })).unwrap()
      onOpenChange(false)
      setTitle('')
      setDescription('')
      setStatus('todo')
      setPriority('medium')
      setErrors({})
    } catch {
      setSubmitError('Не удалось создать задачу. Попробуйте снова.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenChange = (val: boolean) => {
    if (!submitting) {
      onOpenChange(val)
      if (!val) {
        setErrors({})
        setSubmitError(null)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent automation-id="task-modal">
        <DialogHeader>
          <DialogTitle>Новая задача</DialogTitle>
          <DialogDescription>
            Заполните форму. После сохранения задача появится в выбранной колонке.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label htmlFor="task-title">{errors.title ? 'Введите название' : 'Название'}</Label>
            <Input
              id="task-title"
              automation-id="task-input-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              className={errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="task-desc">Описание</Label>
            <Textarea
              id="task-desc"
              automation-id="task-input-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <Label>Статус</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as TaskStatus)}
                disabled={submitting}
              >
                <SelectTrigger automation-id="task-select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1">
              <Label>Приоритет</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as TaskPriority)}
                disabled={submitting}
              >
                <SelectTrigger automation-id="task-select-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {submitError && (
            <p className="text-sm text-red-500">{submitError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              automation-id="task-cancel-button"
              disabled={submitting}
              onClick={() => handleOpenChange(false)}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              automation-id="task-save-button"
              disabled={submitting}
            >
              {submitting ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
