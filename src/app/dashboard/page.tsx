'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navigation } from '@/components/layout/navigation'
import { 
  DashboardCards,
  WellsOverview,
  ProductionChart,
  WellSummary,
  TimePerformance,
  DailyActivities,
  PerformanceProgress,
  GlobalFilters
} from '@/components/dashboard'
import { Tabs } from '@/components/ui/tabs'
import { DashboardFilterProvider } from '@/components/providers/dashboard-filter-provider'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedWell, setSelectedWell] = useState<any>(null)
  const [wells, setWells] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchData()
    }
  }, [status, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [wellsResponse, contractsResponse] = await Promise.all([
        fetch('/api/wells'),
        fetch('/api/contracts')
      ])

      if (wellsResponse.ok && contractsResponse.ok) {
        const wellsData = await wellsResponse.json()
        const contractsData = await contractsResponse.json()
        
        // Las APIs devuelven arrays directos, no objetos envueltos 
        setWells(Array.isArray(wellsData) ? wellsData : wellsData.wells || [])
        setContracts(Array.isArray(contractsData) ? contractsData : contractsData.contracts || [])
        
        // Seleccionar el primer pozo como predeterminado
        const wellsArray = Array.isArray(wellsData) ? wellsData : wellsData.wells || []
        if (wellsArray && wellsArray.length > 0) {
          setSelectedWell(wellsArray[0])
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Función separada para manejar cambios de filtros sin refetch general
  const handleFilterChange = () => {
    // Los componentes individuales manejan sus propios refetch
    console.log('Filtros cambiados - los componentes se actualizarán individualmente')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-lg text-gray-600">Cargando dashboard...</div>
            <div className="text-sm text-gray-500 mt-2">
              {status === 'loading' ? 'Verificando autenticación...' : 'Cargando datos...'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="text-lg text-gray-600">Acceso no autorizado</div>
            <div className="text-sm text-gray-500 mt-2">Redirigiendo al login...</div>
          </div>
        </div>
      </div>
    )
  }

  // Obtener clientes únicos de los contratos
  const uniqueClients = Array.from(new Set(contracts.map(contract => contract.client?.name).filter(Boolean)))

  // Filtrar pozos por cliente seleccionado
  const getWellsByClient = (clientName: string) => {
    return wells.filter(well => well.field?.contract?.client?.name === clientName)
  }

  // Configuración de las pestañas del dashboard
  const dashboardTabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black">
              Dashboard de Well Wizards
            </h1>
            <p className="mt-2 text-black">
              Bienvenido, {session.user?.name || 'Usuario'} - Resumen general de pozos y producción
            </p>
          </div>

          <DashboardCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <WellsOverview />
            <ProductionChart />
          </div>
        </div>
      ),
    },
    {
      id: 'well-summary',
      label: 'Well Summary',
      content: (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-black">Well Summary</h1>
            {wells.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-2">
                <select 
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-black bg-white"
                  value={selectedWell?.field?.contract?.client?.name || ''}
                  onChange={(e) => {
                    const clientWells = getWellsByClient(e.target.value)
                    if (clientWells.length > 0) {
                      setSelectedWell(clientWells[0])
                    }
                  }}
                >
                  <option value="" disabled>Seleccionar Cliente</option>
                  {uniqueClients.map((client: string) => (
                    <option key={client} value={client} className="text-black bg-white">
                      {client}
                    </option>
                  ))}
                </select>
                <select 
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-black bg-white"
                  value={selectedWell?.id || ''}
                  onChange={(e) => {
                    const well = wells.find(w => w.id === e.target.value)
                    if (well) setSelectedWell(well)
                  }}
                >
                  <option value="" disabled>Seleccionar Pozo</option>
                  {wells.map((well: any) => (
                    <option key={well.id} value={well.id} className="text-black bg-white">
                      {well.name} - {well.field?.name || 'Sin campo'}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          {selectedWell ? (
            <WellSummary 
              well={selectedWell} 
              contractLogo={selectedWell.field?.contract?.logo || undefined}
            />
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <div className="text-gray-500">
                <div className="text-lg mb-2">Selecciona un pozo para ver su resumen</div>
                <div className="text-sm">Pozos disponibles: {wells.length}</div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'time-performance',
      label: 'Time Performance',
      content: (
        <div className="space-y-4">
          {selectedWell ? (
            <TimePerformance 
              well={selectedWell} 
              contractLogo={selectedWell.field?.contract?.logo || undefined}
            />
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <div className="text-gray-500">
                <div className="text-lg mb-2">Selecciona un pozo para ver su performance temporal</div>
                <div className="text-sm">Ve al tab &quot;Well Summary&quot; para seleccionar un pozo</div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'daily-activities',
      label: 'Daily Activities',
      content: (
        <div className="space-y-4">
          <DailyActivities />
        </div>
      ),
    },
    {
      id: 'performance-progress',
      label: 'Performance & Progress',
      content: (
        <div className="space-y-4">
          <PerformanceProgress />
        </div>
      ),
    },
    {
      id: 'production',
      label: 'Production Data',
      content: (
        <div className="space-y-8">
          <h1 className="text-2xl font-bold text-black">Production Analytics</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProductionChart />
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Production Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pozos Activos</span>
                  <span className="font-bold">{wells.filter(w => w.status === 'active').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Pozos</span>
                  <span className="font-bold">{wells.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Contratos</span>
                  <span className="font-bold">{contracts.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'wells',
      label: 'Wells Management',
      content: (
        <div className="space-y-8">
          <h1 className="text-2xl font-bold text-black">Wells Management</h1>
          <WellsOverview />
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Well Status Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {wells.filter(w => w.status === 'active').length}
                </div>
                <div className="text-sm text-black">Active Wells</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {wells.filter(w => w.status === 'maintenance').length}
                </div>
                <div className="text-sm text-black">Under Maintenance</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {wells.filter(w => w.status === 'inactive').length}
                </div>
                <div className="text-sm text-black">Inactive</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <DashboardFilterProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <GlobalFilters onFiltersChange={handleFilterChange} />
            <Tabs tabs={dashboardTabs} defaultTab="overview" />
          </div>
        </div>
      </div>
    </DashboardFilterProvider>
  )
}