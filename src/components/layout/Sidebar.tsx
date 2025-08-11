'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebarStore } from '@/store/sidebar-store'
import { initializeRBAC } from '@/store/rbac-store'
import { useRoleBasedUI } from '@/hooks/usePermissions'
import { Module } from '@/types/rbac'
import { 
  HomeIcon, 
  TruckIcon, 
  WrenchIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  MapPinIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  ChevronLeftIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { 
  HomeIcon as HomeIconSolid,
  TruckIcon as TruckIconSolid,
  WrenchIcon as WrenchIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  MapPinIcon as MapPinIconSolid,
  CubeIcon as CubeIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  CogIcon as CogIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid
} from '@heroicons/react/24/solid'

interface NavigationItem {
  name: string
  href?: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  iconSolid: React.ComponentType<React.SVGProps<SVGSVGElement>>
  module: Module
  requiredPermission?: 'create' | 'read' | 'update' | 'delete' | 'manage'
  isAdmin?: boolean
  children?: NavigationItem[]
  isGroup?: boolean
}

const navigation: NavigationItem[] = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: HomeIcon, 
    iconSolid: HomeIconSolid,
    module: 'dashboard',
    requiredPermission: 'read'
  },
  // Fleet Management Category
  {
    name: 'FLEET MANAGEMENT',
    icon: TruckIcon,
    iconSolid: TruckIconSolid,
    module: 'equipment',
    requiredPermission: 'read',
    isGroup: true
  },
  {
    name: 'Equipment',
    href: '/equipment',
    icon: TruckIcon,
    iconSolid: TruckIconSolid,
    module: 'equipment',
    requiredPermission: 'read'
  },
  {
    name: 'Operators',
    href: '/operators',
    icon: UserGroupIcon,
    iconSolid: UserGroupIconSolid,
    module: 'operators',
    requiredPermission: 'read'
  },
  {
    name: 'Tracking',
    href: '/tracking',
    icon: MapPinIcon,
    iconSolid: MapPinIconSolid,
    module: 'tracking',
    requiredPermission: 'read'
  },
  // Maintenance Category
  {
    name: 'MAINTENANCE',
    icon: WrenchIcon,
    iconSolid: WrenchIconSolid,
    module: 'maintenance',
    requiredPermission: 'read',
    isGroup: true
  },
  {
    name: 'Maintenance',
    href: '/maintenance',
    icon: WrenchIcon,
    iconSolid: WrenchIconSolid,
    module: 'maintenance',
    requiredPermission: 'read'
  },
  {
    name: 'Inspections',
    href: '/inspections',
    icon: ClipboardDocumentListIcon,
    iconSolid: ClipboardDocumentListIconSolid,
    module: 'inspections',
    requiredPermission: 'read'
  },
  // Operations Category
  {
    name: 'OPERATIONS',
    icon: CubeIcon,
    iconSolid: CubeIconSolid,
    module: 'inventory',
    requiredPermission: 'read',
    isGroup: true
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: CubeIcon,
    iconSolid: CubeIconSolid,
    module: 'inventory',
    requiredPermission: 'read'
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: ChartBarIcon,
    iconSolid: ChartBarIconSolid,
    module: 'reports',
    requiredPermission: 'read'
  }
]

// Admin navigation items
const adminNavigation: NavigationItem[] = [
  {
    name: 'ADMINISTRATION',
    icon: CogIcon,
    iconSolid: CogIconSolid,
    module: 'users',
    requiredPermission: 'read',
    isAdmin: true,
    isGroup: true
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: UserGroupIcon,
    iconSolid: UserGroupIconSolid,
    module: 'users',
    requiredPermission: 'read',
    isAdmin: true
  },
  {
    name: 'Roles',
    href: '/admin/roles',
    icon: ShieldCheckIcon,
    iconSolid: ShieldCheckIconSolid,
    module: 'roles',
    requiredPermission: 'read',
    isAdmin: true
  }
]


export default function Sidebar() {
  const pathname = usePathname()
  const { isOpen, isMobile, setOpen } = useSidebarStore()
  const { shouldShowMenuItem, highestRole, userPermissions } = useRoleBasedUI()

  // Initialize RBAC on component mount
  useEffect(() => {
    initializeRBAC()
  }, [])

  // Close sidebar when clicking on mobile backdrop
  const handleBackdropClick = () => {
    if (isMobile) {
      setOpen(false)
    }
  }

  // Handle navigation link clicks - auto-close on mobile
  const handleNavigationClick = () => {
    if (isMobile && isOpen) {
      setOpen(false)
    }
  }


  // Filter navigation items based on permissions - show all if permissions not loaded yet
  const visibleNavigation = Object.keys(userPermissions).length === 0 
    ? navigation  // Show all menus if permissions not loaded
    : navigation.filter(item => 
        shouldShowMenuItem(item.module, item.requiredPermission || 'read')
      )

  // Filter admin navigation based on permissions - show all if permissions not loaded yet
  const visibleAdminNavigation = Object.keys(userPermissions).length === 0 
    ? adminNavigation  // Show all admin menus if permissions not loaded
    : adminNavigation.filter(item =>
        shouldShowMenuItem(item.module, item.requiredPermission || 'read')
      )


  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={handleBackdropClick}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-slate-700 text-white z-30 transform transition-all duration-300 ease-in-out flex flex-col
        ${isMobile 
          ? isOpen 
            ? 'translate-x-0 w-72' 
            : '-translate-x-full w-72'
          : isOpen 
            ? 'translate-x-0 w-72'
            : 'translate-x-0 w-20'
        }
      `}>
        {/* Header - Aligned with navbar height */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-600">
          <div className={`flex items-center space-x-3 ${!isOpen && 'lg:justify-center'}`}>
            <div className="w-8 h-8 bg-equipment-600 rounded-lg flex items-center justify-center">
              <TruckIconSolid className="w-5 h-5 text-white" />
            </div>
            {isOpen && (
              <div className="animate-fade-in">
                <h1 className="text-sm font-bold">HEM System</h1>
              </div>
            )}
          </div>
          
          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-md hover:bg-slate-600 transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* Main Navigation */}
          {visibleNavigation.map((item, index) => {
            if (item.isGroup) {
              // Category separator
              return (
                <div key={item.name} className={`${index > 0 ? 'pt-4' : ''}`}>
                  {isOpen ? (
                    <div className="px-3 py-1">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {item.name}
                      </h3>
                    </div>
                  ) : (
                    <div className="h-px bg-slate-600 mx-3 my-2" />
                  )}
                </div>
              )
            } else if (item.href) {
              // Regular navigation item
              const isActive = pathname === item.href
              const Icon = isActive ? item.iconSolid : item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavigationClick}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-equipment-700 text-white'
                      : 'text-gray-300 hover:bg-slate-600 hover:text-white'
                    }
                    ${!isOpen && 'lg:justify-center'}
                  `}
                  title={!isOpen ? item.name : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isOpen ? 'mr-3' : ''}`} />
                  {isOpen && <span>{item.name}</span>}
                </Link>
              )
            }
            return null
          })}

          {/* Admin Section */}
          {visibleAdminNavigation.length > 0 && (
            <div className="pt-3">
              {visibleAdminNavigation.map((item, index) => {
                if (item.isGroup) {
                  // Admin category separator
                  return (
                    <div key={item.name} className="pt-2">
                      {isOpen ? (
                        <div className="px-3 py-1">
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {item.name}
                          </h3>
                        </div>
                      ) : (
                        <div className="h-px bg-slate-600 mx-3 my-2" />
                      )}
                    </div>
                  )
                } else if (item.href) {
                  // Admin navigation item
                  const isActive = pathname === item.href
                  const Icon = isActive ? item.iconSolid : item.icon
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleNavigationClick}
                      className={`
                        flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                        ${isActive
                          ? 'bg-equipment-700 text-white'
                          : 'text-gray-300 hover:bg-slate-600 hover:text-white'
                        }
                        ${!isOpen && 'lg:justify-center'}
                      `}
                      title={!isOpen ? item.name : undefined}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isOpen ? 'mr-3' : ''}`} />
                      {isOpen && <span>{item.name}</span>}
                    </Link>
                  )
                }
                return null
              })}
            </div>
          )}
        </nav>

        {/* User Role Information */}
        {isOpen && highestRole && (
          <div className="p-3 border-t border-slate-600">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-equipment-500 to-equipment-700 rounded-md flex items-center justify-center">
                <ShieldCheckIconSolid className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  {highestRole.name}
                </p>
              </div>
            </div>
          </div>
        )}



      </div>
    </>
  )
}