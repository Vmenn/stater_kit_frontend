<template>
  <div>
    <h2 class="text-2xl font-bold mb-1">Welcome back</h2>
    <p class="text-base-content/60 text-sm mb-6">Sign in to your account</p>

    <form @submit.prevent="onSubmit" novalidate>
      <!-- Email -->
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

      <!-- Password -->
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text font-medium">Password</span>
          <RouterLink to="/forgot-password" class="label-text-alt link link-primary">Forgot password?</RouterLink>
        </label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            class="input input-bordered w-full pr-10"
            :class="errors.password ? 'input-error' : ''"
            autocomplete="current-password"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
            @click="showPassword = !showPassword"
          >
            <EyeIcon v-if="!showPassword" class="h-4 w-4" />
            <EyeSlashIcon v-else class="h-4 w-4" />
          </button>
        </div>
        <p v-if="errors.password" class="input-error-msg">{{ errors.password }}</p>
      </div>

      <!-- Submit -->
      <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
        <span v-if="isLoading" class="loading loading-spinner loading-sm" />
        Sign in
      </button>
    </form>

    <p class="text-center text-sm mt-6 text-base-content/60">
      Don't have an account?
      <RouterLink to="/register" class="link link-primary font-medium">Create one</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { useAuth } from '../composables/useAuth'

const schema = toTypedSchema(z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
}))

const { handleSubmit, errors } = useForm({ validationSchema: schema })
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const showPassword = ref(false)
const { isLoading, login } = useAuth()

const onSubmit = handleSubmit(async (values) => {
  await login({ email: values.email, password: values.password })
})
</script>
