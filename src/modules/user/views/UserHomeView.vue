<template>
  <div class="space-y-8">
    <!-- Welcome hero -->
    <div class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-secondary p-8 text-white">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
      <div class="relative z-10">
        <p class="text-white/70 text-sm mb-1">Welcome back 👋</p>
        <h1 class="text-3xl font-black mb-2">{{ authStore.currentUser?.name ?? 'User' }}</h1>
        <p class="text-white/70 text-sm">{{ authStore.currentUser?.email }}</p>
        <div class="flex items-center gap-3 mt-5">
          <span class="badge bg-white/20 text-white border-0 font-medium">{{ authStore.currentUser?.role }}</span>
          <span class="badge bg-white/20 text-white border-0">Active</span>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div>
      <h2 class="text-lg font-bold mb-4">Quick Actions</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <RouterLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.to"
          class="group card bg-base-100 border border-base-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all hover:-translate-y-0.5"
        >
          <div class="card-body items-center text-center py-5 px-3">
            <div class="text-3xl mb-2 group-hover:scale-110 transition-transform">{{ action.icon }}</div>
            <p class="text-xs font-medium">{{ action.label }}</p>
          </div>
        </RouterLink>
      </div>
    </div>

    <!-- Two column -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Profile summary -->
      <div class="card bg-base-100 border border-base-200 shadow-sm">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold">Profile</h3>
            <RouterLink to="/user/settings" class="btn btn-xs btn-ghost">Edit</RouterLink>
          </div>
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-black">
              {{ initials }}
            </div>
            <div>
              <p class="font-semibold">{{ authStore.currentUser?.name }}</p>
              <p class="text-sm text-base-content/50">{{ authStore.currentUser?.email }}</p>
            </div>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between py-2 border-b border-base-200">
              <span class="text-base-content/50">Role</span>
              <span class="font-medium">{{ authStore.currentUser?.role }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-base-200">
              <span class="text-base-content/50">Status</span>
              <span class="badge badge-success badge-sm">Active</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-base-content/50">Member since</span>
              <span class="font-medium">{{ memberSince }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Active devices -->
      <div class="card bg-base-100 border border-base-200 shadow-sm">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold">Active Devices</h3>
            <RouterLink to="/user/settings" class="btn btn-xs btn-ghost">Manage</RouterLink>
          </div>

          <div v-if="loadingSessions" class="flex justify-center py-6">
            <span class="loading loading-spinner loading-sm" />
          </div>
          <ul v-else class="space-y-2">
            <li
              v-for="session in sessions.slice(0, 4)"
              :key="session.id"
              class="flex items-center gap-3 p-2 rounded-xl hover:bg-base-200 transition-colors"
            >
              <div class="w-9 h-9 rounded-xl bg-base-200 flex items-center justify-center text-lg">
                {{ platformIcon(session.platform) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">
                  {{ session.platform ?? 'Unknown' }}
                  <span v-if="session.currentDevice" class="badge badge-primary badge-xs ml-1">This</span>
                </p>
                <p class="text-xs text-base-content/50">{{ session.ipAddress }}</p>
              </div>
              <span v-if="session.newLoginDetected" class="badge badge-warning badge-xs">New</span>
            </li>
            <li v-if="sessions.length === 0" class="text-sm text-base-content/40 text-center py-4">
              No active sessions
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Notifications preview -->
    <div class="card bg-base-100 border border-base-200 shadow-sm">
      <div class="card-body">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold">Recent Notifications</h3>
          <RouterLink to="/user/notifications" class="btn btn-xs btn-ghost">View all</RouterLink>
        </div>
        <div v-if="notifStore.notifications.length === 0" class="text-center py-6 text-base-content/40 text-sm">
          No notifications yet
        </div>
        <ul v-else class="divide-y divide-base-200">
          <li
            v-for="n in notifStore.notifications.slice(0, 3)"
            :key="n.id"
            class="py-3 flex items-start gap-3 cursor-pointer hover:bg-base-200 -mx-2 px-2 rounded-xl transition-colors"
            @click="notifStore.markRead(n.id)"
          >
            <span class="text-xl mt-0.5">{{ notifTypeIcon(n.type) }}</span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium">{{ n.title }}</p>
              <p class="text-xs text-base-content/50 truncate">{{ n.body }}</p>
            </div>
            <div v-if="!n.read" class="w-2 h-2 bg-primary rounded-full mt-1 flex-shrink-0" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useNotificationStore } from '@/modules/notifications/store/notification.store'
import { authApi } from '@/modules/auth/api/auth.api'
import type { DeviceSession } from '@/modules/auth/types/auth.types'
import { formatDate } from '@/shared/helpers/date.helper'

const authStore = useAuthStore()
const notifStore = useNotificationStore()

const sessions = ref<DeviceSession[]>([])
const loadingSessions = ref(false)

const initials = computed(() => {
  const name = authStore.currentUser?.name ?? ''
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
})

const memberSince = computed(() =>
  authStore.currentUser?.createdAt ? formatDate(authStore.currentUser.createdAt) : '—',
)

const quickActions = [
  { icon: '👤', label: 'Profile',       to: '/user/settings'       },
  { icon: '🔔', label: 'Notifications', to: '/user/notifications'  },
  { icon: '🖥️', label: 'My Devices',    to: '/user/settings'       },
  { icon: '🔐', label: 'Security',      to: '/user/settings'       },
]

onMounted(async () => {
  loadingSessions.value = true
  try {
    sessions.value = await authApi.getDevices()
  } finally {
    loadingSessions.value = false
  }
})

function platformIcon(platform?: string) {
  const map: Record<string, string> = { ios: '🍎', android: '🤖', web: '🌐' }
  return map[platform?.toLowerCase() ?? ''] ?? '💻'
}

function notifTypeIcon(type: string) {
  const map: Record<string, string> = { SECURITY_ALERT: '🔐', SYSTEM: '⚙️', ANNOUNCEMENT: '📢', warning: '⚠️', error: '❌', success: '✅' }
  return map[type] ?? '🔔'
}
</script>
