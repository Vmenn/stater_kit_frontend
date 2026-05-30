import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../../modules/auth/views/LoginView.vue'),
    meta: { requiresAuth: false, layout: 'auth', title: 'Login' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../../modules/auth/views/RegisterView.vue'),
    meta: { requiresAuth: false, layout: 'auth', title: 'Create Account' },
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: () => import('../../modules/auth/views/VerifyEmailView.vue'),
    meta: { requiresAuth: false, layout: 'auth', title: 'Verify Email' },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../../modules/auth/views/ForgotPasswordView.vue'),
    meta: { requiresAuth: false, layout: 'auth', title: 'Forgot Password' },
  },
]
