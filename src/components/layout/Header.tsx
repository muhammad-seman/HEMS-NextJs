'use client'

import { useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { 
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { useSidebarStore } from '@/store/sidebar-store'


const notifications = [
  { id: 1, type: 'maintenance', message: 'Excavator EX-001 maintenance due', time: '10 min ago', urgent: true },
  { id: 2, type: 'alert', message: 'Fuel level low on Bulldozer BD-003', time: '1 hour ago', urgent: false },
  { id: 3, type: 'inspection', message: 'Safety inspection completed for Crane CR-002', time: '2 hours ago', urgent: false },
]

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const { toggle, isOpen } = useSidebarStore()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle Button - Always visible */}
          <button
            onClick={toggle}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search equipment, operators, or reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-96 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search Button */}
          <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 md:hidden">
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>

          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 relative">
              <BellIcon className="w-6 h-6" />
              {notifications.some(n => n.urgent) && (
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
              )}
            </Menu.Button>
            
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="py-2 max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <Menu.Item key={notification.id}>
                      <div className="px-4 py-3 hover:bg-gray-50 border-l-4 border-transparent hover:border-blue-500">
                        <div className="flex items-start space-x-3">
                          <div className={`mt-1 w-2 h-2 rounded-full ${
                            notification.urgent ? 'bg-orange-500' : 'bg-gray-300'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    </Menu.Item>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                    View all notifications
                  </button>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* User Profile Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <UserCircleIcon className="w-8 h-8" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
                <p className="text-xs text-gray-500">Site Manager</p>
              </div>
              <ChevronDownIcon className="w-4 h-4 hidden md:block" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">john.doe@company.com</p>
                  <p className="text-xs text-gray-500">Site Manager</p>
                </div>
                
                <div className="py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/profile"
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <UserCircleIcon className="w-5 h-5 mr-3" />
                        Your Profile
                      </a>
                    )}
                  </Menu.Item>
                  
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/settings"
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <Cog6ToothIcon className="w-5 h-5 mr-3" />
                        Settings
                      </a>
                    )}
                  </Menu.Item>
                </div>
                
                <div className="py-2 border-t border-gray-100">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  )
}