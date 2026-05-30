<template>
  <div>
    <!-- ─── HERO ─────────────────────────────────────────────── -->
    <section class="relative overflow-hidden min-h-[90vh] flex items-center">
      <!-- Gradient blobs -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-20 -left-32 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />
        <div class="absolute bottom-0 right-0 w-[600px] h-[400px] bg-secondary/15 rounded-full blur-3xl" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div class="max-w-7xl mx-auto px-6 py-24 text-center w-full">
        <div class="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-8 border border-primary/20">
          <SparklesIcon class="h-3.5 w-3.5" />
          Enterprise-grade • Production Ready
        </div>

        <h1 class="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
          Build faster with<br />
          <span class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Enterprise Stack
          </span>
        </h1>

        <p class="text-lg md:text-xl text-base-content/60 max-w-2xl mx-auto mb-10">
          Vue 3 + Spring Boot starter kit with JWT auth, push notifications,
          CMS, RBAC, and production-ready architecture — out of the box.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <RouterLink to="/register" class="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/30">
            Get Started Free
            <ArrowRightIcon class="h-5 w-5" />
          </RouterLink>
          <RouterLink to="/features" class="btn btn-ghost btn-lg gap-2">
            <PlayCircleIcon class="h-5 w-5" />
            See Features
          </RouterLink>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div v-for="stat in heroStats" :key="stat.label" class="text-center">
            <div class="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{{ stat.value }}</div>
            <div class="text-xs text-base-content/50 mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FEATURES ─────────────────────────────────────────── -->
    <section id="features" class="py-24 bg-base-200/50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <p class="text-primary font-semibold text-sm mb-2 tracking-widest uppercase">Everything Included</p>
          <h2 class="text-4xl font-black mb-4">Built for the real world</h2>
          <p class="text-base-content/60 max-w-xl mx-auto">
            Every piece you need to ship a production app — not just a template.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feat in features"
            :key="feat.title"
            class="group card bg-base-100 border border-base-300 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
          >
            <div class="card-body">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110" :class="feat.bg">
                {{ feat.icon }}
              </div>
              <h3 class="font-bold text-lg">{{ feat.title }}</h3>
              <p class="text-sm text-base-content/60 leading-relaxed">{{ feat.desc }}</p>
              <ul class="mt-3 space-y-1">
                <li v-for="point in feat.points" :key="point" class="text-xs text-base-content/50 flex items-center gap-2">
                  <span class="text-success">✓</span> {{ point }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── TECH STACK ────────────────────────────────────────── -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <p class="text-base-content/40 text-sm font-medium mb-8 tracking-widest uppercase">Powered by modern tech</p>
        <div class="flex flex-wrap justify-center gap-4">
          <div
            v-for="tech in techStack"
            :key="tech.name"
            class="flex items-center gap-2 bg-base-200 hover:bg-base-300 transition-colors px-5 py-2.5 rounded-full border border-base-300 text-sm font-medium"
          >
            <span>{{ tech.icon }}</span>
            <span>{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── HOW IT WORKS ──────────────────────────────────────── -->
    <section class="py-24 bg-base-200/50">
      <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-16">
          <p class="text-primary font-semibold text-sm mb-2 tracking-widest uppercase">Quick Start</p>
          <h2 class="text-4xl font-black mb-4">Up and running in minutes</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(step, i) in steps" :key="step.title" class="text-center">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center text-2xl font-black text-primary mx-auto mb-4">
              {{ i + 1 }}
            </div>
            <h3 class="font-bold mb-2">{{ step.title }}</h3>
            <p class="text-sm text-base-content/60">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CTA ───────────────────────────────────────────────── -->
    <section class="py-24">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <div class="relative bg-gradient-to-br from-primary to-secondary rounded-3xl p-12 overflow-hidden">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <h2 class="text-4xl font-black text-white mb-4 relative z-10">
            Start building today
          </h2>
          <p class="text-white/70 mb-8 relative z-10">
            Free to use. No credit card required.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <RouterLink to="/register" class="btn btn-white btn-lg gap-2 font-bold">
              Create Account
              <ArrowRightIcon class="h-5 w-5" />
            </RouterLink>
            <RouterLink to="/login" class="btn btn-ghost text-white hover:bg-white/20 btn-lg">
              Sign In
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  SparklesIcon,
  ArrowRightIcon,
  PlayCircleIcon,
} from '@heroicons/vue/24/outline'

const heroStats = [
  { value: '72+', label: 'Files included'     },
  { value: '15+', label: 'Reusable components'},
  { value: '5',   label: 'Modules ready'      },
  { value: '100%', label: 'TypeScript'        },
]

const features = [
  {
    icon: '🔐', bg: 'bg-blue-50 dark:bg-blue-950',
    title: 'Auth & Security',
    desc: 'JWT authentication with silent token refresh, email verification, and device session management.',
    points: ['Silent refresh with queue', 'Email verification flow', '1 device = 1 account rule'],
  },
  {
    icon: '📱', bg: 'bg-purple-50 dark:bg-purple-950',
    title: 'Push Notifications',
    desc: 'Firebase Cloud Messaging for real-time alerts on new device logins and system events.',
    points: ['Foreground + background FCM', 'New device login alert', 'Per-device token management'],
  },
  {
    icon: '📋', bg: 'bg-green-50 dark:bg-green-950',
    title: 'CMS Module',
    desc: 'Full content management with TipTap rich text editor, SEO metadata, and slug generation.',
    points: ['Rich text editor', 'SEO meta fields', 'Auto slug generator'],
  },
  {
    icon: '🛡️', bg: 'bg-orange-50 dark:bg-orange-950',
    title: 'RBAC Permissions',
    desc: 'Role-based access control with route guards, dynamic sidebar, and component-level permissions.',
    points: ['USER / ADMIN / SUPER_ADMIN', 'Route-level guards', 'Dynamic navigation'],
  },
  {
    icon: '📊', bg: 'bg-pink-50 dark:bg-pink-950',
    title: 'Dashboard & Charts',
    desc: 'Analytics dashboard with ApexCharts, stats cards, and activity timeline.',
    points: ['Area charts with periods', 'Animated stat cards', 'Activity feed'],
  },
  {
    icon: '⚡', bg: 'bg-yellow-50 dark:bg-yellow-950',
    title: 'API Layer',
    desc: 'Typed Axios wrapper with request deduplication, global error handling, and retry on 401.',
    points: ['Duplicate request prevention', 'Global error toast', 'Full TypeScript types'],
  },
]

const techStack = [
  { icon: '💚', name: 'Vue 3' },
  { icon: '⚡', name: 'Vite' },
  { icon: '🔷', name: 'TypeScript' },
  { icon: '🍍', name: 'Pinia' },
  { icon: '🌊', name: 'TailwindCSS' },
  { icon: '🎯', name: 'DaisyUI' },
  { icon: '☕', name: 'Spring Boot 3' },
  { icon: '🐘', name: 'PostgreSQL' },
  { icon: '🔥', name: 'Firebase FCM' },
  { icon: '🔴', name: 'Redis' },
]

const steps = [
  { title: 'Clone & Configure', desc: 'Clone the repo, copy .env, set your API URL and Firebase keys.' },
  { title: 'Install & Run',     desc: 'npm install && npm run dev — running on localhost:5173 in under 30 seconds.' },
  { title: 'Customize & Ship',  desc: 'Add your modules, swap the logo, deploy to Vercel or Nginx.' },
]
</script>
