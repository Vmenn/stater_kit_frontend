<template>
  <div class="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
    <!-- Top nav -->
    <header class="sticky top-0 z-40 bg-base-100/80 backdrop-blur-md border-b border-base-200">
      <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <!-- Logo + breadcrumb -->
        <div class="flex items-center gap-3">
          <RouterLink to="/" class="flex items-center gap-2 font-bold text-lg">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">E</div>
          </RouterLink>
          <ChevronRightIcon class="h-4 w-4 text-base-content/30" />
          <span class="text-sm font-medium text-base-content/60">{{ routeTitle }}</span>
        </div>

        <!-- User menu -->
        <div class="flex items-center gap-2">
          <!-- Notifications -->
          <RouterLink to="/user/notifications" class="btn btn-ghost btn-sm btn-square relative">
            <BellIcon class="h-5 w-5" />
            <span v-if="notifStore.unreadCount > 0" class="absolute top-0 right-0 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
              {{ notifStore.unreadCount > 9 ? '9+' : notifStore.unreadCount }}
            </span>
          </RouterLink>

          <!-- Avatar dropdown -->
          <Dropdown align="right">
            <template #trigger>
              <button class="flex items-center gap-2 btn btn-ghost btn-sm px-2">
                <div class="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-semibold">
                  {{ initials }}
                </div>
                <span class="hidden sm:block text-sm font-medium max-w-[100px] truncate">{{ authStore.currentUser?.name }}</span>
              </button>
            </template>
            <template #default="{ close }">
              <li><RouterLink to="/user/profile"   @click="close">Profile</RouterLink></li>
              <li><RouterLink to="/user/settings"  @click="close">Settings</RouterLink></li>
              <li class="divider my-0.5" />
              <li><a class="text-error" @click="() => { close(); logout() }">Sign Out</a></li>
            </template>
          </Dropdown>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-5xl mx-auto px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BellIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useNotificationStore } from '@/modules/notifications/store/notification.store'
import Dropdown from '@/shared/components/Dropdown.vue'

const authStore = useAuthStore()
const notifStore = useNotificationStore()
const route = useRoute()
const router = useRouter()

const routeTitle = computed(() => (route.meta.title as string) ?? 'Dashboard')
const initials = computed(() => {
  const name = authStore.currentUser?.name ?? ''
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
})

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script>
