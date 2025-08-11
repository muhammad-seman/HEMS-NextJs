'use client'

import React, { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { useRBACStore } from '@/store/rbac-store'
import { useAdminPermissions } from '@/hooks/usePermissions'
import { ProtectedComponent, NoAccessMessage } from '@/components/rbac/ProtectedComponent'
import { RBACUser, Role } from '@/types/rbac'

type FilterType = 'all' | 'active' | 'inactive' | 'admins' | 'no-roles'

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<RBACUser | null>(null)
  
  const { 
    users,
    roles,
    isLoadingUsers,
    error,
    loadUsers,
    loadRoles,
    assignRoleToUser,
    removeRoleFromUser
  } = useRBACStore()
  
  const { canManageUsers } = useAdminPermissions()

  // Load data on component mount
  useEffect(() => {
    loadUsers()
    loadRoles()
  }, [loadUsers, loadRoles])

  // Filter and search users
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false

    // Type filter
    switch (filterType) {
      case 'active':
        return user.isActive
      case 'inactive':
        return !user.isActive
      case 'admins':
        return user.roles.some(ur => {
          const role = roles.find(r => r.id === ur.roleId)
          return role && (role.name.includes('Admin') || role.hierarchy >= 90)
        })
      case 'no-roles':
        return user.roles.filter(ur => ur.isActive).length === 0
      default:
        return true
    }
  })

  // Get user's active roles
  const getUserRoles = (user: RBACUser): Role[] => {
    const activeRoleIds = user.roles
      .filter(ur => ur.isActive)
      .map(ur => ur.roleId)
    
    return roles.filter(role => activeRoleIds.includes(role.id))
  }

  // Handle role assignment
  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      await assignRoleToUser(userId, roleId)
    } catch (error) {
      console.error('Failed to assign role:', error)
    }
  }

  const handleRemoveRole = async (userId: string, roleId: string) => {
    try {
      await removeRoleFromUser(userId, roleId)
    } catch (error) {
      console.error('Failed to remove role:', error)
    }
  }

  // Statistics
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => 
      u.roles.some(ur => {
        const role = roles.find(r => r.id === ur.roleId)
        return role && (role.name.includes('Admin') || role.hierarchy >= 90)
      })
    ).length,
    noRoles: users.filter(u => u.roles.filter(ur => ur.isActive).length === 0).length
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Users</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedComponent 
      module="users" 
      action="read"
      fallback={<NoAccessMessage message="You don't have permission to view user management." />}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage user accounts and role assignments for your heavy equipment management system.
            </p>
          </div>
          
          <ProtectedComponent module="users" action="create">
            <button
              onClick={() => console.log('Create user modal')}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add User
            </button>
          </ProtectedComponent>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.active}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Inactive</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.inactive}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShieldCheckIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Admins</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.admins}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">No Roles</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.noRoles}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="w-4 h-4 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as FilterType)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  >
                    <option value="all">All Users</option>
                    <option value="active">Active Users</option>
                    <option value="inactive">Inactive Users</option>
                    <option value="admins">Administrators</option>
                    <option value="no-roles">No Roles Assigned</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>

        {/* Loading State */}
        {isLoadingUsers && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Users Table */}
        {!isLoadingUsers && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const userRoles = getUserRoles(user)
                
                return (
                  <li key={user.id}>
                    <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center">
                        {/* Avatar */}
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                        </div>
                        
                        {/* User Info */}
                        <div className="ml-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            {!user.isActive && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Inactive
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.lastLogin && (
                            <div className="text-xs text-gray-400">
                              Last login: {user.lastLogin.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Roles */}
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-wrap gap-1 max-w-md">
                          {userRoles.length > 0 ? (
                            userRoles.map((role) => (
                              <span
                                key={role.id}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {role.name}
                                {canManageUsers && (
                                  <button
                                    onClick={() => handleRemoveRole(user.id, role.id)}
                                    className="ml-1 inline-flex items-center justify-center w-3 h-3 text-blue-400 hover:text-blue-600"
                                  >
                                    <XCircleIcon className="w-3 h-3" />
                                  </button>
                                )}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400 italic">No roles assigned</span>
                          )}
                        </div>
                        
                        {/* Actions */}
                        {canManageUsers && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user)
                                setShowAssignModal(true)
                              }}
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              Manage Roles
                            </button>
                            <button
                              onClick={() => console.log('View user:', user)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Empty State */}
        {!isLoadingUsers && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterType !== 'all' 
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first user."
              }
            </p>
          </div>
        )}

        {/* Role Assignment Modal */}
        {showAssignModal && selectedUser && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Manage Roles for {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  
                  <div className="space-y-3">
                    {roles.map((role) => {
                      const hasRole = selectedUser.roles.some(ur => 
                        ur.roleId === role.id && ur.isActive
                      )
                      
                      return (
                        <div key={role.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{role.name}</div>
                            <div className="text-xs text-gray-500">{role.description}</div>
                          </div>
                          
                          <button
                            onClick={() => hasRole 
                              ? handleRemoveRole(selectedUser.id, role.id)
                              : handleAssignRole(selectedUser.id, role.id)
                            }
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              hasRole
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {hasRole ? 'Remove' : 'Assign'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={() => {
                      setShowAssignModal(false)
                      setSelectedUser(null)
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedComponent>
  )
}