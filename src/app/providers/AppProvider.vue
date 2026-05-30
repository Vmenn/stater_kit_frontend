<template>
  <slot />
  <Toast />
  <ConfirmDialog />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useNotificationStore } from '@/modules/notifications/store/notification.store'
import Toast from '@/shared/components/Toast.vue'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

onMounted(() => {
  authStore.initFromStorage()
  if (authStore.isAuthenticated) {
    notificationStore.initFCM()
  }
})
</script>
