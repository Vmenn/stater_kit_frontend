import type { RouteRecordRaw } from 'vue-router'

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/user/home',
    name: 'user-home',
    component: () => import('../../modules/user/views/UserHomeView.vue'),
    meta: { requiresAuth: true, layout: 'user', title: 'My Dashboard', roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('../../modules/user/views/UserProfileView.vue'),
    meta: { requiresAuth: true, layout: 'user', title: 'My Profile', roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
  },
  {
    path: '/user/notifications',
    name: 'user-notifications',
    component: () => import('../../modules/notifications/views/NotificationsView.vue'),
    meta: { requiresAuth: true, layout: 'user', title: 'Notifications', roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
  },
  {
    path: '/user/settings',
    name: 'user-settings',
    component: () => import('../../modules/settings/views/SettingsView.vue'),
    meta: { requiresAuth: true, layout: 'user', title: 'Settings', roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
  },
]
