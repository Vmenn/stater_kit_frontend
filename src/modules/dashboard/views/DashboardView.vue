<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-base-content/60 text-sm">Welcome back, {{ authStore.currentUser?.name ?? 'User' }}</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatisticsCard
        v-for="stat in stats"
        :key="stat.title"
        v-bind="stat"
      />
    </div>

    <!-- Charts + Timeline -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div class="xl:col-span-2">
        <AnalyticsWidget title="User Activity" :height="280" />
      </div>
      <ActivityTimeline />
    </div>

    <!-- New Login Alert -->
    <div v-if="newLoginAlert" class="alert alert-warning">
      <span>⚠️ A new device signed in to your account.</span>
      <div class="flex gap-2">
        <RouterLink to="/settings" class="btn btn-xs btn-warning">View Devices</RouterLink>
        <button class="btn btn-xs btn-ghost" @click="dismissAlert">Dismiss</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  UsersIcon,
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  BellIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { authApi } from '@/modules/auth/api/auth.api'
import StatisticsCard from '../components/StatisticsCard.vue'
import AnalyticsWidget from '../components/AnalyticsWidget.vue'
import ActivityTimeline from '../components/ActivityTimeline.vue'

const authStore = useAuthStore()
const newLoginAlert = ref(false)

const stats = [
  { title: 'Total Users',       value: 1_248, trend: 12,  icon: UsersIcon,              color: 'primary'  as const },
  { title: 'Active Sessions',   value: 342,   trend: 5,   icon: DevicePhoneMobileIcon,  color: 'success'  as const },
  { title: 'Published Content', value: 87,    trend: -3,  icon: DocumentTextIcon,       color: 'info'     as const },
  { title: 'Notifications Sent',value: 2_104, trend: 18,  icon: BellIcon,               color: 'warning'  as const },
]

onMounted(async () => {
  try {
    const devices = await authApi.getDevices()
    newLoginAlert.value = devices.some(d => d.newLoginDetected)
  } catch {
    // non-critical
  }
})

async function dismissAlert() {
  try {
    await authApi.dismissNotification()
    newLoginAlert.value = false
  } catch {
    newLoginAlert.value = false
  }
}
</script>
