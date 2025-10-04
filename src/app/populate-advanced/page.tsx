'use client'

import { useState } from 'react'

export default function PopulateAdvancedPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const populateAdvanced = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log('🏗️ Poblando datos avanzados...')
      
      const response = await fetch('/api/populate-advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      console.log('📊 Resultado:', data)
      
      setResult(data)
      
    } catch (error) {
      console.error('❌ Error:', error)
      setResult({
        success: false,
        error: 'Error de red',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">🏗️ POBLAR DATOS AVANZADOS</h1>
          <p className="text-xl text-blue-600 mb-8">
            Crea un dataset completo con múltiples clientes, contratos y pozos
          </p>
        </div>
        
        {/* Información de lo que se creará */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-800 mb-3">🏢 Clientes</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Ecopetrol S.A.</li>
              <li>• Pacific Rubiales</li>
              <li>• Gran Tierra Energy</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-3">📄 Contratos</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 5 contratos activos</li>
              <li>• Valores: $1.5M - $3.2M</li>
              <li>• Diferentes regiones</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-bold text-purple-800 mb-3">⚡ Pozos</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• 8 pozos diferentes</li>
              <li>• Datos Plan vs Real</li>
              <li>• 7-10 días por pozo</li>
            </ul>
          </div>
        </div>
        
        {/* Botón principal */}
        <div className="text-center mb-8">
          <button
            onClick={populateAdvanced}
            disabled={loading}
            className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-lg"
          >
            {loading ? '🔄 POBLANDO DATOS...' : '🏗️ POBLAR DATOS AVANZADOS'}
          </button>
        </div>
        
        {/* Resultado */}
        {result && (
          <div className={`p-6 rounded-lg shadow-md mb-8 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
            <h3 className={`font-bold mb-4 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '✅ DATOS POBLADOS EXITOSAMENTE' : '❌ ERROR AL POBLAR DATOS'}
            </h3>
            
            {result.success && result.summary && (
              <div className="mb-6">
                <h4 className="font-semibold text-green-700 mb-3">📊 Resumen de Datos Creados:</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded border">
                    <div className="text-2xl font-bold text-blue-600">{result.summary.clientes}</div>
                    <div className="text-sm text-gray-600">Clientes</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-2xl font-bold text-green-600">{result.summary.contratos}</div>
                    <div className="text-sm text-gray-600">Contratos</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-2xl font-bold text-purple-600">{result.summary.pozos}</div>
                    <div className="text-sm text-gray-600">Pozos</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-2xl font-bold text-orange-600">{result.summary.planRecords}</div>
                    <div className="text-sm text-gray-600">Planes</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-2xl font-bold text-red-600">{result.summary.realRecords}</div>
                    <div className="text-sm text-gray-600">Datos Reales</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-2xl font-bold text-gray-600">{result.summary.usuarios}</div>
                    <div className="text-sm text-gray-600">Usuarios</div>
                  </div>
                </div>
              </div>
            )}
            
            {result.success && (
              <div className="text-center">
                <a 
                  href="/dashboard" 
                  className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  🚀 IR AL DASHBOARD
                </a>
              </div>
            )}
            
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">Ver detalles técnicos</summary>
              <pre className="text-xs bg-gray-100 p-3 rounded mt-2 overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
        
        {/* Enlaces */}
        <div className="text-center space-x-4">
          <a 
            href="/dashboard" 
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            📊 Ver Dashboard
          </a>
          <a 
            href="/wells" 
            className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            ⚡ Ver Pozos
          </a>
          <a 
            href="/contracts" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            📄 Ver Contratos
          </a>
        </div>
        
        {/* Advertencia */}
        <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700">
            <strong>⚠️ Nota:</strong> Este proceso eliminará todos los datos existentes (excepto usuarios) 
            y creará un dataset completamente nuevo con datos de ejemplo realistas.
          </p>
        </div>
      </div>
    </div>
  )
}