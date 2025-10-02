'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/contracts', label: 'Contratos', icon: '📋' },
  { href: '/contracts/management', label: 'Gestión Contratos', icon: '⚙️' },
  { href: '/wells', label: 'Pozos', icon: '🛢️' },
  { href: '/production', label: 'Producción', icon: '📈' },
  { href: '/analytics', label: 'Análisis', icon: '📊' },
  { href: '/reports', label: 'Reportes', icon: '📄' },
  { href: '/admin', label: 'Administración', icon: '🔧' },
]

export function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h2 className="text-xl font-bold text-blue-600">
                Well Wizards
              </h2>
            </div>
            
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm inline-flex items-center`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <span className="text-black text-sm">
                Hola, {session?.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
