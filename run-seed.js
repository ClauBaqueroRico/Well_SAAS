const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Ejecutar el seed avanzado directamente
async function runAdvancedSeed() {
  console.log('🚀 Iniciando seed avanzado de base de datos...');

  try {
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await prisma.drillingData.deleteMany();
    await prisma.productionData.deleteMany();
    await prisma.contractActivity.deleteMany();
    await prisma.well.deleteMany();
    await prisma.field.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.client.deleteMany();
    
    console.log('✅ Datos existentes eliminados');

    // Crear clientes
    const clients = await Promise.all([
      prisma.client.create({
        data: {
          name: 'Ecopetrol S.A.',
          contactEmail: 'contratos@ecopetrol.com.co',
          contactPhone: '+57 1 234 5678',
          address: 'Carrera 13 # 36-24, Bogotá, Colombia'
        }
      }),
      prisma.client.create({
        data: {
          name: 'Gran Tierra Energy Colombia Ltd.',
          contactEmail: 'operations@grantierra.com',
          contactPhone: '+57 1 345 6789',
          address: 'Calle 100 # 19-61, Bogotá, Colombia'
        }
      }),
      prisma.client.create({
        data: {
          name: 'GeoPark Colombia S.A.S.',
          contactEmail: 'info@geopark.com',
          contactPhone: '+57 1 456 7890',
          address: 'Carrera 7 # 71-21, Bogotá, Colombia'
        }
      })
    ]);
    
    console.log('✅ 3 clientes creados');

    // Obtener usuario admin
    let adminUser = await prisma.user.findUnique({
      where: { email: 'admin@wellwizards.com' }
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      adminUser = await prisma.user.create({
        data: {
          name: 'Administrador',
          email: 'admin@wellwizards.com',
          password: hashedPassword,
          role: 'admin'
        }
      });
      console.log('✅ Usuario admin creado');
    }

    // Crear contratos
    const contracts = await Promise.all([
      prisma.contract.create({
        data: {
          name: 'Contrato Llanos Orientales 2024',
          clientId: clients[0].id,
          userId: adminUser.id,
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-12-31'),
          value: 45000000,
          status: 'active',
          description: 'Perforación de pozos exploratorios en los Llanos Orientales',
          targetDepth: 12000,
          expectedDays: 300,
          dailyRate: 125000,
          contractType: 'drilling'
        }
      }),
      prisma.contract.create({
        data: {
          name: 'Contrato Valle Superior del Magdalena',
          clientId: clients[1].id,
          userId: adminUser.id,
          startDate: new Date('2024-02-01'),
          endDate: new Date('2025-01-31'),
          value: 32000000,
          status: 'active',
          description: 'Desarrollo de campo en Valle Superior del Magdalena',
          targetDepth: 10500,
          expectedDays: 365,
          dailyRate: 110000,
          contractType: 'drilling'
        }
      }),
      prisma.contract.create({
        data: {
          name: 'Contrato Cuenca Putumayo',
          clientId: clients[2].id,
          userId: adminUser.id,
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-11-30'),
          value: 28000000,
          status: 'active',
          description: 'Exploración y desarrollo en Cuenca Putumayo',
          targetDepth: 9800,
          expectedDays: 275,
          dailyRate: 95000,
          contractType: 'drilling'
        }
      })
    ]);

    console.log('✅ 3 contratos creados');

    // Definir formaciones y otros datos técnicos
    const formations = ['La Luna', 'Guadalupe', 'Barco', 'Mirador', 'Carbonera', 'León', 'Gacheta', 'Une', 'Chipaque', 'Villeta', 'Tablazo', 'Rosablanca', 'Paja', 'Simití'];
    const holeSections = ['26" Conductor', '17-1/2" Surface', '12-1/4" Intermediate', '8-3/4" Production', '6-1/8" Completion', '9-5/8" Intermediate', '7" Liner', '5-1/2" Production'];
    const operations = ['Drilling', 'Tripping', 'Casing Running', 'Cementing', 'Logging', 'Testing', 'Completion', 'Workover', 'Stimulation', 'Perforation', 'Acidizing', 'Fracturing', 'Production', 'Maintenance'];
    const mudTypes = ['WBM (Water-Based)', 'OBM (Oil-Based)', 'SBM (Synthetic-Based)', 'Polymer', 'Bentonite', 'Barite', 'KCl Polymer', 'Lime', 'Gypsum'];
    const bitTypes = ['PDC 5-Blade', 'PDC 6-Blade', 'Roller Cone', 'Hybrid PDC', 'Impregnated', 'Natural Diamond', 'TSP (Thermally Stable)', 'Tricone', 'Bicone'];
    const lithologies = ['Sandstone', 'Limestone', 'Shale', 'Mudstone', 'Siltstone', 'Conglomerate', 'Coal', 'Anhydrite', 'Dolomite', 'Marl'];

    // Crear campos y pozos por contrato
    let totalWells = 0;
    let totalFields = 0;
    
    const wellsPerContract = [18, 16, 16]; // Pozos por contrato
    
    for (let contractIndex = 0; contractIndex < contracts.length; contractIndex++) {
      const contract = contracts[contractIndex];
      const fieldsCount = 5; // 5 campos por contrato
      const wellsPerField = Math.ceil(wellsPerContract[contractIndex] / fieldsCount);

      for (let fieldIndex = 0; fieldIndex < fieldsCount; fieldIndex++) {
        const fieldNames = [
          // Ecopetrol - Llanos Orientales
          ['Cusiana', 'Cupiagua', 'Floreña', 'Recetor', 'Pauto'],
          // Gran Tierra - Valle Superior Magdalena
          ['Dina', 'Teca', 'Nare', 'Tisquirama', 'Chichimene'],
          // GeoPark - Putumayo
          ['Orito', 'Cohembi', 'Churuyaco', 'Costayaco', 'Mecaya']
        ];

        const field = await prisma.field.create({
          data: {
            name: fieldNames[contractIndex][fieldIndex],
            location: `${fieldNames[contractIndex][fieldIndex]} Field, Colombia`,
            description: `Campo de ${fieldNames[contractIndex][fieldIndex]} - ${contract.name}`,
            latitude: -4.5 + (Math.random() * 8), // Colombia coordinates range
            longitude: -73.5 + (Math.random() * 5),
            contractId: contract.id
          }
        });

        totalFields++;

        // Crear pozos para este campo
        const currentWellsInField = fieldIndex === fieldsCount - 1 ? 
          wellsPerContract[contractIndex] - (wellsPerField * (fieldsCount - 1)) : 
          wellsPerField;

        for (let wellIndex = 0; wellIndex < currentWellsInField; wellIndex++) {
          const wellNumber = String(wellIndex + 1).padStart(2, '0');
          const wellName = `${field.name}-${wellNumber}`;

          // Datos técnicos aleatorios pero realistas
          const formation = formations[Math.floor(Math.random() * formations.length)];
          const holeSection = holeSections[Math.floor(Math.random() * holeSections.length)];
          const operation = operations[Math.floor(Math.random() * operations.length)];
          const mudType = mudTypes[Math.floor(Math.random() * mudTypes.length)];
          const bitType = bitTypes[Math.floor(Math.random() * bitTypes.length)];
          const lithology = lithologies[Math.floor(Math.random() * lithologies.length)];

          // Profundidades realistas según el contrato
          const targetDepths = [12000, 10500, 9800];
          const baseDepth = targetDepths[contractIndex];
          const initialDepth = Math.random() * 500;
          const finalDepth = baseDepth * (0.8 + Math.random() * 0.4);

          // Fechas realistas
          const startDate = new Date(contract.startDate);
          startDate.setDate(startDate.getDate() + (wellIndex * 15)); // 15 días entre pozos
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + Math.floor(20 + Math.random() * 40)); // 20-60 días de perforación

          const elapsedDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

          // Parámetros de perforación realistas
          const footage = finalDepth - initialDepth;
          const ropAverage = 12 + Math.random() * 16; // 12-28 m/hr
          const wellConstructionRate = footage / elapsedDays;

          const well = await prisma.well.create({
            data: {
              name: wellName,
              location: `${field.location} - Well ${wellName}`,
              status: Math.random() > 0.1 ? 'active' : 'maintenance',
              production: 150 + Math.random() * 500, // bpd
              pressure: 2000 + Math.random() * 2000, // psi
              temperature: 180 + Math.random() * 50, // °F
              depth: finalDepth,
              diameter: 6 + Math.random() * 3, // inches
              wellType: ['vertical', 'horizontal', 'directional'][Math.floor(Math.random() * 3)],
              latitude: field.latitude + (Math.random() - 0.5) * 0.1,
              longitude: field.longitude + (Math.random() - 0.5) * 0.1,
              
              // Campos técnicos avanzados
              formation,
              holeSection,
              operation,
              mudType,
              mudDensity: 8.5 + Math.random() * 3, // ppg
              casingSize: ['9-5/8"', '7"', '5-1/2"'][Math.floor(Math.random() * 3)],
              drillPipeSize: ['5"', '4-1/2"', '3-1/2"'][Math.floor(Math.random() * 3)],
              bitType,
              bitSize: 6 + Math.random() * 6, // inches
              flowRate: 300 + Math.random() * 400, // gpm
              rotarySpeed: 50 + Math.random() * 150, // rpm
              weightOnBit: 15 + Math.random() * 30, // klbs
              torque: 8000 + Math.random() * 17000, // ft-lbs
              standpipePressure: 1500 + Math.random() * 2000, // psi
              
              // Datos geológicos
              formationTop: initialDepth,
              formationBottom: finalDepth,
              lithology,
              porosity: 5 + Math.random() * 25, // %
              permeability: 10 + Math.random() * 500, // mD
              
              // Datos de perforación
              initialDate: startDate,
              actualDate: endDate,
              elapsedDays,
              elapsedHours: elapsedDays * 24,
              initialDepth,
              finalDepth,
              ropAverage,
              ropEffective: ropAverage * (0.7 + Math.random() * 0.3),
              footage,
              wellConstructionRate,
              directionalDifficulty: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
              maxIncl: Math.random() * 90, // degrees
              
              // Datos económicos
              budgetAFE: 2500000 + Math.random() * 6000000, // $2.5M - $8.5M
              actualCost: 2000000 + Math.random() * 5000000, // $2M - $7M
              dailyRate: 80000 + Math.random() * 50000, // $80K - $130K/day
              
              userId: adminUser.id,
              fieldId: field.id,
              lastMaintenance: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null
            }
          });

          totalWells++;

          // Crear datos históricos de perforación (30 días por pozo)
          const drillingPromises = [];
          for (let day = 0; day < 30; day++) {
            const drillingDate = new Date(startDate);
            drillingDate.setDate(drillingDate.getDate() + day);
            
            drillingPromises.push(
              prisma.drillingData.create({
                data: {
                  wellId: well.id,
                  date: drillingDate,
                  day: day + 1, // Día de perforación (1-30)
                  depth: initialDepth + (footage * (day / 30)),
                  plan: initialDepth + (footage * ((day + 1) / 30)), // Profundidad planeada
                  progressM: (footage * (day / 30)) * 0.3048, // Convertir de pies a metros
                  rop: ropAverage * (0.7 + Math.random() * 0.6),
                  mud: mudType,
                  pressure: 2000 + Math.random() * 2000,
                  temperature: 180 + Math.random() * 50,
                  status: 'drilling',
                  shift: Math.random() > 0.5 ? 'day' : 'night',
                  crew: `Crew-${Math.floor(Math.random() * 3) + 1}`,
                  contractor: clients[contractIndex].name,
                  formation: formation,
                  holeSection: holeSection,
                  operation: operation,
                  mudDensity: 8.5 + Math.random() * 3,
                  mudViscosity: 30 + Math.random() * 20,
                  flowRate: 300 + Math.random() * 400,
                  rotarySpeed: 50 + Math.random() * 150,
                  weightOnBit: 15 + Math.random() * 30,
                  torque: 8000 + Math.random() * 17000,
                  standpipePressure: 1500 + Math.random() * 2000,
                  lithology: lithology,
                  gasDetection: Math.random() * 10,
                  cuttingsReturn: 'Good',
                  holeCleanling: 7 + Math.random() * 3,
                  vibration: Math.random() * 5,
                  deviation: Math.random() * 5,
                  drillingTime: 16 + Math.random() * 8,
                  connectionTime: 2 + Math.random() * 2,
                  circulationTime: 4 + Math.random() * 4,
                  trippingTime: 2 + Math.random() * 2,
                  contractActivity: operation,
                  efficiency: 70 + Math.random() * 30,
                  dailyCost: 80000 + Math.random() * 50000,
                  cumulativeCost: (80000 + Math.random() * 50000) * (day + 1)
                }
              })
            );
          }
          
          await Promise.all(drillingPromises);
        }
      }
    }

    // Crear algunas actividades de contrato
    const contractActivities = [];
    for (const contract of contracts) {
      for (let i = 0; i < 10; i++) {
        const activityDate = new Date(contract.startDate);
        activityDate.setDate(activityDate.getDate() + (i * 7));
        
        contractActivities.push(
          prisma.contractActivity.create({
            data: {
              contractId: contract.id,
              name: [
                'Contract Signed',
                'Mobilization Started',
                'First Well Spudded',
                'Safety Meeting',
                'Equipment Inspection',
                'Progress Review',
                'Client Visit',
                'Environmental Audit',
                'Performance Review',
                'Monthly Report'
              ][i],
              description: `Actividad programada para ${contract.name}`,
              category: ['drilling', 'maintenance', 'drilling', 'maintenance', 'maintenance', 'drilling', 'drilling', 'maintenance', 'drilling', 'drilling'][i],
              unit: ['pieces', 'hours', 'pieces', 'hours', 'hours', 'hours', 'hours', 'hours', 'hours', 'pieces'][i],
              targetValue: 1 + Math.random() * 10,
              priority: Math.floor(Math.random() * 5) + 1,
              minRate: 1,
              maxRate: 10,
              optimalRate: 7
            }
          })
        );
      }
    }

    await Promise.all(contractActivities);

    const summary = {
      clients: clients.length,
      contracts: contracts.length,
      fields: totalFields,
      wells: totalWells,
      drillingRecords: totalWells * 30,
      contractActivities: contractActivities.length
    };

    console.log('✅ Seed completado exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - ${summary.clients} clientes`);
    console.log(`   - ${summary.contracts} contratos`);
    console.log(`   - ${summary.fields} campos`);
    console.log(`   - ${summary.wells} pozos`);
    console.log(`   - ${summary.drillingRecords} registros de perforación`);
    console.log(`   - ${summary.contractActivities} actividades de contrato`);

    return summary;

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed
if (require.main === module) {
  runAdvancedSeed()
    .then((summary) => {
      console.log('\n🎉 Base de datos poblada exitosamente!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { runAdvancedSeed };