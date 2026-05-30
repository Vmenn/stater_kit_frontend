import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tokenService } from '../../../core/security/token.service'
import { authApi } from '../api/auth.api'
import type { User, LoginRequest, RegisterRequest, RegisterResponse } from '../types/auth.types'
import type { Role } from '../../../core/permissions/rbac'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!tokenService.getAccessToken() && !!user.value)
  const currentUser = computed(() => user.value)
  const userRole = computed<Role>(() => (user.value?.role as Role) ?? 'USER')
  const isAdmin = computed(() =>
    user.value?.role === 'ADMIN' || user.value?.role === 'SUPER_ADMIN',
  )
  const isSuperAdmin = computed(() => user.value?.role === 'SUPER_ADMIN')

  async function login(payload: LoginRequest): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await authApi.login(payload)
      tokenService.setAccessToken(response.accessToken)
      tokenService.setRefreshToken(response.refreshToken)
      await fetchCurrentUser()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function register(payload: RegisterRequest): Promise<RegisterResponse> {
    isLoading.value = true
    error.value = null
    try {
      return await authApi.register(payload)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await authApi.logout()
    } catch {
      // proceed with local cleanup even if server call fails
    } finally {
      tokenService.clearTokens()
      user.value = null
    }
  }

  async function refreshTokens(): Promise<void> {
    const refreshToken = tokenService.getRefreshToken()
    if (!refreshToken) throw new Error('No refresh token')
    const response = await authApi.refresh(refreshToken)
    tokenService.setAccessToken(response.accessToken)
    tokenService.setRefreshToken(response.refreshToken)
  }

  async function verifyEmail(token: string): Promise<void> {
    await authApi.verifyEmail(token)
  }

  async function resendVerification(email: string): Promise<void> {
    await authApi.resendVerification({ email })
  }

  async function fetchCurrentUser(): Promise<void> {
    // If the backend has a /users/me endpoint, call it here.
    // For now, we decode the JWT payload to get basic info.
    const token = tokenService.getAccessToken()
    if (!token) return
    const payload = tokenService.getTokenPayload(token)
    if (payload) {
      user.value = {
        id: payload['sub'] as string ?? '',
        name: (payload['name'] as string) ?? payload['sub'] as string ?? '',
        email: payload['sub'] as string ?? '',
        role: (payload['role'] as User['role']) ?? 'USER',
        isActive: true,
        createdAt: new Date().toISOString(),
      }
    }
  }

  function initFromStorage(): void {
    const token = tokenService.getAccessToken()
    if (token && !tokenService.isTokenExpired(token)) {
      fetchCurrentUser()
    } else if (token) {
      tokenService.clearTokens()
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    currentUser,
    userRole,
    isAdmin,
    isSuperAdmin,
    login,
    register,
    logout,
    refreshTokens,
    verifyEmail,
    resendVerification,
    fetchCurrentUser,
    initFromStorage,
  }
})
