export interface LoginRequest {
  email: string
  password: string
  fcmToken?: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface ResendVerificationRequest {
  email: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface RegisterResponse {
  email: string
  requiresEmailVerification: boolean
  message: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER'
  isActive: boolean
  createdAt: string
  updatedAt?: string
  deletedAt?: string
}

export interface DeviceSession {
  id: string
  deviceId: string
  platform: string
  appVersion?: string
  deviceType?: string
  ipAddress?: string
  lastSeenAt?: string
  createdAt: string
  newLoginDetected: boolean
  currentDevice: boolean
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
