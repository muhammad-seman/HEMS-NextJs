'use client'

import { useCallback, useMemo } from 'react'
import { useRBACStore } from '@/store/rbac-store'
import { Module, Permission, Role } from '@/types/rbac'

export interface UsePermissionsReturn {
  // Permission checking functions
  hasPermission: (module: Module, action: Permission, resource?: string) => boolean
  hasAllPermissions: (permissions: Array<{ module: Module; action: Permission; resource?: string }>) => boolean
  hasAnyPermission: (permissions: Array<{ module: Module; action: Permission; resource?: string }>) => boolean
  
  // Role checking functions
  hasRole: (roleName: string) => boolean
  hasAnyRole: (roleNames: string[]) => boolean
  hasAllRoles: (roleNames: string[]) => boolean
  hasMinimumRole: (minimumLevel: number) => boolean
  
  // Module access checking
  canAccessModule: (module: Module) => boolean
  getModulePermissions: (module: Module) => Permission[]
  
  // User role information
  userRoles: Role[]
  userPermissions: Record<string, Record<string, boolean>>
  highestRole: Role | null
  isAdmin: boolean
  isSuperAdmin: boolean
  
  // Convenience functions
  canCreate: (module: Module) => boolean
  canRead: (module: Module) => boolean
  canUpdate: (module: Module) => boolean
  canDelete: (module: Module) => boolean
  canApprove: (module: Module) => boolean
  canExport: (module: Module) => boolean
  canManage: (module: Module) => boolean
  
  // Loading states
  isLoading: boolean
  error: string | null
}

export function usePermissions(): UsePermissionsReturn {
  const {
    userPermissions,
    userRoles,
    checkPermission,
    hasAnyRole,
    hasMinimumRole,
    isLoading,
    error
  } = useRBACStore()

  // Basic permission checking
  const hasPermission = useCallback(
    (module: Module, action: Permission, resource?: string) => {
      return checkPermission(module, action, resource)
    },
    [checkPermission]
  )

  // Check if user has all specified permissions
  const hasAllPermissions = useCallback(
    (permissions: Array<{ module: Module; action: Permission; resource?: string }>) => {
      return permissions.every(({ module, action, resource }) => 
        hasPermission(module, action, resource)
      )
    },
    [hasPermission]
  )

  // Check if user has any of the specified permissions
  const hasAnyPermission = useCallback(
    (permissions: Array<{ module: Module; action: Permission; resource?: string }>) => {
      return permissions.some(({ module, action, resource }) => 
        hasPermission(module, action, resource)
      )
    },
    [hasPermission]
  )

  // Role checking functions
  const hasRole = useCallback(
    (roleName: string) => {
      return userRoles.some(role => role.name === roleName && role.isActive)
    },
    [userRoles]
  )

  const hasAllRoles = useCallback(
    (roleNames: string[]) => {
      return roleNames.every(roleName => hasRole(roleName))
    },
    [hasRole]
  )

  // Module access checking
  const canAccessModule = useCallback(
    (module: Module) => {
      return userPermissions[module] && Object.keys(userPermissions[module]).length > 0
    },
    [userPermissions]
  )

  const getModulePermissions = useCallback(
    (module: Module): Permission[] => {
      if (!userPermissions[module]) return []
      
      return Object.keys(userPermissions[module])
        .filter(action => userPermissions[module][action])
        .map(action => action as Permission)
    },
    [userPermissions]
  )

  // Convenience permission checking functions
  const canCreate = useCallback(
    (module: Module) => hasPermission(module, 'create') || hasPermission(module, 'manage'),
    [hasPermission]
  )

  const canRead = useCallback(
    (module: Module) => hasPermission(module, 'read') || hasPermission(module, 'manage'),
    [hasPermission]
  )

  const canUpdate = useCallback(
    (module: Module) => hasPermission(module, 'update') || hasPermission(module, 'manage'),
    [hasPermission]
  )

  const canDelete = useCallback(
    (module: Module) => hasPermission(module, 'delete') || hasPermission(module, 'manage'),
    [hasPermission]
  )

  const canApprove = useCallback(
    (module: Module) => hasPermission(module, 'approve') || hasPermission(module, 'manage'),
    [hasPermission]
  )

  const canExport = useCallback(
    (module: Module) => hasPermission(module, 'export') || hasPermission(module, 'manage'),
    [hasPermission]
  )

  const canManage = useCallback(
    (module: Module) => hasPermission(module, 'manage'),
    [hasPermission]
  )

  // Computed values
  const highestRole = useMemo(
    () => userRoles.reduce<Role | null>((highest, role) => {
      if (!role.isActive) return highest
      if (!highest || role.hierarchy > highest.hierarchy) return role
      return highest
    }, null),
    [userRoles]
  )

  const isAdmin = useMemo(
    () => hasRole('Super Admin') || hasRole('Admin') || hasMinimumRole(90),
    [hasRole, hasMinimumRole]
  )

  const isSuperAdmin = useMemo(
    () => hasRole('Super Admin') || hasMinimumRole(100),
    [hasRole, hasMinimumRole]
  )

  return {
    // Permission checking functions
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    
    // Role checking functions
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasMinimumRole,
    
    // Module access checking
    canAccessModule,
    getModulePermissions,
    
    // User role information
    userRoles,
    userPermissions,
    highestRole,
    isAdmin,
    isSuperAdmin,
    
    // Convenience functions
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canApprove,
    canExport,
    canManage,
    
    // Loading states
    isLoading,
    error
  }
}

// Hook for checking specific module permissions
export function useModulePermissions(module: Module) {
  const permissions = usePermissions()
  
  return useMemo(() => ({
    canAccess: permissions.canAccessModule(module),
    canCreate: permissions.canCreate(module),
    canRead: permissions.canRead(module),
    canUpdate: permissions.canUpdate(module),
    canDelete: permissions.canDelete(module),
    canApprove: permissions.canApprove(module),
    canExport: permissions.canExport(module),
    canManage: permissions.canManage(module),
    permissions: permissions.getModulePermissions(module)
  }), [module, permissions])
}

// Hook for admin-specific permissions
export function useAdminPermissions() {
  const permissions = usePermissions()
  
  return useMemo(() => ({
    isAdmin: permissions.isAdmin,
    isSuperAdmin: permissions.isSuperAdmin,
    canManageUsers: permissions.canManage('users'),
    canManageRoles: permissions.canManage('roles'),
    canAccessAdmin: permissions.canAccessModule('admin'),
    canViewReports: permissions.canRead('reports'),
    canExportData: permissions.hasAnyPermission([
      { module: 'equipment', action: 'export' },
      { module: 'maintenance', action: 'export' },
      { module: 'reports', action: 'export' }
    ])
  }), [permissions])
}

// Hook for role-based UI rendering
export function useRoleBasedUI() {
  const permissions = usePermissions()
  
  const shouldShowMenuItem = useCallback(
    (module: Module, requiredAction: Permission = 'read') => {
      return permissions.hasPermission(module, requiredAction)
    },
    [permissions]
  )
  
  const shouldShowButton = useCallback(
    (module: Module, action: Permission) => {
      return permissions.hasPermission(module, action)
    },
    [permissions]
  )
  
  const getVisibleMenuItems = useCallback(
    (menuItems: Array<{ module: Module; requiredPermission?: Permission }>) => {
      return menuItems.filter(item => 
        shouldShowMenuItem(item.module, item.requiredPermission)
      )
    },
    [shouldShowMenuItem]
  )
  
  return {
    shouldShowMenuItem,
    shouldShowButton,
    getVisibleMenuItems,
    userRoles: permissions.userRoles,
    userPermissions: permissions.userPermissions,
    highestRole: permissions.highestRole
  }
}