<template>
  <div class="animate-pulse">
    <!-- Circle variant -->
    <div v-if="variant === 'circle'" :style="{ width: size, height: size }"
      class="rounded-full skeleton-shimmer rounded-full" />

    <!-- Block variant -->
    <div v-else-if="variant === 'block'" :style="{ width, height }"
      class="skeleton-shimmer rounded-lg" />

    <!-- Lines variant (default) -->
    <div v-else class="space-y-3">
      <div v-for="i in lines" :key="i"
        class="skeleton-shimmer rounded-md h-4"
        :style="{ width: i === lines ? '60%' : '100%' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'lines' | 'circle' | 'block'
  lines?: number
  size?: string
  width?: string
  height?: string
}>(), {
  variant: 'lines',
  lines: 3,
  size: '48px',
  width: '100%',
  height: '120px',
})
</script>
