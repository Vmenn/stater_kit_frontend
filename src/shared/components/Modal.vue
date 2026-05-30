<template>
  <TransitionRoot :show="modelValue" as="template">
    <Dialog as="div" class="relative z-50" @close="$emit('update:modelValue', false)">
      <TransitionChild
        enter="ease-out duration-200" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-150" leave-from="opacity-100" leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            enter="ease-out duration-200" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
            leave="ease-in duration-150" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full bg-base-100 rounded-2xl shadow-2xl border border-base-300"
              :class="sizeClass"
            >
              <!-- Header -->
              <div v-if="title" class="flex items-center justify-between px-6 py-4 border-b border-base-300">
                <DialogTitle class="text-lg font-semibold">{{ title }}</DialogTitle>
                <button class="btn btn-ghost btn-sm btn-circle" @click="$emit('update:modelValue', false)">✕</button>
              </div>

              <!-- Body -->
              <div class="px-6 py-4">
                <slot />
              </div>

              <!-- Footer -->
              <div v-if="$slots.footer" class="px-6 py-4 border-t border-base-300 flex justify-end gap-2">
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Dialog, DialogPanel, DialogTitle,
  TransitionRoot, TransitionChild,
} from '@headlessui/vue'

const props = defineProps<{
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>()

defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const sizeClass = computed(() => {
  const map = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }
  return map[props.size ?? 'md']
})
</script>
