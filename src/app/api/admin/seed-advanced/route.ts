import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log('🚀 Iniciando seed avanzado de base de datos...\n');

    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await prisma.drillingData.deleteMany();
    await prisma.well.deleteMany();
    await prisma.field.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.client.deleteMany();
    await prisma.user.deleteMany();

    // Crear usuario administrador
    console.log('👤 Creando usuario administrador...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await prisma.user.create({
      data: {
        email: 'admin@wellwizards.com',
        password: hashedPassword,
        name: 'Administrador Well Wizards',
        role: 'ADMIN',
      },
    });

    // Datos base para generación realista
    const formations = [
      'La Luna', 'Guadalupe', 'Barco', 'Mirador', 'Carbonera', 'León', 'Paujil',
      'Lisama', 'La Paz', 'Esmeraldas', 'Mugrosa', 'Colorado', 'Gacheta', 'Ubaque'
    ];

    const holeSections = [
      '26" Conductor', '17-1/2" Surface', '12-1/4" Intermediate', '8-1/2" Production',
      '6" Horizontal', '9-5/8" Casing', '7" Liner', '4-1/2" Completion'
    ];

    const operations = [
      'Drilling', 'Tripping', 'Casing Running', 'Cementing', 'Logging', 'Testing',
      'Completion', 'Perforation', 'Stimulation', 'Workover', 'Maintenance',
      'Waiting on Weather', 'NPT - Equipment', 'NPT - Operational'
    ];

    const mudTypes = [
      'WBM - Water Base', 'OBM - Oil Base', 'SBM - Synthetic Base',
      'Polymer', 'KCL Polymer', 'PHPA', 'Silicate', 'Formate', 'Cesium Formate'
    ];

    const bitTypes = [
      'PDC - 5 Blades', 'PDC - 6 Blades', 'Roller Cone - TCI', 'Hybrid',
      'Natural Diamond', 'TSP', 'Steel Tooth', 'Impregnated', 'Core Bit'
    ];

    const lithologies = [
      'Sandstone', 'Limestone', 'Shale', 'Conglomerate', 'Mudstone',
      'Siltstone', 'Claystone', 'Marl', 'Dolomite', 'Anhydrite'
    ];

    // Crear 3 clientes
    console.log('🏢 Creando clientes...');
    const clients = [];
    const clientNames = ['Ecopetrol S.A.', 'Gran Tierra Energy', 'GeoPark Colombia'];
    
    for (let i = 0; i < clientNames.length; i++) {
      const client = await prisma.client.create({
        data: {
          name: clientNames[i],
          contactEmail: `contact@${clientNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
          contactPhone: `+57-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          address: `Bogotá, Colombia - Office ${i + 1}`,
        },
      });
      clients.push(client);
    }

    // Crear 3 contratos
    console.log('📋 Creando contratos...');
    const contracts = [];
    const contractNames = [
      'Contrato Llanos Orientales 2024',
      'Contrato Valle Superior del Magdalena',
      'Contrato Cuenca Putumayo'
    ];

    for (let i = 0; i < 3; i++) {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2025-12-31');
      
      const contract = await prisma.contract.create({
        data: {
          name: contractNames[i],
          contractNumber: `WW-${2024}-${String(i + 1).padStart(3, '0')}`,
          clientId: clients[i].id,
          startDate,
          endDate,
          totalValue: Math.random() * 50000000 + 10000000, // 10-60M USD
          status: i === 0 ? 'active' : ['active', 'active', 'completed'][i],
          description: `Contrato de perforación de pozos exploratorios y de desarrollo en ${contractNames[i].split(' ').slice(-1)[0]}`,
          targetDepth: Math.floor(Math.random() * 8000) + 8000, // 8000-16000 ft
          plannedWells: [18, 16, 16][i], // Total: 50 wells
          budgetAFE: Math.random() * 30000000 + 20000000, // 20-50M USD
          actualCost: Math.random() * 25000000 + 15000000, // 15-40M USD
          dailyRate: Math.random() * 50000 + 80000, // 80-130K USD/day
        },
      });
      contracts.push(contract);
    }

    // Crear 15 campos (5 por contrato)
    console.log('🗺️ Creando campos...');
    const fields = [];
    const fieldPrefixes = [
      ['Cusiana', 'Cupiagua', 'Floreña', 'Recetor', 'Pauto'],
      ['Dina', 'Teca', 'Nare', 'Tisquirama', 'Chichimene'],
      ['Orito', 'Cohembi', 'Churuyaco', 'Costayaco', 'Mecaya']
    ];

    for (let contractIdx = 0; contractIdx < 3; contractIdx++) {
      for (let fieldIdx = 0; fieldIdx < 5; fieldIdx++) {
        const field = await prisma.field.create({
          data: {
            name: `${fieldPrefixes[contractIdx][fieldIdx]} Field`,
            contractId: contracts[contractIdx].id,
            location: `${fieldPrefixes[contractIdx][fieldIdx]}, Colombia`,
            description: `Campo de petróleo en la región de ${contractNames[contractIdx].split(' ').slice(-1)[0]}`,
          },
        });
        fields.push(field);
      }
    }

    // Crear 50 pozos distribuidos en los campos
    console.log('🛢️ Creando pozos y datos de perforación...');
    let wellCounter = 1;
    const wellsPerField = [4, 3, 4, 3, 4]; // Total: 18, 16, 16 = 50 wells

    for (let contractIdx = 0; contractIdx < 3; contractIdx++) {
      const contractFields = fields.slice(contractIdx * 5, (contractIdx + 1) * 5);
      
      for (let fieldIdx = 0; fieldIdx < 5; fieldIdx++) {
        const wellsInField = contractIdx === 0 ? wellsPerField[fieldIdx] : 
                            (contractIdx === 1 ? [3, 3, 4, 3, 3][fieldIdx] : [3, 3, 3, 4, 3][fieldIdx]);
        
        for (let wellIdx = 0; wellIdx < wellsInField; wellIdx++) {
          const wellName = `${fieldPrefixes[contractIdx][fieldIdx]}-${String(wellIdx + 1).padStart(2, '0')}`;
          const targetDepth = Math.floor(Math.random() * 8000) + 8000;
          
          const well = await prisma.well.create({
            data: {
              name: wellName,
              fieldId: contractFields[fieldIdx].id,
              wellType: ['exploration', 'development', 'appraisal'][Math.floor(Math.random() * 3)],
              status: ['drilling', 'completed', 'suspended'][Math.floor(Math.random() * 3)],
              latitude: 4.5 + (Math.random() - 0.5) * 8, // Colombia coordinates
              longitude: -74.0 + (Math.random() - 0.5) * 10,
              spudDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
              targetDepth,
              currentDepth: targetDepth * (0.3 + Math.random() * 0.7), // 30-100% complete
              formation: formations[Math.floor(Math.random() * formations.length)],
              holeSection: holeSections[Math.floor(Math.random() * holeSections.length)],
              operation: operations[Math.floor(Math.random() * operations.length)],
              mudType: mudTypes[Math.floor(Math.random() * mudTypes.length)],
              bitType: bitTypes[Math.floor(Math.random() * bitTypes.length)],
              flowRate: Math.floor(Math.random() * 400) + 300, // 300-700 gpm
              rotarySpeed: Math.floor(Math.random() * 150) + 50, // 50-200 rpm
              weightOnBit: Math.floor(Math.random() * 30) + 15, // 15-45 klbs
              torque: Math.floor(Math.random() * 17) + 8, // 8-25 k-ft.lbs
              standpipePressure: Math.floor(Math.random() * 2000) + 1500, // 1500-3500 psi
              lithology: lithologies[Math.floor(Math.random() * lithologies.length)],
              porosity: Math.random() * 25 + 5, // 5-30%
              permeability: Math.random() * 500 + 10, // 10-510 md
              budgetAFE: Math.random() * 6000000 + 2500000, // 2.5-8.5M USD per well
              actualCost: Math.random() * 5000000 + 2000000, // 2-7M USD per well
            },
          });

          // Crear datos de perforación históricos (30 días por pozo)
          const drillingDataPoints = [];
          const startDate = well.spudDate;
          
          for (let day = 0; day < 30; day++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + day);
            
            const depth = (targetDepth / 30) * (day + 1) + (Math.random() - 0.5) * 200;
            
            drillingDataPoints.push({
              wellId: well.id,
              date: currentDate,
              depth: Math.max(0, depth),
              rop: Math.random() * 16 + 12, // 12-28 m/hr
              bitDepth: depth + Math.random() * 100,
              formation: formations[Math.floor(Math.random() * formations.length)],
              holeSection: holeSections[Math.floor(Math.random() * holeSections.length)],
              operation: operations[Math.floor(Math.random() * operations.length)],
              mudType: mudTypes[Math.floor(Math.random() * mudTypes.length)],
              bitType: bitTypes[Math.floor(Math.random() * bitTypes.length)],
              flowRate: Math.floor(Math.random() * 400) + 300,
              rotarySpeed: Math.floor(Math.random() * 150) + 50,
              weightOnBit: Math.floor(Math.random() * 30) + 15,
              torque: Math.floor(Math.random() * 17) + 8,
              standpipePressure: Math.floor(Math.random() * 2000) + 1500,
              lithology: lithologies[Math.floor(Math.random() * lithologies.length)],
              porosity: Math.random() * 25 + 5,
              permeability: Math.random() * 500 + 10,
              budgetAFE: well.budgetAFE,
              actualCost: (well.actualCost || 0) * ((day + 1) / 30), // Costo acumulativo
            });
          }

          await prisma.drillingData.createMany({
            data: drillingDataPoints,
          });

          console.log(`✅ Pozo ${wellCounter}/50: ${wellName} creado con 30 registros de perforación`);
          wellCounter++;
        }
      }
    }

    // Crear actividades de contrato
    console.log('📊 Creando actividades de contrato...');
    const contractActivities = [
      { name: 'Site Preparation', description: 'Preparación del sitio de perforación', status: 'completed' },
      { name: 'Rig Mobilization', description: 'Movilización del equipo de perforación', status: 'completed' },
      { name: 'Spud Operations', description: 'Inicio de operaciones de perforación', status: 'active' },
      { name: 'Drilling Operations', description: 'Operaciones de perforación en curso', status: 'active' },
      { name: 'Logging Operations', description: 'Operaciones de registro de pozo', status: 'pending' },
      { name: 'Completion Operations', description: 'Operaciones de completación', status: 'pending' },
      { name: 'Testing Operations', description: 'Pruebas de producción', status: 'pending' },
      { name: 'Rig Demobilization', description: 'Desmovilización del equipo', status: 'pending' },
    ];

    for (const contract of contracts) {
      for (const activity of contractActivities) {
        await prisma.contractActivity.create({
          data: {
            contractId: contract.id,
            name: activity.name,
            description: activity.description,
            status: activity.status,
            startDate: new Date(),
            progress: activity.status === 'completed' ? 100 : 
                     activity.status === 'active' ? Math.floor(Math.random() * 80) + 20 : 0,
          },
        });
      }
    }

    console.log('\n🎉 Seed avanzado completado exitosamente!');
    console.log(`📊 Creados: 3 clientes, 3 contratos, 15 campos, 50 pozos`);
    console.log(`🗂️ Datos técnicos: ${formations.length} formaciones, ${operations.length} operaciones`);
    console.log(`📈 Datos de perforación: 1,500 registros históricos (30 días × 50 pozos)`);

    return NextResponse.json({ 
      success: true, 
      message: 'Base de datos poblada exitosamente',
      summary: {
        clients: 3,
        contracts: 3,
        fields: 15,
        wells: 50,
        drillingRecords: 1500,
        formations: formations.length,
        operations: operations.length
      }
    });

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    return NextResponse.json(
      { error: 'Error al poblar la base de datos', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}