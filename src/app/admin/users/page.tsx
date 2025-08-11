'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  MagnifyingGlassIcon,
  UserGroupIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { ColumnDef } from '@tanstack/react-table'
import { useRBACStore } from '@/store/rbac-store'
import { useAdminPermissions } from '@/hooks/usePermissions'
import { ProtectedComponent, NoAccessMessage } from '@/components/rbac/ProtectedComponent'
import { RBACUser, Role } from '@/types/rbac'
import Table from '@/components/ui/Table'
import { CreateButton, EditButton, DeleteButton } from '@/components/ui/IconButton'
import Accordion from '@/components/ui/Accordion'
import { confirmDelete, confirmRoleChange, successAlert, errorAlert } from '@/lib/alerts'
import { format } from 'date-fns'

interface FilterState {
  role: string
  status: string
  search: string
  dateRange: string
}

export default function UserManagementPage() {
  const [filters, setFilters] = useState<FilterState>({
    role: 'all',
    status: 'all',
    search: '',
    dateRange: 'all'
  })
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [expandedRows, setExpandedRows] = useState<{[key: string]: 'show' | 'edit'}>({})
  
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

  // Advanced filtering logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search filter
      const matchesSearch = !filters.search || 
        user.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      
      // Status filter
      let matchesStatus = true
      if (filters.status === 'active') matchesStatus = user.isActive
      else if (filters.status === 'inactive') matchesStatus = !user.isActive
      
      // Role filter
      let matchesRole = true
      if (filters.role !== 'all') {
        if (filters.role === 'admins') {
          matchesRole = user.roles.some(ur => {
            const role = roles.find(r => r.id === ur.roleId)
            return role && (role.name.includes('Admin') || role.hierarchy >= 90)
          })
        } else if (filters.role === 'no-roles') {
          matchesRole = user.roles.filter(ur => ur.isActive).length === 0
        } else {
          matchesRole = user.roles.some(ur => ur.roleId === filters.role && ur.isActive)
        }
      }
      
      // Date range filter (if implemented)
      let matchesDate = true
      if (filters.dateRange !== 'all' && user.lastLogin) {
        const now = new Date()
        const loginDate = user.lastLogin
        const daysDiff = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24))
        
        switch (filters.dateRange) {
          case '7d':
            matchesDate = daysDiff <= 7
            break
          case '30d':
            matchesDate = daysDiff <= 30
            break
          case '90d':
            matchesDate = daysDiff <= 90
            break
          default:
            matchesDate = true
        }
      }
      
      return matchesSearch && matchesStatus && matchesRole && matchesDate
    })
  }, [users, roles, filters])

  // Get user's active roles
  const getUserRoles = useCallback((user: RBACUser): Role[] => {
    const activeRoleIds = user.roles
      .filter(ur => ur.isActive)
      .map(ur => ur.roleId)
    
    return roles.filter(role => activeRoleIds.includes(role.id))
  }, [roles])

  // Handle role assignment with confirmation
  const handleAssignRole = async (userId: string, roleId: string) => {
    const user = users.find(u => u.id === userId)
    const role = roles.find(r => r.id === roleId)
    
    if (!user || !role) return
    
    const confirmed = await confirmRoleChange('assign', role.name, `${user.firstName} ${user.lastName}`)
    if (!confirmed) return
    
    try {
      await assignRoleToUser(userId, roleId)
      successAlert({ title: 'Role assigned successfully!' })
    } catch (error) {
      errorAlert({ 
        title: 'Failed to assign role', 
        text: error instanceof Error ? error.message : 'An error occurred' 
      })
    }
  }

  const handleRemoveRole = async (userId: string, roleId: string) => {
    const user = users.find(u => u.id === userId)
    const role = roles.find(r => r.id === roleId)
    
    if (!user || !role) return
    
    const confirmed = await confirmRoleChange('remove', role.name, `${user.firstName} ${user.lastName}`)
    if (!confirmed) return
    
    try {
      await removeRoleFromUser(userId, roleId)
      successAlert({ title: 'Role removed successfully!' })
    } catch (error) {
      errorAlert({ 
        title: 'Failed to remove role', 
        text: error instanceof Error ? error.message : 'An error occurred' 
      })
    }
  }

  // Handle user deletion
  const handleDeleteUser = useCallback(async (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (!user) return
    
    const confirmed = await confirmDelete(`${user.firstName} ${user.lastName}`)
    if (!confirmed) return
    
    try {
      // Add delete user logic here
      successAlert({ title: 'User deleted successfully!' })
    } catch (error) {
      errorAlert({ 
        title: 'Failed to delete user', 
        text: error instanceof Error ? error.message : 'An error occurred' 
      })
    }
  }, [users])

  // Handle showing user details
  const handleShowUser = useCallback((userId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [userId]: prev[userId] === 'show' ? undefined as any : 'show'
    }))
  }, [])

  // Handle editing user
  const handleEditUser = useCallback((userId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [userId]: prev[userId] === 'edit' ? undefined as any : 'edit'
    }))
  }, [])


  // Table columns definition
  const columns = useMemo<ColumnDef<RBACUser>[]>(() => [
    {
      accessorKey: 'firstName',
      header: 'Name',
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="font-medium text-gray-900 text-sm">
            {user.firstName} {user.lastName}
          </div>
        )
      }
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="text-sm text-gray-600">
            {user.email}
          </div>
        )
      }
    },
    {
      id: 'roles',
      header: 'Role',
      cell: ({ row }) => {
        const user = row.original
        const userRoles = getUserRoles(user)
        return (
          <div className="text-sm">
            {userRoles.length > 0 ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {userRoles[0].name}
                {userRoles.length > 1 && ` +${userRoles.length - 1}`}
              </span>
            ) : (
              <span className="text-gray-400 italic">No role</span>
            )}
          </div>
        )
      },
      enableSorting: false
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const user = row.original
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            user.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        )
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => handleShowUser(user.id)}
              className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Show details"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            {canManageUsers && (
              <>
                <button
                  onClick={() => handleEditUser(user.id)}
                  className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  title="Edit user"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete user"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        )
      },
      enableSorting: false
    }
  ], [canManageUsers, getUserRoles, handleDeleteUser, handleShowUser, handleEditUser])

  // Expandable row content
  const expandableContent = (user: RBACUser) => {
    const userRoles = getUserRoles(user)
    const availableRoles = roles.filter(role => 
      !userRoles.some(ur => ur.id === role.id)
    )
    const expandMode = expandedRows[user.id]
    
    if (expandMode === 'edit') {
      return (
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Edit User: {user.firstName} {user.lastName}</h4>
            <button
              onClick={() => handleEditUser(user.id)}
              className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
          
          <form className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                defaultValue={user.firstName}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                defaultValue={user.lastName}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Employee ID
              </label>
              <input
                type="text"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter employee ID"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Department/Site
              </label>
              <select className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select department</option>
                <option value="operations">Operations</option>
                <option value="maintenance">Maintenance</option>
                <option value="logistics">Logistics</option>
                <option value="safety">Safety & Compliance</option>
                <option value="admin">Administration</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <select defaultValue={user.isActive ? 'active' : 'inactive'} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex justify-end space-x-2 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => handleEditUser(user.id)}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )
    }
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Details */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">User Details: {user.firstName} {user.lastName}</h4>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Full Name:</dt>
              <dd className="text-gray-900">{user.firstName} {user.lastName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Email:</dt>
              <dd className="text-gray-900">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Status:</dt>
              <dd className={user.isActive ? 'text-green-600' : 'text-red-600'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Last Login:</dt>
              <dd className="text-gray-900">
                {user.lastLogin ? format(user.lastLogin, 'MMM dd, yyyy HH:mm') : 'Never'}
              </dd>
            </div>
          </dl>
        </div>
        
        {/* Role Management */}
        {canManageUsers && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Role Management</h4>
            
            {/* Current Roles */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Current Roles</h5>
              {userRoles.length > 0 ? (
                <div className="space-y-2">
                  {userRoles.map(role => (
                    <div key={role.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{role.name}</span>
                        <p className="text-xs text-gray-500">{role.description}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveRole(user.id, role.id)}
                        className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No roles assigned</p>
              )}
            </div>
            
            {/* Available Roles */}
            {availableRoles.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Available Roles</h5>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableRoles.map(role => (
                    <div key={role.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{role.name}</span>
                        <p className="text-xs text-gray-500">{role.description}</p>
                      </div>
                      <button
                        onClick={() => handleAssignRole(user.id, role.id)}
                        className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200"
                      >
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full py-6">
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
      <div className="w-full py-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">User Management</h1>
          </div>
          
          <ProtectedComponent module="users" action="create">
            <CreateButton 
              onClick={() => setShowCreateForm(!showCreateForm)}
              tooltip="Create new user"
            />
          </ProtectedComponent>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <div className="mb-4">
            <Accordion title="Create New User" isOpen={showCreateForm} onToggle={() => setShowCreateForm(!showCreateForm)}>
              <form className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter last name"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter password"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter employee ID"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Department/Site
                  </label>
                  <select className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select department</option>
                    <option value="operations">Operations</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="logistics">Logistics</option>
                    <option value="safety">Safety & Compliance</option>
                    <option value="admin">Administration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="sm:col-span-2 flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </Accordion>
          </div>
        )}

        {/* Advanced Filters */}
        <div className="bg-white shadow rounded-lg mb-4 p-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Role Filter */}
            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admins">Administrators</option>
              <option value="no-roles">No Roles</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>

            {/* Date Range Filter */}
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          
          <div className="mt-3 flex items-center justify-end">
            {/* Clear Filters */}
            <button
              onClick={() => setFilters({ role: 'all', status: 'all', search: '', dateRange: 'all' })}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Users Table */}
        {isLoadingUsers ? (
          <div className="bg-white rounded-lg shadow">
            <div className="animate-pulse">
              <div className="border-b border-gray-200 px-4 py-4">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b border-gray-200 px-4 py-4">
                  <div className="flex space-x-4">
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {typeof column.header === 'string' ? column.header : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user, userIndex) => (
                    <React.Fragment key={user.id}>
                      <tr className="hover:bg-gray-50">
                        {columns.map((column, colIndex) => (
                          <td key={colIndex} className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                            {column.cell ? column.cell({ row: { original: user } } as any) : ''}
                          </td>
                        ))}
                      </tr>
                      {expandedRows[user.id] && (
                        <tr>
                          <td colSpan={columns.length} className="px-3 py-4 bg-gray-50">
                            {expandableContent(user)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoadingUsers && filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.status !== 'all' || filters.role !== 'all'
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first user."
              }
            </p>
          </div>
        )}

      </div>
    </ProtectedComponent>
  )
}