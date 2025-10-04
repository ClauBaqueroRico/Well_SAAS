import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🏗️ Poblando datos avanzados...');
    
    // Limpiar datos existentes (excepto usuarios)
    console.log('🧹 Limpiando datos existentes...');
    await prisma.drillingData.deleteMany();
    await prisma.drillingPlan.deleteMany();
    await prisma.well.deleteMany();
    await prisma.field.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.client.deleteMany();
    
    // Obtener usuario simple (debe existir)
    const user = await prisma.user.findUnique({
      where: { email: 'simple@test.com' }
    });
    
    if (!user) {
      throw new Error('Usuario simple no encontrado');
    }
    
    console.log('👤 Usuario encontrado:', user.email);
    
    // CREAR 3 CLIENTES
    console.log('🏢 Creando clientes...');
    const clients = [];
    
    const clientsData = [
      { name: 'Ecopetrol S.A.', email: 'operaciones@ecopetrol.com.co', contactName: 'Carlos Mendoza' },
      { name: 'Pacific Rubiales', email: 'drilling@pacific.com', contactName: 'Ana Rodriguez' },
      { name: 'Gran Tierra Energy', email: 'operations@gran-tierra.com', contactName: 'Miguel Torres' }
    ];
    
    for (const clientData of clientsData) {
      const client = await prisma.client.create({
        data: clientData
      });
      clients.push(client);
      console.log(`✅ Cliente: ${client.name}`);
    }
    
    // CREAR 5 CONTRATOS (distribuyendo entre clientes)
    console.log('📄 Creando contratos...');
    const contracts = [];
    
    const contractsData = [
      { name: 'Contrato Cusiana 2024', clientIndex: 0, value: 2500000, startDate: '2024-01-15', endDate: '2024-12-15' },
      { name: 'Proyecto Llanos 2024', clientIndex: 1, value: 1800000, startDate: '2024-03-01', endDate: '2024-11-30' },
      { name: 'Campaña Magdalena 2024', clientIndex: 2, value: 3200000, startDate: '2024-02-10', endDate: '2025-01-10' },
      { name: 'Desarrollo Putumayo 2024', clientIndex: 0, value: 2100000, startDate: '2024-04-01', endDate: '2024-12-31' },
      { name: 'Exploración Casanare 2024', clientIndex: 1, value: 1500000, startDate: '2024-05-15', endDate: '2024-10-15' }
    ];
    
    for (const contractData of contractsData) {
      const contract = await prisma.contract.create({
        data: {
          name: contractData.name,
          startDate: new Date(contractData.startDate),
          endDate: new Date(contractData.endDate),
          value: contractData.value,
          clientId: clients[contractData.clientIndex].id,
          userId: user.id
        }
      });
      contracts.push(contract);
      console.log(`✅ Contrato: ${contract.name}`);
    }
    
    // CREAR 5 CAMPOS (uno por contrato)
    console.log('🏭 Creando campos...');
    const fields = [];
    
    const fieldsData = [
      { name: 'Campo Cusiana Norte', location: 'Casanare, Colombia' },
      { name: 'Bloque Llanos 34', location: 'Meta, Colombia' },
      { name: 'Área Magdalena Sur', location: 'Magdalena, Colombia' },
      { name: 'Sector Putumayo Central', location: 'Putumayo, Colombia' },
      { name: 'Zona Casanare Este', location: 'Casanare, Colombia' }
    ];
    
    for (let i = 0; i < fieldsData.length; i++) {
      const field = await prisma.field.create({
        data: {
          ...fieldsData[i],
          contractId: contracts[i].id
        }
      });
      fields.push(field);
      console.log(`✅ Campo: ${field.name}`);
    }
    
    // CREAR 8 POZOS (distribuyendo entre campos)
    console.log('⚡ Creando pozos...');
    const wells = [];
    
    const wellsData = [
      { name: 'Cusiana-HZ-15', fieldIndex: 0 },
      { name: 'Cusiana-ST-22', fieldIndex: 0 },
      { name: 'Llanos-34-A1', fieldIndex: 1 },
      { name: 'Llanos-34-B2', fieldIndex: 1 },
      { name: 'Magdalena-Sur-7', fieldIndex: 2 },
      { name: 'Putumayo-C12', fieldIndex: 3 },
      { name: 'Putumayo-D8', fieldIndex: 3 },
      { name: 'Casanare-E-01', fieldIndex: 4 }
    ];
    
    for (const wellData of wellsData) {
      const well = await prisma.well.create({
        data: {
          name: wellData.name,
          location: fields[wellData.fieldIndex].location,
          userId: user.id,
          fieldId: fields[wellData.fieldIndex].id
        }
      });
      wells.push(well);
      console.log(`✅ Pozo: ${well.name}`);
    }
    
    // CREAR PLANES DE PERFORACIÓN PARA CADA POZO
    console.log('📋 Creando planes de perforación...');
    let plansCreated = 0;
    
    for (const well of wells) {
      // Crear plan de 7-10 días por pozo (variando)
      const days = 7 + Math.floor(Math.random() * 4); // 7-10 días
      let currentDepth = 0;
      
      for (let day = 1; day <= days; day++) {
        const dayProgress = 300 + Math.random() * 400; // 300-700m por día
        const depthTo = currentDepth + dayProgress;
        
        await prisma.drillingPlan.create({
          data: {
            wellId: well.id,
            day: day,
            depthFrom: currentDepth,
            depthTo: depthTo,
            plannedROP: 250 + Math.random() * 200, // 250-450 m/hr
            plannedHours: 1.5 + Math.random() * 2.5 // 1.5-4 horas
          }
        });
        
        currentDepth = depthTo;
        plansCreated++;
      }
    }
    
    console.log(`✅ Planes creados: ${plansCreated} días de perforación`);
    
    // CREAR DATOS REALES DE PERFORACIÓN
    console.log('📊 Creando datos reales...');
    let dataCreated = 0;
    
    const plans = await prisma.drillingPlan.findMany({
      orderBy: [{ wellId: 'asc' }, { day: 'asc' }]
    });
    
    for (const plan of plans) {
      // Generar variación realista (-10% a +5% del plan)
      const variation = -0.1 + Math.random() * 0.15; // -10% a +5%
      const realDepth = plan.depthTo * (1 + variation);
      
      // Calcular progreso diario
      const progressM = plan.depthTo - plan.depthFrom;
      
      await prisma.drillingData.create({
        data: {
          wellId: plan.wellId,
          day: plan.day,
          date: new Date(2024, 0, plan.day), // Enero 2024
          depth: Math.round(realDepth),
          plan: plan.depthTo,
          progressM: Math.round(progressM * (1 + variation))
        }
      });
      
      dataCreated++;
    }
    
    console.log(`✅ Datos reales creados: ${dataCreated} registros`);
    
    // RESUMEN FINAL
    const summary = {
      usuarios: await prisma.user.count(),
      clientes: await prisma.client.count(),
      contratos: await prisma.contract.count(),
      campos: await prisma.field.count(),
      pozos: await prisma.well.count(),
      planRecords: await prisma.drillingPlan.count(),
      realRecords: await prisma.drillingData.count()
    };
    
    console.log('📊 Resumen final:', summary);
    
    return NextResponse.json({
      success: true,
      message: '🎉 Datos avanzados poblados exitosamente',
      summary,
      details: {
        clientsCreated: clients.length,
        contractsCreated: contracts.length,
        fieldsCreated: fields.length,
        wellsCreated: wells.length,
        plansCreated,
        dataCreated
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error poblando datos avanzados:', error);
    return NextResponse.json({
      success: false,
      error: 'Error poblando datos avanzados',
      details: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: '🏗️ Endpoint para poblar datos avanzados',
    instructions: 'Envía POST para crear múltiples clientes, contratos, pozos y datos',
    note: 'Creará un dataset completo y realista para el dashboard'
  });
}