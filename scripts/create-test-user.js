// Script para crear un usuario de prueba adicional
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function createTestUser() {
  try {
    console.log('👤 Creando usuario de prueba...');
    
    // Generar hash para contraseña simple
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Verificar si ya existe
    const existing = await prisma.user.findUnique({
      where: { email: 'test@wellwizards.com' }
    });
    
    if (existing) {
      console.log('🔄 Actualizando usuario existente...');
      const updatedUser = await prisma.user.update({
        where: { email: 'test@wellwizards.com' },
        data: { 
          password: hashedPassword,
          name: 'Usuario Test'
        }
      });
      console.log('✅ Usuario test actualizado');
    } else {
      console.log('➕ Creando nuevo usuario test...');
      const newUser = await prisma.user.create({
        data: {
          email: 'test@wellwizards.com',
          name: 'Usuario Test',
          password: hashedPassword,
          role: 'user'
        }
      });
      console.log('✅ Usuario test creado');
    }
    
    // Verificar que funciona
    const testValid = await bcrypt.compare(password, hashedPassword);
    console.log('🔍 Verificación:', testValid ? '✅ VÁLIDA' : '❌ INVÁLIDA');
    
    console.log('\n🎯 CREDENCIALES DE PRUEBA:');
    console.log('   Email: test@wellwizards.com');
    console.log('   Password: 123456');
    
    console.log('\n🎯 CREDENCIALES ADMIN:');
    console.log('   Email: admin@wellwizards.com');
    console.log('   Password: admin123');
    
    // Listar todos los usuarios
    console.log('\n👥 USUARIOS DISPONIBLES:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    console.table(users);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();