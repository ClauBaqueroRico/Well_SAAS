// Script para generar hash usando EXACTAMENTE la misma configuración que NextAuth
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function regeneratePasswordWithExactConfig() {
  try {
    console.log('🔧 Regenerando hash con configuración exacta de NextAuth...');
    
    const password = 'admin123';
    console.log('📝 Password a hashear:', password);
    
    // Usar exactamente la misma configuración que en el código de NextAuth
    const saltRounds = 10; // Estándar de bcryptjs
    
    console.log('🧂 Salt rounds:', saltRounds);
    console.log('📚 Versión de bcryptjs:', require('bcryptjs/package.json').version);
    
    // Generar el hash
    const newHash = await bcrypt.hash(password, saltRounds);
    console.log('🔑 Nuevo hash generado:', newHash);
    
    // Verificar inmediatamente que funciona
    const testVerification = await bcrypt.compare(password, newHash);
    console.log('✅ Verificación inmediata:', testVerification);
    
    if (!testVerification) {
      throw new Error('El hash generado no verifica correctamente');
    }
    
    // Actualizar en la base de datos
    console.log('💾 Actualizando en base de datos...');
    const updatedUser = await prisma.user.update({
      where: { email: 'admin@wellwizards.com' },
      data: { password: newHash }
    });
    
    console.log('✅ Usuario actualizado:', updatedUser.email);
    console.log('🔍 Hash en BD:', newHash.substring(0, 20) + '...');
    
    // Verificar que funciona desde la BD
    console.log('🧪 Probando desde base de datos...');
    const userFromDB = await prisma.user.findUnique({
      where: { email: 'admin@wellwizards.com' }
    });
    
    if (!userFromDB) {
      throw new Error('Usuario no encontrado en BD');
    }
    
    const dbVerification = await bcrypt.compare(password, userFromDB.password);
    console.log('✅ Verificación desde BD:', dbVerification);
    
    if (dbVerification) {
      console.log('\n🎉 ¡ÉXITO! Hash regenerado correctamente');
      console.log('🔑 Credenciales funcionando:');
      console.log('   Email: admin@wellwizards.com');
      console.log('   Password: admin123');
    } else {
      console.log('❌ ERROR: Hash no verifica desde BD');
    }
    
    // También actualizar el usuario test
    console.log('\n👤 Actualizando usuario test...');
    const testPassword = '123456';
    const testHash = await bcrypt.hash(testPassword, saltRounds);
    
    await prisma.user.update({
      where: { email: 'test@wellwizards.com' },
      data: { password: testHash }
    });
    
    const testVerificationDB = await bcrypt.compare(testPassword, testHash);
    console.log('✅ Usuario test actualizado:', testVerificationDB);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

regeneratePasswordWithExactConfig();