import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../../modules/auth/store/auth.store'
import { hasAnyRole } from '../../core/permissions/rbac'
import type { Role } from '../../core/permissions/rbac'

/** Returns the appropriate home path for a given role after login. */
export function roleHomePath(role: Role): string {
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') return '/admin/dashboard'
  return '/user/home'
}

export async function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> {
  const authStore = useAuthStore()

  const requiresAuth = to.meta.requiresAuth !== false
  const requiredRoles = to.meta.roles as Role[] | undefined

  if (!requiresAuth) {
    // Redirect already-authenticated users away from login/register
    if (authStore.isAuthenticated && ['login', 'register'].includes(to.name as string)) {
      next(roleHomePath(authStore.userRole))
      return
    }
    next()
    return
  }

  if (!authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasAnyRole(authStore.userRole, requiredRoles)) {
      // Non-admin trying to hit admin routes → send to user area
      next(roleHomePath(authStore.userRole))
      return
    }
  }

  next()
}
