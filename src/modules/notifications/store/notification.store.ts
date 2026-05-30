import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '../../auth/api/auth.api'

export interface AppNotification {
  id: string
  title: string
  body: string
  type: 'info' | 'warning' | 'success' | 'error' | 'SECURITY_ALERT' | 'SYSTEM' | 'ANNOUNCEMENT'
  read: boolean
  createdAt: string
  data?: Record<string, string>
}

export const useNotificationStore = defineStore('notifications', () => {
  // ─── State ─────────────────────────────────────────────────────────────────
  const notifications = ref<AppNotification[]>([])
  const unreadCount = ref(0)
  const fcmToken = ref<string | null>(null)
  const fcmEnabled = ref(false)
  const fcmPermission = ref<NotificationPermission>('default')
  const isInitializing = ref(false)

  // ─── Actions ──────────────────────────────────────────────────────────────
  async function initFCM(): Promise<void> {
    if (isInitializing.value) return
    isInitializing.value = true

    try {
      // Lazy-import firebase to avoid top-level loading cost
      const { getMessagingInstance } = await import('../../../app/plugins/firebase')
      const messaging = await getMessagingInstance()
      if (!messaging) return

      const { getToken, onMessage } = await import('firebase/messaging')

      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
      if (!vapidKey) {
        console.warn('[FCM] VAPID key not configured')
        return
      }

      // Request permission
      const permission = await Notification.requestPermission()
      fcmPermission.value = permission

      if (permission !== 'granted') {
        console.info('[FCM] Notification permission denied')
        return
      }

      // Get token
      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: await navigator.serviceWorker.ready,
      })

      if (token) {
        fcmToken.value = token
        fcmEnabled.value = true
        // Register token with backend
        await authApi.updateFcmToken(token)
      }

      // Handle foreground messages
      onMessage(messaging, (payload) => {
        const notification: AppNotification = {
          id: `fcm-${Date.now()}`,
          title: payload.notification?.title ?? 'Notification',
          body: payload.notification?.body ?? '',
          type: 'info',
          read: false,
          createdAt: new Date().toISOString(),
          data: payload.data,
        }
        addNotification(notification)
      })
    } catch (err) {
      console.error('[FCM] Initialization failed:', err)
    } finally {
      isInitializing.value = false
    }
  }

  function addNotification(notification: AppNotification): void {
    notifications.value.unshift(notification)
    unreadCount.value++
  }

  function markRead(id: string): void {
    const n = notifications.value.find(n => n.id === id)
    if (n && !n.read) {
      n.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  function markAllRead(): void {
    notifications.value.forEach(n => {
      n.read = true
    })
    unreadCount.value = 0
  }

  function removeNotification(id: string): void {
    const idx = notifications.value.findIndex(n => n.id === id)
    if (idx !== -1) {
      if (!notifications.value[idx].read) {
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      notifications.value.splice(idx, 1)
    }
  }

  async function checkNewLoginAlert(): Promise<boolean> {
    try {
      const devices = await authApi.getDevices()
      return devices.some(d => d.newLoginDetected && d.currentDevice)
    } catch {
      return false
    }
  }

  function clearAll(): void {
    notifications.value = []
    unreadCount.value = 0
    fcmToken.value = null
  }

  return {
    notifications,
    unreadCount,
    fcmToken,
    fcmEnabled,
    fcmPermission,
    isInitializing,
    initFCM,
    addNotification,
    markRead,
    markAllRead,
    removeNotification,
    checkNewLoginAlert,
    clearAll,
  }
})
