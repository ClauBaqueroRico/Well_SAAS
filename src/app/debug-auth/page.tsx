'use client'

import { useState } from 'react'

export default function DiagnosticPage() {
  const [email, setEmail] = useState('admin@wellwizards.com')
  const [password, setPassword] = useState('admin123')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAuth = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      // Probar el endpoint de test
      const response = await fetch('/api/test-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: 'Error de red',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setLoading(false)
    }
  }

  const testNextAuth = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      // Usar la función signIn de NextAuth
      const { signIn } = await import('next-auth/react')
      
      const authResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      setResult({
        success: !authResult?.error,
        nextAuthResult: authResult,
        error: authResult?.error || null
      })
    } catch (error) {
      setResult({
        success: false,
        error: 'Error con NextAuth',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">🔧 Diagnóstico de Autenticación</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={testAuth}
              disabled={loading}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Probando...' : 'Probar API Directa'}
            </button>
            
            <button
              onClick={testNextAuth}
              disabled={loading}
              className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Probando...' : 'Probar NextAuth'}
            </button>
          </div>
          
          {result && (
            <div className="mt-6 p-4 border rounded-md">
              <h3 className="font-bold mb-2">
                {result.success ? '✅ Resultado' : '❌ Error'}
              </h3>
              <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="font-bold text-blue-800 mb-2">💡 Credenciales de Prueba:</h3>
            <div className="text-sm text-blue-700">
              <p><strong>Admin:</strong> admin@wellwizards.com / admin123</p>
              <p><strong>Test:</strong> test@wellwizards.com / 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}