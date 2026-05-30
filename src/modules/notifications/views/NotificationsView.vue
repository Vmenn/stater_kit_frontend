<template>
  <div class="space-y-5 max-w-2xl">
    <div>
      <h1 class="text-2xl font-bold">Notifications</h1>
      <p class="text-sm text-base-content/60">Your recent notifications</p>
    </div>

    <!-- FCM Status -->
    <div class="card bg-base-100 border border-base-200 shadow-sm">
      <div class="card-body py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Push Notifications</p>
            <p class="text-sm text-base-content/50">Receive alerts on this device</p>
          </div>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            :checked="notifStore.fcmEnabled"
            @change="togglePush"
          />
        </div>
        <p v-if="notifStore.fcmToken" class="text-xs text-base-content/40 font-mono truncate mt-1">
          FCM: {{ notifStore.fcmToken.slice(0, 30) }}…
        </p>
      </div>
    </div>

    <!-- Notification List -->
    <div v-if="notifStore.notifications.length === 0" class="text-center py-16">
      <EmptyState
        title="No notifications"
        description="You're all caught up!"
        icon="🔔"
      />
    </div>
    <ul v-else class="space-y-2">
      <li
        v-for="n in notifStore.notifications"
        :key="n.id"
        class="card bg-base-100 border shadow-sm cursor-pointer hover:bg-base-200 transition"
        :class="!n.read ? 'border-primary/30' : 'border-base-200'"
        @click="notifStore.markRead(n.id)"
      >
        <div class="card-body py-3 px-4 flex-row items-start gap-3">
          <div class="text-2xl">{{ typeIcon(n.type) }}</div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <p class="font-medium text-sm">{{ n.title }}</p>
              <span class="text-xs text-base-content/40">{{ fromNow(n.createdAt) }}</span>
            </div>
            <p class="text-sm text-base-content/60">{{ n.body }}</p>
          </div>
          <div v-if="!n.read" class="badge badge-primary badge-xs mt-1" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '../store/notification.store'
import EmptyState from '@/shared/components/EmptyState.vue'
import { fromNow } from '@/shared/helpers/date.helper'

const notifStore = useNotificationStore()

function typeIcon(type: string) {
  const map: Record<string, string> = {
    SECURITY_ALERT: '🔐',
    SYSTEM: '⚙️',
    ANNOUNCEMENT: '📢',
  }
  return map[type] ?? '🔔'
}

async function togglePush() {
  if (notifStore.fcmEnabled) {
    notifStore.fcmToken = null
    notifStore.fcmEnabled = false
  } else {
    await notifStore.initFCM()
  }
}
</script>
