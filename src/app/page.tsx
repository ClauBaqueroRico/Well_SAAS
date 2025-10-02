import { AuthForm } from '@/components/auth/auth-form'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Well Wizards SaaS
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sistema completo de gestión y análisis de datos de pozos petrolíferos
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Acceso al Sistema
            </h2>
            <AuthForm />
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}