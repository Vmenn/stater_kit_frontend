<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="alert shadow-lg pointer-events-auto animate-slide-in-right"
          :class="alertClass(toast.type)"
        >
          <component :is="iconComponent(toast.type)" class="h-5 w-5 shrink-0" />
          <span class="text-sm">{{ toast.message }}</span>
          <button class="btn btn-ghost btn-xs btn-circle ml-auto" @click="remove(toast.id)">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'
import { useToast } from '@/shared/composables/useToast'

const { toasts, remove } = useToast()

function alertClass(type: string): string {
  const map: Record<string, string> = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info',
  }
  return map[type] ?? 'alert-info'
}

function iconComponent(type: string) {
  const map: Record<string, unknown> = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  }
  return map[type] ?? InformationCircleIcon
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
