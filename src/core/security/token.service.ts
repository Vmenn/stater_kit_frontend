import { secureStorage } from '../storage/secure-storage'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

interface JWTPayload {
  exp?: number
  iat?: number
  sub?: string
  [key: string]: unknown
}

function parseJWTPayload(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(jsonPayload) as JWTPayload
  } catch {
    return null
  }
}

export const tokenService = {
  getAccessToken(): string | null {
    return secureStorage.get(ACCESS_TOKEN_KEY)
  },

  setAccessToken(token: string): void {
    secureStorage.set(ACCESS_TOKEN_KEY, token)
  },

  getRefreshToken(): string | null {
    return secureStorage.get(REFRESH_TOKEN_KEY)
  },

  setRefreshToken(token: string): void {
    secureStorage.set(REFRESH_TOKEN_KEY, token)
  },

  clearTokens(): void {
    secureStorage.remove(ACCESS_TOKEN_KEY)
    secureStorage.remove(REFRESH_TOKEN_KEY)
  },

  isTokenExpired(token: string): boolean {
    const payload = parseJWTPayload(token)
    if (!payload || !payload.exp) return true

    const nowSeconds = Math.floor(Date.now() / 1000)
    // Consider expired 60 seconds before actual expiry
    return payload.exp <= nowSeconds + 60
  },

  getTokenPayload(token: string): JWTPayload | null {
    return parseJWTPayload(token)
  },

  getTokenExpiry(token: string): Date | null {
    const payload = parseJWTPayload(token)
    if (!payload?.exp) return null
    return new Date(payload.exp * 1000)
  },
}
