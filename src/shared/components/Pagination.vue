<template>
  <div class="flex items-center justify-between py-3">
    <p class="text-sm text-base-content/60">
      Showing {{ from }}–{{ to }} of {{ total }} results
    </p>
    <div class="join">
      <button class="join-item btn btn-sm" :disabled="page === 0" @click="$emit('change', page - 1)">«</button>
      <template v-for="p in displayedPages" :key="p">
        <button
          v-if="p !== '...'"
          class="join-item btn btn-sm"
          :class="{ 'btn-active': p === page }"
          @click="$emit('change', Number(p))"
        >{{ Number(p) + 1 }}</button>
        <button v-else class="join-item btn btn-sm btn-disabled">…</button>
      </template>
      <button class="join-item btn btn-sm" :disabled="page >= totalPages - 1" @click="$emit('change', page + 1)">»</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  totalPages: number
  total: number
  size: number
}>()

defineEmits<{ (e: 'change', page: number): void }>()

const from = computed(() => props.total === 0 ? 0 : props.page * props.size + 1)
const to = computed(() => Math.min((props.page + 1) * props.size, props.total))

const displayedPages = computed((): (number | '...')[] => {
  const pages: (number | '...')[] = []
  const total = props.totalPages
  const cur = props.page

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i)
  }
  pages.push(0)
  if (cur > 3) pages.push('...')
  const start = Math.max(1, cur - 1)
  const end = Math.min(total - 2, cur + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (cur < total - 4) pages.push('...')
  pages.push(total - 1)
  return pages
})
</script>
