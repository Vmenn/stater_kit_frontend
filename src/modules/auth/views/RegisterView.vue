<template>
  <div>
    <template v-if="!registered">
      <h2 class="text-2xl font-bold mb-1">Create account</h2>
      <p class="text-base-content/60 text-sm mb-6">Join the platform today</p>

      <form @submit.prevent="onSubmit" novalidate>
        <div class="form-control mb-4">
          <label class="label"><span class="label-text font-medium">Full Name</span></label>
          <input v-model="name" type="text" placeholder="John Doe" class="input input-bordered w-full"
            :class="errors.name ? 'input-error' : ''" autocomplete="name" />
          <p v-if="errors.name" class="input-error-msg">{{ errors.name }}</p>
        </div>

        <div class="form-control mb-4">
          <label class="label"><span class="label-text font-medium">Email</span></label>
          <input v-model="email" type="email" placeholder="you@example.com" class="input input-bordered w-full"
            :class="errors.email ? 'input-error' : ''" autocomplete="email" />
          <p v-if="errors.email" class="input-error-msg">{{ errors.email }}</p>
        </div>

        <div class="form-control mb-4">
          <label class="label"><span class="label-text font-medium">Password</span></label>
          <div class="relative">
            <input v-model="password" :type="showPwd ? 'text' : 'password'" placeholder="Min. 8 characters"
              class="input input-bordered w-full pr-10" :class="errors.password ? 'input-error' : ''"
              autocomplete="new-password" />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50"
              @click="showPwd = !showPwd">
              <EyeIcon v-if="!showPwd" class="h-4 w-4" />
              <EyeSlashIcon v-else class="h-4 w-4" />
            </button>
          </div>
          <p v-if="errors.password" class="input-error-msg">{{ errors.password }}</p>
        </div>

        <div class="form-control mb-6">
          <label class="label"><span class="label-text font-medium">Confirm Password</span></label>
          <input v-model="confirmPassword" :type="showPwd ? 'text' : 'password'" placeholder="Repeat password"
            class="input input-bordered w-full" :class="errors.confirmPassword ? 'input-error' : ''"
            autocomplete="new-password" />
          <p v-if="errors.confirmPassword" class="input-error-msg">{{ errors.confirmPassword }}</p>
        </div>

        <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
          <span v-if="isLoading" class="loading loading-spinner loading-sm" />
          Create account
        </button>
      </form>

      <p class="text-center text-sm mt-6 text-base-content/60">
        Already have an account?
        <RouterLink to="/login" class="link link-primary font-medium">Sign in</RouterLink>
      </p>
    </template>

    <!-- Success state -->
    <template v-else>
      <div class="text-center py-4">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-4">
          <CheckCircleIcon class="h-8 w-8 text-success" />
        </div>
        <h2 class="text-xl font-bold mb-2">Check your email</h2>
        <p class="text-base-content/60 text-sm mb-4">
          We sent a verification link to <strong>{{ registeredEmail }}</strong>
        </p>
        <RouterLink to="/login" class="btn btn-primary btn-sm">Back to login</RouterLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useAuth } from '../composables/useAuth'

const schema = toTypedSchema(z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}))

const { handleSubmit, errors } = useForm({ validationSchema: schema })
const { value: name } = useField<string>('name')
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: confirmPassword } = useField<string>('confirmPassword')

const showPwd = ref(false)
const registered = ref(false)
const registeredEmail = ref('')
const { isLoading, register } = useAuth()

const onSubmit = handleSubmit(async (values) => {
  const result = await register({ name: values.name, email: values.email, password: values.password })
  if (result) {
    registeredEmail.value = result.email
    registered.value = true
  }
})
</script>
