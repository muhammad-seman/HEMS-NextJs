'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  TruckIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  LockClosedIcon,
  EnvelopeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo purposes, accept any email/password
      if (formData.email && formData.password) {
        router.push('/')
      } else {
        setError('Please enter your email and password')
      }
    } catch {
      setError('Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-industrial-900 via-industrial-800 to-sidebar">
      <div className="flex min-h-screen">
        {/* Left Side - Branding & Information */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-primary-800/90" />
          <div className="absolute inset-0 bg-[url('/api/placeholder/800/600')] bg-cover bg-center opacity-20" />
          
          <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <TruckIcon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">HEM System</h1>
                  <p className="text-primary-200">Heavy Equipment Management</p>
                </div>
              </div>
              
              <h2 className="text-4xl font-bold mb-6">
                Manage Your Fleet with Confidence
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Comprehensive solution for tracking, maintaining, and optimizing your heavy equipment operations.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <ShieldCheckIcon className="w-6 h-6 text-primary-200 mt-1" />
                <div>
                  <h3 className="font-semibold text-primary-100">Enterprise Security</h3>
                  <p className="text-primary-200 text-sm">Bank-level encryption and compliance with industry standards</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <TruckIcon className="w-6 h-6 text-primary-200 mt-1" />
                <div>
                  <h3 className="font-semibold text-primary-100">Real-time Tracking</h3>
                  <p className="text-primary-200 text-sm">Live location and status monitoring for your entire fleet</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <LockClosedIcon className="w-6 h-6 text-primary-200 mt-1" />
                <div>
                  <h3 className="font-semibold text-primary-100">Secure Access</h3>
                  <p className="text-primary-200 text-sm">Role-based permissions and audit trails for all operations</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-primary-700/50">
              <p className="text-sm text-primary-200">
                Trusted by 500+ construction and mining companies worldwide
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden mb-8 text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                  <TruckIcon className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-xl font-bold text-white">HEM System</h1>
                  <p className="text-sm text-gray-400">Heavy Equipment Management</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-300">Sign in to access your equipment dashboard</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-danger-500/20 border border-danger-500/50 rounded-lg flex items-center space-x-3">
                  <ExclamationCircleIcon className="w-5 h-5 text-danger-400" />
                  <p className="text-danger-200 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm"
                      placeholder="your.email@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 bg-white/10 border-white/20 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-center text-sm text-gray-300">
                  Need access to the system?{' '}
                  <Link href="/contact" className="text-primary-400 hover:text-primary-300 font-medium">
                    Contact Administrator
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-8 text-center text-xs text-gray-400">
              <p>© 2024 Heavy Equipment Management System</p>
              <p className="mt-1">Secure • Compliant • Trusted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}