<template>
  <div>
    <!-- Hero -->
    <section class="bg-gradient-to-br from-base-200 to-base-100 py-24 text-center">
      <div class="max-w-3xl mx-auto px-6">
        <div class="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-primary/20">
          Our Story
        </div>
        <h1 class="text-5xl font-black mb-6">Built for developers,<br/>by developers</h1>
        <p class="text-base-content/60 text-lg leading-relaxed">
          Enterprise Starter Kit was born from the frustration of starting every project from scratch.
          We built the foundation so you can focus on what makes your product unique.
        </p>
      </div>
    </section>

    <!-- Values -->
    <section class="py-20 max-w-5xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div v-for="value in values" :key="value.title" class="group">
          <div class="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">{{ value.icon }}</div>
          <h3 class="font-black text-xl mb-2">{{ value.title }}</h3>
          <p class="text-base-content/60 text-sm leading-relaxed">{{ value.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Mission -->
    <section class="py-20 bg-base-200/50">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-black mb-6">Our Mission</h2>
        <p class="text-base-content/60 text-xl leading-relaxed max-w-2xl mx-auto">
          To reduce the time from idea to production-ready app from weeks to hours,
          without sacrificing security, scalability, or code quality.
        </p>
        <div class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{{ stat.value }}</div>
            <div class="text-xs text-base-content/50 mt-1 font-medium">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const values = [
  { icon: '🚀', title: 'Speed', desc: 'Ship production-ready apps in hours, not weeks. Every piece is pre-built and battle-tested.' },
  { icon: '🔒', title: 'Security', desc: 'OWASP standards, JWT best practices, CSP headers — security is not an afterthought.' },
  { icon: '♻️', title: 'Reusability', desc: 'Every component, service, and module is designed to be extended, not rewritten.' },
]

const stats = [
  { value: '72+',  label: 'Files included'      },
  { value: '5',    label: 'Core modules'         },
  { value: '100%', label: 'TypeScript coverage'  },
  { value: '0',    label: 'Vendor lock-in'       },
]
</script>
