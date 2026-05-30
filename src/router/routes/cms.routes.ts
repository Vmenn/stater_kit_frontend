import type { RouteRecordRaw } from 'vue-router'

export const cmsRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/cms',
    name: 'cms-list',
    component: () => import('../../modules/cms/views/CmsListView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'dashboard',
      title: 'Content Management',
      roles: ['ADMIN', 'SUPER_ADMIN'],
    },
  },
  {
    path: '/admin/users',
    name: 'users',
    component: () => import('../../modules/cms/views/UsersView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'dashboard',
      title: 'User Management',
      roles: ['ADMIN', 'SUPER_ADMIN'],
    },
  },
]
