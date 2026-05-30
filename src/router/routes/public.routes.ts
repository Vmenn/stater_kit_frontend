import type { RouteRecordRaw } from 'vue-router'

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../../modules/public/views/HomeView.vue'),
    meta: { requiresAuth: false, layout: 'public', title: 'Home' },
  },
  {
    path: '/features',
    name: 'features',
    component: () => import('../../modules/public/views/FeaturesView.vue'),
    meta: { requiresAuth: false, layout: 'public', title: 'Features' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../../modules/public/views/AboutView.vue'),
    meta: { requiresAuth: false, layout: 'public', title: 'About' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../../modules/public/views/ContactView.vue'),
    meta: { requiresAuth: false, layout: 'public', title: 'Contact' },
  },
]
