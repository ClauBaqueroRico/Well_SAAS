'use client'

import { useState, useEffect } from 'react'

interface Contract {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  value: number
  currency: string
  status: string
  client: {
    id: string
    name: string
    email?: string
  }
  _count?: {
    fields: number
  }
  fields?: Array<{
    id: string
    name: string
    wells: Array<{ id: string }>
  }>
}

export function ContractsList() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/contracts')
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setContracts(data.contracts || [])
    } catch (error) {
      console.error('Error fetching contracts:', error)
      setError('Error al cargar los contratos. Por favor, intente de nuevo.')
      setContracts([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Activo'
      case 'completed':
        return 'Completado'
      case 'cancelled':
        return 'Cancelado'
      case 'suspended':
        return 'Suspendido'
      default:
        return status
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  const getTotalWells = (contract: Contract) => {
    if (contract.fields) {
      return contract.fields.reduce((total, field) => total + (field.wells?.length || 0), 0)
    }
    return 0
  }

  if (loading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Contratos
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Cargando contratos...
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Contratos
          </h3>
        </div>
        <div className="p-6 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={fetchContracts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (contracts.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Contratos
          </h3>
        </div>
        <div className="p-6 text-center">
          <div className="text-gray-500 mb-4">No hay contratos disponibles</div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Crear Primer Contrato
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Contratos Activos
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Lista de todos los contratos y su información general
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          Nuevo Contrato
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
        {contracts.map((contract) => (
          <div key={contract.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-900 truncate">
                {contract.name}
              </h4>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(contract.status)}`}>
                {getStatusText(contract.status)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-20">Cliente:</span>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {contract.client.name}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-20">Valor:</span>
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(contract.value, contract.currency)}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-20">Período:</span>
                <span className="text-sm text-gray-900">
                  {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center bg-blue-50 rounded-lg p-2">
                  <div className="text-lg font-semibold text-blue-600">
                    {contract._count?.fields || contract.fields?.length || 0}
                  </div>
                  <div className="text-xs text-blue-600">Campos</div>
                </div>
                <div className="text-center bg-green-50 rounded-lg p-2">
                  <div className="text-lg font-semibold text-green-600">
                    {getTotalWells(contract)}
                  </div>
                  <div className="text-xs text-green-600">Pozos</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-md text-xs font-medium">
                  Ver Detalles
                </button>
                <button className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-xs font-medium">
                  Generar Reporte
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {contracts.length} contratos activos
          </p>
          <div className="flex space-x-2">
            <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium">
              Exportar Lista
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium">
              Ver Todos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}