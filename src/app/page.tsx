import Link from "next/link"

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Heavy Equipment Management System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Efficiently manage your heavy equipment fleet
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/equipment"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Equipment</h3>
          <p className="text-gray-600">
            Manage your equipment inventory, specifications, and status
          </p>
        </Link>

        <Link
          href="/maintenance"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Maintenance</h3>
          <p className="text-gray-600">
            Schedule and track maintenance activities and repairs
          </p>
        </Link>

        <Link
          href="/operators"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Operators</h3>
          <p className="text-gray-600">
            Manage operator certifications and equipment assignments
          </p>
        </Link>

        <Link
          href="/reports"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports</h3>
          <p className="text-gray-600">
            Generate reports and analytics for your fleet
          </p>
        </Link>
      </div>
    </div>
  )
}
