import { create } from 'zustand'
import { 
  RBACState, 
  Role, 
  RBACUser, 
  PermissionMatrix, 
  Module, 
  Permission, 
  PermissionResource,
  SYSTEM_ROLES,
  RoleTemplate,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignRoleRequest
} from '@/types/rbac'

// Mock current user ID - in real app, this would come from auth
const CURRENT_USER_ID = 'user-123'

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock data - in production, these would come from API
const mockRoles: Role[] = [
  {
    id: 'role-1',
    name: 'Super Admin',
    description: 'Full system access - all permissions',
    isSystem: true,
    isActive: true,
    hierarchy: 100,
    permissions: [
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
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system'
  },
  {
    id: 'role-2',
    name: 'Fleet Manager',
    description: 'Manage equipment, maintenance, and operators',
    isSystem: false,
    isActive: true,
    hierarchy: 70,
    permissions: [
      { module: 'dashboard', action: 'read' },
      { module: 'equipment', action: 'manage' },
      { module: 'maintenance', action: 'manage' },
      { module: 'operators', action: 'manage' },
      { module: 'tracking', action: 'read' },
      { module: 'inventory', action: 'update' },
      { module: 'inspections', action: 'read' },
      { module: 'reports', action: 'read' },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'user-123'
  }
]

const mockUsers: RBACUser[] = [
  {
    id: 'user-123',
    email: 'admin@hems.com',
    firstName: 'System',
    lastName: 'Administrator',
    isActive: true,
    roles: [
      {
        id: 'user-role-1',
        userId: 'user-123',
        roleId: 'role-1',
        assignedAt: new Date('2024-01-01'),
        assignedBy: 'system',
        isActive: true
      }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastLogin: new Date()
  }
]

// Helper function to build permission matrix from roles
function buildPermissionMatrix(roles: Role[]): PermissionMatrix {
  const matrix: PermissionMatrix = {}
  
  roles.forEach(role => {
    role.permissions.forEach(permission => {
      if (!matrix[permission.module]) {
        matrix[permission.module] = {}
      }
      matrix[permission.module][permission.action] = true
      
      // If user has 'manage' permission, grant all CRUD permissions
      if (permission.action === 'manage') {
        matrix[permission.module]['create'] = true
        matrix[permission.module]['read'] = true
        matrix[permission.module]['update'] = true
        matrix[permission.module]['delete'] = true
        matrix[permission.module]['approve'] = true
        matrix[permission.module]['export'] = true
      }
    })
  })
  
  return matrix
}

// Create the RBAC store
export const useRBACStore = create<RBACState>((set, get) => ({
  // Initial state
  userPermissions: {},
  userRoles: [],
  roles: [],
  roleTemplates: SYSTEM_ROLES,
  users: [],
  isLoading: false,
  isLoadingRoles: false,
  isLoadingUsers: false,
  error: null,

  // Load current user permissions
  loadUserPermissions: async (userId: string = CURRENT_USER_ID) => {
    set({ isLoading: true, error: null })
    
    try {
      await delay(500) // Simulate API call
      
      // Find user and their active roles
      const user = mockUsers.find(u => u.id === userId)
      if (!user) {
        throw new Error('User not found')
      }

      const activeRoleIds = user.roles
        .filter(ur => ur.isActive)
        .map(ur => ur.roleId)
      
      const userRoles = mockRoles.filter(role => activeRoleIds.includes(role.id))
      const permissionMatrix = buildPermissionMatrix(userRoles)
      
      set({ 
        userPermissions: permissionMatrix,
        userRoles,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load permissions',
        isLoading: false 
      })
    }
  },

  // Load all roles
  loadRoles: async () => {
    set({ isLoadingRoles: true, error: null })
    
    try {
      await delay(300)
      set({ roles: mockRoles, isLoadingRoles: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load roles',
        isLoadingRoles: false 
      })
    }
  },

  // Load all users
  loadUsers: async () => {
    set({ isLoadingUsers: true, error: null })
    
    try {
      await delay(300)
      set({ users: mockUsers, isLoadingUsers: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load users',
        isLoadingUsers: false 
      })
    }
  },

  // Create new role
  createRole: async (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { roles } = get()
    
    try {
      await delay(500)
      
      const newRole: Role = {
        ...roleData,
        id: `role-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const updatedRoles = [...roles, newRole]
      set({ roles: updatedRoles })
      
      return newRole
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create role' })
      throw error
    }
  },

  // Update existing role
  updateRole: async (id: string, updates: Partial<Role>) => {
    const { roles } = get()
    
    try {
      await delay(500)
      
      const roleIndex = roles.findIndex(r => r.id === id)
      if (roleIndex === -1) {
        throw new Error('Role not found')
      }
      
      const updatedRole: Role = {
        ...roles[roleIndex],
        ...updates,
        updatedAt: new Date()
      }
      
      const updatedRoles = [...roles]
      updatedRoles[roleIndex] = updatedRole
      
      set({ roles: updatedRoles })
      
      return updatedRole
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update role' })
      throw error
    }
  },

  // Delete role
  deleteRole: async (id: string) => {
    const { roles } = get()
    
    try {
      await delay(300)
      
      const role = roles.find(r => r.id === id)
      if (!role) {
        throw new Error('Role not found')
      }
      
      if (role.isSystem) {
        throw new Error('Cannot delete system role')
      }
      
      const updatedRoles = roles.filter(r => r.id !== id)
      set({ roles: updatedRoles })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete role' })
      throw error
    }
  },

  // Assign role to user
  assignRoleToUser: async (userId: string, roleId: string) => {
    const { users } = get()
    
    try {
      await delay(300)
      
      const userIndex = users.findIndex(u => u.id === userId)
      if (userIndex === -1) {
        throw new Error('User not found')
      }
      
      // Check if user already has this role
      const user = users[userIndex]
      const existingRole = user.roles.find(ur => ur.roleId === roleId && ur.isActive)
      if (existingRole) {
        throw new Error('User already has this role')
      }
      
      const newUserRole = {
        id: `user-role-${Date.now()}`,
        userId,
        roleId,
        assignedAt: new Date(),
        assignedBy: CURRENT_USER_ID,
        isActive: true
      }
      
      const updatedUsers = [...users]
      updatedUsers[userIndex] = {
        ...user,
        roles: [...user.roles, newUserRole]
      }
      
      set({ users: updatedUsers })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to assign role' })
      throw error
    }
  },

  // Remove role from user
  removeRoleFromUser: async (userId: string, roleId: string) => {
    const { users } = get()
    
    try {
      await delay(300)
      
      const userIndex = users.findIndex(u => u.id === userId)
      if (userIndex === -1) {
        throw new Error('User not found')
      }
      
      const user = users[userIndex]
      const updatedRoles = user.roles.map(ur => 
        ur.roleId === roleId ? { ...ur, isActive: false } : ur
      )
      
      const updatedUsers = [...users]
      updatedUsers[userIndex] = {
        ...user,
        roles: updatedRoles
      }
      
      set({ users: updatedUsers })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to remove role' })
      throw error
    }
  },

  // Check if user has specific permission
  checkPermission: (module: Module, action: Permission, resource?: string) => {
    const { userPermissions } = get()
    
    // Check if user has permission for the module and action
    return !!(userPermissions[module] && userPermissions[module][action])
  },

  // Check if user has any of the specified roles
  hasAnyRole: (roleNames: string[]) => {
    const { userRoles } = get()
    return userRoles.some(role => roleNames.includes(role.name))
  },

  // Check if user has minimum role hierarchy level
  hasMinimumRole: (minimumLevel: number) => {
    const { userRoles } = get()
    return userRoles.some(role => role.hierarchy >= minimumLevel)
  }
}))

// Initialize the store with current user permissions
export const initializeRBAC = async () => {
  const store = useRBACStore.getState()
  await Promise.all([
    store.loadUserPermissions(),
    store.loadRoles(),
    store.loadUsers()
  ])
}