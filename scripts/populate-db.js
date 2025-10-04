// Script para poblar la base de datos usando Prisma
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function main() {
  try {
    console.log('🧹 Limpiando datos existentes...');
    
    // Limpiar en orden correcto (respetando foreign keys)
    await prisma.drillingData.deleteMany();
    await prisma.drillingPlan.deleteMany();
    await prisma.well.deleteMany();
    await prisma.field.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.client.deleteMany();
    await prisma.user.deleteMany({
      where: { email: 'admin@wellwizards.com' }
    });

    console.log('✅ Datos limpiados');

    // 1. Crear usuario admin
    console.log('👤 Creando usuario admin...');
    const user = await prisma.user.create({
      data: {
        email: 'admin@wellwizards.com',
        name: 'Administrador',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
        role: 'admin'
      }
    });
    console.log(`✅ Usuario creado con ID: ${user.id}`);

    // 2. Crear cliente
    console.log('🏢 Creando cliente...');
    const client = await prisma.client.create({
      data: {
        name: 'Ecopetrol Demo'
      }
    });
    console.log(`✅ Cliente creado con ID: ${client.id}`);

    // 3. Crear contrato
    console.log('📄 Creando contrato...');
    const contract = await prisma.contract.create({
      data: {
        name: 'Contrato Demo',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        value: 500000,
        clientId: client.id,
        userId: user.id
      }
    });
    console.log(`✅ Contrato creado con ID: ${contract.id}`);

    // 4. Crear campo
    console.log('🏭 Creando campo...');
    const field = await prisma.field.create({
      data: {
        name: 'Campo Demo',
        location: 'Colombia',
        contractId: contract.id
      }
    });
    console.log(`✅ Campo creado con ID: ${field.id}`);

    // 5. Crear pozo
    console.log('⚡ Creando pozo...');
    const well = await prisma.well.create({
      data: {
        name: 'Pozo Demo-1',
        location: 'Colombia',
        userId: user.id,
        fieldId: field.id
      }
    });
    console.log(`✅ Pozo creado con ID: ${well.id}`);

    // 6. Crear plan de perforación (5 días)
    console.log('📋 Creando plan de perforación...');
    const planData = [
      { day: 1, depthFrom: 0, depthTo: 500, plannedROP: 250, plannedHours: 2.0 },
      { day: 2, depthFrom: 500, depthTo: 1200, plannedROP: 350, plannedHours: 2.0 },
      { day: 3, depthFrom: 1200, depthTo: 2000, plannedROP: 400, plannedHours: 2.0 },
      { day: 4, depthFrom: 2000, depthTo: 3000, plannedROP: 350, plannedHours: 2.9 },
      { day: 5, depthFrom: 3000, depthTo: 4000, plannedROP: 300, plannedHours: 3.3 }
    ];

    for (const plan of planData) {
      await prisma.drillingPlan.create({
        data: {
          wellId: well.id,
          day: plan.day,
          depthFrom: plan.depthFrom,
          depthTo: plan.depthTo,
          plannedROP: plan.plannedROP,
          plannedHours: plan.plannedHours
        }
      });
    }
    console.log(`✅ Plan de perforación creado (${planData.length} días)`);

    // 7. Crear datos reales de perforación
    console.log('📊 Creando datos reales...');
    const realData = [
      { day: 1, date: new Date('2024-01-01'), depth: 480, plan: 500 },
      { day: 2, date: new Date('2024-01-02'), depth: 1150, plan: 1200 },
      { day: 3, date: new Date('2024-01-03'), depth: 1980, plan: 2000 },
      { day: 4, date: new Date('2024-01-04'), depth: 2950, plan: 3000 },
      { day: 5, date: new Date('2024-01-05'), depth: 3950, plan: 4000 }
    ];

    for (const real of realData) {
      await prisma.drillingData.create({
        data: {
          wellId: well.id,
          day: real.day,
          date: real.date,
          depth: real.depth,
          plan: real.plan,
          progressM: real.depth - (realData[real.day - 2]?.depth || 0) // Progreso diario
        }
      });
    }
    console.log(`✅ Datos reales creados (${realData.length} días)`);

    // 8. Verificar datos creados
    console.log('\n📈 RESUMEN DE DATOS CREADOS:');
    const counts = {
      usuarios: await prisma.user.count(),
      clientes: await prisma.client.count(),
      contratos: await prisma.contract.count(),
      campos: await prisma.field.count(),
      pozos: await prisma.well.count(),
      planRecords: await prisma.drillingPlan.count(),
      realRecords: await prisma.drillingData.count()
    };

    console.table(counts);

    // 9. Mostrar datos Plan vs Real
    console.log('\n📊 DATOS PLAN VS REAL:');
    const planVsReal = await prisma.drillingPlan.findMany({
      where: { wellId: well.id },
      include: {
        well: true
      },
      orderBy: { day: 'asc' }
    });

    const realDataMap = {};
    const realRecords = await prisma.drillingData.findMany({
      where: { wellId: well.id }
    });
    
    realRecords.forEach(record => {
      realDataMap[record.day] = record.depth;
    });

    const comparison = planVsReal.map(plan => ({
      Día: plan.day,
      'Plan (m)': plan.depthTo,
      'Real (m)': realDataMap[plan.day] || 0,
      'Diferencia (m)': (realDataMap[plan.day] || 0) - plan.depthTo
    }));

    console.table(comparison);

    console.log('\n🎉 BASE DE DATOS POBLADA EXITOSAMENTE!');
    console.log('🔑 Credenciales de login:');
    console.log('   Email: admin@wellwizards.com');
    console.log('   Password: admin123');
    console.log('\n🌐 Aplicación: https://wellsaas-99852eae3e84.herokuapp.com/');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { main };