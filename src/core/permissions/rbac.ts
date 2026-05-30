export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'USER'

export const roleHierarchy: Record<Role, number> = {
  SUPER_ADMIN: 3,
  ADMIN: 2,
  USER: 1,
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function hasAnyRole(userRole: Role, roles: Role[]): boolean {
  return roles.some(role => hasRole(userRole, role))
}

export function isAdmin(userRole: Role): boolean {
  return hasRole(userRole, 'ADMIN')
}

export function isSuperAdmin(userRole: Role): boolean {
  return userRole === 'SUPER_ADMIN'
}
