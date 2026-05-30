export const appConfig = {
  name: 'Enterprise Starter Kit',
  version: '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  platform: 'web' as const,
  appVersion: '1.0.0',
  deviceType: 'desktop' as const,
  defaultPageSize: 20,
  maxUploadSize: 5 * 1024 * 1024, // 5MB
  tokenRefreshBuffer: 60, // seconds before expiry to refresh
  requestTimeout: 15000, // 15 seconds
} as const

export type AppConfig = typeof appConfig
