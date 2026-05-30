import { ref } from 'vue'
import type { ConfirmOptions } from '../types/shared.types'

interface ConfirmState extends ConfirmOptions {
  visible: boolean
  resolve: ((value: boolean) => void) | null
}

const state = ref<ConfirmState>({
  visible: false,
  message: '',
  title: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'info',
  resolve: null,
})

export function useConfirm() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise(resolve => {
      state.value = {
        ...options,
        visible: true,
        confirmText: options.confirmText ?? 'Confirm',
        cancelText: options.cancelText ?? 'Cancel',
        type: options.type ?? 'info',
        resolve,
      }
    })
  }

  function accept() {
    state.value.resolve?.(true)
    state.value.visible = false
  }

  function reject() {
    state.value.resolve?.(false)
    state.value.visible = false
  }

  return { state, confirm, accept, reject }
}
