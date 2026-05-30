<template>
  <div class="space-y-5 max-w-3xl">
    <h1 class="text-2xl font-bold">Settings</h1>

    <!-- Tabs -->
    <div class="tabs tabs-boxed w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="activeTab === tab.id ? 'tab-active' : ''"
        @click="activeTab = tab.id"
      >{{ tab.label }}</button>
    </div>

    <!-- Profile Tab -->
    <div v-if="activeTab === 'profile'" class="card bg-base-100 border border-base-200 shadow-sm">
      <div class="card-body space-y-4">
        <h2 class="card-title text-base">Profile Information</h2>

        <!-- Avatar -->
        <div class="flex items-center gap-4">
          <div class="avatar">
            <div class="w-16 h-16 rounded-full bg-base-300 overflow-hidden">
              <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" />
              <div v-else class="w-full h-full flex items-center justify-center text-2xl">
                {{ authStore.currentUser?.name?.charAt(0).toUpperCase() ?? '?' }}
              </div>
            </div>
          </div>
          <ImageUpload @uploaded="onAvatarUploaded">
            <template #trigger>
              <button type="button" class="btn btn-xs btn-ghost">Change Photo</button>
            </template>
          </ImageUpload>
        </div>

        <form @submit.prevent="saveProfile" class="space-y-3">
          <div class="form-control">
            <label class="label"><span class="label-text">Full Name</span></label>
            <input v-model="profileForm.name" class="input input-bordered" required />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Email</span></label>
            <input v-model="profileForm.email" type="email" class="input input-bordered" disabled />
            <label class="label"><span class="label-text-alt text-base-content/40">Email cannot be changed</span></label>
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Role</span></label>
            <input :value="authStore.currentUser?.role" class="input input-bordered" disabled />
          </div>
          <button type="submit" class="btn btn-primary btn-sm" :disabled="savingProfile">
            <span v-if="savingProfile" class="loading loading-spinner loading-xs" />
            Save Changes
          </button>
        </form>
      </div>
    </div>

    <!-- Security Tab -->
    <div v-if="activeTab === 'security'" class="space-y-4">
      <div class="card bg-base-100 border border-base-200 shadow-sm">
        <div class="card-body">
          <h2 class="card-title text-base">Active Device Sessions</h2>
          <p class="text-sm text-base-content/60 mb-3">Devices currently signed into your account.</p>

          <div v-if="loadingSessions" class="flex justify-center py-6">
            <span class="loading loading-spinner" />
          </div>
          <ul v-else class="space-y-2">
            <li
              v-for="session in sessions"
              :key="session.id"
              class="flex items-center justify-between p-3 rounded-lg bg-base-200"
            >
              <div class="flex items-center gap-3">
                <span class="text-xl">{{ platformIcon(session.platform) }}</span>
                <div>
                  <p class="text-sm font-medium">
                    {{ session.platform ?? 'Unknown' }}
                    <span v-if="session.currentDevice" class="badge badge-primary badge-xs ml-1">This device</span>
                    <span v-if="session.newLoginDetected" class="badge badge-warning badge-xs ml-1">New</span>
                  </p>
                  <p class="text-xs text-base-content/50">{{ session.ipAddress }} · {{ fromNow(session.lastSeenAt) }}</p>
                </div>
              </div>
              <button
                v-if="!session.currentDevice"
                class="btn btn-xs btn-error btn-outline"
                @click="revokeSession(session.id)"
              >Revoke</button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Notifications Tab -->
    <div v-if="activeTab === 'notifications'" class="card bg-base-100 border border-base-200 shadow-sm">
      <div class="card-body space-y-4">
        <h2 class="card-title text-base">Notification Preferences</h2>

        <div v-for="pref in notifPrefs" :key="pref.key" class="flex items-center justify-between">
          <div>
            <p class="font-medium text-sm">{{ pref.label }}</p>
            <p class="text-xs text-base-content/50">{{ pref.description }}</p>
          </div>
          <input
            type="checkbox"
            class="toggle toggle-primary toggle-sm"
            v-model="pref.enabled"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { authApi } from '@/modules/auth/api/auth.api'
import type { DeviceSession } from '@/modules/auth/types/auth.types'
import ImageUpload from '@/shared/components/ImageUpload.vue'
import { useToast } from '@/shared/composables/useToast'
import { fromNow } from '@/shared/helpers/date.helper'

const authStore = useAuthStore()
const { success, error } = useToast()

const activeTab = ref<'profile' | 'security' | 'notifications'>('profile')
const tabs = [
  { id: 'profile',       label: 'Profile' },
  { id: 'security',      label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
] as const

const savingProfile = ref(false)
const avatarUrl = ref<string | null>(null)
const profileForm = reactive({
  name: authStore.currentUser?.name ?? '',
  email: authStore.currentUser?.email ?? '',
})

const loadingSessions = ref(false)
const sessions = ref<DeviceSession[]>([])

const notifPrefs = reactive([
  { key: 'newDevice',  label: 'New Device Login',    description: 'Alert when a new device signs in',         enabled: true },
  { key: 'system',     label: 'System Notifications', description: 'Platform updates and announcements',       enabled: true },
  { key: 'security',   label: 'Security Alerts',      description: 'Suspicious activity on your account',      enabled: true },
])

onMounted(loadSessions)

async function loadSessions() {
  loadingSessions.value = true
  try {
    sessions.value = await authApi.getDevices()
  } finally {
    loadingSessions.value = false
  }
}

async function saveProfile() {
  savingProfile.value = true
  try {
    // Profile update endpoint TBD — update local store for now
    if (authStore.user) authStore.user.name = profileForm.name
    success('Profile updated')
  } catch {
    error('Failed to update profile')
  } finally {
    savingProfile.value = false
  }
}

function onAvatarUploaded(url: string) {
  avatarUrl.value = url
  success('Avatar updated')
}

async function revokeSession(id: string) {
  try {
    await authApi.revokeDevice(id)
    sessions.value = sessions.value.filter(s => s.id !== id)
    success('Session revoked')
  } catch {
    error('Failed to revoke session')
  }
}

function platformIcon(platform?: string) {
  const map: Record<string, string> = { ios: '🍎', android: '🤖', web: '🌐' }
  return map[platform?.toLowerCase() ?? ''] ?? '💻'
}
</script>
