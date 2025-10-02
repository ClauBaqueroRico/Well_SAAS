import { RegisterForm } from '@/components/auth/register-form'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Registro - Well Wizards SaaS
          </h1>
          <p className="text-gray-600">
            Crea tu cuenta para acceder al sistema
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Crear Cuenta
            </h2>
            <RegisterForm />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/" className="text-blue-600 hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}