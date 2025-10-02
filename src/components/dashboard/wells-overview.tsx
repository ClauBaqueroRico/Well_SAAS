'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboardFilter } from '../providers/dashboard-filter-provider'

interface Well {
  id: string
  name: string
  status: string
  production?: number
  location?: string
  field?: {
    name: string
    contract: {
      name: string
      client: {
        name: string
      }
    }
  }
}

export function WellsOverview() {
  const [wells, setWells] = useState<Well[]>([])
  const [totalWells, setTotalWells] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // Obtener filtros directamente (siempre debe estar disponible en el dashboard)
  const { selectedContract } = useDashboardFilter()

  const fetchWells = useCallback(async () => {
    try {
      setLoading(true)
      const url = selectedContract 
        ? `/api/wells?contractId=${selectedContract}`
        : '/api/wells'
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        const allWells = Array.isArray(data) ? data : data.wells || []
        setTotalWells(allWells.length)
        // Mostrar solo los primeros 5 pozos para el overview
        setWells(allWells.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching wells:', error)
      setWells([])
      setTotalWells(0)
    } finally {
      setLoading(false)
    }
  }, [selectedContract])

  useEffect(() => {
    fetchWells()
  }, [fetchWells])

  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
        <div className="px-4 py-5 sm:p-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Resumen de Pozos por Cliente
        </h3>
        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {wells.map((well) => (
              <li key={well.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {well.id.slice(-1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {well.name}
                      </p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          well.status === 'Activo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {well.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="font-medium">🏢 Cliente:</span>
                        <span className="ml-1 text-blue-600">
                          {well.field?.contract?.client?.name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="font-medium">📋 Contrato:</span>
                        <span className="ml-1">
                          {well.field?.contract?.name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="font-medium">🏭 Campo:</span>
                        <span className="ml-1">
                          {well.field?.name || well.location || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {well.production ? `${well.production.toFixed(1)} bbls/d` : '0.0 bbls/d'}
                    </p>
                    <p className="text-xs text-gray-500">
                      ID: {well.id.slice(-8)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <button 
            onClick={() => router.push('/wells')}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Ver Todos los Pozos {totalWells > 5 ? `(+${totalWells - 5} más)` : `(${totalWells} total)`}
          </button>
        </div>
      </div>
    </div>
  )
}