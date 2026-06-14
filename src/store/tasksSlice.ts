import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { tasksApi } from '@/api/tasks'
import type { Task, CreateTaskPayload, UpdateTaskPayload, TaskStatus } from '@/types'

interface TasksState {
  items: Task[]
  loading: boolean
  error: string | null
  selectedTaskId: string | null
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
  selectedTaskId: null,
}

export const fetchTasks = createAsyncThunk('tasks/fetchAll', () => tasksApi.getAll())

export const createTask = createAsyncThunk('tasks/create', (payload: CreateTaskPayload) =>
  tasksApi.create(payload)
)

export const updateTask = createAsyncThunk(
  'tasks/update',
  ({ id, payload }: { id: string; payload: UpdateTaskPayload }) => tasksApi.update(id, payload)
)

export const deleteTask = createAsyncThunk('tasks/delete', (id: string) =>
  tasksApi.delete(id).then(() => id)
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    selectTask(state, action: PayloadAction<string | null>) {
      state.selectedTaskId = action.payload
    },
    clearError(state) {
      state.error = null
    },
    moveTaskLocally(state, action: PayloadAction<{ id: string; status: TaskStatus }>) {
      const task = state.items.find((t) => t.id === action.payload.id)
      if (task) task.status = action.payload.status
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Ошибка загрузки'
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message ?? 'Не удалось обновить задачу'
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload)
        if (state.selectedTaskId === action.payload) {
          state.selectedTaskId = null
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message ?? 'Не удалось удалить задачу'
      })
  },
})

export const { selectTask, clearError, moveTaskLocally } = tasksSlice.actions
export default tasksSlice.reducer
