import apiClient from '../../../core/api/axios'
import { getOrCreateDeviceId } from '../../../core/storage/secure-storage'
import type {
  LoginRequest,
  RegisterRequest,
  ResendVerificationRequest,
  AuthResponse,
  RegisterResponse,
  DeviceSession,
} from '../types/auth.types'
import type { ApiResponse } from '../../../shared/types/shared.types'

export const authApi = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload)
    return data.data!
  },

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const { data } = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', payload)
    return data.data!
  },

  async verifyEmail(token: string): Promise<void> {
    await apiClient.get('/auth/verify-email', { params: { token } })
  },

  async resendVerification(payload: ResendVerificationRequest): Promise<void> {
    await apiClient.post('/auth/resend-verification', payload)
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/refresh',
      {},
      { headers: { 'Refresh-Token': refreshToken } },
    )
    return data.data!
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout', {}, {
      headers: { 'X-Device-Id': getOrCreateDeviceId() },
    })
  },

  async getDevices(): Promise<DeviceSession[]> {
    const { data } = await apiClient.get<ApiResponse<DeviceSession[]>>('/auth/devices')
    return data.data ?? []
  },

  async revokeDevice(sessionId: string): Promise<void> {
    await apiClient.delete(`/auth/devices/${sessionId}`)
  },

  async updateFcmToken(fcmToken: string): Promise<void> {
    await apiClient.patch('/auth/devices/fcm-token', null, { params: { fcmToken } })
  },

  async dismissNotification(): Promise<void> {
    await apiClient.post('/auth/devices/notifications/dismiss')
  },
}
