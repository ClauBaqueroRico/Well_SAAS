import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validaciones
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe con este email' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    // Remover la contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'Usuario creado exitosamente',
        user: userWithoutPassword
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}