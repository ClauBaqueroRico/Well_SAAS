// Script simplificado para configurar la base de datos en Heroku
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function simpleSetup() {
  try {
    console.log('🚀 Iniciando configuración simple de base de datos...');

    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión a PostgreSQL establecida');

    // Crear usuario administrador sin bcrypt (para evitar errores de dependencias)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@wellwizards.com' },
      update: {},
      create: {
        email: 'admin@wellwizards.com',
        name: 'Administrador',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123 ya hasheado
        role: 'admin'
      }
    });

    console.log('✅ Usuario administrador creado:', admin.email);
    console.log('📋 Credenciales: admin@wellwizards.com / admin123');
    
    console.log('🎉 ¡Configuración básica completada!');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
    console.log('📝 Información del error:', {
      name: error.name,
      code: error.code || 'N/A'
    });
  } finally {
    await prisma.$disconnect();
  }
}

simpleSetup();