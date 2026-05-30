<template>
  <div class="min-h-screen bg-base-200">
    <Sidebar v-model="sidebarOpen" />

    <!-- Main content -->
    <div
      class="transition-all duration-300"
      :style="{ marginLeft: sidebarOpen ? '256px' : '64px' }"
    >
      <Navbar :sidebar-open="sidebarOpen" />

      <!-- New login alert -->
      <div
        v-if="showNewLoginAlert"
        class="mx-6 mt-20 alert alert-warning shadow-sm animate-fade-in"
      >
        <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p class="font-semibold">New login detected on another device</p>
          <p class="text-sm">If this wasn't you, please check your account security immediately.</p>
        </div>
        <button class="btn btn-sm btn-ghost" @click="dismissAlert">Dismiss</button>
      </div>

      <main class="p-6 pt-24">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from '@/shared/components/Sidebar.vue'
import Navbar from '@/shared/components/Navbar.vue'
import { authApi } from '@/modules/auth/api/auth.api'
import { getOrCreateDeviceId } from '@/core/storage/secure-storage'

const sidebarOpen = ref(true)
const showNewLoginAlert = ref(false)

onMounted(async () => {
  try {
    const sessions = await authApi.getDevices()
    const currentDeviceId = getOrCreateDeviceId()
    const currentSession = sessions.find(s => s.deviceId === currentDeviceId)
    if (currentSession?.newLoginDetected) {
      showNewLoginAlert.value = true
    }
  } catch {
    // silently ignore
  }
})

async function dismissAlert() {
  showNewLoginAlert.value = false
  try {
    await authApi.dismissNotification()
  } catch {
    // silently ignore
  }
}
</script>
