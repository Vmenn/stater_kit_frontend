export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  warning?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

// Alias for Spring Page response
export type PaginatedResponse<T> = PageResponse<T>

export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string
  header: string
  sortable?: boolean
  width?: string
  formatter?: (value: unknown, row: T) => string
}

export interface TableState {
  page: number
  size: number
  sort: string
  direction: 'asc' | 'desc'
  search: string
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}
