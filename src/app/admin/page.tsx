'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-lg">Cargando...</div>
    </div>
  }

  if (status === 'unauthenticated') {
    router.push('/')
    return null
  }

  const handleSeedAdvanced = async () => {
    if (!confirm('¿Estás seguro de ejecutar el seed avanzado? Esto eliminará todos los datos existentes y creará 50 pozos nuevos.')) {
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/seed-advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Error de conexión', details: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="mt-2 text-gray-600">
              Herramientas de administración del sistema Well Wizards
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Base de Datos</h2>
              <p className="text-sm text-gray-600">Gestión y poblado de la base de datos</p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="border border-blue-200 bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">
                    Seed Avanzado de Base de Datos
                  </h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Ejecuta el poblado completo de la base de datos con datos realistas:
                  </p>
                  <ul className="text-sm text-blue-700 mb-4 space-y-1">
                    <li>• 3 clientes (Ecopetrol, Gran Tierra, GeoPark)</li>
                    <li>• 3 contratos de perforación</li>
                    <li>• 15 campos petrolíferos</li>
                    <li>• 50 pozos con datos técnicos completos</li>
                    <li>• 1,500 registros históricos de perforación</li>
                    <li>• 14 formaciones geológicas</li>
                    <li>• 14 tipos de operaciones</li>
                    <li>• Datos económicos y técnicos realistas</li>
                  </ul>
                  
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    <strong>⚠️ Advertencia:</strong> Esta acción eliminará todos los datos existentes
                  </div>

                  <button
                    onClick={handleSeedAdvanced}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Ejecutando...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>Ejecutar Seed Avanzado</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resultado del seed */}
          {result && (
            <div className="mt-6 bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {result.success ? 'Resultado Exitoso' : 'Error'}
                </h2>
              </div>
              
              <div className="p-6">
                {result.success ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-2">✅</span>
                      <span className="text-lg font-medium text-green-900">
                        {result.message}
                      </span>
                    </div>
                    
                    {result.summary && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-3 rounded border">
                          <div className="text-2xl font-bold text-blue-600">
                            {result.summary.clients}
                          </div>
                          <div className="text-sm text-gray-600">Clientes</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="text-2xl font-bold text-green-600">
                            {result.summary.contracts}
                          </div>
                          <div className="text-sm text-gray-600">Contratos</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="text-2xl font-bold text-purple-600">
                            {result.summary.fields}
                          </div>
                          <div className="text-sm text-gray-600">Campos</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="text-2xl font-bold text-orange-600">
                            {result.summary.wells}
                          </div>
                          <div className="text-sm text-gray-600">Pozos</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">
                        El sistema está ahora poblado con datos realistas. 
                        Puedes navegar a los diferentes módulos para explorar:
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button 
                          onClick={() => router.push('/dashboard')}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200"
                        >
                          Dashboard
                        </button>
                        <button 
                          onClick={() => router.push('/contracts/management')}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-200"
                        >
                          Gestión de Contratos
                        </button>
                        <button 
                          onClick={() => router.push('/wells')}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm hover:bg-purple-200"
                        >
                          Pozos
                        </button>
                        <button 
                          onClick={() => router.push('/reports')}
                          className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm hover:bg-orange-200"
                        >
                          Reportes
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">❌</span>
                      <span className="text-lg font-medium text-red-900">Error</span>
                    </div>
                    <p className="text-red-700 mb-2">{result.error}</p>
                    {result.details && (
                      <div className="bg-red-100 p-3 rounded mt-2">
                        <p className="text-sm text-red-600 font-mono">{result.details}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}