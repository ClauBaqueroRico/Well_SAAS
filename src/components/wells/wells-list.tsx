'use client'

import { useState, useEffect } from 'react'

interface Well {
  id: string
  name: string
  location?: string
  status: string
  production?: number
  pressure?: number
  temperature?: number
  lastMaintenance?: string
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

export function WellsList() {
  const [wells, setWells] = useState<Well[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWells()
  }, [])

  const fetchWells = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/wells')
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setWells(data.wells || [])
    } catch (error) {
      console.error('Error fetching wells:', error)
      setError('Error al cargar los pozos. Por favor, intente de nuevo.')
      setWells([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('es-ES')
    } catch {
      return 'N/A'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'activo':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
      case 'mantenimiento':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
      case 'inactivo':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Activo'
      case 'maintenance':
        return 'Mantenimiento'
      case 'inactive':
        return 'Inactivo'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Lista de Pozos
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Cargando información de pozos...
          </p>
        </div>
        <div className="px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Lista de Pozos
          </h3>
        </div>
        <div className="px-4 py-8 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={fetchWells}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (wells.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Lista de Pozos
          </h3>
        </div>
        <div className="px-4 py-8 text-center">
          <div className="text-gray-500 mb-4">No hay pozos disponibles</div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Agregar Primer Pozo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Lista de Pozos
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Información detallada de {wells.length} pozos en el sistema
        </p>
      </div>

      <ul className="divide-y divide-gray-200">
        {wells.map((well) => (
          <li key={well.id} className="px-4 py-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {well.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        {well.name}
                      </p>
                      <span
                        className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(well.status)}`}
                      >
                        {getStatusText(well.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {well.field?.name || well.location || 'Sin ubicación'} • Cliente: {well.field?.contract?.client?.name || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-400">
                      ID: {well.id.slice(-8)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-6 text-right">
                <div>
                  <p className="text-xs text-gray-500">Producción</p>
                  <p className="text-sm font-medium text-gray-900">
                    {well.production ? `${well.production.toFixed(1)} bbls/d` : '0.0 bbls/d'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Presión</p>
                  <p className="text-sm font-medium text-gray-900">
                    {well.pressure ? `${well.pressure.toFixed(0)} psi` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Temperatura</p>
                  <p className="text-sm font-medium text-gray-900">
                    {well.temperature ? `${well.temperature.toFixed(0)}°F` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Últ. Mantenim.</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(well.lastMaintenance)}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center sm:px-6">
        <div className="text-sm text-gray-700">
          Mostrando {wells.length} pozos
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Actualizar Lista
        </button>
      </div>
    </div>
  )
}