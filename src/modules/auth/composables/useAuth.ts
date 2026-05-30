import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth.store'
import { useToast } from '../../../shared/composables/useToast'
import type { LoginRequest, RegisterRequest } from '../types/auth.types'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()
  const isLoading = ref(false)
  const fieldErrors = ref<Record<string, string>>({})

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const currentUser = computed(() => authStore.currentUser)

  async function login(payload: LoginRequest): Promise<void> {
    isLoading.value = true
    fieldErrors.value = {}
    try {
      await authStore.login(payload)
      toast.success('Welcome back!')
      await router.push('/dashboard')
    } catch (err: unknown) {
      const errorData = (err as { response?: { data?: { message?: string; errors?: Record<string, string> } } }).response?.data
      fieldErrors.value = errorData?.errors ?? {}
      const message = errorData?.message ?? 'Invalid credentials'
      toast.error(message)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function register(payload: RegisterRequest): Promise<{ email: string; message: string } | null> {
    isLoading.value = true
    fieldErrors.value = {}
    try {
      const response = await authStore.register(payload)
      return { email: response.email, message: response.message }
    } catch (err: unknown) {
      const errorData = (err as { response?: { data?: { message?: string; errors?: Record<string, string> } } }).response?.data
      fieldErrors.value = errorData?.errors ?? {}
      const message = errorData?.message ?? 'Registration failed'
      toast.error(message)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    await authStore.logout()
    await router.push('/login')
    toast.info('You have been logged out.')
  }

  return {
    isLoading,
    fieldErrors,
    isAuthenticated,
    currentUser,
    login,
    register,
    logout,
  }
}
