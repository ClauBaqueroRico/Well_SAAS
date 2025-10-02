// Script para configurar la base de datos en Heroku
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('🚀 Iniciando configuración de base de datos en Heroku...');

    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión a base de datos establecida');

    // Crear usuario administrador
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@wellwizards.com' },
      update: {},
      create: {
        email: 'admin@wellwizards.com',
        name: 'Administrador',
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log('✅ Usuario administrador creado:', admin.email);

    // Crear cliente de prueba
    const client = await prisma.client.upsert({
      where: { name: 'Empresa Demo' },
      update: {},
      create: {
        name: 'Empresa Demo',
        email: 'demo@empresa.com',
        phone: '+1 555-0123',
        address: '123 Main Street, Houston, TX',
        contactPerson: 'Juan Pérez',
        industry: 'Petróleo y Gas'
      }
    });

    console.log('✅ Cliente de prueba creado:', client.name);

    // Crear contrato de prueba
    const contract = await prisma.contract.upsert({
      where: { name: 'Contrato Demo' },
      update: {},
      create: {
        name: 'Contrato Demo',
        description: 'Contrato de demostración para Well Wizards SaaS',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        value: 500000,
        currency: 'USD',
        status: 'active',
        contractType: 'drilling',
        targetDepth: 10000,
        expectedDays: 45,
        dailyRate: 15000,
        clientId: client.id,
        userId: admin.id
      }
    });

    console.log('✅ Contrato de prueba creado:', contract.name);

    // Crear campo de prueba
    const field = await prisma.field.upsert({
      where: { name: 'Campo Demo' },
      update: {},
      create: {
        name: 'Campo Demo',
        location: 'Texas, USA',
        description: 'Campo de demostración',
        latitude: 29.7604,
        longitude: -95.3698,
        contractId: contract.id
      }
    });

    console.log('✅ Campo de prueba creado:', field.name);

    // Crear pozo de prueba
    const well = await prisma.well.upsert({
      where: { name: 'Pozo Demo-1' },
      update: {},
      create: {
        name: 'Pozo Demo-1',
        location: 'Texas, USA',
        status: 'drilling',
        depth: 8500,
        wellType: 'horizontal',
        formation: 'Eagle Ford',
        operation: 'drilling',
        latitude: 29.7604,
        longitude: -95.3698,
        userId: admin.id,
        fieldId: field.id
      }
    });

    console.log('✅ Pozo de prueba creado:', well.name);

    console.log('🎉 ¡Configuración de base de datos completada exitosamente!');
    console.log('📋 Credenciales de acceso:');
    console.log('   Email: admin@wellwizards.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Setup completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup falló:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };