'use client'

import { useState, useEffect } from 'react'
import { useDashboardFilter } from '../providers/dashboard-filter-provider'

interface Contract {
  id: string
  name: string
  status: string
  client: {
    name: string
  }
}

interface GlobalFiltersProps {
  onFiltersChange?: () => void
}

export function GlobalFilters({ onFiltersChange }: GlobalFiltersProps) {
  const { 
    selectedContract, 
    setSelectedContract, 
    selectedClient, 
    setSelectedClient, 
    timeframe, 
    setTimeframe 
  } = useDashboardFilter()
  
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContracts()
  }, [])

  // Usar un debounce para evitar llamadas excesivas
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onFiltersChange) {
        onFiltersChange()
      }
    }, 300) // 300ms delay
    
    return () => clearTimeout(timeoutId)
  }, [selectedContract, selectedClient, timeframe, onFiltersChange])

  const fetchContracts = async () => {
    try {
      const response = await fetch('/api/contracts')
      if (response.ok) {
        const data = await response.json()
        setContracts(Array.isArray(data) ? data : data.contracts || [])
      }
    } catch (error) {
      console.error('Error fetching contracts:', error)
      setContracts([])
    } finally {
      setLoading(false)
    }
  }

  const uniqueClients = Array.from(
    new Set(contracts.map(contract => contract.client?.name).filter(Boolean))
  )

  const filteredContracts = selectedClient 
    ? contracts.filter(contract => contract.client?.name === selectedClient)
    : contracts

  const handleClientChange = (clientName: string) => {
    setSelectedClient(clientName)
    // Reset contract selection when client changes
    setSelectedContract('')
  }

  const handleContractChange = (contractId: string) => {
    setSelectedContract(contractId)
    // Automatically set client based on selected contract
    if (contractId) {
      const contract = contracts.find(c => c.id === contractId)
      if (contract && contract.client) {
        setSelectedClient(contract.client.name)
      }
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtros Globales</h3>
        <button
          onClick={() => {
            setSelectedClient('')
            setSelectedContract('')
            setTimeframe('30')
          }}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Limpiar Filtros
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filtro por Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cliente
          </label>
          <select
            value={selectedClient}
            onChange={(e) => handleClientChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los clientes</option>
            {uniqueClients.map(client => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Contrato */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contrato
          </label>
          <select
            value={selectedContract}
            onChange={(e) => handleContractChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los contratos</option>
            {filteredContracts.map(contract => (
              <option key={contract.id} value={contract.id}>
                {contract.name} ({contract.status})
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Período de Tiempo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Período
          </label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
            <option value="180">Últimos 6 meses</option>
            <option value="365">Último año</option>
            <option value="all">Todo el período</option>
          </select>
        </div>

        {/* Información del Filtro Activo */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Filtros activos</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {selectedClient && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {selectedClient}
                </span>
              )}
              {selectedContract && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Contrato
                </span>
              )}
              {timeframe !== '30' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  {timeframe === 'all' ? 'Todo' : `${timeframe}d`}
                </span>
              )}
              {!selectedClient && !selectedContract && timeframe === '30' && (
                <span className="text-xs text-gray-400">Sin filtros</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}