import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    console.log('🚨 EMERGENCIA: Arreglando passwords...');
    
    // Configuración exacta de bcrypt
    const saltRounds = 10;
    
    // Generar hash correcto para admin
    const adminPassword = 'admin123';
    const adminHash = await bcrypt.hash(adminPassword, saltRounds);
    
    console.log('🔑 Hash generado para admin:', adminHash);
    
    // Verificar que el hash funciona antes de guardarlo
    const adminVerification = await bcrypt.compare(adminPassword, adminHash);
    console.log('✅ Verificación admin antes de guardar:', adminVerification);
    
    if (!adminVerification) {
      throw new Error('Hash de admin no verifica correctamente');
    }
    
    // Actualizar admin en BD
    const updatedAdmin = await prisma.user.update({
      where: { email: 'admin@wellwizards.com' },
      data: { password: adminHash }
    });
    
    console.log('✅ Admin actualizado:', updatedAdmin.email);
    
    // Generar hash para usuario test
    const testPassword = '123456';
    const testHash = await bcrypt.hash(testPassword, saltRounds);
    
    const testVerification = await bcrypt.compare(testPassword, testHash);
    console.log('✅ Verificación test antes de guardar:', testVerification);
    
    if (!testVerification) {
      throw new Error('Hash de test no verifica correctamente');
    }
    
    // Actualizar test user (crear si no existe)
    let updatedTest;
    try {
      updatedTest = await prisma.user.update({
        where: { email: 'test@wellwizards.com' },
        data: { password: testHash }
      });
    } catch (error) {
      // Si no existe, crearlo
      updatedTest = await prisma.user.create({
        data: {
          email: 'test@wellwizards.com',
          name: 'Usuario Test',
          password: testHash,
          role: 'user'
        }
      });
    }
    
    console.log('✅ Test user actualizado/creado:', updatedTest.email);
    
    // Verificar desde la BD que funcionan
    console.log('🧪 Verificando desde BD...');
    
    const adminFromDB = await prisma.user.findUnique({
      where: { email: 'admin@wellwizards.com' }
    });
    
    const testFromDB = await prisma.user.findUnique({
      where: { email: 'test@wellwizards.com' }
    });
    
    const adminDBVerification = await bcrypt.compare(adminPassword, adminFromDB!.password);
    const testDBVerification = await bcrypt.compare(testPassword, testFromDB!.password);
    
    console.log('✅ Admin BD verification:', adminDBVerification);
    console.log('✅ Test BD verification:', testDBVerification);
    
    // Obtener todos los usuarios para mostrar estado
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    });
    
    return NextResponse.json({
      success: true,
      message: '🎉 Passwords arreglados exitosamente',
      details: {
        adminFixed: adminDBVerification,
        testFixed: testDBVerification,
        adminHash: adminHash.substring(0, 20) + '...',
        testHash: testHash.substring(0, 20) + '...',
        timestamp: new Date().toISOString()
      },
      users: allUsers.map(user => ({
        email: user.email,
        name: user.name,
        role: user.role,
        hashPrefix: user.password.substring(0, 15) + '...'
      })),
      credentials: [
        { email: 'admin@wellwizards.com', password: 'admin123', status: adminDBVerification ? 'WORKING' : 'FAILED' },
        { email: 'test@wellwizards.com', password: '123456', status: testDBVerification ? 'WORKING' : 'FAILED' }
      ]
    });
    
  } catch (error) {
    console.error('❌ Error en fix-passwords:', error);
    return NextResponse.json({
      success: false,
      error: 'Error arreglando passwords',
      details: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: '🚨 Endpoint de emergencia para arreglar passwords',
    instructions: 'Envía POST a este endpoint para arreglar los passwords',
    note: 'Este endpoint regenera los hashes con la configuración correcta de bcrypt'
  });
}