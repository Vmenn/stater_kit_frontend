<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="mb-4 opacity-30">
      <component :is="icon ?? FolderOpenIcon" class="h-16 w-16 mx-auto" />
    </div>
    <h3 class="text-lg font-semibold mb-1">{{ title ?? 'No data found' }}</h3>
    <p v-if="description" class="text-base-content/60 text-sm mb-4 max-w-xs">{{ description }}</p>
    <button v-if="actionLabel" class="btn btn-primary btn-sm" @click="$emit('action')">
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { FolderOpenIcon } from '@heroicons/vue/24/outline'

defineProps<{
  title?: string
  description?: string
  icon?: unknown
  actionLabel?: string
}>()

defineEmits<{ (e: 'action'): void }>()
</script>
