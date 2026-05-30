<template>
  <div class="card bg-base-100 shadow-sm border border-base-200">
    <div class="card-body">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-base-content/60 font-medium">{{ title }}</p>
          <p class="text-3xl font-bold mt-1">{{ formattedValue }}</p>
          <div v-if="trend !== undefined" class="flex items-center gap-1 mt-1 text-sm">
            <span :class="trend >= 0 ? 'text-success' : 'text-error'">
              {{ trend >= 0 ? '↑' : '↓' }} {{ Math.abs(trend) }}%
            </span>
            <span class="text-base-content/40">vs last month</span>
          </div>
        </div>
        <div class="rounded-full p-3" :class="iconBgClass">
          <component :is="icon" class="h-6 w-6" :class="iconClass" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  value: number | string
  trend?: number
  icon: Component
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
}>(), { color: 'primary' })

const colorMap = {
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  success: { bg: 'bg-success/10', text: 'text-success' },
  warning: { bg: 'bg-warning/10', text: 'text-warning' },
  error:   { bg: 'bg-error/10',   text: 'text-error'   },
  info:    { bg: 'bg-info/10',    text: 'text-info'    },
}

const iconBgClass = computed(() => colorMap[props.color].bg)
const iconClass   = computed(() => colorMap[props.color].text)

const formattedValue = computed(() =>
  typeof props.value === 'number'
    ? props.value.toLocaleString()
    : props.value,
)
</script>
