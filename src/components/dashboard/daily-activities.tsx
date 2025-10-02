'use client'

import { useState } from 'react'

interface DailyActivity {
  id: string
  time: string
  activity: string
  well: string
  contract: string
  client: string
  field: string
  depth: number
  rop: number
  status: 'active' | 'completed' | 'alert' | 'maintenance'
  description: string
  personnel: string[]
}

interface DailyActivitiesProps {
  selectedDate?: Date
}

export function DailyActivities({ selectedDate = new Date() }: DailyActivitiesProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate)
  const [selectedWell, setSelectedWell] = useState('all')
  const [selectedClient, setSelectedClient] = useState('all')

  // Datos simulados de actividades diarias
  const mockActivities: DailyActivity[] = [
    {
      id: '1',
      time: '06:00',
      activity: 'Inicio de operaciones de perforación',
      well: 'Mateguafa Oeste-1',
      contract: 'Contrato Ecopetrol 2024',
      client: 'Ecopetrol',
      field: 'Campo Casanare Norte',
      depth: 2150,
      rop: 45.2,
      status: 'active',
      description: 'Inicio de turno de perforación con equipo completo',
      personnel: ['Supervisor A', 'Perforador B', 'Ayudante C']
    },
    {
      id: '2',
      time: '08:30',
      activity: 'Cambio de broca',
      well: 'Mateguafa Oeste-1',
      contract: 'Contrato Ecopetrol 2024',
      client: 'Ecopetrol',
      field: 'Campo Casanare Norte',
      depth: 2150,
      rop: 0,
      status: 'maintenance',
      description: 'Reemplazo de broca PDC por desgaste',
      personnel: ['Técnico D', 'Supervisor A']
    },
    {
      id: '3',
      time: '10:15',
      activity: 'Reanudación de perforación',
      well: 'Mateguafa Oeste-1',
      contract: 'Contrato Ecopetrol 2024',
      client: 'Ecopetrol',
      field: 'Campo Casanare Norte',
      depth: 2155,
      rop: 38.7,
      status: 'active',
      description: 'Continúa perforación después del cambio de broca',
      personnel: ['Perforador B', 'Supervisor A']
    },
    {
      id: '4',
      time: '12:00',
      activity: 'Inspección de seguridad',
      well: 'Llanos Sur-2',
      contract: 'Contrato Petrobras 2024',
      client: 'Petrobras',
      field: 'Campo Llanos Oriental',
      depth: 1850,
      rop: 0,
      status: 'alert',
      description: 'Inspección rutinaria de equipos de seguridad',
      personnel: ['Inspector E', 'Supervisor F']
    },
    {
      id: '5',
      time: '14:45',
      activity: 'Registro de producción',
      well: 'Casanare Norte-3',
      contract: 'Contrato Gran Tierra 2024',
      client: 'Gran Tierra Energy',
      field: 'Campo Costayaco',
      depth: 3200,
      rop: 42.1,
      status: 'completed',
      description: 'Registro de datos de producción diaria',
      personnel: ['Ingeniero G', 'Técnico H']
    },
    {
      id: '6',
      time: '16:20',
      activity: 'Mantenimiento preventivo',
      well: 'Llanos Sur-2',
      contract: 'Contrato Petrobras 2024',
      client: 'Petrobras',
      field: 'Campo Llanos Oriental',
      depth: 1850,
      rop: 0,
      status: 'maintenance',
      description: 'Mantenimiento de bomba de lodo',
      personnel: ['Mecánico I', 'Técnico J']
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'alert':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '🔄'
      case 'completed':
        return '✅'
      case 'alert':
        return '⚠️'
      case 'maintenance':
        return '🔧'
      default:
        return '📋'
    }
  }

  const filteredActivities = mockActivities.filter(activity => {
    if (selectedWell !== 'all' && activity.well !== selectedWell) return false
    if (selectedClient !== 'all' && activity.client !== selectedClient) return false
    return true
  })

  // Obtener clientes únicos
  const uniqueClients = Array.from(new Set(mockActivities.map(a => a.client)))
  // Obtener pozos únicos
  const uniqueWells = Array.from(new Set(mockActivities.map(a => a.well)))

  return (
    <div className="space-y-6">
      {/* Header con fecha y controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">Daily Activities</h2>
          <p className="text-black">
            {currentDate.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Controles de fecha */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setDate(newDate.getDate() - 1)
              setCurrentDate(newDate)
            }}
            className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-black"
          >
            ← Anterior
          </button>
          <input
            type="date"
            value={currentDate.toISOString().split('T')[0]}
            onChange={(e) => setCurrentDate(new Date(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
          />
          <button
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setDate(newDate.getDate() + 1)
              setCurrentDate(newDate)
            }}
            className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-black"
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-black mb-1">Cliente</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
            >
              <option value="all" className="text-black bg-white">Todos los clientes</option>
              {uniqueClients.map(client => (
                <option key={client} value={client} className="text-black bg-white">{client}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-black mb-1">Pozo</label>
            <select
              value={selectedWell}
              onChange={(e) => setSelectedWell(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
            >
              <option value="all" className="text-black bg-white">Todos los pozos</option>
              {uniqueWells.map(well => (
                <option key={well} value={well} className="text-black bg-white">{well}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedClient('all')
                setSelectedWell('all')
              }}
              className="px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 border border-gray-300"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Resumen del día */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">
            {filteredActivities.length}
          </div>
          <div className="text-sm text-black">Total Actividades</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">
            {filteredActivities.filter(a => a.status === 'active').length}
          </div>
          <div className="text-sm text-black">En Progreso</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-orange-600">
            {filteredActivities.filter(a => a.status === 'maintenance').length}
          </div>
          <div className="text-sm text-black">Mantenimiento</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-red-600">
            {filteredActivities.filter(a => a.status === 'alert').length}
          </div>
          <div className="text-sm text-black">Alertas</div>
        </div>
      </div>

      {/* Timeline de actividades */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">Timeline de Actividades</h3>
          
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="border-l-4 border-blue-200 pl-4 pb-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg font-medium text-black">
                        {activity.time}
                      </span>
                      <span className="text-lg">{getStatusIcon(activity.status)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-black mb-2">
                      {activity.activity}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                      <div>
                        <span className="text-sm font-medium text-black">Cliente:</span>
                        <p className="text-sm text-black">{activity.client}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-black">Contrato:</span>
                        <p className="text-sm text-black">{activity.contract}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-black">Campo:</span>
                        <p className="text-sm text-black">{activity.field}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-black">Pozo:</span>
                        <p className="text-sm text-black">{activity.well}</p>
                      </div>
                    </div>
                    
                    <p className="text-black mb-2">{activity.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span>
                        <span className="font-medium text-black">Profundidad:</span> 
                        <span className="text-black"> {activity.depth.toLocaleString()} ft</span>
                      </span>
                      <span>
                        <span className="font-medium text-black">ROP:</span> 
                        <span className="text-black"> {activity.rop} ft/hr</span>
                      </span>
                      <span>
                        <span className="font-medium text-black">Personal:</span> 
                        <span className="text-black"> {activity.personnel.join(', ')}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-black mb-2">No hay actividades</h3>
              <p className="text-black">No se encontraron actividades para los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}