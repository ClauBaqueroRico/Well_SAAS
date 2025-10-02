const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Datos base expandidos
const FORMATIONS = [
  'La Luna', 'Guadalupe', 'Barco', 'Mirador', 'Carbonera', 'Gacheta', 'Villeta',
  'Une', 'Lisama', 'Esmeraldas', 'Mugrosa', 'Colorado', 'Real', 'Tibú'
]

const HOLE_SECTIONS = [
  'Surface', 'Intermediate', 'Production', 'Horizontal', 'Vertical', 
  'Directional', 'Extended Reach', 'Sidetrack'
]

const OPERATIONS = [
  'drilling', 'completion', 'workover', 'maintenance', 'testing',
  'logging', 'casing', 'cementing', 'perforation', 'fracturing',
  'acidizing', 'fishing', 'plugging', 'abandonment'
]

const MUD_TYPES = [
  'Water-based', 'Oil-based', 'Synthetic-based', 'Foam', 'Air',
  'Polymer', 'Bentonite', 'Barite-weighted', 'KCl-Polymer'
]

const BIT_TYPES = [
  'PDC', 'Tricone', 'Diamond', 'Hybrid', 'Steel-tooth',
  'Matrix PDC', 'Steel-body PDC', 'Impreg', 'TSP'
]

const LITHOLOGIES = [
  'Sandstone', 'Shale', 'Limestone', 'Dolomite', 'Conglomerate',
  'Siltstone', 'Mudstone', 'Coal', 'Anhydrite', 'Salt'
]

const WELL_STATUSES = ['active', 'completed', 'suspended', 'abandoned', 'drilling']

// Función para generar datos aleatorios realistas
function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function generateRealisticDrillingData() {
  const formation = randomChoice(FORMATIONS)
  const operation = randomChoice(OPERATIONS)
  
  return {
    formation,
    holeSection: randomChoice(HOLE_SECTIONS),
    operation,
    mudType: randomChoice(MUD_TYPES),
    bitType: randomChoice(BIT_TYPES),
    flowRate: randomBetween(200, 800), // GPM
    rotarySpeed: randomBetween(60, 180), // RPM
    weightOnBit: randomBetween(15, 45), // klbs
    torque: randomBetween(8, 25), // k-ft.lbs
    standpipePressure: randomBetween(2000, 4500), // psi
    lithology: randomChoice(LITHOLOGIES),
    porosity: randomBetween(8, 25), // %
    permeability: randomBetween(0.1, 150), // mD
    mudWeight: randomBetween(8.5, 16.5), // ppg
    viscosity: randomBetween(35, 85), // sec
    ph: randomBetween(8.5, 11.5),
    chlorides: randomBetween(15000, 85000), // ppm
    temperature: randomBetween(85, 185), // °F
    tvd: randomBetween(2500, 4200), // ft
    md: randomBetween(2800, 5500), // ft
    inclination: randomBetween(0, 75), // degrees
    azimuth: randomBetween(0, 360), // degrees
  }
}

function generateWellName(contractPrefix, index) {
  const zones = ['Norte', 'Sur', 'Este', 'Oeste', 'Centro']
  const zone = randomChoice(zones)
  return `${contractPrefix}-${zone}-${String(index).padStart(2, '0')}`
}

function generateBudgetData() {
  const budgetAFE = randomBetween(2500000, 8500000) // USD
  const actualCost = budgetAFE * randomBetween(0.75, 1.35) // ±35% variance
  const dailyRate = randomBetween(18000, 35000) // USD/day
  
  return {
    budgetAFE: Math.round(budgetAFE),
    actualCost: Math.round(actualCost),
    dailyRate: Math.round(dailyRate)
  }
}

async function main() {
  console.log('🚀 Iniciando seed avanzado con 50 pozos...')

  try {
    // Limpiar datos existentes
    await prisma.drillingData.deleteMany()
    await prisma.contractActivity.deleteMany()
    await prisma.well.deleteMany()
    await prisma.field.deleteMany()
    await prisma.contract.deleteMany()
    await prisma.client.deleteMany()
    await prisma.user.deleteMany()

    console.log('✅ Datos existentes eliminados')

    // Crear usuarios
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@wellwizards.com',
        password: hashedPassword,
        role: 'admin'
      }
    })

    const users = await Promise.all([
      prisma.user.create({
        data: {
          name: 'Carlos Rodríguez',
          email: 'carlos@wellwizards.com',
          password: await bcrypt.hash('password123', 12),
          role: 'engineer'
        }
      }),
      prisma.user.create({
        data: {
          name: 'Ana García',
          email: 'ana@wellwizards.com',
          password: await bcrypt.hash('password123', 12),
          role: 'operator'
        }
      }),
      prisma.user.create({
        data: {
          name: 'Miguel Torres',
          email: 'miguel@wellwizards.com',
          password: await bcrypt.hash('password123', 12),
          role: 'supervisor'
        }
      }),
      prisma.user.create({
        data: {
          name: 'Sofia López',
          email: 'sofia@wellwizards.com',
          password: await bcrypt.hash('password123', 12),
          role: 'analyst'
        }
      })
    ])

    console.log('✅ 5 usuarios creados')

    // Crear clientes
    const clients = await Promise.all([
      prisma.client.create({
        data: {
          name: 'Ecopetrol S.A.',
          contactEmail: 'contratos@ecopetrol.com.co',
          phone: '+57 1 234 5000',
          address: 'Carrera 13 # 36-24, Bogotá, Colombia',
          country: 'Colombia',
          taxId: '860007813-1',
          status: 'active'
        }
      }),
      prisma.client.create({
        data: {
          name: 'Petrobras Colombia',
          contactEmail: 'operaciones@petrobras.com.co',
          phone: '+57 1 345 6000',
          address: 'Calle 72 # 10-07, Bogotá, Colombia',
          country: 'Colombia',
          taxId: '830045735-2',
          status: 'active'
        }
      }),
      prisma.client.create({
        data: {
          name: 'Gran Tierra Energy',
          contactEmail: 'drilling@grantierra.com',
          phone: '+57 1 456 7000',
          address: 'Carrera 7 # 71-21, Bogotá, Colombia',
          country: 'Colombia',
          taxId: '900123456-3',
          status: 'active'
        }
      })
    ])

    console.log('✅ 3 clientes creados')

    // Crear contratos con presupuestos realistas
    const contracts = await Promise.all([
      prisma.contract.create({
        data: {
          name: 'Contrato Ecopetrol 2024-2025',
          contractNumber: 'ECO-2024-001',
          clientId: clients[0].id,
          startDate: new Date('2024-01-15'),
          endDate: new Date('2025-12-31'),
          totalValue: 125000000, // 125M USD
          status: 'active',
          description: 'Perforación y completación de pozos en Campos Casanare y Llanos Orientales',
          targetDepth: 4200,
          plannedWells: 18,
          ...generateBudgetData()
        }
      }),
      prisma.contract.create({
        data: {
          name: 'Contrato Petrobras Magdalena',
          contractNumber: 'PBR-2024-002',
          clientId: clients[1].id,
          startDate: new Date('2024-03-01'),
          endDate: new Date('2025-08-30'),
          totalValue: 89000000, // 89M USD
          status: 'active',
          description: 'Desarrollo de campos en Valle Medio del Magdalena',
          targetDepth: 3800,
          plannedWells: 16,
          ...generateBudgetData()
        }
      }),
      prisma.contract.create({
        data: {
          name: 'Contrato Gran Tierra Putumayo',
          contractNumber: 'GTE-2024-003',
          clientId: clients[2].id,
          startDate: new Date('2024-02-20'),
          endDate: new Date('2025-10-15'),
          totalValue: 67000000, // 67M USD
          status: 'active',
          description: 'Exploración y desarrollo en Cuenca Putumayo',
          targetDepth: 3500,
          plannedWells: 16,
          ...generateBudgetData()
        }
      })
    ])

    console.log('✅ 3 contratos creados')

    // Crear campos por contrato
    const fieldsData = [
      // Ecopetrol - 6 campos
      { name: 'Campo Casanare Norte', contractId: contracts[0].id, location: 'Casanare, Colombia' },
      { name: 'Campo Casanare Sur', contractId: contracts[0].id, location: 'Casanare, Colombia' },
      { name: 'Campo Llanos Oriental', contractId: contracts[0].id, location: 'Meta, Colombia' },
      { name: 'Campo Arauca Este', contractId: contracts[0].id, location: 'Arauca, Colombia' },
      { name: 'Campo Vichada Norte', contractId: contracts[0].id, location: 'Vichada, Colombia' },
      { name: 'Campo Guaviare', contractId: contracts[0].id, location: 'Guaviare, Colombia' },
      
      // Petrobras - 5 campos
      { name: 'Campo Magdalena Central', contractId: contracts[1].id, location: 'Santander, Colombia' },
      { name: 'Campo Magdalena Sur', contractId: contracts[1].id, location: 'Huila, Colombia' },
      { name: 'Campo Cesar Norte', contractId: contracts[1].id, location: 'Cesar, Colombia' },
      { name: 'Campo Bolívar', contractId: contracts[1].id, location: 'Bolívar, Colombia' },
      { name: 'Campo Tolima Este', contractId: contracts[1].id, location: 'Tolima, Colombia' },
      
      // Gran Tierra - 4 campos
      { name: 'Campo Putumayo Norte', contractId: contracts[2].id, location: 'Putumayo, Colombia' },
      { name: 'Campo Putumayo Sur', contractId: contracts[2].id, location: 'Putumayo, Colombia' },
      { name: 'Campo Nariño Este', contractId: contracts[2].id, location: 'Nariño, Colombia' },
      { name: 'Campo Caquetá', contractId: contracts[2].id, location: 'Caquetá, Colombia' }
    ]

    const fields = await Promise.all(
      fieldsData.map(field => 
        prisma.field.create({
          data: {
            ...field,
            status: 'active',
            startDate: new Date('2024-01-01'),
            estimatedReserves: randomBetween(15, 85), // MMBO
            currentProduction: randomBetween(2500, 12500) // BOPD
          }
        })
      )
    )

    console.log('✅ 15 campos creados')

    // Distribuir 50 pozos entre los contratos y campos
    const wellsDistribution = [
      { contractIndex: 0, count: 18, prefix: 'ECO' }, // Ecopetrol
      { contractIndex: 1, count: 16, prefix: 'PBR' }, // Petrobras  
      { contractIndex: 2, count: 16, prefix: 'GTE' }  // Gran Tierra
    ]

    let wellIndex = 1
    const allWells = []

    for (const dist of wellsDistribution) {
      const contractFields = fields.filter(f => f.contractId === contracts[dist.contractIndex].id)
      
      for (let i = 0; i < dist.count; i++) {
        const field = contractFields[i % contractFields.length]
        const wellName = generateWellName(dist.prefix, wellIndex++)
        const drillingData = generateRealisticDrillingData()
        const budget = generateBudgetData()
        
        // Calcular ROP realista basado en formación y operación
        let baseROP = randomBetween(12, 28)
        if (drillingData.formation === 'Shale') baseROP *= 0.7
        if (drillingData.formation === 'Sandstone') baseROP *= 1.1
        if (drillingData.operation === 'drilling') baseROP *= 1.0
        if (drillingData.operation === 'completion') baseROP *= 0.3
        
        const well = {
          name: wellName,
          fieldId: field.id,
          status: randomChoice(WELL_STATUSES),
          wellType: randomChoice(['Oil', 'Gas', 'Water Injection', 'Gas Injection']),
          spudDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          location: `${field.location} - Sector ${String.fromCharCode(65 + i % 26)}`,
          operator: field.contractId === contracts[0].id ? 'Ecopetrol' : 
                   field.contractId === contracts[1].id ? 'Petrobras' : 'Gran Tierra',
          
          // Datos técnicos básicos
          finalDepth: drillingData.md,
          targetDepth: drillingData.md + randomBetween(-200, 300),
          currentDepth: drillingData.md * randomBetween(0.85, 1.0),
          
          // Métricas de perforación
          ropAverage: Math.round(baseROP * 100) / 100,
          elapsedDays: Math.round(drillingData.md / baseROP / 24 * 10) / 10,
          
          // Datos económicos
          ...budget,
          
          // Información expandida
          formation: drillingData.formation,
          holeSection: drillingData.holeSection,
          operation: drillingData.operation,
          mudType: drillingData.mudType,
          bitType: drillingData.bitType,
          flowRate: drillingData.flowRate,
          rotarySpeed: drillingData.rotarySpeed,
          weightOnBit: drillingData.weightOnBit,
          torque: drillingData.torque,
          standpipePressure: drillingData.standpipePressure,
          lithology: drillingData.lithology,
          porosity: drillingData.porosity,
          permeability: drillingData.permeability,
          mudWeight: drillingData.mudWeight,
          viscosity: drillingData.viscosity,
          ph: drillingData.ph,
          chlorides: drillingData.chlorides,
          temperature: drillingData.temperature,
          tvd: drillingData.tvd,
          md: drillingData.md,
          inclination: drillingData.inclination,
          azimuth: drillingData.azimuth,
          
          // Fechas
          createdAt: new Date(),
          updatedAt: new Date()
        }

        allWells.push(well)
      }
    }

    // Crear todos los pozos
    const createdWells = await Promise.all(
      allWells.map(well => prisma.well.create({ data: well }))
    )

    console.log('✅ 50 pozos creados')

    // Crear actividades de contrato (5-10 por contrato)
    const contractActivities = []
    
    for (const contract of contracts) {
      const activityCount = randomBetween(5, 10)
      
      for (let i = 0; i < activityCount; i++) {
        const activity = {
          contractId: contract.id,
          activityType: randomChoice([
            'Drilling', 'Completion', 'Testing', 'Workover', 'Maintenance',
            'Logging', 'Cementing', 'Perforation', 'Stimulation'
          ]),
          description: `Actividad ${i + 1} del contrato ${contract.name}`,
          startDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
          status: randomChoice(['planned', 'in_progress', 'completed', 'delayed']),
          cost: randomBetween(150000, 2500000),
          progress: randomBetween(0, 100),
          assignedTeam: randomChoice([
            'Equipo Alpha', 'Equipo Beta', 'Equipo Gamma', 'Equipo Delta'
          ])
        }
        
        contractActivities.push(activity)
      }
    }

    await Promise.all(
      contractActivities.map(activity => 
        prisma.contractActivity.create({ data: activity })
      )
    )

    console.log('✅ Actividades de contrato creadas')

    // Crear datos de drilling detallados para análisis
    const drillingDataEntries = []
    
    for (const well of createdWells) {
      // Crear 5-15 entradas de datos por pozo
      const entryCount = randomBetween(5, 15)
      
      for (let i = 0; i < entryCount; i++) {
        const date = new Date(well.spudDate.getTime() + i * 24 * 60 * 60 * 1000)
        const depthProgress = (well.finalDepth / entryCount) * (i + 1)
        
        const entry = {
          wellId: well.id,
          date: date,
          depth: depthProgress,
          rop: well.ropAverage * randomBetween(0.7, 1.3),
          wob: well.weightOnBit * randomBetween(0.8, 1.2),
          torque: well.torque * randomBetween(0.9, 1.1),
          flow: well.flowRate * randomBetween(0.85, 1.15),
          pressure: well.standpipePressure * randomBetween(0.9, 1.1),
          temperature: well.temperature + randomBetween(-5, 10),
          mudWeight: well.mudWeight * randomBetween(0.95, 1.05),
          bitRuns: Math.floor(i / 3) + 1,
          formation: well.formation,
          lithology: randomChoice(LITHOLOGIES),
          porosity: well.porosity * randomBetween(0.8, 1.2),
          permeability: well.permeability * randomBetween(0.5, 2.0),
          gasShow: randomBetween(0, 15),
          oilShow: randomBetween(0, 8)
        }
        
        drillingDataEntries.push(entry)
      }
    }

    await Promise.all(
      drillingDataEntries.map(entry => 
        prisma.drillingData.create({ data: entry })
      )
    )

    console.log('✅ Datos detallados de perforación creados')

    // Estadísticas finales
    const stats = {
      users: await prisma.user.count(),
      clients: await prisma.client.count(),
      contracts: await prisma.contract.count(),
      fields: await prisma.field.count(),
      wells: await prisma.well.count(),
      activities: await prisma.contractActivity.count(),
      drillingData: await prisma.drillingData.count()
    }

    console.log('📊 Estadísticas de la base de datos:')
    console.log(`   👥 Usuarios: ${stats.users}`)
    console.log(`   🏢 Clientes: ${stats.clients}`)
    console.log(`   📋 Contratos: ${stats.contracts}`)
    console.log(`   🏭 Campos: ${stats.fields}`)
    console.log(`   🏗️ Pozos: ${stats.wells}`)
    console.log(`   📋 Actividades: ${stats.activities}`)
    console.log(`   📈 Datos de perforación: ${stats.drillingData}`)

    console.log('\n🎉 Seed completo exitoso! Base de datos poblada con:')
    console.log('   • 50 pozos distribuidos en 3 contratos')
    console.log('   • 15 campos en diferentes regiones')
    console.log('   • Datos técnicos completos y realistas')
    console.log('   • Múltiples formaciones y operaciones')
    console.log('   • Datos históricos para análisis avanzado')

  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })