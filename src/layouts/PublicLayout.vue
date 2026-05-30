<template>
  <div class="min-h-screen flex flex-col bg-base-100">
    <!-- Navbar -->
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      :class="scrolled ? 'bg-base-100/95 backdrop-blur-md shadow-sm' : 'bg-transparent'"
    >
      <nav class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 font-bold text-xl">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">E</div>
          <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Enterprise</span>
        </RouterLink>

        <!-- Desktop nav -->
        <ul class="hidden md:flex items-center gap-1">
          <li v-for="link in navLinks" :key="link.to">
            <RouterLink
              :to="link.to"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-base-200"
              :class="$route.path === link.to ? 'text-primary' : 'text-base-content/70'"
            >{{ link.label }}</RouterLink>
          </li>
        </ul>

        <!-- CTA -->
        <div class="hidden md:flex items-center gap-2">
          <RouterLink
            v-if="!authStore.isAuthenticated"
            to="/login"
            class="btn btn-ghost btn-sm"
          >Sign In</RouterLink>
          <RouterLink
            v-if="!authStore.isAuthenticated"
            to="/register"
            class="btn btn-primary btn-sm"
          >Get Started</RouterLink>
          <RouterLink
            v-else
            :to="authStore.isAdmin ? '/admin/dashboard' : '/user/home'"
            class="btn btn-primary btn-sm"
          >Dashboard</RouterLink>
        </div>

        <!-- Mobile menu toggle -->
        <button
          class="md:hidden btn btn-ghost btn-sm btn-square"
          @click="mobileOpen = !mobileOpen"
        >
          <Bars3Icon v-if="!mobileOpen" class="h-5 w-5" />
          <XMarkIcon v-else class="h-5 w-5" />
        </button>
      </nav>

      <!-- Mobile menu -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileOpen" class="md:hidden bg-base-100 border-b border-base-200 px-6 pb-4">
          <ul class="space-y-1 pt-2">
            <li v-for="link in navLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                class="block px-4 py-2 rounded-lg text-sm font-medium hover:bg-base-200"
                @click="mobileOpen = false"
              >{{ link.label }}</RouterLink>
            </li>
          </ul>
          <div class="flex gap-2 mt-4">
            <RouterLink to="/login" class="btn btn-ghost btn-sm flex-1" @click="mobileOpen = false">Sign In</RouterLink>
            <RouterLink to="/register" class="btn btn-primary btn-sm flex-1" @click="mobileOpen = false">Get Started</RouterLink>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Main content -->
    <main class="flex-1 pt-16">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-base-200 border-t border-base-300">
      <div class="max-w-7xl mx-auto px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <div class="flex items-center gap-2 font-bold text-xl mb-3">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">E</div>
              <span>Enterprise Starter Kit</span>
            </div>
            <p class="text-sm text-base-content/60 max-w-sm">
              Production-ready Vue 3 + Spring Boot enterprise foundation.
              Built for speed, security, and scale.
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-sm mb-3">Product</h4>
            <ul class="space-y-2 text-sm text-base-content/60">
              <li><RouterLink to="/features" class="hover:text-primary transition-colors">Features</RouterLink></li>
              <li><RouterLink to="/pricing" class="hover:text-primary transition-colors">Pricing</RouterLink></li>
              <li><RouterLink to="/docs" class="hover:text-primary transition-colors">Docs</RouterLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-sm mb-3">Company</h4>
            <ul class="space-y-2 text-sm text-base-content/60">
              <li><RouterLink to="/about" class="hover:text-primary transition-colors">About</RouterLink></li>
              <li><RouterLink to="/contact" class="hover:text-primary transition-colors">Contact</RouterLink></li>
              <li><RouterLink to="/privacy" class="hover:text-primary transition-colors">Privacy</RouterLink></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-base-300 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-base-content/40 gap-2">
          <p>© {{ new Date().getFullYear() }} Enterprise Starter Kit. All rights reserved.</p>
          <p>Built with Vue 3 + Spring Boot</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/modules/auth/store/auth.store'

const authStore = useAuthStore()
const scrolled = ref(false)
const mobileOpen = ref(false)

const navLinks = [
  { label: 'Home',     to: '/'         },
  { label: 'Features', to: '/features' },
  { label: 'About',    to: '/about'    },
  { label: 'Contact',  to: '/contact'  },
]

function onScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>
