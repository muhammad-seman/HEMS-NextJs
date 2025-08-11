'use client'

import React, { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { useRBACStore } from '@/store/rbac-store'
import { useAdminPermissions } from '@/hooks/usePermissions'
import { RoleCard } from '@/components/rbac/RoleCard'
import { ProtectedComponent, NoAccessMessage } from '@/components/rbac/ProtectedComponent'
import { Role } from '@/types/rbac'

type ViewMode = 'grid' | 'list'
type FilterType = 'all' | 'system' | 'custom' | 'active' | 'inactive'

export default function RoleManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  
  const { 
    roles, 
    users,
    isLoadingRoles,
    error,
    loadRoles,
    loadUsers,
    deleteRole
  } = useRBACStore()
  
  const { canManageRoles } = useAdminPermissions()

  // Load data on component mount
  useEffect(() => {
    loadRoles()
    loadUsers()
  }, [loadRoles, loadUsers])

  // Filter and search roles
  const filteredRoles = roles.filter(role => {
    // Search filter
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false

    // Type filter
    switch (filterType) {
      case 'system':
        return role.isSystem
      case 'custom':
        return !role.isSystem
      case 'active':
        return role.isActive
      case 'inactive':
        return !role.isActive
      default:
        return true
    }
  })

  // Get user count for each role
  const getUserCountForRole = (roleId: string): number => {
    return users.filter(user => 
      user.roles.some(userRole => 
        userRole.roleId === roleId && userRole.isActive
      )
    ).length
  }

  // Handle role actions
  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setShowCreateModal(true)
  }

  const handleDeleteRole = async (role: Role) => {
    try {
      await deleteRole(role.id)
    } catch (error) {
      console.error('Failed to delete role:', error)
    }
  }

  const handleViewRole = (role: Role) => {
    // TODO: Implement role details view
    console.log('View role:', role)
  }

  // Statistics
  const stats = {
    total: roles.length,
    system: roles.filter(r => r.isSystem).length,
    custom: roles.filter(r => !r.isSystem).length,
    active: roles.filter(r => r.isActive).length,
    inactive: roles.filter(r => !r.isActive).length
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Roles</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedComponent 
      module="roles" 
      action="read"
      fallback={<NoAccessMessage message="You don't have permission to view role management." />}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Role Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage user roles and permissions for your heavy equipment management system.
            </p>
          </div>
          
          <ProtectedComponent module="roles" action="create">
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Role
            </button>
          </ProtectedComponent>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShieldCheckIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Roles</dt>
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
                  <UserGroupIcon className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">System</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.system}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Custom</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.custom}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-green-400 rounded-full"></div>
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
                  <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
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
                  placeholder="Search roles..."
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
                    <option value="all">All Roles</option>
                    <option value="system">System Roles</option>
                    <option value="custom">Custom Roles</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                    title="Grid view"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                    title="List view"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600">
            Showing {filteredRoles.length} of {roles.length} roles
          </div>
        </div>

        {/* Loading State */}
        {isLoadingRoles && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Roles Display */}
        {!isLoadingRoles && (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" 
              : "space-y-4"
          }>
            {filteredRoles.map(role => (
              <RoleCard
                key={role.id}
                role={role}
                userCount={getUserCountForRole(role.id)}
                onEdit={canManageRoles ? handleEditRole : undefined}
                onDelete={canManageRoles ? handleDeleteRole : undefined}
                onView={handleViewRole}
                compact={viewMode === 'list'}
                showActions={canManageRoles}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoadingRoles && filteredRoles.length === 0 && (
          <div className="text-center py-12">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterType !== 'all' 
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first role."
              }
            </p>
            {canManageRoles && (!searchTerm && filterType === 'all') && (
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Role
                </button>
              </div>
            )}
          </div>
        )}

        {/* TODO: Create/Edit Role Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {selectedRole ? 'Edit Role' : 'Create New Role'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Role creation/editing modal will be implemented here.
                  </p>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      setSelectedRole(null)
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
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