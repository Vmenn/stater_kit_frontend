<template>
  <div>
    <!-- Hero -->
    <section class="bg-gradient-to-br from-base-200 to-base-100 py-20 text-center">
      <div class="max-w-3xl mx-auto px-6">
        <p class="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Features</p>
        <h1 class="text-5xl font-black mb-4">Everything you need</h1>
        <p class="text-base-content/60 text-lg">
          A complete toolkit for building enterprise-grade applications — batteries included.
        </p>
      </div>
    </section>

    <!-- Feature grid -->
    <section class="py-20 max-w-7xl mx-auto px-6">
      <div class="space-y-20">
        <div v-for="(section, i) in featureSections" :key="section.title"
          class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          :class="i % 2 === 1 ? 'md:flex-row-reverse' : ''"
        >
          <div :class="i % 2 === 1 ? 'md:order-2' : ''">
            <div class="w-14 h-14 rounded-2xl text-3xl flex items-center justify-center mb-6" :class="section.bg">
              {{ section.icon }}
            </div>
            <h2 class="text-3xl font-black mb-4">{{ section.title }}</h2>
            <p class="text-base-content/60 mb-6 leading-relaxed">{{ section.desc }}</p>
            <ul class="space-y-2">
              <li v-for="feat in section.features" :key="feat" class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                  <CheckIcon class="h-3 w-3 text-success" />
                </div>
                <span class="text-sm">{{ feat }}</span>
              </li>
            </ul>
          </div>

          <div :class="i % 2 === 1 ? 'md:order-1' : ''" class="rounded-2xl overflow-hidden border border-base-300 shadow-xl bg-base-200 p-6">
            <div class="space-y-2">
              <div v-for="j in 4" :key="j" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg flex-shrink-0" :class="['bg-primary/20','bg-secondary/20','bg-accent/20','bg-success/20'][j-1]" />
                <div class="flex-1 space-y-1">
                  <div class="h-2.5 bg-base-300 rounded-full" :style="`width:${[75,55,85,65][j-1]}%`" />
                  <div class="h-2 bg-base-300/50 rounded-full" :style="`width:${[50,40,60,45][j-1]}%`" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/solid'

const featureSections = [
  {
    icon: '🔐', bg: 'bg-blue-100 dark:bg-blue-950',
    title: 'Authentication & Security',
    desc: 'Complete auth flow with JWT, silent token refresh, email verification, and device session tracking. Built to OWASP standards.',
    features: [
      'JWT access + refresh token rotation',
      'Silent refresh with subscriber queue',
      'Email verification on registration',
      'Device fingerprinting & 1-account rule',
      'Rate limiting on auth endpoints',
      'CSP headers + XSS protection',
    ],
  },
  {
    icon: '📱', bg: 'bg-purple-100 dark:bg-purple-950',
    title: 'Push Notifications',
    desc: 'Firebase Cloud Messaging integration for real-time push notifications on web and mobile. Alerts on new device logins.',
    features: [
      'Firebase FCM (foreground + background)',
      'Service worker for background messages',
      'New device login security alert',
      'Per-device FCM token management',
      'Notification history & read status',
    ],
  },
  {
    icon: '🛡️', bg: 'bg-orange-100 dark:bg-orange-950',
    title: 'Permission System',
    desc: 'Fine-grained role-based access control with dynamic navigation and component-level permission checks.',
    features: [
      'USER / ADMIN / SUPER_ADMIN roles',
      'Route-level auth + role guards',
      'Dynamic sidebar per role',
      'Admin-only routes auto-hidden',
      'Extensible permission service',
    ],
  },
]
</script>
