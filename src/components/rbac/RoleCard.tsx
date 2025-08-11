'use client'

import React, { useState } from 'react'
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  CogIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { Role } from '@/types/rbac'

interface RoleCardProps {
  role: Role
  onEdit?: (role: Role) => void
  onDelete?: (role: Role) => void
  onView?: (role: Role) => void
  userCount?: number
  showActions?: boolean
  compact?: boolean
}

export function RoleCard({ 
  role, 
  onEdit, 
  onDelete, 
  onView,
  userCount = 0,
  showActions = true,
  compact = false 
}: RoleCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleDelete = () => {
    if (showConfirmDelete) {
      onDelete?.(role)
      setShowConfirmDelete(false)
    } else {
      setShowConfirmDelete(true)
    }
  }

  const getHierarchyLabel = (hierarchy: number): string => {
    if (hierarchy >= 90) return 'Executive'
    if (hierarchy >= 70) return 'Management'
    if (hierarchy >= 50) return 'Supervisor'
    if (hierarchy >= 30) return 'Operator'
    return 'Basic'
  }

  const getHierarchyColor = (hierarchy: number): string => {
    if (hierarchy >= 90) return 'bg-purple-100 text-purple-800'
    if (hierarchy >= 70) return 'bg-blue-100 text-blue-800'
    if (hierarchy >= 50) return 'bg-green-100 text-green-800'
    if (hierarchy >= 30) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getPermissionSummary = () => {
    const permissionCount = role.permissions.length
    const modules = [...new Set(role.permissions.map(p => p.module))].length
    return { permissionCount, modules }
  }

  const { permissionCount, modules } = getPermissionSummary()

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              role.isSystem ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              {role.isSystem ? (
                <CogIcon className="w-5 h-5 text-red-600" />
              ) : (
                <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {role.name}
                </h3>
                {role.isSystem && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    System
                  </span>
                )}
                {!role.isActive && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    Inactive
                  </span>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                {role.description}
              </p>
              
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <span>{permissionCount} permissions</span>
                <span>•</span>
                <span>{userCount} users</span>
              </div>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-1 ml-4">
              <button
                onClick={() => onView?.(role)}
                className="p-1 text-gray-400 hover:text-blue-600 rounded"
                title="View details"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
              
              {!role.isSystem && onEdit && (
                <button
                  onClick={() => onEdit(role)}
                  className="p-1 text-gray-400 hover:text-blue-600 rounded"
                  title="Edit role"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              )}
              
              {!role.isSystem && onDelete && userCount === 0 && (
                <button
                  onClick={handleDelete}
                  className={`p-1 rounded ${
                    showConfirmDelete 
                      ? 'text-red-600 bg-red-50' 
                      : 'text-gray-400 hover:text-red-600'
                  }`}
                  title={showConfirmDelete ? "Click again to confirm" : "Delete role"}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              role.isSystem ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              {role.isSystem ? (
                <CogIcon className="w-6 h-6 text-red-600" />
              ) : (
                <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {role.name}
                </h3>
                
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getHierarchyColor(role.hierarchy)
                }`}>
                  {getHierarchyLabel(role.hierarchy)}
                </span>
                
                {role.isSystem && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    System Role
                  </span>
                )}
                
                {!role.isActive && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Inactive
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {role.description}
              </p>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onView?.(role)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View details"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
              
              {!role.isSystem && onEdit && (
                <button
                  onClick={() => onEdit(role)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit role"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              )}
              
              {!role.isSystem && onDelete && userCount === 0 && (
                <button
                  onClick={handleDelete}
                  className={`p-2 rounded-lg transition-colors ${
                    showConfirmDelete 
                      ? 'text-red-600 bg-red-50' 
                      : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                  }`}
                  title={showConfirmDelete ? "Click again to confirm" : "Delete role"}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-gray-900">{permissionCount}</div>
              <div className="text-xs text-gray-500">Permissions</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">{modules}</div>
              <div className="text-xs text-gray-500">Modules</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">{userCount}</div>
              <div className="text-xs text-gray-500">Users</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <UserGroupIcon className="w-4 h-4" />
            <span>Level {role.hierarchy}</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Created: {role.createdAt.toLocaleDateString()}</span>
            {role.updatedAt.getTime() !== role.createdAt.getTime() && (
              <span>Updated: {role.updatedAt.toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Confirm Delete Overlay */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-red-50 bg-opacity-95 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrashIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-red-800 font-medium mb-3">
              Delete "{role.name}"?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-3 py-1 bg-white text-gray-600 text-sm rounded border hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}