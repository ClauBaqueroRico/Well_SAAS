// Script para probar la autenticación
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function testLogin() {
  try {
    console.log('🧪 Probando autenticación...');
    
    const email = 'admin@wellwizards.com';
    const password = 'admin123';
    
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }
    
    console.log('✅ Usuario encontrado:');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Nombre:', user.name);
    console.log('   Rol:', user.role);
    console.log('   Hash almacenado:', user.password.substring(0, 20) + '...');
    
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    console.log('\n🔍 Resultado de la verificación:');
    console.log('   Contraseña proporcionada: "admin123"');
    console.log('   Hash en base de datos: ' + (user.password.length > 0 ? 'PRESENTE' : 'AUSENTE'));
    console.log('   Verificación bcrypt:', isPasswordValid ? '✅ VÁLIDA' : '❌ INVÁLIDA');
    
    if (isPasswordValid) {
      console.log('\n🎉 ¡AUTENTICACIÓN EXITOSA!');
      console.log('El usuario puede hacer login correctamente.');
    } else {
      console.log('\n❌ AUTENTICACIÓN FALLIDA');
      console.log('Hay un problema con la verificación de la contraseña.');
    }
    
  } catch (error) {
    console.error('❌ Error en test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();