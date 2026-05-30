<template>
  <div>
    <h2 class="text-2xl font-bold mb-1">Reset Password</h2>
    <p class="text-base-content/60 text-sm mb-6">Enter your email and we'll send a reset link.</p>

    <template v-if="!sent">
      <form @submit.prevent="onSubmit" novalidate>
        <div class="form-control mb-4">
          <label class="label"><span class="label-text font-medium">Email</span></label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="input input-bordered w-full"
            :class="errors.email ? 'input-error' : ''"
            autocomplete="email"
          />
          <p v-if="errors.email" class="input-error-msg">{{ errors.email }}</p>
        </div>
        <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
          <span v-if="isLoading" class="loading loading-spinner loading-sm" />
          Send Reset Link
        </button>
      </form>
    </template>

    <template v-else>
      <div class="alert alert-success mb-4">
        <span>If that email is registered, you'll receive a reset link shortly.</span>
      </div>
    </template>

    <p class="text-center text-sm mt-6 text-base-content/60">
      Remembered?
      <RouterLink to="/login" class="link link-primary font-medium">Sign in</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const schema = toTypedSchema(z.object({
  email: z.string().email('Please enter a valid email address'),
}))

const { handleSubmit, errors } = useForm({ validationSchema: schema })
const { value: email } = useField<string>('email')

const isLoading = ref(false)
const sent = ref(false)

// Forgot password endpoint not yet implemented in backend — simulate response
const onSubmit = handleSubmit(async () => {
  isLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  isLoading.value = false
  sent.value = true
})
</script>
