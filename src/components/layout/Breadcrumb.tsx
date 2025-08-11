'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

// Define route mappings for better UX
const routeMap: Record<string, string> = {
  '': 'Dashboard',
  'equipment': 'Equipment Fleet',
  'maintenance': 'Maintenance',
  'operators': 'Operators',
  'tracking': 'Live Tracking',
  'inventory': 'Inventory',
  'inspections': 'Inspections',
  'reports': 'Reports & Analytics',
  'settings': 'System Settings',
  'profile': 'User Profile',
  'login': 'Login',
  
  // Sub-routes for equipment
  'equipment/create': 'Add New Equipment',
  'equipment/import': 'Import Equipment',
  'equipment/[id]': 'Equipment Details',
  'equipment/[id]/edit': 'Edit Equipment',
  'equipment/[id]/maintenance': 'Maintenance History',
  'equipment/[id]/tracking': 'Tracking History',
  
  // Sub-routes for maintenance  
  'maintenance/schedule': 'Maintenance Schedule',
  'maintenance/create': 'Schedule Maintenance',
  'maintenance/[id]': 'Maintenance Details',
  'maintenance/[id]/edit': 'Edit Maintenance',
  'maintenance/history': 'Maintenance History',
  'maintenance/preventive': 'Preventive Maintenance',
  'maintenance/corrective': 'Corrective Maintenance',
  
  // Sub-routes for operators
  'operators/create': 'Add New Operator',
  'operators/[id]': 'Operator Profile',
  'operators/[id]/edit': 'Edit Operator',
  'operators/certifications': 'Certifications',
  'operators/assignments': 'Equipment Assignments',
  
  // Sub-routes for tracking
  'tracking/live': 'Live Tracking',
  'tracking/history': 'Tracking History',
  'tracking/zones': 'Geo Zones',
  'tracking/alerts': 'Location Alerts',
  
  // Sub-routes for inventory
  'inventory/parts': 'Spare Parts',
  'inventory/fuel': 'Fuel Management',
  'inventory/supplies': 'Supplies',
  'inventory/orders': 'Purchase Orders',
  'inventory/create': 'Add Item',
  'inventory/[id]': 'Item Details',
  
  // Sub-routes for inspections
  'inspections/safety': 'Safety Inspections',
  'inspections/compliance': 'Compliance Audits',
  'inspections/create': 'New Inspection',
  'inspections/[id]': 'Inspection Details',
  'inspections/schedule': 'Inspection Schedule',
  
  // Sub-routes for reports
  'reports/operational': 'Operational Reports',
  'reports/financial': 'Financial Reports',
  'reports/maintenance': 'Maintenance Reports',
  'reports/utilization': 'Equipment Utilization',
  'reports/downtime': 'Downtime Analysis',
  'reports/custom': 'Custom Reports',
}

// Helper function to get equipment/operator name from URL params (would be real data in production)
const getEntityName = (pathSegment: string, id: string): string => {
  if (pathSegment === 'equipment') {
    return `Equipment ${id.toUpperCase()}`
  }
  if (pathSegment === 'operators') {
    return `Operator ${id}`
  }
  if (pathSegment === 'maintenance') {
    return `Maintenance ${id}`
  }
  if (pathSegment === 'inspections') {
    return `Inspection ${id}`
  }
  if (pathSegment === 'inventory') {
    return `Item ${id}`
  }
  return id
}

export default function Breadcrumb() {
  const pathname = usePathname()
  
  // Skip breadcrumb for login and root pages
  if (pathname === '/login' || pathname === '/') {
    return null
  }

  const pathSegments = pathname.split('/').filter(Boolean)
  
  // Build breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/' }
  ]

  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === pathSegments.length - 1
    
    // Check if segment is an ID (starts with letter followed by dash and number, or just a UUID-like pattern)
    const isId = /^[a-zA-Z]+-\d+$/.test(segment) || /^[a-f\d-]{8,}$/.test(segment)
    
    let label: string
    
    if (isId && index > 0) {
      // Use entity name for ID segments
      const parentSegment = pathSegments[index - 1]
      label = getEntityName(parentSegment, segment)
    } else {
      // Use route map or capitalize segment
      const routeKey = pathSegments.slice(0, index + 1).join('/')
      label = routeMap[routeKey] || routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    }
    
    breadcrumbItems.push({
      label,
      href: currentPath,
      current: isLast
    })
  })

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-2" />
            )}
            
            {index === 0 ? (
              <Link 
                href={item.href}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <HomeIcon className="w-4 h-4 mr-1" />
                <span className="sr-only sm:not-sr-only">{item.label}</span>
              </Link>
            ) : item.current ? (
              <span className="text-gray-900 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {/* Context Actions - could show relevant quick actions based on current page */}
      {pathname.includes('/equipment/') && (
        <div className="mt-2 flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800">
              Operational
            </span>
            <span>•</span>
            <span>Last maintenance: 15 days ago</span>
            <span>•</span>
            <span>Next service due: 45 days</span>
          </div>
        </div>
      )}
      
      {pathname.includes('/maintenance/') && (
        <div className="mt-2 flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
              Scheduled
            </span>
            <span>•</span>
            <span>Priority: High</span>
            <span>•</span>
            <span>Est. duration: 4 hours</span>
          </div>
        </div>
      )}
      
      {pathname.includes('/operators/') && (
        <div className="mt-2 flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800">
              Active
            </span>
            <span>•</span>
            <span>Certified: Heavy Equipment</span>
            <span>•</span>
            <span>Experience: 8 years</span>
          </div>
        </div>
      )}
    </nav>
  )
}