'use client'

import { useState, useEffect } from 'react'

interface Well {
  id: string
  name: string
  field?: {
    name: string
    contract: {
      name: string
      targetDepth?: number
      expectedDays?: number
    }
  }
  initialDate?: string
  actualDate?: string
  elapsedDays?: number
  finalDepth?: number
  ropAverage?: number
  wellConstructionRate?: number
  status: string
}

interface DrillingProgress {
  wellId: string
  wellName: string
  contractName: string
  day: number
  actualDepth: number
  plannedDepth: number
  rop: number
  efficiency: number
  status: string
  contractActivity: string
  crew: string
  shift: string
  date: string
}

interface ContractActivity {
  id: string
  name: string
  category: string
  targetValue: number
  unit: string
  optimalRate?: number
  contractName: string
  contractType: string
}

export default function PerformanceProgress() {
  const [wells, setWells] = useState<Well[]>([])
  const [selectedWells, setSelectedWells] = useState<string[]>([])
  const [selectedContract, setSelectedContract] = useState<string>('')
  const [drillingProgress, setDrillingProgress] = useState<DrillingProgress[]>([])
  const [contractActivities, setContractActivities] = useState<ContractActivity[]>([])
  const [timeframe, setTimeframe] = useState('30') // días
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Fetch wells data
      const wellsResponse = await fetch('/api/wells')
      const wellsData = await wellsResponse.json()
      setWells(wellsData)

      // Fetch drilling progress data
      const progressResponse = await fetch('/api/drilling-progress')
      const progressData = await progressResponse.json()
      setDrillingProgress(progressData)

      // Fetch contract activities
      const activitiesResponse = await fetch('/api/contract-activities')
      const activitiesData = await activitiesResponse.json()
      setContractActivities(activitiesData)

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWellSelection = (wellId: string) => {
    setSelectedWells(prev => {
      if (prev.includes(wellId)) {
        return prev.filter(id => id !== wellId)
      } else {
        return [...prev, wellId]
      }
    })
  }

  // Filtrar pozos por contrato seleccionado
  const filteredWells = selectedContract
    ? wells.filter(well => well.field?.contract.name === selectedContract)
    : wells

  // Datos para el gráfico de progreso de perforación
  const progressChartData = drillingProgress
    .filter(p => selectedWells.length === 0 || selectedWells.includes(p.wellId))
    .map(p => ({
      day: p.day,
      wellName: p.wellName,
      actualDepth: p.actualDepth,
      plannedDepth: p.plannedDepth,
      efficiency: p.efficiency
    }))

  // Datos para comparación de ROP
  const ropComparisonData = filteredWells
    .filter(well => selectedWells.length === 0 || selectedWells.includes(well.id))
    .map(well => ({
      name: well.name,
      ropAverage: well.ropAverage || 0,
      wcr: well.wellConstructionRate || 0,
      targetDepth: well.field?.contract.targetDepth || 0,
      actualDepth: well.finalDepth || 0
    }))

  // Datos para el gráfico de eficiencia por actividad
  const activityEfficiencyData = contractActivities.map(activity => {
    const wellsForActivity = drillingProgress.filter(p => 
      selectedWells.length === 0 || selectedWells.includes(p.wellId)
    )
    const avgEfficiency = wellsForActivity.length > 0
      ? wellsForActivity.reduce((sum, p) => sum + p.efficiency, 0) / wellsForActivity.length
      : 0

    return {
      name: activity.name,
      efficiency: avgEfficiency,
      target: activity.targetValue,
      optimal: activity.optimalRate || 100
    }
  })

  // Datos para el gráfico de distribución de tiempo
  const timeDistributionData = [
    { name: 'Perforación', value: 45, color: '#3B82F6' },
    { name: 'Conexiones', value: 20, color: '#10B981' },
    { name: 'Mantenimiento', value: 15, color: '#F59E0B' },
    { name: 'Esperas', value: 10, color: '#EF4444' },
    { name: 'Otros', value: 10, color: '#8B5CF6' }
  ]

  const uniqueContracts = Array.from(
    new Set(wells.map(well => well.field?.contract.name).filter(Boolean))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-black">
      {/* Controles de filtrado */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Performance & Progress - Análisis Comparativo de Pozos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Selector de contrato */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Filtrar por Contrato
            </label>
            <select
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
              className="w-full p-2 border rounded-md text-black bg-white"
            >
              <option value="">Todos los contratos</option>
              {uniqueContracts.map(contract => (
                <option key={contract} value={contract}>{contract}</option>
              ))}
            </select>
          </div>

          {/* Selector de período */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Período de Análisis
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full p-2 border rounded-md text-black bg-white"
            >
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
              <option value="all">Todo el período</option>
            </select>
          </div>

          {/* Botón de actualizar */}
          <div className="flex items-end">
            <button
              onClick={fetchData}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Actualizar Datos
            </button>
          </div>
        </div>

        {/* Selección de pozos */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Seleccionar Pozos para Comparar
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {filteredWells.map(well => (
              <label key={well.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedWells.includes(well.id)}
                  onChange={() => handleWellSelection(well.id)}
                  className="rounded"
                />
                <span className="text-sm text-black">{well.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium text-black mb-2">ROP Promedio</h3>
          <p className="text-2xl font-bold text-blue-600">
            {(ropComparisonData.reduce((sum, w) => sum + w.ropAverage, 0) / ropComparisonData.length || 0).toFixed(1)} m/h
          </p>
          <p className="text-sm text-gray-600">Última semana</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium text-black mb-2">Eficiencia Promedio</h3>
          <p className="text-2xl font-bold text-green-600">
            {(activityEfficiencyData.reduce((sum, a) => sum + a.efficiency, 0) / activityEfficiencyData.length || 0).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">Todas las actividades</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium text-black mb-2">Pozos Activos</h3>
          <p className="text-2xl font-bold text-orange-600">
            {wells.filter(w => w.status === 'active').length}
          </p>
          <p className="text-sm text-gray-600">En perforación</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium text-black mb-2">Profundidad Total</h3>
          <p className="text-2xl font-bold text-purple-600">
            {ropComparisonData.reduce((sum, w) => sum + w.actualDepth, 0).toFixed(0)} m
          </p>
          <p className="text-sm text-gray-600">Acumulada</p>
        </div>
      </div>

      {/* Gráficos principales - Versión Simplificada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progreso vs Plan */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-black">
            Progreso de Perforación vs Plan
          </h3>
          <div className="space-y-4">
            {progressChartData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-black">Día {item.day} - {item.wellName}</p>
                  <p className="text-sm text-gray-600">Eficiencia: {item.efficiency}%</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-bold">{item.actualDepth}m</p>
                  <p className="text-gray-500 text-sm">Plan: {item.plannedDepth}m</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparación ROP por pozo */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-black">
            Comparación ROP por Pozo
          </h3>
          <div className="space-y-4">
            {ropComparisonData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-black">{item.name}</p>
                  <p className="text-sm text-gray-600">Profundidad: {item.actualDepth}m</p>
                </div>
                <div className="flex space-x-4">
                  <div className="text-center">
                    <p className="text-blue-600 font-bold">{item.ropAverage}</p>
                    <p className="text-xs text-gray-500">ROP (m/h)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-600 font-bold">{item.wcr}</p>
                    <p className="text-xs text-gray-500">WCR (m/h)</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráficos secundarios - Versión Simplificada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eficiencia por actividad */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-black">
            Eficiencia por Actividad de Contrato
          </h3>
          <div className="space-y-4">
            {activityEfficiencyData.slice(0, 6).map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-black">{item.name}</span>
                  <span className="text-sm font-medium text-black">{item.efficiency.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{width: `${Math.min(item.efficiency, 100)}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución de tiempo */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-black">
            Distribución de Tiempo de Operaciones
          </h3>
          <div className="space-y-4">
            {timeDistributionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{backgroundColor: item.color}}
                  ></div>
                  <span className="text-sm text-black">{item.name}</span>
                </div>
                <span className="font-medium text-black">{item.value}%</span>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total</span>
                <span className="font-medium text-black">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis de rendimiento simplificado */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-black">
          Análisis de Rendimiento: ROP vs Profundidad
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-black">Pozo</th>
                <th className="text-right py-3 px-4 text-black">Profundidad (m)</th>
                <th className="text-right py-3 px-4 text-black">ROP Promedio (m/h)</th>
                <th className="text-right py-3 px-4 text-black">WCR (m/h)</th>
                <th className="text-right py-3 px-4 text-black">Eficiencia</th>
              </tr>
            </thead>
            <tbody>
              {ropComparisonData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-black">{item.name}</td>
                  <td className="py-3 px-4 text-right text-black">{item.actualDepth.toFixed(0)}</td>
                  <td className="py-3 px-4 text-right text-blue-600 font-medium">{item.ropAverage.toFixed(1)}</td>
                  <td className="py-3 px-4 text-right text-green-600 font-medium">{item.wcr.toFixed(1)}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.ropAverage > 15 ? 'bg-green-100 text-green-800' :
                      item.ropAverage > 10 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.ropAverage > 15 ? 'Excelente' : item.ropAverage > 10 ? 'Bueno' : 'Bajo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}