// Script para arreglar el hash de la contraseña del usuario admin
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function fixAdminPassword() {
  try {
    console.log('🔧 Arreglando contraseña del usuario admin...');
    
    // Generar un hash correcto para "admin123"
    const password = 'admin123';
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('🔑 Nuevo hash generado para "admin123"');
    console.log('Hash:', hashedPassword);
    
    // Actualizar el usuario admin
    const updatedUser = await prisma.user.update({
      where: { email: 'admin@wellwizards.com' },
      data: { 
        password: hashedPassword,
        name: 'Administrador' // Asegurar que tenga nombre
      }
    });
    
    console.log('✅ Usuario admin actualizado correctamente');
    console.log('📧 Email:', updatedUser.email);
    console.log('👤 Nombre:', updatedUser.name);
    console.log('🎭 Rol:', updatedUser.role);
    
    // Verificar que el hash funciona
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('🔍 Verificación del hash:', isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO');
    
    console.log('\n🎉 ¡Contraseña arreglada exitosamente!');
    console.log('🔑 Credenciales de login:');
    console.log('   Email: admin@wellwizards.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  fixAdminPassword();
}

module.exports = { fixAdminPassword };