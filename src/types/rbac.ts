// RBAC Type Definitions for Heavy Equipment Management System

// Base Permission Actions
export type Permission = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export' | 'manage'

// System Modules that can have permissions
export type Module = 
  | 'dashboard'
  | 'equipment'
  | 'maintenance'
  | 'operators'
  | 'tracking'
  | 'inventory'
  | 'inspections'
  | 'reports'
  | 'admin'
  | 'users'
  | 'roles'

// Permission Resource - combination of module and action
export interface PermissionResource {
  module: Module
  action: Permission
  resource?: string // Optional specific resource (e.g., 'equipment:123')
}

// Role Definition
export interface Role {
  id: string
  name: string
  description: string
  isSystem: boolean // System roles cannot be deleted
  permissions: PermissionResource[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
  isActive: boolean
  hierarchy: number // Role hierarchy level (higher = more permissions)
}

// User Role Assignment
export interface UserRole {
  id: string
  userId: string
  roleId: string
  assignedAt: Date
  assignedBy: string
  isActive: boolean
  expiresAt?: Date
}

// User with RBAC information
export interface RBACUser {
  id: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  roles: UserRole[]
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

// Permission Check Result
export interface PermissionCheck {
  allowed: boolean
  reason?: string
  requiredRole?: string
  userRoles: string[]
}

// Permission Matrix for UI
export interface PermissionMatrix {
  [module: string]: {
    [action: string]: boolean
  }
}

// Role Template for predefined roles
export interface RoleTemplate {
  name: string
  description: string
  permissions: PermissionResource[]
  isDefault: boolean
}

// System Role Templates
export const SYSTEM_ROLES: RoleTemplate[] = [
  {
    name: 'Super Admin',
    description: 'Full system access - all permissions',
    isDefault: false,
    permissions: [
      // All modules with all permissions
      { module: 'dashboard', action: 'read' },
      { module: 'equipment', action: 'manage' },
      { module: 'maintenance', action: 'manage' },
      { module: 'operators', action: 'manage' },
      { module: 'tracking', action: 'manage' },
      { module: 'inventory', action: 'manage' },
      { module: 'inspections', action: 'manage' },
      { module: 'reports', action: 'manage' },
      { module: 'admin', action: 'manage' },
      { module: 'users', action: 'manage' },
      { module: 'roles', action: 'manage' },
    ]
  },
  {
    name: 'Fleet Manager',
    description: 'Manage equipment, maintenance, and operators',
    isDefault: true,
    permissions: [
      { module: 'dashboard', action: 'read' },
      { module: 'equipment', action: 'manage' },
      { module: 'maintenance', action: 'manage' },
      { module: 'operators', action: 'manage' },
      { module: 'tracking', action: 'read' },
      { module: 'inventory', action: 'update' },
      { module: 'inspections', action: 'read' },
      { module: 'reports', action: 'read' },
    ]
  },
  {
    name: 'Maintenance Supervisor',
    description: 'Manage maintenance and inspections',
    isDefault: true,
    permissions: [
      { module: 'dashboard', action: 'read' },
      { module: 'equipment', action: 'read' },
      { module: 'maintenance', action: 'manage' },
      { module: 'operators', action: 'read' },
      { module: 'tracking', action: 'read' },
      { module: 'inventory', action: 'manage' },
      { module: 'inspections', action: 'manage' },
      { module: 'reports', action: 'read' },
    ]
  },
  {
    name: 'Operator',
    description: 'Basic equipment operation and reporting',
    isDefault: true,
    permissions: [
      { module: 'dashboard', action: 'read' },
      { module: 'equipment', action: 'read' },
      { module: 'maintenance', action: 'read' },
      { module: 'tracking', action: 'read' },
      { module: 'inspections', action: 'create' },
      { module: 'inspections', action: 'read' },
    ]
  },
  {
    name: 'Viewer',
    description: 'Read-only access to most data',
    isDefault: true,
    permissions: [
      { module: 'dashboard', action: 'read' },
      { module: 'equipment', action: 'read' },
      { module: 'maintenance', action: 'read' },
      { module: 'operators', action: 'read' },
      { module: 'tracking', action: 'read' },
      { module: 'inventory', action: 'read' },
      { module: 'inspections', action: 'read' },
      { module: 'reports', action: 'read' },
    ]
  }
]

// Permission Descriptions for UI
export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  create: 'Create new records',
  read: 'View and read data',
  update: 'Edit existing records',
  delete: 'Delete records',
  approve: 'Approve requests and changes',
  export: 'Export data and reports',
  manage: 'Full management access (all CRUD operations)'
}

// Module Descriptions for UI
export const MODULE_DESCRIPTIONS: Record<Module, string> = {
  dashboard: 'System dashboard and analytics overview',
  equipment: 'Heavy equipment fleet management',
  maintenance: 'Equipment maintenance and service records',
  operators: 'Equipment operators and staff management',
  tracking: 'Real-time equipment location and status',
  inventory: 'Parts, supplies, and inventory management',
  inspections: 'Safety inspections and compliance',
  reports: 'Analytics, reports, and data insights',
  admin: 'System administration settings',
  users: 'User account management',
  roles: 'Role and permission management'
}

// Role Hierarchy Levels
export const ROLE_HIERARCHY = {
  SUPER_ADMIN: 100,
  ADMIN: 90,
  FLEET_MANAGER: 70,
  MAINTENANCE_SUPERVISOR: 60,
  SUPERVISOR: 50,
  TECHNICIAN: 40,
  OPERATOR: 30,
  VIEWER: 10
} as const

// RBAC Store State Interface
export interface RBACState {
  // Current user permissions
  userPermissions: PermissionMatrix
  userRoles: Role[]
  
  // Role management
  roles: Role[]
  roleTemplates: RoleTemplate[]
  
  // User management
  users: RBACUser[]
  
  // Loading states
  isLoading: boolean
  isLoadingRoles: boolean
  isLoadingUsers: boolean
  
  // Error states
  error: string | null
  
  // Actions
  loadUserPermissions: (userId: string) => Promise<void>
  loadRoles: () => Promise<void>
  loadUsers: () => Promise<void>
  createRole: (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Role>
  updateRole: (id: string, updates: Partial<Role>) => Promise<Role>
  deleteRole: (id: string) => Promise<void>
  assignRoleToUser: (userId: string, roleId: string) => Promise<void>
  removeRoleFromUser: (userId: string, roleId: string) => Promise<void>
  checkPermission: (module: Module, action: Permission, resource?: string) => boolean
  hasAnyRole: (roleNames: string[]) => boolean
  hasMinimumRole: (minimumLevel: number) => boolean
}

// API Response Types
export interface RoleApiResponse {
  roles: Role[]
  total: number
  page: number
  limit: number
}

export interface UserApiResponse {
  users: RBACUser[]
  total: number
  page: number
  limit: number
}

// Form Types for Role Management
export interface CreateRoleRequest {
  name: string
  description: string
  permissions: PermissionResource[]
  isActive: boolean
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
  permissions?: PermissionResource[]
  isActive?: boolean
}

// Form Types for User Role Management
export interface AssignRoleRequest {
  userId: string
  roleId: string
  expiresAt?: Date
}

export interface BulkRoleAssignmentRequest {
  userIds: string[]
  roleId: string
  expiresAt?: Date
}