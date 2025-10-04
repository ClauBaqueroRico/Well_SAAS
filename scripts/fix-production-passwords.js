// Script para actualizar la base de datos de PRODUCCIÓN (Heroku)
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

// URL de base de datos de Heroku
const HEROKU_DATABASE_URL = "postgresql://uch4pf3igdaodg:pa6af14ee30b4c9b5d39c0b1c6f9d53a2cfc0e61ee5f97b652c8b0e23bae3a35a@c5flugvup2318r.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/dc7v4b3k68qo1n";

const prisma = new PrismaClient({
  datasourceUrl: HEROKU_DATABASE_URL
});

async function updateProductionPasswords() {
  try {
    console.log('🌐 Actualizando passwords en PRODUCCIÓN (Heroku)...');
    console.log('🗄️  Base de datos:', HEROKU_DATABASE_URL.split('@')[1]?.split('.')[0] + '...');
    
    // Configuración exacta
    const saltRounds = 10;
    
    // Actualizar admin
    console.log('👤 Actualizando usuario admin...');
    const adminPassword = 'admin123';
    const adminHash = await bcrypt.hash(adminPassword, saltRounds);
    
    await prisma.user.update({
      where: { email: 'admin@wellwizards.com' },
      data: { password: adminHash }
    });
    
    // Verificar admin
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@wellwizards.com' }
    });
    
    if (adminUser) {
      const adminVerification = await bcrypt.compare(adminPassword, adminUser.password);
      console.log('✅ Admin verification:', adminVerification);
    }
    
    // Actualizar test user
    console.log('👤 Actualizando usuario test...');
    const testPassword = '123456';
    const testHash = await bcrypt.hash(testPassword, saltRounds);
    
    await prisma.user.update({
      where: { email: 'test@wellwizards.com' },
      data: { password: testHash }
    });
    
    // Verificar test user
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@wellwizards.com' }
    });
    
    if (testUser) {
      const testVerification = await bcrypt.compare(testPassword, testUser.password);
      console.log('✅ Test user verification:', testVerification);
    }
    
    // Listar todos los usuarios de producción
    console.log('\n📊 Usuarios en producción:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    });
    
    users.forEach(user => {
      console.log(`👤 ${user.email} (${user.role}) - Hash: ${user.password.substring(0, 15)}...`);
    });
    
    console.log('\n🎉 ¡PASSWORDS DE PRODUCCIÓN ACTUALIZADOS!');
    console.log('🌐 Prueba en: https://wellsaas-99852eae3e84.herokuapp.com/');
    console.log('🧪 Test page: https://wellsaas-99852eae3e84.herokuapp.com/test-login');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateProductionPasswords();