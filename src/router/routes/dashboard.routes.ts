import type { RouteRecordRaw } from 'vue-router'

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/dashboard',
    name: 'dashboard',
    component: () => import('../../modules/dashboard/views/DashboardView.vue'),
    meta: { requiresAuth: true, layout: 'dashboard', title: 'Dashboard', roles: ['ADMIN', 'SUPER_ADMIN'] },
  },
  {
    path: '/admin/settings',
    name: 'settings',
    component: () => import('../../modules/settings/views/SettingsView.vue'),
    meta: { requiresAuth: true, layout: 'dashboard', title: 'Settings', roles: ['ADMIN', 'SUPER_ADMIN'] },
  },
  {
    path: '/admin/notifications',
    name: 'notifications',
    component: () => import('../../modules/notifications/views/NotificationsView.vue'),
    meta: { requiresAuth: true, layout: 'dashboard', title: 'Notifications', roles: ['ADMIN', 'SUPER_ADMIN'] },
  },
]
