'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TestLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showValues, setShowValues] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowValues(true)
    console.log('Email:', email)
    console.log('Password:', password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Well Wizards SaaS - Test Login
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Página de prueba para verificar formulario
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Test de Login
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    console.log('Email changed:', e.target.value)
                    setEmail(e.target.value)
                  }}
                  placeholder="admin@wellwizards.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    console.log('Password changed:', e.target.value)
                    setPassword(e.target.value)
                  }}
                  placeholder="admin123"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Probar Formulario
              </button>
            </form>

            {showValues && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Valores Capturados:</h3>
                <p className="text-sm text-green-700">Email: {email || 'No ingresado'}</p>
                <p className="text-sm text-green-700">Password: {password || 'No ingresado'}</p>
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                <Link href="/" className="text-blue-600 hover:underline">
                  ← Volver al login principal
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg p-4 inline-block">
            <h3 className="font-semibold mb-2">Credenciales de Prueba:</h3>
            <p className="text-sm text-gray-600">📧 admin@wellwizards.com</p>
            <p className="text-sm text-gray-600">🔑 admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}