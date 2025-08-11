'use client'

import React, { useState } from 'react'
import { CheckCircleIcon, XCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline'
import { 
  Module, 
  Permission, 
  PermissionResource, 
  MODULE_DESCRIPTIONS, 
  PERMISSION_DESCRIPTIONS 
} from '@/types/rbac'

interface PermissionMatrixProps {
  permissions: PermissionResource[]
  onChange: (permissions: PermissionResource[]) => void
  readOnly?: boolean
  showSearch?: boolean
  compactView?: boolean
}

const ALL_MODULES: Module[] = [
  'dashboard', 'equipment', 'maintenance', 'operators', 
  'tracking', 'inventory', 'inspections', 'reports', 'admin', 'users', 'roles'
]

const ALL_PERMISSIONS: Permission[] = ['create', 'read', 'update', 'delete', 'approve', 'export', 'manage']

export function PermissionMatrix({ 
  permissions = [], 
  onChange, 
  readOnly = false,
  showSearch = true,
  compactView = false 
}: PermissionMatrixProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  // Create lookup map for faster permission checking
  const permissionMap = new Map<string, boolean>()
  permissions.forEach(perm => {
    const key = `${perm.module}:${perm.action}`
    permissionMap.set(key, true)
  })

  // Filter modules based on search
  const filteredModules = ALL_MODULES.filter(module =>
    module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    MODULE_DESCRIPTIONS[module].toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Check if permission exists
  const hasPermission = (module: Module, action: Permission): boolean => {
    return permissionMap.has(`${module}:${action}`)
  }

  // Toggle permission
  const togglePermission = (module: Module, action: Permission) => {
    if (readOnly) return

    const key = `${module}:${action}`
    const newPermissions = [...permissions]
    
    if (permissionMap.has(key)) {
      // Remove permission
      const index = newPermissions.findIndex(p => p.module === module && p.action === action)
      if (index > -1) {
        newPermissions.splice(index, 1)
      }
    } else {
      // Add permission
      newPermissions.push({ module, action })
    }
    
    onChange(newPermissions)
  }

  // Toggle all permissions for a module
  const toggleModulePermissions = (module: Module, enable: boolean) => {
    if (readOnly) return

    let newPermissions = permissions.filter(p => p.module !== module)
    
    if (enable) {
      const modulePermissions = ALL_PERMISSIONS.map(action => ({ module, action }))
      newPermissions = [...newPermissions, ...modulePermissions]
    }
    
    onChange(newPermissions)
  }

  // Check if module has all permissions
  const moduleHasAllPermissions = (module: Module): boolean => {
    return ALL_PERMISSIONS.every(action => hasPermission(module, action))
  }

  // Check if module has some permissions
  const moduleHasSomePermissions = (module: Module): boolean => {
    return ALL_PERMISSIONS.some(action => hasPermission(module, action))
  }

  // Toggle module expansion
  const toggleModuleExpansion = (module: Module) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(module)) {
      newExpanded.delete(module)
    } else {
      newExpanded.add(module)
    }
    setExpandedModules(newExpanded)
  }

  const getPermissionIcon = (module: Module, action: Permission) => {
    const hasPerms = hasPermission(module, action)
    
    if (hasPerms) {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    }
    
    return <XCircleIcon className="w-5 h-5 text-gray-300 hover:text-red-400 transition-colors" />
  }

  const getModuleIcon = (module: Module) => {
    const hasAll = moduleHasAllPermissions(module)
    const hasSome = moduleHasSomePermissions(module)
    
    if (hasAll) {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    } else if (hasSome) {
      return <MinusCircleIcon className="w-5 h-5 text-yellow-500" />
    } else {
      return <XCircleIcon className="w-5 h-5 text-gray-300" />
    }
  }

  if (compactView) {
    return (
      <div className="space-y-4">
        {showSearch && (
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        <div className="space-y-2">
          {filteredModules.map(module => (
            <div key={module} className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {!readOnly && (
                    <button
                      onClick={() => toggleModulePermissions(module, !moduleHasAllPermissions(module))}
                      className="focus:outline-none"
                    >
                      {getModuleIcon(module)}
                    </button>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 capitalize">{module}</h4>
                    <p className="text-sm text-gray-500">{MODULE_DESCRIPTIONS[module]}</p>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  {ALL_PERMISSIONS.map(action => (
                    <button
                      key={action}
                      onClick={() => togglePermission(module, action)}
                      disabled={readOnly}
                      className="p-1 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                      title={`${action} - ${PERMISSION_DESCRIPTIONS[action]}`}
                    >
                      {getPermissionIcon(module, action)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                {ALL_PERMISSIONS.map(permission => (
                  <th 
                    key={permission}
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    title={PERMISSION_DESCRIPTIONS[permission]}
                  >
                    {permission}
                  </th>
                ))}
                {!readOnly && (
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    All
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredModules.map(module => (
                <tr key={module} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {module}
                      </div>
                      <div className="text-sm text-gray-500">
                        {MODULE_DESCRIPTIONS[module]}
                      </div>
                    </div>
                  </td>
                  {ALL_PERMISSIONS.map(action => (
                    <td key={action} className="px-3 py-4 text-center">
                      <button
                        onClick={() => togglePermission(module, action)}
                        disabled={readOnly}
                        className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                        title={`${action} - ${PERMISSION_DESCRIPTIONS[action]}`}
                      >
                        {getPermissionIcon(module, action)}
                      </button>
                    </td>
                  ))}
                  {!readOnly && (
                    <td className="px-3 py-4 text-center">
                      <button
                        onClick={() => toggleModulePermissions(module, !moduleHasAllPermissions(module))}
                        className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title={moduleHasAllPermissions(module) ? "Remove all permissions" : "Grant all permissions"}
                      >
                        {getModuleIcon(module)}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!readOnly && (
        <div className="flex justify-between items-center pt-4 text-sm text-gray-500">
          <span>
            {permissions.length} permission{permissions.length !== 1 ? 's' : ''} granted
          </span>
          <div className="flex space-x-4">
            <button
              onClick={() => onChange([])}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Clear All
            </button>
            <button
              onClick={() => {
                const allPermissions: PermissionResource[] = []
                ALL_MODULES.forEach(module => {
                  ALL_PERMISSIONS.forEach(action => {
                    allPermissions.push({ module, action })
                  })
                })
                onChange(allPermissions)
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Grant All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}