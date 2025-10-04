'use client'

import { useState, useEffect } from 'react'

export default function LoginTestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [configInfo, setConfigInfo] = useState<any>(null)

  useEffect(() => {
    // Cargar información de configuración al inicializar
    fetch('/api/debug-config')
      .then(res => res.json())
      .then(data => setConfigInfo(data))
      .catch(err => console.error('Error loading config:', err))
  }, [])

  const testCredentials = async (email: string, password: string) => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log('🧪 Probando credenciales:', email)
      
      // Probar el endpoint directo primero
      const directResponse = await fetch('/api/test-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const directResult = await directResponse.json()
      console.log('📊 Resultado directo:', directResult)
      
      // Probar NextAuth
      const { signIn } = await import('next-auth/react')
      const nextAuthResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      console.log('🔐 Resultado NextAuth:', nextAuthResult)
      
      setResult({
        direct: directResult,
        nextAuth: nextAuthResult,
        timestamp: new Date().toISOString()
      })
      
    } catch (error) {
      console.error('❌ Error en test:', error)
      setResult({
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">🧪 Well Wizards - Test de Login</h1>
        
        {/* Información de configuración */}
        {configInfo && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="font-bold text-blue-800 mb-2">⚙️ Configuración del Servidor</h2>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Entorno:</strong> {configInfo.environment}</p>
              <p><strong>Base de Datos:</strong> {configInfo.databaseUrl}</p>
              <p><strong>NextAuth URL:</strong> {configInfo.nextAuthUrl}</p>
              <p><strong>NextAuth Secret:</strong> {configInfo.nextAuthSecret}</p>
              <p><strong>Timestamp:</strong> {configInfo.timestamp}</p>
            </div>
          </div>
        )}
        
        {/* Botones de prueba */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => testCredentials('admin@wellwizards.com', 'admin123')}
            disabled={loading}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '🔄 Probando...' : '🔑 Probar Admin (admin123)'}
          </button>
          
          <button
            onClick={() => testCredentials('test@wellwizards.com', '123456')}
            disabled={loading}
            className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? '🔄 Probando...' : '👤 Probar Test User (123456)'}
          </button>
        </div>
        
        {/* Resultado */}
        {result && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-4">
              {result.error ? '❌ Error en las Pruebas' : '📊 Resultados de las Pruebas'}
            </h3>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        {/* Información adicional */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-green-800 mb-2">✅ Credenciales Válidas</h3>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>Admin:</strong> admin@wellwizards.com / admin123</p>
              <p><strong>Test:</strong> test@wellwizards.com / 123456</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-bold text-yellow-800 mb-2">🔍 Diagnóstico</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>• Test Directo: Verifica la BD y bcrypt</p>
              <p>• Test NextAuth: Verifica el flujo completo</p>
              <p>• Ambos deben devolver success: true</p>
            </div>
          </div>
        </div>
        
        {/* Enlaces rápidos */}
        <div className="mt-6 text-center space-x-4">
          <a 
            href="/" 
            className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            🏠 Ir a Login Normal
          </a>
          <a 
            href="/api/test-auth" 
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            � API Test Directo
          </a>
          <a 
            href="/api/debug-config" 
            className="inline-block px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            ⚙️ Ver Configuración
          </a>
        </div>
      </div>
    </div>
  )
}