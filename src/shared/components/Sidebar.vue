<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 flex flex-col bg-base-200 border-r border-base-300 transition-all duration-300',
      isOpen ? 'w-64' : 'w-16',
    ]"
  >
    <!-- Logo -->
    <div class="flex h-16 items-center border-b border-base-300 px-4 shrink-0">
      <div class="flex items-center gap-3">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <svg class="h-5 w-5 text-primary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span v-if="isOpen" class="font-bold text-sm truncate">Enterprise Kit</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
      <template v-for="item in filteredNavItems" :key="item.name">
        <RouterLink
          :to="item.to"
          :class="['sidebar-link', { active: isActive(item.to) }]"
          :title="!isOpen ? item.label : undefined"
        >
          <component :is="item.icon" class="h-5 w-5 shrink-0" />
          <span v-if="isOpen" class="truncate">{{ item.label }}</span>
        </RouterLink>
      </template>
    </nav>

    <!-- User info + logout -->
    <div class="border-t border-base-300 p-3">
      <div v-if="isOpen && authStore.currentUser" class="flex items-center gap-3 px-2 py-1 mb-2">
        <div class="avatar placeholder">
          <div class="w-8 rounded-full bg-primary text-primary-content">
            <span class="text-xs font-bold">{{ initials }}</span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ authStore.currentUser.name }}</p>
          <p class="text-xs text-base-content/50 truncate">{{ authStore.currentUser.role }}</p>
        </div>
      </div>
      <button
        class="sidebar-link w-full text-error hover:bg-error/10"
        :title="!isOpen ? 'Logout' : undefined"
        @click="handleLogout"
      >
        <ArrowRightOnRectangleIcon class="h-5 w-5 shrink-0" />
        <span v-if="isOpen">Logout</span>
      </button>
    </div>

    <!-- Toggle button -->
    <button
      class="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-base-300 border border-base-300 shadow-sm hover:bg-base-content/10 transition-colors"
      @click="toggle"
    >
      <ChevronLeftIcon v-if="isOpen" class="h-3 w-3" />
      <ChevronRightIcon v-else class="h-3 w-3" />
    </button>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/modules/auth/store/auth.store'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const navItems = [
  { name: 'dashboard', label: 'Dashboard', to: '/admin/dashboard', icon: HomeIcon, roles: [] },
  { name: 'users', label: 'Users', to: '/admin/users', icon: UsersIcon, roles: ['ADMIN', 'SUPER_ADMIN'] },
  { name: 'cms', label: 'CMS', to: '/admin/cms', icon: DocumentTextIcon, roles: ['ADMIN', 'SUPER_ADMIN'] },
  { name: 'notifications', label: 'Notifications', to: '/admin/notifications', icon: BellIcon, roles: [] },
  { name: 'settings', label: 'Settings', to: '/admin/settings', icon: Cog6ToothIcon, roles: [] },
]

const filteredNavItems = computed(() => {
  const role = authStore.userRole
  return navItems.filter(item => {
    if (!item.roles || item.roles.length === 0) return true
    return item.roles.includes(role)
  })
})

const initials = computed(() => {
  const name = authStore.currentUser?.name ?? ''
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
})

function isActive(to: string): boolean {
  return route.path.startsWith(to)
}

function toggle() {
  isOpen.value = !isOpen.value
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>
