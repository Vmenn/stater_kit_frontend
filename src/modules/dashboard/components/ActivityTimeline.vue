<template>
  <div class="card bg-base-100 shadow-sm border border-base-200">
    <div class="card-body">
      <h3 class="card-title text-base mb-4">Recent Activity</h3>
      <ul class="space-y-4">
        <li v-for="item in activities" :key="item.id" class="flex gap-3">
          <div class="flex-shrink-0 mt-0.5">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm" :class="item.colorClass">
              {{ item.icon }}
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-base-content">{{ item.title }}</p>
            <p class="text-xs text-base-content/50 truncate">{{ item.description }}</p>
          </div>
          <span class="flex-shrink-0 text-xs text-base-content/40">{{ item.time }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fromNow } from '@/shared/helpers/date.helper'

const now = new Date()
const m = (mins: number) => new Date(now.getTime() - mins * 60 * 1000).toISOString()

const activities = [
  { id: 1, icon: '👤', colorClass: 'bg-primary',  title: 'New user registered',       description: 'john.doe@example.com joined',           time: fromNow(m(5))   },
  { id: 2, icon: '🔐', colorClass: 'bg-warning',  title: 'Login from new device',     description: 'Android device, Jakarta',               time: fromNow(m(18))  },
  { id: 3, icon: '✅', colorClass: 'bg-success',  title: 'Email verified',            description: 'alice@example.com verified account',    time: fromNow(m(42))  },
  { id: 4, icon: '📝', colorClass: 'bg-info',     title: 'Content published',         description: 'Getting Started guide published',       time: fromNow(m(90))  },
  { id: 5, icon: '🗑️', colorClass: 'bg-error',    title: 'User account deleted',      description: 'bob@example.com account removed',      time: fromNow(m(180)) },
]
</script>
