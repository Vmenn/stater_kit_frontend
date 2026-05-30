<template>
  <div class="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 shadow-lg">
          <svg class="w-9 h-9 text-primary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-base-content">Enterprise Starter Kit</h1>
        <p class="text-base-content/60 text-sm mt-1">Production-ready Vue 3 foundation</p>
      </div>

      <!-- Card -->
      <div class="card bg-base-100 shadow-xl border border-base-300">
        <div class="card-body">
          <slot />
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-base-content/40 text-xs mt-6">
        &copy; {{ year }} Enterprise Starter Kit. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
