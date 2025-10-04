// API endpoint para probar la autenticación directamente
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('🧪 Test Auth API - Email:', email);
    
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Faltan credenciales' 
      }, { status: 400 });
    }
    
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      }, { status: 404 });
    }
    
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    return NextResponse.json({
      success: true,
      message: 'Test de autenticación',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      passwordValid: isPasswordValid,
      hashInfo: {
        provided: password,
        hashedLength: user.password.length,
        hashPrefix: user.password.substring(0, 10)
      }
    });
    
  } catch (error) {
    console.error('❌ Error en test auth:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de test de autenticación',
    instructions: 'Envía POST con email y password para probar',
    availableUsers: [
      { email: 'admin@wellwizards.com', password: 'admin123', role: 'admin' },
      { email: 'test@wellwizards.com', password: '123456', role: 'user' }
    ]
  });
}