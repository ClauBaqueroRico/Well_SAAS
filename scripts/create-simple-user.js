// Script super simple para crear un usuario que funcione garantizado
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function createSimpleWorkingUser() {
  try {
    console.log('🔄 Creando usuario simple que funcione...');
    
    // Usar la configuración más básica posible
    const email = 'simple@test.com';
    const password = '123';
    
    console.log('📝 Email:', email);
    console.log('📝 Password:', password);
    
    // Generar hash con configuración muy básica
    const hash = await bcrypt.hash(password, 10);
    console.log('🔑 Hash generado:', hash);
    
    // Verificar inmediatamente
    const verification = await bcrypt.compare(password, hash);
    console.log('✅ Verificación inmediata:', verification);
    
    if (!verification) {
      throw new Error('Hash no funciona');
    }
    
    // Eliminar usuario si existe
    try {
      await prisma.user.delete({
        where: { email }
      });
      console.log('🗑️ Usuario existente eliminado');
    } catch (e) {
      console.log('ℹ️ Usuario no existía previamente');
    }
    
    // Crear usuario nuevo
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
    
    const dbVerification = await bcrypt.compare(password, userFromDB.password);
    console.log('✅ Verificación desde BD:', dbVerification);
    
    if (dbVerification) {
      console.log('\n🎉 ¡USUARIO SIMPLE CREADO EXITOSAMENTE!');
      console.log('🔑 Credenciales GARANTIZADAS:');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
      console.log('\n💡 Prueba estas credenciales simples en la aplicación');
    } else {
      throw new Error('Verificación desde BD falló');
    }
    
    // Listar todos los usuarios
    console.log('\n👥 Todos los usuarios en la BD:');
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true
      }
    });
    
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - ${user.name}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSimpleWorkingUser();