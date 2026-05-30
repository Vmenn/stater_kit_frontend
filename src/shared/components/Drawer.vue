<template>
  <TransitionRoot :show="modelValue" as="template">
    <Dialog as="div" class="relative z-50" @close="$emit('update:modelValue', false)">
      <TransitionChild
        enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in-out duration-200" leave-from="opacity-100" leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <TransitionChild
              enter="transform transition ease-in-out duration-300"
              enter-from="translate-x-full" enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leave-from="translate-x-0" leave-to="translate-x-full"
            >
              <DialogPanel class="pointer-events-auto w-screen" :class="widthClass">
                <div class="flex h-full flex-col bg-base-100 shadow-xl border-l border-base-300">
                  <div class="flex items-center justify-between px-6 py-4 border-b border-base-300">
                    <DialogTitle class="text-lg font-semibold">{{ title }}</DialogTitle>
                    <button class="btn btn-ghost btn-sm btn-circle" @click="$emit('update:modelValue', false)">✕</button>
                  </div>
                  <div class="flex-1 overflow-y-auto px-6 py-4">
                    <slot />
                  </div>
                  <div v-if="$slots.footer" class="px-6 py-4 border-t border-base-300 flex justify-end gap-2">
                    <slot name="footer" />
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

const props = defineProps<{ modelValue: boolean; title?: string; size?: 'sm' | 'md' | 'lg' }>()
defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const widthClass = computed(() => {
  const map = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }
  return map[props.size ?? 'md']
})
</script>
