'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSidebarStore } from '@/store/sidebar-store'
import Sidebar from './Sidebar'
import Header from './Header'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const { isOpen, isMobile, setMobile } = useSidebarStore()

  // Routes that should not show the main layout (sidebar, header, etc.)
  const publicRoutes = ['/login', '/forgot-password', '/register']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024 // lg breakpoint
      setMobile(mobile)
    }

    // Set initial state
    handleResize()
    
    // Listen for resize events
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setMobile])

  // For public routes (like login), render without layout
  if (isPublicRoute) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
        isMobile 
          ? 'ml-0' // No margin on mobile - sidebar overlays
          : isOpen 
            ? 'ml-88' // Full sidebar width on desktop when open
            : 'ml-20'  // Collapsed sidebar width on desktop
      }`}>
        {/* Header */}
        <Header />
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb />
        
        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}