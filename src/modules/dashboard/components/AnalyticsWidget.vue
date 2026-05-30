<template>
  <div class="card bg-base-100 shadow-sm border border-base-200">
    <div class="card-body">
      <div class="flex items-center justify-between mb-4">
        <h3 class="card-title text-base">{{ title }}</h3>
        <div class="flex gap-1">
          <button
            v-for="p in periods"
            :key="p.value"
            class="btn btn-xs"
            :class="activePeriod === p.value ? 'btn-primary' : 'btn-ghost'"
            @click="activePeriod = p.value"
          >{{ p.label }}</button>
        </div>
      </div>
      <VueApexCharts
        :options="chartOptions"
        :series="series"
        :height="height"
        type="area"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = withDefaults(defineProps<{
  title?: string
  height?: number
}>(), {
  title: 'User Activity',
  height: 260,
})

const periods = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
]
const activePeriod = ref('7d')

const dataMap: Record<string, number[]> = {
  '7d':  [12, 19, 14, 22, 31, 28, 35],
  '30d': [45, 52, 38, 64, 71, 59, 82, 90, 75, 68, 95, 88, 102, 115, 98, 110, 125, 118, 130, 142, 135, 128, 145, 152, 140, 158, 162, 155, 170, 178],
  '90d': Array.from({ length: 90 }, (_, i) => Math.floor(50 + Math.random() * 100 + i * 0.8)),
}

const categoriesMap: Record<string, string[]> = {
  '7d':  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  '30d': Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
  '90d': Array.from({ length: 90 }, (_, i) => `Day ${i + 1}`),
}

const series = computed(() => [{
  name: 'Active Users',
  data: dataMap[activePeriod.value],
}])

const chartOptions = computed(() => ({
  chart: { toolbar: { show: false }, sparkline: { enabled: false } },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
  colors: ['#6366f1'],
  xaxis: { categories: categoriesMap[activePeriod.value], labels: { style: { fontSize: '11px' } } },
  yaxis: { labels: { style: { fontSize: '11px' } } },
  tooltip: { theme: 'dark' },
  grid: { strokeDashArray: 4, borderColor: '#e5e7eb' },
  dataLabels: { enabled: false },
}))
</script>
