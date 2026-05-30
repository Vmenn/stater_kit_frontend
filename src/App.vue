<template>
  <component :is="layout">
    <RouterView />
  </component>
  <Toast />
  <ConfirmDialog />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import Toast from '@/shared/components/Toast.vue'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'

const PublicLayout    = defineAsyncComponent(() => import('@/layouts/PublicLayout.vue'))
const AuthLayout      = defineAsyncComponent(() => import('@/layouts/AuthLayout.vue'))
const UserLayout      = defineAsyncComponent(() => import('@/layouts/UserLayout.vue'))
const DashboardLayout = defineAsyncComponent(() => import('@/layouts/DashboardLayout.vue'))

const route = useRoute()

const layout = computed(() => {
  switch (route.meta.layout) {
    case 'public':    return PublicLayout
    case 'auth':      return AuthLayout
    case 'user':      return UserLayout
    case 'dashboard': return DashboardLayout
    default:          return PublicLayout
  }
})
</script>
