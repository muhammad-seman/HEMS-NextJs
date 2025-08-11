'use client'

import { useSidebarStore } from '@/store/sidebar-store'

export default function TestSidebar() {
  const { isOpen, isMobile, toggle, setOpen } = useSidebarStore()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sidebar Toggle Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Current State</h2>
          <ul className="space-y-1">
            <li>Sidebar Open: <span className={isOpen ? 'text-green-600' : 'text-red-600'}>{isOpen ? 'Yes' : 'No'}</span></li>
            <li>Mobile Mode: <span className={isMobile ? 'text-blue-600' : 'text-gray-600'}>{isMobile ? 'Yes' : 'No'}</span></li>
          </ul>
        </div>

        <div className="space-x-2">
          <button 
            onClick={toggle}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Toggle Sidebar
          </button>
          
          <button 
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Open Sidebar
          </button>
          
          <button 
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Close Sidebar
          </button>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800">Test Instructions:</h3>
          <ol className="list-decimal list-inside text-sm text-yellow-700 mt-2 space-y-1">
            <li>Try the hamburger button in the header</li>
            <li>Try the collapse/expand button at the bottom of the sidebar (desktop only)</li>
            <li>Resize the browser window to test mobile/desktop breakpoints</li>
            <li>Check that content area adjusts properly when sidebar toggles</li>
            <li>Verify mobile overlay works correctly</li>
          </ol>
        </div>
      </div>
    </div>
  )
}