import { Navigation } from '@/components/layout/navigation'
import { WellsList } from '@/components/wells/wells-list'

export default function WellsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Pozos
            </h1>
            <p className="mt-2 text-gray-600">
              Administra y monitorea todos los pozos de Well Wizards
            </p>
          </div>

          <WellsList />
        </div>
      </div>
    </div>
  )
}