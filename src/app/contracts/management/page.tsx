'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'

interface Contract {
  id: string
  name: string
  contractNumber: string
  clientId: string
  client: {
    name: string
  }
  startDate: string
  endDate: string
  totalValue: number
  status: string
  description: string
  targetDepth: number
  plannedWells: number
  budgetAFE?: number
  actualCost?: number
  dailyRate?: number
  _count?: {
    fields: number
  }
}

interface Client {
  id: string
  name: string
}

export default function ContractsManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    contractNumber: '',
    clientId: '',
    startDate: '',
    endDate: '',
    totalValue: '',
    status: 'active',
    description: '',
    targetDepth: '',
    plannedWells: '',
    budgetAFE: '',
    actualCost: '',
    dailyRate: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchData()
    }
  }, [status, router])

  const fetchData = async () => {
    try {
      const [contractsRes, clientsRes] = await Promise.all([
        fetch('/api/contracts'),
        fetch('/api/clients')
      ])

      if (contractsRes.ok) {
        const contractsData = await contractsRes.json()
        setContracts(contractsData)
      }

      if (clientsRes.ok) {
        const clientsData = await clientsRes.json()
        setClients(clientsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingContract ? `/api/contracts/${editingContract.id}` : '/api/contracts'
      const method = editingContract ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalValue: parseFloat(formData.totalValue) || 0,
          targetDepth: parseInt(formData.targetDepth) || 0,
          plannedWells: parseInt(formData.plannedWells) || 0,
          budgetAFE: parseFloat(formData.budgetAFE) || 0,
          actualCost: parseFloat(formData.actualCost) || 0,
          dailyRate: parseFloat(formData.dailyRate) || 0,
        }),
      })

      if (response.ok) {
        setShowModal(false)
        setEditingContract(null)
        resetForm()
        fetchData()
      } else {
        alert('Error al guardar el contrato')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract)
    setFormData({
      name: contract.name,
      contractNumber: contract.contractNumber,
      clientId: contract.clientId,
      startDate: contract.startDate.split('T')[0],
      endDate: contract.endDate.split('T')[0],
      totalValue: contract.totalValue.toString(),
      status: contract.status,
      description: contract.description,
      targetDepth: contract.targetDepth.toString(),
      plannedWells: contract.plannedWells.toString(),
      budgetAFE: (contract.budgetAFE || 0).toString(),
      actualCost: (contract.actualCost || 0).toString(),
      dailyRate: (contract.dailyRate || 0).toString(),
    })
    setShowModal(true)
  }

  const handleDelete = async (contract: Contract) => {
    if (contract._count?.fields && contract._count.fields > 0) {
      alert(`No se puede eliminar el contrato porque tiene ${contract._count.fields} campos asociados`)
      return
    }

    if (confirm(`¿Estás seguro de eliminar el contrato "${contract.name}"?`)) {
      try {
        const response = await fetch(`/api/contracts/${contract.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          fetchData()
        } else {
          alert('Error al eliminar el contrato')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al eliminar el contrato')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      contractNumber: '',
      clientId: '',
      startDate: '',
      endDate: '',
      totalValue: '',
      status: 'active',
      description: '',
      targetDepth: '',
      plannedWells: '',
      budgetAFE: '',
      actualCost: '',
      dailyRate: ''
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      suspended: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    
    return `px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Contratos</h1>
              <p className="mt-2 text-gray-600">
                Administra todos los contratos de perforación
              </p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setEditingContract(null)
                setShowModal(true)
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <span>+</span>
              <span>Nuevo Contrato</span>
            </button>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">{contracts.length}</div>
              <div className="text-sm text-gray-600">Total Contratos</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">
                {contracts.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Activos</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(contracts.reduce((sum, c) => sum + c.totalValue, 0))}
              </div>
              <div className="text-sm text-gray-600">Valor Total</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl font-bold text-orange-600">
                {contracts.reduce((sum, c) => sum + c.plannedWells, 0)}
              </div>
              <div className="text-sm text-gray-600">Pozos Planificados</div>
            </div>
          </div>

          {/* Tabla de contratos */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contrato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fechas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pozos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {contract.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contract.contractNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{contract.client.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(contract.startDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          hasta {new Date(contract.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(contract.totalValue)}
                        </div>
                        {contract.dailyRate && (
                          <div className="text-sm text-gray-500">
                            {formatCurrency(contract.dailyRate)}/día
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.plannedWells} planificados
                        <div className="text-sm text-gray-500">
                          {contract.targetDepth.toLocaleString()} ft target
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(contract.status)}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(contract)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(contract)}
                          className="text-red-600 hover:text-red-900"
                          disabled={!!(contract._count?.fields && contract._count.fields > 0)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear/editar contrato */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingContract ? 'Editar Contrato' : 'Nuevo Contrato'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Contrato
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Contrato
                    </label>
                    <input
                      type="text"
                      value={formData.contractNumber}
                      onChange={(e) => setFormData({...formData, contractNumber: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Fin
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Total (USD)
                    </label>
                    <input
                      type="number"
                      value={formData.totalValue}
                      onChange={(e) => setFormData({...formData, totalValue: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tarifa Diaria (USD)
                    </label>
                    <input
                      type="number"
                      value={formData.dailyRate}
                      onChange={(e) => setFormData({...formData, dailyRate: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pozos Planificados
                    </label>
                    <input
                      type="number"
                      value={formData.plannedWells}
                      onChange={(e) => setFormData({...formData, plannedWells: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profundidad Objetivo (ft)
                    </label>
                    <input
                      type="number"
                      value={formData.targetDepth}
                      onChange={(e) => setFormData({...formData, targetDepth: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Presupuesto AFE (USD)
                    </label>
                    <input
                      type="number"
                      value={formData.budgetAFE}
                      onChange={(e) => setFormData({...formData, budgetAFE: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="active">Activo</option>
                      <option value="completed">Completado</option>
                      <option value="suspended">Suspendido</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : editingContract ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}