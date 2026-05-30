import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from './routes/auth.routes'
import { dashboardRoutes } from './routes/dashboard.routes'
import { cmsRoutes } from './routes/cms.routes'
import { publicRoutes } from './routes/public.routes'
import { userRoutes } from './routes/user.routes'
import { authGuard, roleHomePath } from './guards/auth.guard'
import { useAuthStore } from '../modules/auth/store/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,
    ...authRoutes,
    ...userRoutes,
    ...dashboardRoutes,
    ...cmsRoutes,
    // Catch-all: redirect based on auth state
    { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (!authStore.currentUser) {
    authStore.initFromStorage()
  }

  // After login, redirect to role-appropriate home if hitting root
  if (to.path === '/' && authStore.isAuthenticated) {
    next(roleHomePath(authStore.userRole))
    return
  }

  await authGuard(to, from, next)
})

router.afterEach(to => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} — Enterprise Starter Kit` : 'Enterprise Starter Kit'
})

export default router
