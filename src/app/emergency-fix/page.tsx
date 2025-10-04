'use client'

import { useState } from 'react'

export default function EmergencyFixPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fixPasswords = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log('🚨 Ejecutando fix de emergencia...')
      
      const response = await fetch('/api/fix-passwords', {
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

  const testLogin = async (email: string, password: string) => {
    try {
      const { signIn } = await import('next-auth/react')
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      if (result?.error) {
        alert(`❌ Error de login: ${result.error}`)
      } else {
        alert(`✅ ¡Login exitoso! Redirigiendo...`)
        window.location.href = '/dashboard'
      }
    } catch (error) {
      alert(`❌ Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-red-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-800 mb-4">🚨 REPARACIÓN DE EMERGENCIA</h1>
          <p className="text-xl text-red-600 mb-8">
            Herramienta de emergencia para arreglar problemas de login
          </p>
        </div>
        
        {/* Botón de emergencia */}
        <div className="text-center mb-8">
          <button
            onClick={fixPasswords}
            disabled={loading}
            className="px-8 py-4 bg-red-600 text-white text-xl font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 shadow-lg"
          >
            {loading ? '🔄 ARREGLANDO...' : '🚨 ARREGLAR PASSWORDS AHORA'}
          </button>
        </div>
        
        {/* Resultado */}
        {result && (
          <div className={`p-6 rounded-lg shadow-md mb-8 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
            <h3 className={`font-bold mb-4 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '✅ PASSWORDS ARREGLADOS' : '❌ ERROR EN REPARACIÓN'}
            </h3>
            
            {result.success && result.credentials && (
              <div className="mb-6">
                <h4 className="font-semibold text-green-700 mb-3">🔑 Credenciales Reparadas:</h4>
                <div className="space-y-2">
                  {result.credentials.map((cred: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <span className="font-mono">{cred.email}</span> / <span className="font-mono">{cred.password}</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${cred.status === 'WORKING' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {cred.status}
                        </span>
                      </div>
                      <button
                        onClick={() => testLogin(cred.email, cred.password)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        🧪 Probar Login
                      </button>
                    </div>
                  ))}
                </div>
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
        
        {/* Instrucciones */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-8">
          <h3 className="font-bold text-yellow-800 mb-3">📋 INSTRUCCIONES:</h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>Haz clic en "ARREGLAR PASSWORDS AHORA"</li>
            <li>Espera a que se complete la reparación</li>
            <li>Si es exitosa, usa las credenciales mostradas</li>
            <li>Haz clic en "Probar Login" junto a cada credencial</li>
            <li>Si funciona, ve al <a href="/" className="text-blue-600 underline">login principal</a></li>
          </ol>
        </div>
        
        {/* Enlaces rápidos */}
        <div className="text-center space-x-4">
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            🏠 Ir a Login Principal
          </a>
          <a 
            href="/test-login" 
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            🧪 Página de Pruebas
          </a>
          <a 
            href="/dashboard" 
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            📊 Ir al Dashboard
          </a>
        </div>
        
        {/* Información adicional */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Esta herramienta regenera los hashes de password usando la configuración correcta de bcrypt.</p>
          <p>Funciona directamente en la base de datos de producción de Heroku.</p>
        </div>
      </div>
    </div>
  )
}