'use client'

import React from 'react'
import { useRBACStore } from '@/store/rbac-store'
import { Module, Permission } from '@/types/rbac'

interface ProtectedComponentProps {
  module: Module
  action: Permission
  resource?: string
  fallback?: React.ReactNode
  children: React.ReactNode
  requireAll?: boolean // If multiple permissions, require all (default: false - require any)
}

interface MultiplePermissionsProps {
  permissions: Array<{ module: Module; action: Permission; resource?: string }>
  requireAll?: boolean
  fallback?: React.ReactNode
  children: React.ReactNode
}

// Single permission check component
export function ProtectedComponent({ 
  module, 
  action, 
  resource, 
  fallback = null, 
  children 
}: ProtectedComponentProps) {
  const checkPermission = useRBACStore(state => state.checkPermission)
  
  const hasPermission = checkPermission(module, action, resource)
  
  if (!hasPermission) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Multiple permissions check component
export function ProtectedMultipleComponent({ 
  permissions, 
  requireAll = false, 
  fallback = null, 
  children 
}: MultiplePermissionsProps) {
  const checkPermission = useRBACStore(state => state.checkPermission)
  
  const hasPermissions = requireAll
    ? permissions.every(({ module, action, resource }) => 
        checkPermission(module, action, resource)
      )
    : permissions.some(({ module, action, resource }) => 
        checkPermission(module, action, resource)
      )
  
  if (!hasPermissions) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Role-based component protection
interface ProtectedByRoleProps {
  roles: string[]
  requireAll?: boolean
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function ProtectedByRole({ 
  roles, 
  requireAll = false, 
  fallback = null, 
  children 
}: ProtectedByRoleProps) {
  const { userRoles } = useRBACStore()
  
  const hasRole = requireAll
    ? roles.every(roleName => userRoles.some(role => role.name === roleName))
    : roles.some(roleName => userRoles.some(role => role.name === roleName))
  
  if (!hasRole) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Hierarchy-based component protection
interface ProtectedByHierarchyProps {
  minimumLevel: number
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function ProtectedByHierarchy({ 
  minimumLevel, 
  fallback = null, 
  children 
}: ProtectedByHierarchyProps) {
  const hasMinimumRole = useRBACStore(state => state.hasMinimumRole)
  
  const hasAccess = hasMinimumRole(minimumLevel)
  
  if (!hasAccess) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Combined protection wrapper
interface AdvancedProtectedComponentProps {
  permissions?: Array<{ module: Module; action: Permission; resource?: string }>
  roles?: string[]
  minimumHierarchy?: number
  requireAllPermissions?: boolean
  requireAllRoles?: boolean
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function AdvancedProtectedComponent({
  permissions = [],
  roles = [],
  minimumHierarchy,
  requireAllPermissions = false,
  requireAllRoles = false,
  fallback = null,
  children
}: AdvancedProtectedComponentProps) {
  const { checkPermission, userRoles, hasMinimumRole } = useRBACStore()
  
  // Check permissions
  let permissionCheck = true
  if (permissions.length > 0) {
    permissionCheck = requireAllPermissions
      ? permissions.every(({ module, action, resource }) => 
          checkPermission(module, action, resource)
        )
      : permissions.some(({ module, action, resource }) => 
          checkPermission(module, action, resource)
        )
  }
  
  // Check roles
  let roleCheck = true
  if (roles.length > 0) {
    roleCheck = requireAllRoles
      ? roles.every(roleName => userRoles.some(role => role.name === roleName))
      : roles.some(roleName => userRoles.some(role => role.name === roleName))
  }
  
  // Check hierarchy
  let hierarchyCheck = true
  if (minimumHierarchy !== undefined) {
    hierarchyCheck = hasMinimumRole(minimumHierarchy)
  }
  
  const hasAccess = permissionCheck && roleCheck && hierarchyCheck
  
  if (!hasAccess) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// No access message component
export function NoAccessMessage({ 
  message = "You don't have permission to view this content",
  showIcon = true 
}: { 
  message?: string
  showIcon?: boolean 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {showIcon && (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
      <p className="text-sm text-gray-500 text-center max-w-md">
        {message}
      </p>
    </div>
  )
}