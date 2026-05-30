<template>
  <header class="fixed top-0 right-0 left-0 z-30 h-16 bg-base-100 border-b border-base-300 flex items-center px-4 gap-4"
    :style="{ paddingLeft: `${leftOffset}px` }">
    <!-- Page title -->
    <div class="flex-1 min-w-0">
      <h2 class="text-lg font-semibold truncate">{{ pageTitle }}</h2>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <!-- Theme toggle -->
      <button class="btn btn-ghost btn-sm btn-circle" @click="toggleTheme" title="Toggle theme">
        <SunIcon v-if="isDark" class="h-5 w-5" />
        <MoonIcon v-else class="h-5 w-5" />
      </button>

      <!-- Notification bell -->
      <RouterLink to="/notifications" class="btn btn-ghost btn-sm btn-circle relative">
        <BellIcon class="h-5 w-5" />
        <span
          v-if="notificationStore.unreadCount > 0"
          class="absolute top-0 right-0 h-4 w-4 rounded-full bg-error text-error-content text-xs flex items-center justify-center"
        >
          {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
        </span>
      </RouterLink>

      <!-- User menu -->
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-sm gap-2">
          <div class="avatar placeholder">
            <div class="w-7 rounded-full bg-primary text-primary-content">
              <span class="text-xs font-bold">{{ initials }}</span>
            </div>
          </div>
          <span class="hidden sm:block text-sm font-medium max-w-24 truncate">
            {{ authStore.currentUser?.name ?? 'User' }}
          </span>
        </div>
        <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box shadow-lg border border-base-300 w-52 p-2 z-50">
          <li class="menu-title px-2 py-1">
            <span class="text-xs text-base-content/50">{{ authStore.currentUser?.email }}</span>
          </li>
          <li><RouterLink to="/settings">Settings</RouterLink></li>
          <li><button @click="handleLogout" class="text-error">Logout</button></li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BellIcon, SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useNotificationStore } from '@/modules/notifications/store/notification.store'

defineProps<{ sidebarOpen: boolean }>()

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const route = useRoute()
const router = useRouter()

const isDark = ref(document.documentElement.getAttribute('data-theme') === 'enterpriseDark')

const leftOffset = computed(() => 64) // sidebar width — kept fixed to avoid layout shift

const pageTitle = computed(() => route.meta.title as string ?? 'Dashboard')

const initials = computed(() => {
  const name = authStore.currentUser?.name ?? ''
  return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
})

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'enterpriseDark' : 'enterpriseLight')
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>
