<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-black">My Profile</h1>
      <p class="text-sm text-base-content/60">Manage your personal information</p>
    </div>

    <!-- Avatar section -->
    <div class="card bg-base-100 border border-base-200 shadow-sm">
      <div class="card-body">
        <div class="flex items-center gap-6">
          <div class="relative">
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary/30">
              {{ initials }}
            </div>
            <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-base-100" />
          </div>
          <div>
            <h2 class="text-xl font-bold">{{ authStore.currentUser?.name }}</h2>
            <p class="text-base-content/50 text-sm">{{ authStore.currentUser?.email }}</p>
            <div class="flex gap-2 mt-2">
              <span class="badge badge-ghost badge-sm">{{ authStore.currentUser?.role }}</span>
              <span class="badge badge-success badge-sm">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit form -->
    <div class="card bg-base-100 border border-base-200 shadow-sm">
      <div class="card-body">
        <h3 class="font-bold mb-4">Personal Information</h3>
        <form @submit.prevent="saveProfile" class="space-y-4">
          <div class="form-control">
            <label class="label"><span class="label-text font-medium">Full Name</span></label>
            <input v-model="form.name" class="input input-bordered" required />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Email</span>
              <span class="label-text-alt text-base-content/40">Cannot be changed</span>
            </label>
            <input :value="authStore.currentUser?.email" type="email" class="input input-bordered input-disabled" disabled />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text font-medium">Role</span></label>
            <input :value="authStore.currentUser?.role" class="input input-bordered input-disabled" disabled />
          </div>
          <div class="pt-2">
            <button type="submit" class="btn btn-primary" :disabled="saving">
              <span v-if="saving" class="loading loading-spinner loading-sm" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Security actions -->
    <div class="card bg-base-100 border border-base-200 shadow-sm">
      <div class="card-body">
        <h3 class="font-bold mb-4">Account</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between py-2 border-b border-base-200">
            <div>
              <p class="font-medium text-sm">Sign out of all devices</p>
              <p class="text-xs text-base-content/50">Remove all active sessions</p>
            </div>
            <button class="btn btn-sm btn-outline btn-warning" @click="signOutAll">Sign Out All</button>
          </div>
          <div class="flex items-center justify-between py-2">
            <div>
              <p class="font-medium text-sm text-error">Delete account</p>
              <p class="text-xs text-base-content/50">Permanently remove your account</p>
            </div>
            <button class="btn btn-sm btn-outline btn-error" @click="deleteAccount">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useToast } from '@/shared/composables/useToast'

const authStore = useAuthStore()
const { success } = useToast()

const saving = ref(false)
const form = reactive({ name: authStore.currentUser?.name ?? '' })

const initials = computed(() => {
  const name = authStore.currentUser?.name ?? ''
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
})

async function saveProfile() {
  saving.value = true
  try {
    if (authStore.user) authStore.user.name = form.name
    success('Profile updated')
  } finally {
    saving.value = false
  }
}

function signOutAll() {
  // Would call backend to invalidate all sessions
  success('All other devices signed out')
}

function deleteAccount() {
  // Placeholder
  alert('Account deletion — connect to your backend delete endpoint.')
}
</script>
