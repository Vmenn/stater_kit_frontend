importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js')

// Config injected at build time or read from a separate config endpoint.
// The actual values come from VITE_FIREBASE_* env vars in the app;
// for the service worker (no Vite), they're read from a generated config file
// or hardcoded here for development.
firebase.initializeApp(self.__FIREBASE_CONFIG__ ?? {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
})

const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage(payload => {
  const { title = 'Notification', body = '' } = payload.notification ?? {}
  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data,
  })
})

// Click on notification opens the app
self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/'
  event.waitUntil(clients.openWindow(url))
})
