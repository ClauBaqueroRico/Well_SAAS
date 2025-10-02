'use client'

import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { useDashboardFilter } from '../providers/dashboard-filter-provider'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface WellData {
  id: string
  name: string
  status: string
  field?: {
    name: string
    contract: {
      id: string
      name: string
      targetDepth?: number
      client?: {
        name: string
      }
    }
  }
  finalDepth?: number
  depth?: number
  ropAverage?: number
  elapsedDays?: number
  formation?: string
  holeSection?: string
  operation?: string
}

interface DrillingPlanData {
  day: number
  planDepth: number | null
  actualDepth: number | null
  planROP: number | null
  actualROP: number | null
  planHours: number | null
  actualHours: number | null
  formation: string | null
  holeSection: string | null
  operation: string | null
  variance: number | null
  efficiency: number | null
}

interface PlanVsRealStats {
  totalPlanDays: number
  totalActualDays: number
  planTargetDepth: number
  actualFinalDepth: number
  avgPlanROP: number
  avgActualROP: number
  overallEfficiency: number
  daysAheadBehind: number
}

interface TimePerformanceProps {
  well: WellData
  contractLogo?: string
}

export function TimePerformance({ well, contractLogo }: TimePerformanceProps) {
  // Usar filtros globales del dashboard
  const { selectedContract: globalSelectedContract, selectedClient } = useDashboardFilter()
  
  const [wells, setWells] = useState<WellData[]>([])
  const [selectedWell, setSelectedWell] = useState<WellData>(well)
  const [planVsRealData, setPlanVsRealData] = useState<DrillingPlanData[]>([])
  const [stats, setStats] = useState<PlanVsRealStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'plan-vs-real' | 'efficiency'>('plan-vs-real')

  useEffect(() => {
    fetchWells()
  }, [])

  useEffect(() => {
    if (selectedWell?.id) {
      fetchPlanVsRealData(selectedWell.id)
    }
  }, [selectedWell])

  const fetchWells = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/wells')
      if (response.ok) {
        const data = await response.json()
        const wellsData = Array.isArray(data) ? data : data.wells || []
        
        // Filtrar pozos según filtros globales
        let filteredWells = wellsData
        
        if (globalSelectedContract) {
          filteredWells = filteredWells.filter((w: WellData) => 
            w.field?.contract?.id === globalSelectedContract
          )
        }
        
        if (selectedClient) {
          filteredWells = filteredWells.filter((w: WellData) => 
            w.field?.contract?.client?.name === selectedClient
          )
        }
        
        setWells(filteredWells)
        
        // Establecer el primer pozo como seleccionado si no hay uno
        if (filteredWells.length > 0 && !selectedWell) {
          setSelectedWell(filteredWells[0])
        }
      }
    } catch (error) {
      console.error('Error fetching wells:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPlanVsRealData = async (wellId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/drilling-plan?wellId=${wellId}`)
      if (response.ok) {
        const data = await response.json()
        setPlanVsRealData(data.combined || [])
        setStats(data.stats || null)
      }
    } catch (error) {
      console.error('Error fetching plan vs real data:', error)
      setPlanVsRealData([])
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  // Datos para la gráfica Plan vs Real
  const planVsRealChartData = {
    labels: planVsRealData.map(d => `Day ${d.day}`),
    datasets: [
      {
        label: 'Plan (Projected Depth)',
        data: planVsRealData.map(d => d.planDepth),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.1,
        pointStyle: 'circle',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Real (Actual Depth)',
        data: planVsRealData.map(d => d.actualDepth),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.1,
        pointStyle: 'triangle',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  }

  const planVsRealChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Plan vs Real - ${selectedWell?.name || 'Well Progress'}`,
        font: {
          size: 18,
          weight: 'bold' as const
        }
      },
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          afterBody: function(context: any) {
            const dataIndex = context[0].dataIndex
            const data = planVsRealData[dataIndex]
            if (data && data.variance !== null) {
              return [`Variance: ${data.variance.toFixed(1)}%`]
            }
            return []
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Days',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Depth (m)',
        },
        reverse: true,
        min: 0,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  }

  // Datos para la gráfica de ROP comparación
  const ropComparisonData = {
    labels: planVsRealData.filter(d => d.planROP && d.actualROP).map(d => `Day ${d.day}`),
    datasets: [
      {
        label: 'Planned ROP (m/hr)',
        data: planVsRealData.filter(d => d.planROP && d.actualROP).map(d => d.planROP),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
      {
        label: 'Actual ROP (m/hr)',
        data: planVsRealData.filter(d => d.planROP && d.actualROP).map(d => d.actualROP),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
      }
    ],
  }

  const ropChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'ROP Performance: Plan vs Real',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Days',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'ROP (m/hr)',
        },
        beginAtZero: true,
      },
    },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex items-center space-x-4">
          {contractLogo && (
            <img 
              src={contractLogo} 
              alt="Contract Logo" 
              className="w-12 h-12 object-contain bg-white p-1 rounded"
            />
          )}
          <div>
            <h2 className="text-xl font-bold text-blue-900">Análisis Plan vs Real</h2>
            <p className="text-blue-700">Comparación de Progreso Planificado vs Actual</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-blue-700">
            {globalSelectedContract && <div>Contrato: {selectedWell?.field?.contract?.name}</div>}
            {selectedClient && <div>Cliente: {selectedClient}</div>}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Well Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Pozo para Análisis Plan vs Real
          </label>
          <select
            value={selectedWell?.id || ''}
            onChange={(e) => {
              const well = wells.find(w => w.id === e.target.value)
              if (well) setSelectedWell(well)
            }}
            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!globalSelectedContract} // Deshabilitar si hay filtro global
          >
            <option value="">Seleccionar pozo</option>
            {wells.map((well) => (
              <option key={well.id} value={well.id}>
                {well.name} - {well.formation} ({well.field?.name})
              </option>
            ))}
          </select>
          {globalSelectedContract && (
            <p className="text-xs text-blue-600 mt-1">Pozos filtrados por contrato global</p>
          )}
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-semibold text-blue-800 mb-2">📅 Duración</h5>
              <p className="text-sm text-blue-700">
                Plan: {stats.totalPlanDays} días
              </p>
              <p className="text-sm text-blue-700">
                Real: {stats.totalActualDays} días
              </p>
              <p className={`text-xs mt-1 ${
                stats.daysAheadBehind <= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.daysAheadBehind === 0 ? 'En tiempo' : 
                 stats.daysAheadBehind < 0 ? `${Math.abs(stats.daysAheadBehind)} días adelantado` :
                 `${stats.daysAheadBehind} días atrasado`}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-semibold text-green-800 mb-2">🎯 Profundidad</h5>
              <p className="text-sm text-green-700">
                Plan: {stats.planTargetDepth.toFixed(0)}m
              </p>
              <p className="text-sm text-green-700">
                Real: {stats.actualFinalDepth.toFixed(0)}m
              </p>
              <p className={`text-xs mt-1 ${
                stats.actualFinalDepth >= stats.planTargetDepth ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {((stats.actualFinalDepth / stats.planTargetDepth) * 100).toFixed(1)}% completado
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h5 className="font-semibold text-yellow-800 mb-2">⚡ ROP Average</h5>
              <p className="text-sm text-yellow-700">
                Plan: {stats.avgPlanROP.toFixed(1)} m/h
              </p>
              <p className="text-sm text-yellow-700">
                Real: {stats.avgActualROP.toFixed(1)} m/h
              </p>
              <p className={`text-xs mt-1 ${
                stats.avgActualROP >= stats.avgPlanROP ? 'text-green-600' : 'text-red-600'
              }`}>
                {((stats.avgActualROP / stats.avgPlanROP) * 100).toFixed(1)}% vs plan
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h5 className="font-semibold text-purple-800 mb-2">📊 Eficiencia</h5>
              <p className="text-lg font-bold text-purple-900">
                {stats.overallEfficiency.toFixed(1)}%
              </p>
              <p className={`text-xs mt-1 ${
                stats.overallEfficiency >= 100 ? 'text-green-600' :
                stats.overallEfficiency >= 80 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {stats.overallEfficiency >= 100 ? 'Superando plan' :
                 stats.overallEfficiency >= 80 ? 'Dentro del rango' : 'Bajo el plan'}
              </p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('plan-vs-real')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'plan-vs-real'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Plan vs Real
          </button>
          <button
            onClick={() => setActiveTab('efficiency')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'efficiency'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Análisis de Eficiencia
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {!selectedWell ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <div className="text-yellow-800">
                <h3 className="text-lg font-semibold mb-2">Selecciona un Pozo</h3>
                <p className="text-sm">Selecciona un pozo para ver el análisis Plan vs Real.</p>
              </div>
            </div>
          ) : planVsRealData.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="text-gray-600">
                <h3 className="text-lg font-semibold mb-2">Sin Datos de Plan</h3>
                <p className="text-sm">No hay datos de planificación disponibles para este pozo.</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'plan-vs-real' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-black">Progreso Plan vs Real - {selectedWell.name}</h3>
                  
                  {/* Main Plan vs Real Chart */}
                  <div className="bg-white p-6 rounded-lg border">
                    <div style={{ height: '500px' }}>
                      <Line data={planVsRealChartData} options={planVsRealChartOptions} />
                    </div>
                    <p className="text-sm text-gray-600 mt-4 text-center">
                      Comparación día a día del progreso planificado vs progreso real
                    </p>
                  </div>

                  {/* Detailed Progress Table */}
                  <div className="bg-white rounded-lg border">
                    <div className="px-6 py-4 border-b">
                      <h4 className="text-lg font-semibold text-black">Detalle Diario - Plan vs Real</h4>
                    </div>
                    <div className="overflow-x-auto max-h-96">
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-black">Día</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-black">Prof. Plan (m)</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-black">Prof. Real (m)</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-black">Varianza (%)</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-black">ROP Plan</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-black">ROP Real</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-black">Eficiencia</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-black">Formación</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {planVsRealData.slice(0, 30).map((data) => (
                            <tr key={data.day} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-black">{data.day}</td>
                              <td className="px-4 py-3 text-center text-sm text-black">
                                {data.planDepth ? data.planDepth.toFixed(0) : '-'}
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-black">
                                {data.actualDepth ? data.actualDepth.toFixed(0) : '-'}
                              </td>
                              <td className="px-4 py-3 text-center text-sm">
                                {data.variance !== null ? (
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    data.variance >= 0 ? 'bg-green-100 text-green-800' :
                                    data.variance >= -10 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {data.variance.toFixed(1)}%
                                  </span>
                                ) : '-'}
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-black">
                                {data.planROP ? data.planROP.toFixed(1) : '-'}
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-black">
                                {data.actualROP ? data.actualROP.toFixed(1) : '-'}
                              </td>
                              <td className="px-4 py-3 text-center text-sm">
                                {data.efficiency !== null ? (
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    data.efficiency >= 100 ? 'bg-green-100 text-green-800' :
                                    data.efficiency >= 80 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {data.efficiency.toFixed(0)}%
                                  </span>
                                ) : '-'}
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-black">
                                {data.formation || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'efficiency' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-black">Análisis de Eficiencia ROP</h3>
                  
                  {/* ROP Comparison Chart */}
                  <div className="bg-white p-6 rounded-lg border">
                    <div style={{ height: '400px' }}>
                      <Bar data={ropComparisonData} options={ropChartOptions} />
                    </div>
                    <p className="text-sm text-gray-600 mt-4 text-center">
                      Comparación de Rate of Penetration planificado vs real
                    </p>
                  </div>

                  {/* Performance Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-800 mb-2">📈 Tendencia General</h5>
                      <p className="text-sm text-blue-700">
                        {stats && stats.overallEfficiency >= 100 ? 
                          'Rendimiento superior al plan' :
                          stats && stats.overallEfficiency >= 80 ?
                          'Rendimiento dentro del rango esperado' :
                          'Rendimiento por debajo del plan'
                        }
                      </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h5 className="font-semibold text-green-800 mb-2">🎯 Objetivos</h5>
                      <p className="text-sm text-green-700">
                        {stats && stats.actualFinalDepth >= stats.planTargetDepth ?
                          'Profundidad objetivo alcanzada' :
                          'Progresando hacia objetivo'
                        }
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h5 className="font-semibold text-yellow-800 mb-2">⏱️ Cronograma</h5>
                      <p className="text-sm text-yellow-700">
                        {stats && stats.daysAheadBehind === 0 ? 'En cronograma' :
                         stats && stats.daysAheadBehind < 0 ? 'Adelantado al cronograma' :
                         'Atrasado del cronograma'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}