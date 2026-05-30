import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getMessaging, type Messaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app: FirebaseApp | null = null
let messagingInstance: Messaging | null = null

function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  )
}

function initFirebase(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    console.warn('[Firebase] Firebase is not configured. Set VITE_FIREBASE_* env vars.')
    return null
  }

  try {
    if (getApps().length > 0) {
      app = getApps()[0]
    } else {
      app = initializeApp(firebaseConfig)
    }
    return app
  } catch (err) {
    console.error('[Firebase] Initialization error:', err)
    return null
  }
}

export async function getMessagingInstance(): Promise<Messaging | null> {
  if (messagingInstance) return messagingInstance

  const firebaseApp = initFirebase()
  if (!firebaseApp) return null

  // FCM requires a browser environment with service worker support
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('[Firebase] Service workers not supported')
    return null
  }

  try {
    messagingInstance = getMessaging(firebaseApp)
    return messagingInstance
  } catch (err) {
    console.error('[Firebase] Failed to get messaging instance:', err)
    return null
  }
}

// Named export for direct use
export { messagingInstance as messaging }

export default initFirebase
