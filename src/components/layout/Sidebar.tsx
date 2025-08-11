'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebarStore } from '@/store/sidebar-store'
import { useRBACStore, initializeRBAC } from '@/store/rbac-store'
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
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  iconSolid: React.ComponentType<React.SVGProps<SVGSVGElement>>
  description: string
  module: Module
  requiredPermission?: 'create' | 'read' | 'update' | 'delete' | 'manage'
  badge?: string
  isAdmin?: boolean
  children?: NavigationItem[]
}

const navigation: NavigationItem[] = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: HomeIcon, 
    iconSolid: HomeIconSolid,
    description: 'Overview & Analytics',
    module: 'dashboard',
    requiredPermission: 'read'
  },
  { 
    name: 'Equipment', 
    href: '/equipment', 
    icon: TruckIcon, 
    iconSolid: TruckIconSolid,
    description: 'Fleet Management',
    module: 'equipment',
    requiredPermission: 'read'
  },
  { 
    name: 'Maintenance', 
    href: '/maintenance', 
    icon: WrenchIcon, 
    iconSolid: WrenchIconSolid,
    description: 'Service & Repairs',
    module: 'maintenance',
    requiredPermission: 'read',
    badge: '3' // Pending maintenance
  },
  { 
    name: 'Operators', 
    href: '/operators', 
    icon: UserGroupIcon, 
    iconSolid: UserGroupIconSolid,
    description: 'Staff Management',
    module: 'operators',
    requiredPermission: 'read'
  },
  { 
    name: 'Tracking', 
    href: '/tracking', 
    icon: MapPinIcon, 
    iconSolid: MapPinIconSolid,
    description: 'Live Location & Status',
    module: 'tracking',
    requiredPermission: 'read'
  },
  { 
    name: 'Inventory', 
    href: '/inventory', 
    icon: CubeIcon, 
    iconSolid: CubeIconSolid,
    description: 'Parts & Supplies',
    module: 'inventory',
    requiredPermission: 'read'
  },
  { 
    name: 'Inspections', 
    href: '/inspections', 
    icon: ClipboardDocumentListIcon, 
    iconSolid: ClipboardDocumentListIconSolid,
    description: 'Safety & Compliance',
    module: 'inspections',
    requiredPermission: 'read'
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: ChartBarIcon, 
    iconSolid: ChartBarIconSolid,
    description: 'Analytics & Insights',
    module: 'reports',
    requiredPermission: 'read'
  },
]

// Admin navigation items
const adminNavigation: NavigationItem[] = [
  {
    name: 'Role Management',
    href: '/admin/roles',
    icon: ShieldCheckIcon,
    iconSolid: ShieldCheckIconSolid,
    description: 'Manage user roles',
    module: 'roles',
    requiredPermission: 'read',
    isAdmin: true
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: UserGroupIcon,
    iconSolid: UserGroupIconSolid,
    description: 'Manage user accounts',
    module: 'users',
    requiredPermission: 'read',
    isAdmin: true
  },
]


export default function Sidebar() {
  const pathname = usePathname()
  const { isOpen, isMobile, toggle, setOpen } = useSidebarStore()
  const { shouldShowMenuItem, highestRole } = useRoleBasedUI()

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

  // Filter navigation items based on permissions
  const visibleNavigation = navigation.filter(item => 
    shouldShowMenuItem(item.module, item.requiredPermission || 'read')
  )

  // Filter admin navigation based on permissions
  const visibleAdminNavigation = adminNavigation.filter(item =>
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
        fixed top-0 left-0 h-screen bg-slate-800 text-white z-30 transform transition-all duration-300 ease-in-out flex flex-col
        ${isMobile 
          ? isOpen 
            ? 'translate-x-0 w-88' 
            : '-translate-x-full w-88'
          : isOpen 
            ? 'translate-x-0 w-88'
            : 'translate-x-0 w-20'
        }
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className={`flex items-center space-x-3 ${!isOpen && 'lg:justify-center'}`}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <TruckIconSolid className="w-6 h-6 text-white" />
            </div>
            {isOpen && (
              <div className="animate-fade-in">
                <h1 className="text-lg font-bold">HEM System</h1>
                <p className="text-xs text-gray-300">Heavy Equipment</p>
              </div>
            )}
          </div>
          
          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-md hover:bg-slate-700 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* Main Navigation */}
          {visibleNavigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = isActive ? item.iconSolid : item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavigationClick}
                className={`
                  flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }
                  ${!isOpen && 'lg:justify-center lg:px-2'}
                `}
                title={!isOpen ? item.name : undefined}
              >
                <div className="relative flex items-center">
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isOpen ? 'mr-3' : ''}`} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                  )}
                </div>
                
                {isOpen && (
                  <div className="flex-1 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                )}
              </Link>
            )
          })}

          {/* Admin Section */}
          {visibleAdminNavigation.length > 0 && (
            <>
              {isOpen && (
                <div className="pt-4 pb-2">
                  <div className="flex items-center px-3 py-2">
                    <div className="h-px flex-1 bg-slate-600"></div>
                    <span className="px-3 text-xs text-gray-400 font-medium">ADMINISTRATION</span>
                    <div className="h-px flex-1 bg-slate-600"></div>
                  </div>
                </div>
              )}

              {visibleAdminNavigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = isActive ? item.iconSolid : item.icon
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleNavigationClick}
                    className={`
                      flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                      }
                      ${!isOpen && 'lg:justify-center lg:px-2'}
                    `}
                    title={!isOpen ? item.name : undefined}
                  >
                    <div className="relative flex items-center">
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isOpen ? 'mr-3' : ''}`} />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                      )}
                    </div>
                    
                    {isOpen && (
                      <div className="flex-1 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                      </div>
                    )}
                  </Link>
                )
              })}
            </>
          )}
        </nav>

        {/* User Role Information */}
        {isOpen && highestRole && (
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ShieldCheckIconSolid className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {highestRole.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  Level {highestRole.hierarchy}
                </p>
              </div>
            </div>
          </div>
        )}



      </div>
    </>
  )
}