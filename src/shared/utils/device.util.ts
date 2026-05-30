import { getOrCreateDeviceId } from '../../core/storage/secure-storage'

export function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  const ua = navigator.userAgent.toLowerCase()
  if (/tablet|ipad|playbook|silk/.test(ua)) return 'tablet'
  if (/mobile|iphone|ipod|android|blackberry|windows phone/.test(ua)) return 'mobile'
  return 'desktop'
}

export function getPlatform(): 'web' {
  return 'web'
}

export { getOrCreateDeviceId }

export function getDeviceHeaders(): Record<string, string> {
  return {
    'X-Device-Id': getOrCreateDeviceId(),
    'X-Platform': getPlatform(),
    'X-App-Version': '1.0.0',
    'X-Device-Type': getDeviceType(),
  }
}
