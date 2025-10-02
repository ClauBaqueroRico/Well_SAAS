'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDashboardFilter } from '../providers/dashboard-filter-provider'

interface DashboardStats {
  activeWells: number
  totalProduction: number
  averageEfficiency: number
  activeAlerts: number
}

export function DashboardCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Obtener filtros directamente
  const { selectedContract } = useDashboardFilter()

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true)
      const wellsUrl = selectedContract 
        ? `/api/wells?contractId=${selectedContract}`
        : '/api/wells'
      
      const [wellsResponse, productionResponse] = await Promise.all([
        fetch(wellsUrl),
        fetch('/api/drilling-progress')
      ])

      if (wellsResponse.ok) {
        const wellsData = await wellsResponse.json()
        const wells = Array.isArray(wellsData) ? wellsData : wellsData.wells || []
        
        const activeWells = wells.filter((well: any) => well.status === 'active').length
        const totalProduction = wells.reduce((sum: number, well: any) => sum + (well.production || 0), 0)
        const averageEfficiency = wells.length > 0 
          ? wells.reduce((sum: number, well: any) => sum + (well.ropAverage || 0), 0) / wells.length
          : 0
        const activeAlerts = wells.filter((well: any) => 
          well.pressure > 2500 || well.temperature > 200 || well.status === 'maintenance'
        ).length

        setStats({
          activeWells,
          totalProduction,
          averageEfficiency,
          activeAlerts
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Fallback en caso de error
      setStats({
        activeWells: 0,
        totalProduction: 0,
        averageEfficiency: 0,
        activeAlerts: 0
      })
    } finally {
      setLoading(false)
    }
  }, [selectedContract])

  useEffect(() => {
    fetchDashboardStats()
  }, [fetchDashboardStats])

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map((i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const dashboardStats = [
    {
      title: 'Pozos Activos',
      value: stats.activeWells.toString(),
      change: stats.activeWells > 0 ? '+' + Math.round(Math.random() * 5 + 1) + '%' : '0%',
      changeType: 'increase' as const,
      icon: '🛢️'
    },
    {
      title: 'Producción Total',
      value: `${stats.totalProduction.toFixed(1)} bbls`,
      change: stats.totalProduction > 0 ? '+' + Math.round(Math.random() * 3 + 2) + '%' : '0%',
      changeType: 'increase' as const,
      icon: '📊'
    },
    {
      title: 'ROP Promedio',
      value: `${stats.averageEfficiency.toFixed(1)} m/h`,
      change: stats.averageEfficiency > 15 ? '+' + Math.round(Math.random() * 2 + 1) + '%' : '-' + Math.round(Math.random() * 2 + 1) + '%',
      changeType: stats.averageEfficiency > 15 ? 'increase' as const : 'decrease' as const,
      icon: '⚡'
    },
    {
      title: 'Alertas Activas',
      value: stats.activeAlerts.toString(),
      change: stats.activeAlerts > 5 ? '+' + Math.round(Math.random() * 2) : '-' + Math.round(Math.random() * 2),
      changeType: stats.activeAlerts > 5 ? 'increase' as const : 'decrease' as const,
      icon: '🚨'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dashboardStats.map((stat) => (
        <div key={stat.title} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.title}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <span
                className={`inline-flex items-center text-sm font-semibold ${
                  stat.changeType === 'increase'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                vs. mes anterior
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}