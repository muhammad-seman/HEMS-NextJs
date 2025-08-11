
export default function Footer() {
  // Use static values to prevent hydration mismatch
  const currentYear = 2024

  return (
    <footer className="bg-industrial-800 text-gray-300">

      {/* Bottom Bar */}
      <div className="border-t border-industrial-700 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>© {currentYear} Heavy Equipment Management System</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">All rights reserved</span>
          </div>
          
          <div className="mt-2 md:mt-0 flex items-center space-x-4 text-xs text-gray-500">
            <span>Built for industrial operations</span>
            <span>•</span>
            <span>Powered by Next.js</span>
            <span>•</span>
            <span className="hidden sm:inline">Server: US-East-1</span>
          </div>
        </div>
      </div>
    </footer>
  )
}