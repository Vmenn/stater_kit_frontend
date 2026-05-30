<template>
  <div class="text-center">
    <!-- Loading -->
    <template v-if="status === 'loading'">
      <span class="loading loading-spinner loading-lg text-primary" />
      <p class="mt-4 text-base-content/60">Verifying your email…</p>
    </template>

    <!-- Success -->
    <template v-else-if="status === 'success'">
      <div class="text-success text-5xl mb-4">✓</div>
      <h2 class="text-2xl font-bold mb-2">Email Verified!</h2>
      <p class="text-base-content/60 mb-6">Your account is now active. You can log in.</p>
      <RouterLink to="/login" class="btn btn-primary w-full">Go to Login</RouterLink>
    </template>

    <!-- Error -->
    <template v-else-if="status === 'error'">
      <div class="text-error text-5xl mb-4">✕</div>
      <h2 class="text-2xl font-bold mb-2">Verification Failed</h2>
      <p class="text-base-content/60 mb-6">{{ errorMessage }}</p>

      <form v-if="showResend" @submit.prevent="onResend" class="space-y-3">
        <input
          v-model="resendEmail"
          type="email"
          placeholder="Enter your email"
          class="input input-bordered w-full"
          required
        />
        <button type="submit" class="btn btn-primary w-full" :disabled="resending">
          <span v-if="resending" class="loading loading-spinner loading-sm" />
          Resend Verification Email
        </button>
        <p v-if="resendSuccess" class="text-success text-sm">Email sent! Check your inbox.</p>
      </form>

      <RouterLink v-else to="/login" class="btn btn-ghost w-full mt-2">Back to Login</RouterLink>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../store/auth.store'

type Status = 'loading' | 'success' | 'error'

const route = useRoute()
const authStore = useAuthStore()

const status = ref<Status>('loading')
const errorMessage = ref('')
const showResend = ref(false)
const resendEmail = ref('')
const resending = ref(false)
const resendSuccess = ref(false)

onMounted(async () => {
  const token = route.query.token as string
  if (!token) {
    status.value = 'error'
    errorMessage.value = 'No verification token provided.'
    return
  }
  try {
    await authStore.verifyEmail(token)
    status.value = 'success'
  } catch (err: unknown) {
    status.value = 'error'
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Invalid or expired token.'
    errorMessage.value = msg
    showResend.value = msg.toLowerCase().includes('expired')
  }
})

async function onResend() {
  if (!resendEmail.value) return
  resending.value = true
  try {
    await authStore.resendVerification(resendEmail.value)
    resendSuccess.value = true
    showResend.value = false
  } finally {
    resending.value = false
  }
}
</script>
