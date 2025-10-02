'use client'

import { useState, useEffect } from 'react'

interface WellData {
  id: string
  name: string
  status: string
  location?: string
  production?: number
  pressure?: number  
  temperature?: number
  depth?: number
  wellType?: string
  formation?: string
  holeSection?: string
  operation?: string
  initialDate?: string
  actualDate?: string
  elapsedDays?: number
  elapsedHours?: number
  initialDepth?: number
  finalDepth?: number
  ropAverage?: number
  ropEffective?: number
  footage?: number
  wellConstructionRate?: number
  directionalDifficulty?: string
  maxIncl?: number
  field?: {
    name: string
    location: string
    contract: {
      name: string
    }
  }
}

interface WellSummaryProps {
  well: WellData
  contractLogo?: string
}

export function WellSummary({ well: initialWell, contractLogo }: WellSummaryProps) {
  const [well, setWell] = useState<WellData>(initialWell)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchWellDetails()
  }, [initialWell.id])

  const fetchWellDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/wells?id=${initialWell.id}`)
      if (response.ok) {
        const data = await response.json()
        const wellData = data.wells?.find((w: WellData) => w.id === initialWell.id)
        if (wellData) {
          setWell(wellData)
        }
      }
    } catch (error) {
      console.error('Error fetching well details:', error)
    } finally {
      setLoading(false)
    }
  }

  // Formatear fechas
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit', 
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  // Datos calculados o por defecto
  const summaryData = {
    initialDate: formatDate(well.initialDate),
    actualDate: formatDate(well.actualDate) || formatDate(new Date().toISOString()),
    elapsedDays: well.elapsedDays || 0,
    elapsedHours: well.elapsedHours || (well.elapsedDays ? well.elapsedDays * 24 : 0),
    initialDepth: well.initialDepth || 0,
    finalDepth: well.finalDepth || well.depth || 0,
    ropAverage: well.ropAverage || 0,
    ropEffective: well.ropEffective || (well.ropAverage ? well.ropAverage * 1.2 : 0),
    footage: well.footage || ((well.finalDepth || 0) - (well.initialDepth || 0)),
    wellConstructionRate: well.wellConstructionRate || (well.elapsedDays && well.footage ? well.footage / well.elapsedDays : 0),
    directionalDifficulty: well.directionalDifficulty || (well.wellType === 'horizontal' ? 'High' : well.wellType === 'direccional' ? 'Medium' : 'Low'),
    maxIncl: well.maxIncl || 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-blue-600">Cargando datos del pozo...</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Panel - Metrics */}
      <div className="space-y-6">
        {/* Header with Logo and Well Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-blue-900">{well.name}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {well.field?.name} - {well.location || 'Ubicación no especificada'}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  well.status === 'active' ? 'bg-green-100 text-green-800' :
                  well.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {well.status}
                </span>
                <span className="text-sm text-gray-600">{well.wellType || 'Vertical'}</span>
                <span className="text-sm text-gray-600">{well.formation || 'N/A'}</span>
              </div>
            </div>
            {contractLogo && (
              <div className="bg-yellow-400 rounded-lg p-2">
                <img 
                  src={contractLogo} 
                  alt="Contract Logo" 
                  className="h-12 w-auto"
                />
              </div>
            )}
          </div>

          <div className="text-green-500 font-medium mb-2">Resumen Técnico del Pozo</div>
        </div>

        {/* Current Status Metrics */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Estado Actual</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-900">{well.production?.toFixed(1) || '0.0'}</div>
              <div className="text-sm text-blue-700">Producción (bbl/día)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-900">{well.pressure?.toFixed(0) || '0'}</div>
              <div className="text-sm text-blue-700">Presión (psi)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-900">{well.temperature?.toFixed(0) || '0'}</div>
              <div className="text-sm text-blue-700">Temperatura (°F)</div>
            </div>
          </div>
        </div>

        {/* Date Information */}
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{summaryData.initialDate}</div>
            <div className="text-green-500 font-medium">Initial Date</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{summaryData.actualDate}</div>
            <div className="text-green-500 font-medium">Actual Date</div>
          </div>
        </div>

        {/* Elapsed Time */}
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{summaryData.elapsedDays}</div>
            <div className="text-green-500 font-medium">Elapsed Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{summaryData.elapsedHours}</div>
            <div className="text-green-500 font-medium">Elapsed Hours</div>
          </div>
        </div>

        {/* Depth Information */}
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{summaryData.initialDepth.toLocaleString()}</div>
            <div className="text-green-500 font-medium">Initial Depth (ft)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{summaryData.finalDepth.toLocaleString()}</div>
            <div className="text-green-500 font-medium">Final Depth (ft)</div>
          </div>
        </div>

        {/* ROP Information */}
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{summaryData.ropAverage}</div>
            <div className="text-green-500 font-medium">ROP Average (ft/hr)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{summaryData.ropEffective}</div>
            <div className="text-green-500 font-medium">ROP Effective (ft/hr)</div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-900">{summaryData.footage.toLocaleString()}</div>
            <div className="text-green-500 font-medium">Footage (ft)</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-900">{summaryData.wellConstructionRate.toLocaleString()}</div>
            <div className="text-green-500 font-medium">Well Construction Rate AVG (ft/day)</div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{summaryData.directionalDifficulty}</div>
              <div className="text-green-500 font-medium">Directional Difficulty Index</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{summaryData.maxIncl}</div>
              <div className="text-green-500 font-medium">Max Incl(°)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Map and Field Info */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-blue-900 text-center">Ubicación del Pozo - {well.field?.name || 'Campo'}</h3>
        
        {/* Field Information Card */}
        <div className="bg-white border rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Información del Campo</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Campo:</span>
              <span className="font-medium ml-2">{well.field?.name || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Contrato:</span>
              <span className="font-medium ml-2">{well.field?.contract?.name || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Formación:</span>
              <span className="font-medium ml-2">{well.formation || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Sección:</span>
              <span className="font-medium ml-2">{well.holeSection || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Operación:</span>
              <span className="font-medium ml-2">{well.operation || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Tipo:</span>
              <span className="font-medium ml-2">{well.wellType || 'Vertical'}</span>
            </div>
          </div>
        </div>
        
        {/* Map Placeholder */}
        <div className="bg-gradient-to-br from-green-300 to-red-300 rounded-lg h-80 flex items-center justify-center relative">
          {/* Mock Map Content */}
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div className="h-full w-full bg-gradient-to-br from-green-400 via-yellow-300 to-red-400 relative">
              {/* Mock regions based on well location */}
              <div className="absolute top-16 left-8 bg-green-500 w-20 h-16 opacity-70 rounded"></div>
              <div className="absolute top-32 right-16 bg-red-500 w-24 h-20 opacity-70 rounded"></div>
              <div className="absolute bottom-20 left-16 bg-orange-500 w-16 h-12 opacity-70 rounded"></div>
              
              {/* Well marker */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white px-3 py-1 rounded shadow-lg border">
                  <div className="text-sm font-bold">{well.name}</div>
                  <div className="text-xs text-gray-600">{well.field?.name}</div>
                </div>
                <div className={`w-3 h-3 rounded-full mx-auto mt-1 border-2 border-white shadow ${
                  well.status === 'active' ? 'bg-green-400' : 
                  well.status === 'completed' ? 'bg-blue-400' : 'bg-gray-400'
                }`}></div>
              </div>
              
              {/* Mock location labels - colombian fields */}
              <div className="absolute top-8 left-4 text-xs font-bold text-gray-700">CASANARE</div>
              <div className="absolute top-20 right-8 text-xs font-bold text-gray-700">LLANOS ORIENTALES</div>
              <div className="absolute bottom-32 left-8 text-xs font-bold text-gray-700">MAGDALENA MEDIO</div>
              <div className="absolute bottom-16 right-12 text-xs font-bold text-gray-700">PUTUMAYO</div>
            </div>
          </div>
        </div>

        {/* Map controls mockup */}
        <div className="flex justify-center space-x-2">
          <button className="p-2 bg-white border rounded shadow hover:bg-gray-50">🗺️</button>
          <button className="p-2 bg-white border rounded shadow hover:bg-gray-50">📊</button>
          <button className="p-2 bg-white border rounded shadow hover:bg-gray-50">📍</button>
          <button className="p-2 bg-white border rounded shadow hover:bg-gray-50">🔍</button>
        </div>
      </div>
    </div>
  )
}