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

interface Contract {
  id: string
  name: string
  targetDepth?: number
  expectedDays?: number
  client?: {
    name: string
  }
}

interface TimePerformanceProps {
  well: WellData
  contractLogo?: string
}

export function TimePerformance({ well, contractLogo }: TimePerformanceProps) {
  // Usar filtros globales del dashboard
  const { selectedContract: globalSelectedContract, selectedClient } = useDashboardFilter()
  
  const [allWells, setAllWells] = useState<WellData[]>([])
  const [wells, setWells] = useState<WellData[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [selectedContract, setSelectedContract] = useState<string>('')
  const [selectedWells, setSelectedWells] = useState<string[]>([])
  const [currentWell, setCurrentWell] = useState<WellData>(well)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'performance' | 'efficiency'>('performance')

  useEffect(() => {
    fetchData()
  }, [])

  // Responder a cambios en filtros globales
  useEffect(() => {
    if (globalSelectedContract || selectedClient) {
      let filteredWells = allWells
      
      if (globalSelectedContract) {
        filteredWells = filteredWells.filter(well => 
          well.field?.contract?.id === globalSelectedContract
        )
        setSelectedContract(globalSelectedContract)
      }
      
      if (selectedClient) {
        filteredWells = filteredWells.filter(well => 
          well.field?.contract?.client?.name === selectedClient
        )
      }
      
      setWells(filteredWells)
      setSelectedWells(filteredWells.map(well => well.id))
      
      if (filteredWells.length > 0) {
        setCurrentWell(filteredWells[0])
      }
    } else {
      setWells(allWells)
      setSelectedWells(allWells.map(well => well.id))
      if (allWells.length > 0) {
        setCurrentWell(allWells[0])
      }
    }
  }, [globalSelectedContract, selectedClient, allWells])

  useEffect(() => {
    if (selectedContract && !globalSelectedContract) {
      const filteredWells = allWells.filter(well => 
        well.field?.contract?.id === selectedContract
      )
      setWells(filteredWells)
      setSelectedWells(filteredWells.map(well => well.id))
    } else if (!globalSelectedContract) {
      setWells(allWells)
      setSelectedWells(allWells.map(well => well.id))
    }
  }, [selectedContract, allWells, globalSelectedContract])

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
        
        const allWellsData = Array.isArray(wellsData) ? wellsData : wellsData.wells || []
        const allContracts = Array.isArray(contractsData) ? contractsData : contractsData.contracts || []
        
        setAllWells(allWellsData)
        setContracts(allContracts)
        
        if (allWellsData.length > 0 && selectedWells.length === 0) {
          setCurrentWell(allWellsData[0])
          setSelectedWells([allWellsData[0].id])
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setWells([])
      setContracts([])
    } finally {
      setLoading(false)
    }
  }

  // Plan vs Real data para un solo pozo
  const generatePlanVsRealData = (well: WellData) => {
    const totalDays = Math.max(well.elapsedDays || 30, 45)
    const targetDepth = well.finalDepth || well.depth || 10000
    const contract = contracts.find(c => c.id === well.field?.contract?.id)
    const plannedDays = contract?.expectedDays || totalDays
    const plannedROP = 18 // ROP planificado estándar (m/h)
    const actualROP = well.ropAverage || 15
    
    const labels = Array.from({ length: totalDays }, (_, i) => `Día ${i + 1}`)
    
    // Datos del Plan (progreso lineal basado en ROP planificado)
    const plannedData = Array.from({ length: totalDays }, (_, day) => {
      const dailyProgress = plannedROP * 16 // 16 horas operacionales por día
      const plannedDepth = dailyProgress * (day + 1)
      return Math.min(targetDepth, plannedDepth)
    })
    
    // Datos Reales (con variaciones realistas)
    const actualData = Array.from({ length: totalDays }, (_, day) => {
      if (day >= (well.elapsedDays || 30)) {
        return null // No hay datos reales después del día actual
      }
      
      const dailyProgress = actualROP * 16
      let actualDepth = dailyProgress * (day + 1)
      
      // Agregar variaciones realistas
      const weekday = day % 7
      if (weekday === 0 || weekday === 6) {
        actualDepth *= 0.7 // Menos progreso en fines de semana
      }
      
      if (day % 10 === 0) {
        actualDepth *= 0.5 // Día de mantenimiento cada 10 días
      }
      
      const noise = Math.sin(day * 0.3) * (actualROP * 3) + (Math.random() - 0.5) * (actualROP * 2)
      actualDepth += noise
      
      return Math.min(targetDepth, Math.max(0, actualDepth))
    })
    
    return {
      labels,
      datasets: [
        {
          label: 'Plan',
          data: plannedData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.1,
          borderDash: [5, 5],
        },
        {
          label: 'Real',
          data: actualData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.2,
        }
      ]
    }
  }

  // Filtrar pozos según selección múltiple
  const displayWells = wells.filter(well => selectedWells.includes(well.id))

  // Plan vs Real chart data para el pozo actual
  const planVsRealData = generatePlanVsRealData(currentWell)

  // Multi-well efficiency comparison data
  const efficiencyComparisonData = {
    labels: displayWells.map(well => well.name),
    datasets: [
      {
        label: 'ROP Average (m/hr)',
        data: displayWells.map(well => well.ropAverage || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
      {
        label: 'Target ROP (m/hr)',
        data: displayWells.map(() => 15),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
      }
    ],
  }

  // Multi-well depth vs day comparison
  const allWellsComparisonData = {
    labels: Array.from({ length: 60 }, (_, i) => `Day ${i + 1}`),
    datasets: displayWells.map((well, index) => {
      const colors = [
        'rgb(59, 130, 246)',
        'rgb(34, 197, 94)',
        'rgb(234, 179, 8)',
        'rgb(239, 68, 68)',
        'rgb(147, 51, 234)',
        'rgb(245, 101, 101)',
        'rgb(52, 211, 153)',
        'rgb(251, 191, 36)',
      ]
      
      const targetDays = well.elapsedDays || 30
      const finalDepth = well.finalDepth || well.depth || 10000
      const ropAverage = well.ropAverage || 15
      
      const sampleData = Array.from({ length: 60 }, (_, day) => {
        if (day >= targetDays) {
          return finalDepth
        }
        
        const dailyProgress = ropAverage * 16
        const targetDepth = dailyProgress * (day + 1)
        const variation = Math.sin(day * 0.2) * (ropAverage * 2) + (Math.random() - 0.5) * (ropAverage * 0.5)
        const currentDepth = Math.min(finalDepth, Math.max(0, targetDepth + variation))
        
        return currentDepth
      })

      return {
        label: well.name,
        data: sampleData,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      }
    })
  }

  const planVsRealChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Plan vs Real - ${currentWell.name}`,
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
          afterLabel: function(context: any) {
            const dataIndex = context.dataIndex
            const plannedValue = planVsRealData.datasets[0].data[dataIndex]
            const actualValue = planVsRealData.datasets[1].data[dataIndex]
            
            if (plannedValue && actualValue) {
              const variance = ((actualValue - plannedValue) / plannedValue * 100).toFixed(1)
              return `Variación: ${variance}%`
            }
            return ''
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Días',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Profundidad (m)',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        },
        reverse: true,
        min: 0,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  }

  const multiWellChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Multi-Well Depth vs Day Comparison',
        font: {
          size: 16,
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

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'ROP Comparison - Selected Wells',
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
          text: 'Wells',
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
            <h2 className="text-xl font-bold text-blue-900">Análisis de Rendimiento Temporal</h2>
            <p className="text-blue-700">Monitoreo de Tiempos y Eficiencia Operacional</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-blue-700">
            {globalSelectedContract && <div>Contrato: {contracts.find(c => c.id === globalSelectedContract)?.name}</div>}
            {selectedClient && <div>Cliente: {selectedClient}</div>}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Contract
            </label>
            <select
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!!globalSelectedContract}
            >
              <option value="">All Contracts</option>
              {contracts.map((contract) => (
                <option key={contract.id} value={contract.id}>
                  {contract.name}
                </option>
              ))}
            </select>
            {globalSelectedContract && (
              <p className="text-xs text-blue-600 mt-1">Filtrado por contrato global</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {activeTab === 'performance' ? 'Select Well for Plan vs Real' : `Select Wells to Display (${selectedWells.length} selected)`}
            </label>
            <div className="relative">
              {activeTab === 'performance' ? (
                <select
                  value={currentWell.id}
                  onChange={(e) => {
                    const selected = wells.find(w => w.id === e.target.value)
                    if (selected) {
                      setCurrentWell(selected)
                      setSelectedWells([selected.id])
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {wells.map((well) => (
                    <option key={well.id} value={well.id}>
                      {well.name} - {well.formation} ({well.operation})
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <select
                    multiple
                    value={selectedWells}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value)
                      setSelectedWells(values)
                      if (values.length > 0) {
                        const selected = wells.find(w => w.id === values[0])
                        if (selected) setCurrentWell(selected)
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    size={Math.min(wells.length, 5)}
                  >
                    {wells.map((well) => (
                      <option key={well.id} value={well.id}>
                        {well.name} - {well.formation} ({well.operation})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Ctrl+Click para seleccionar múltiples pozos
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Selection Buttons - Solo para tab de comparativa */}
        {activeTab === 'efficiency' && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedWells(wells.map(w => w.id))}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Select All ({wells.length})
            </button>
            <button
              onClick={() => setSelectedWells([])}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Clear Selection
            </button>
            <button
              onClick={() => {
                const activeWells = wells.filter(w => w.status === 'active')
                setSelectedWells(activeWells.map(w => w.id))
              }}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Active Wells Only ({wells.filter(w => w.status === 'active').length})
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'performance'
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
            Comparativa de Pozos
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'performance' ? (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-black">Plan vs Real Analysis - {currentWell.name}</h3>
            
            {/* Current Well Info Card with Plan vs Real metrics */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">{currentWell.name}</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-blue-700">Formation</p>
                  <p className="text-lg font-semibold text-blue-900">{currentWell.formation || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">ROP Real</p>
                  <p className="text-lg font-semibold text-blue-900">{(currentWell.ropAverage || 0).toFixed(1)} m/h</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">ROP Plan</p>
                  <p className="text-lg font-semibold text-blue-900">18.0 m/h</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Días Transcurridos</p>
                  <p className="text-lg font-semibold text-blue-900">{currentWell.elapsedDays || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Eficiencia vs Plan</p>
                  <p className={`text-lg font-semibold ${
                    ((currentWell.ropAverage || 0) / 18) >= 0.9 ? 'text-green-600' : 
                    ((currentWell.ropAverage || 0) / 18) >= 0.7 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {(((currentWell.ropAverage || 0) / 18) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Plan vs Real Chart */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-black">Plan vs Real Progress</h4>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-green-500 border-dashed border-2 border-green-500"></div>
                    <span>Plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-blue-500"></div>
                    <span>Real</span>
                  </div>
                </div>
              </div>
              <div style={{ height: '500px' }}>
                <Line data={planVsRealData} options={planVsRealChartOptions} />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Profundidad Planeada</p>
                  <p className="text-lg font-semibold">{(currentWell.finalDepth || currentWell.depth || 0).toFixed(0)} m</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Progreso Actual</p>
                  <p className="text-lg font-semibold">{(((currentWell.elapsedDays || 0) / 45) * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Desviación</p>
                  <p className={`text-lg font-semibold ${
                    ((currentWell.ropAverage || 0) - 18) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {((currentWell.ropAverage || 0) - 18).toFixed(1)} m/h
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : selectedWells.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <div className="text-yellow-800">
              <h3 className="text-lg font-semibold mb-2">No Wells Selected</h3>
              <p className="text-sm">Please select one or more wells to view comparative data.</p>
              <button
                onClick={() => setSelectedWells(wells.map(w => w.id))}
                className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Select All Wells ({wells.length})
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-black">Multi-Well Efficiency Analysis</h3>
            
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="text-lg font-semibold text-black mb-4">Selected Wells Progress Comparison</h4>
              <div style={{ height: '500px' }}>
                <Line data={allWellsComparisonData} options={multiWellChartOptions} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h4 className="text-lg font-semibold text-black mb-4">ROP Comparison - Selected Wells</h4>
              <div style={{ height: '400px' }}>
                <Bar data={efficiencyComparisonData} options={barChartOptions} />
              </div>
            </div>

            <div className="bg-white rounded-lg border">
              <div className="px-6 py-4 border-b">
                <h4 className="text-lg font-semibold text-black">Detailed Performance Metrics - Selected Wells</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-black">Well</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-black">Formation</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-black">Operation</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-black">ROP (m/h)</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-black">Depth (m)</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-black">Days</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-black">Efficiency</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-black">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displayWells.map((well) => {
                      const ropValue = well.ropAverage || 0
                      const efficiency = ropValue > 0 ? (ropValue / 15) * 100 : 0
                      const isCurrentWell = well.id === currentWell.id
                      
                      return (
                        <tr key={well.id} className={isCurrentWell ? 'bg-blue-50' : ''}>
                          <td className="px-4 py-4 text-sm font-medium text-black">
                            {isCurrentWell && <span className="text-blue-600">★ </span>}
                            {well.name}
                          </td>
                          <td className="px-4 py-4 text-center text-sm text-black">
                            {well.formation || 'N/A'}
                          </td>
                          <td className="px-4 py-4 text-center text-sm text-black">
                            {well.operation || 'N/A'}
                          </td>
                          <td className="px-4 py-4 text-center text-sm text-black">
                            {ropValue.toFixed(1)}
                          </td>
                          <td className="px-4 py-4 text-center text-sm text-black">
                            {(well.finalDepth || well.depth || 0).toFixed(0)}
                          </td>
                          <td className="px-4 py-4 text-center text-sm text-black">
                            {well.elapsedDays || 0}
                          </td>
                          <td className="px-4 py-4 text-center text-sm">
                            <span className={`px-2 py-1 rounded font-medium ${
                              efficiency >= 100 ? 'bg-green-100 text-green-800' :
                              efficiency >= 80 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {efficiency.toFixed(0)}%
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              well.status === 'active' ? 'bg-green-100 text-green-800' :
                              well.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {well.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-semibold text-green-800 mb-2">🏆 Best Performance</h5>
                <p className="text-sm text-green-700">
                  {displayWells.length > 0 ? displayWells.reduce((best, well) => 
                    (well.ropAverage || 0) > (best.ropAverage || 0) ? well : best, displayWells[0]
                  ).name : 'N/A'}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ROP: {displayWells.length > 0 ? displayWells.reduce((best, well) => 
                    (well.ropAverage || 0) > (best.ropAverage || 0) ? well : best, displayWells[0]
                  ).ropAverage?.toFixed(1) || '0.0' : '0.0'} m/h
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-800 mb-2">📊 Overall Average</h5>
                <p className="text-sm text-blue-700">
                  ROP Average: {displayWells.length > 0 ? (displayWells.reduce((sum, well) => sum + (well.ropAverage || 0), 0) / displayWells.length).toFixed(1) : '0.0'} m/h
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {displayWells.length} wells selected
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-800 mb-2">⚡ Opportunities</h5>
                <p className="text-sm text-yellow-700">
                  {displayWells.filter(well => (well.ropAverage || 0) < 12).length} wells below target
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Target: 15.0 m/h ROP
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}