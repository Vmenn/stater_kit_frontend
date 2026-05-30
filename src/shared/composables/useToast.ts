import { ref } from 'vue'
import type { ToastMessage } from '../types/shared.types'
import { TOAST_DURATION } from '../constants/app.constants'

// Simple event bus for toast
type ToastEventType = 'success' | 'error' | 'warning' | 'info'
type ToastListener = (type: ToastEventType, message: string) => void

const listeners: ToastListener[] = []

export const toastBus = {
  emit(type: ToastEventType, message: string) {
    listeners.forEach(l => l(type, message))
  },
  on(listener: ToastListener) {
    listeners.push(listener)
    return () => {
      const idx = listeners.indexOf(listener)
      if (idx !== -1) listeners.splice(idx, 1)
    }
  },
}

// Global toast state
const toasts = ref<ToastMessage[]>([])

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

function addToast(type: ToastMessage['type'], message: string, duration = TOAST_DURATION) {
  const id = generateId()
  toasts.value.push({ id, type, message, duration })
  setTimeout(() => removeToast(id), duration)
}

function removeToast(id: string) {
  const idx = toasts.value.findIndex(t => t.id === id)
  if (idx !== -1) toasts.value.splice(idx, 1)
}

// Register bus listener
toastBus.on((type, message) => addToast(type, message))

export function useToast() {
  return {
    toasts,
    success: (message: string) => addToast('success', message),
    error: (message: string) => addToast('error', message),
    warning: (message: string) => addToast('warning', message),
    info: (message: string) => addToast('info', message),
    remove: removeToast,
  }
}
