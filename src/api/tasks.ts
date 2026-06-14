import type { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types'

const BASE_URL = import.meta.env.DEV ? '' : 'https://webdev-kanban.culab.ru'
const AUTH_HEADER = 'Bearer vahre3heisigaiph1chi7iQu1ma4ao0e'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options?.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      Authorization: AUTH_HEADER,
      ...options?.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

export const tasksApi = {
  getAll: () => request<Task[]>('/tasks'),
  getById: (id: string) => request<Task>(`/tasks/${id}`),
  create: (payload: CreateTaskPayload) =>
    request<Task>('/tasks', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: string, payload: UpdateTaskPayload) =>
    request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  delete: (id: string) =>
    request<void>(`/tasks/${id}`, { method: 'DELETE' }),
}
