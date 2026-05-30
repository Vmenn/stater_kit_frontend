import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { appConfig } from '../../app/config/app.config'
import { tokenService } from '../security/token.service'
import { getOrCreateDeviceId } from '../storage/secure-storage'
import { getDeviceType } from '../../shared/utils/device.util'
import { toastBus } from '../../shared/composables/useToast'

const pendingRequests = new Map<string, AbortController>()

function getRequestKey(config: AxiosRequestConfig): string {
  return `${config.method}:${config.url}:${JSON.stringify(config.params ?? {})}`
}

let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}

function onRefreshFailed() {
  refreshSubscribers = []
  tokenService.clearTokens()
  window.location.href = '/login'
}

export const apiClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: appConfig.requestTimeout,
  headers: {
    'Content-Type': 'application/json',
    'X-Platform': 'web',
    'X-App-Version': appConfig.appVersion,
    'X-Device-Type': getDeviceType(),
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach device ID
    config.headers['X-Device-Id'] = getOrCreateDeviceId()

    // Attach access token
    const token = tokenService.getAccessToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // Duplicate request prevention (skip for mutations)
    if (config.method === 'get') {
      const key = getRequestKey(config)
      if (pendingRequests.has(key)) {
        pendingRequests.get(key)!.abort()
      }
      const controller = new AbortController()
      config.signal = controller.signal
      pendingRequests.set(key, controller)
    }

    return config
  },
  error => Promise.reject(error),
)

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    const key = getRequestKey(response.config)
    pendingRequests.delete(key)
    return response
  },
  async error => {
    const originalRequest = error.config

    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    pendingRequests.delete(getRequestKey(originalRequest ?? {}))

    // Handle 401 - attempt silent refresh
    if (error.response?.status === 401 && !originalRequest?._retry) {
      const refreshToken = tokenService.getRefreshToken()
      if (!refreshToken) {
        onRefreshFailed()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise(resolve => {
          subscribeTokenRefresh(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            resolve(apiClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${appConfig.apiBaseUrl}/auth/refresh`,
          {},
          { headers: { 'Refresh-Token': refreshToken } },
        )
        const newAccessToken = data.data.accessToken
        const newRefreshToken = data.data.refreshToken

        tokenService.setAccessToken(newAccessToken)
        tokenService.setRefreshToken(newRefreshToken)

        isRefreshing = false
        onTokenRefreshed(newAccessToken)

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch {
        isRefreshing = false
        onRefreshFailed()
        return Promise.reject(error)
      }
    }

    // Global error notifications
    const message = error.response?.data?.message ?? error.message ?? 'An unexpected error occurred'
    const status = error.response?.status

    if (status === 403) {
      toastBus.emit('error', 'Access denied. You do not have permission to perform this action.')
    } else if (status === 404) {
      // Let the caller handle 404
    } else if (status === 429) {
      toastBus.emit('warning', 'Too many requests. Please slow down.')
    } else if (status && status >= 500) {
      toastBus.emit('error', 'Server error. Please try again later.')
    } else if (!status) {
      toastBus.emit('error', 'Network error. Please check your connection.')
    } else if (status !== 401 && status !== 422) {
      toastBus.emit('error', message)
    }

    return Promise.reject(error)
  },
)

export default apiClient
