import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Verificando estado de la base de datos...');
    
    // Listar todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    console.log('📊 Usuarios encontrados:', users.length);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      userCount: users.length,
      users: users,
      message: 'Base de datos accesible'
    });
    
  } catch (error) {
    console.error('❌ Error accediendo BD:', error);
    return NextResponse.json({
      success: false,
      error: 'Error accediendo a la base de datos',
      details: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log('🔄 Creando usuario simple desde endpoint...');
    
    const bcrypt = await import('bcryptjs');
    
    // Configuración super simple
    const email = 'simple@test.com';
    const password = '123';
    const saltRounds = 10;
    
    console.log('📝 Creando usuario:', email);
    
    // Generar hash
    const hash = await bcrypt.default.hash(password, saltRounds);
    console.log('🔑 Hash generado, longitud:', hash.length);
    
    // Verificar hash funciona
    const verification = await bcrypt.default.compare(password, hash);
    console.log('✅ Verificación hash:', verification);
    
    if (!verification) {
      throw new Error('Hash no verifica correctamente');
    }
    
    // Eliminar usuario si existe
    try {
      await prisma.user.delete({
        where: { email }
      });
      console.log('🗑️ Usuario existente eliminado');
    } catch (e) {
      console.log('ℹ️ Usuario no existía');
    }
    
    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        name: 'Usuario Simple',
        password: hash,
        role: 'admin'
      }
    });
    
    console.log('✅ Usuario creado:', newUser.email);
    
    // Verificar desde BD
    const userFromDB = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!userFromDB) {
      throw new Error('Usuario no encontrado después de crear');
    }
    
    const dbVerification = await bcrypt.default.compare(password, userFromDB.password);
    console.log('✅ Verificación desde BD:', dbVerification);
    
    return NextResponse.json({
      success: true,
      message: '🎉 Usuario simple creado exitosamente',
      credentials: {
        email,
        password,
        verified: dbVerification
      },
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    return NextResponse.json({
      success: false,
      error: 'Error creando usuario simple',
      details: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}