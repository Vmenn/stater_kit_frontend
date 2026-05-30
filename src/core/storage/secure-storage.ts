const PREFIX = 'esk_'

function prefixKey(key: string): string {
  return `${PREFIX}${key}`
}

export const secureStorage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(prefixKey(key))
    } catch {
      return null
    }
  },

  set(key: string, value: string): void {
    try {
      localStorage.setItem(prefixKey(key), value)
    } catch (err) {
      console.warn('[SecureStorage] Failed to set item:', err)
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(prefixKey(key))
    } catch (err) {
      console.warn('[SecureStorage] Failed to remove item:', err)
    }
  },

  clear(): void {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX))
      keys.forEach(k => localStorage.removeItem(k))
    } catch (err) {
      console.warn('[SecureStorage] Failed to clear storage:', err)
    }
  },
}

const DEVICE_ID_KEY = 'device_id'

export function getOrCreateDeviceId(): string {
  const existing = secureStorage.get(DEVICE_ID_KEY)
  if (existing) return existing

  const deviceId = generateUUIDv4()
  secureStorage.set(DEVICE_ID_KEY, deviceId)
  return deviceId
}

function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
