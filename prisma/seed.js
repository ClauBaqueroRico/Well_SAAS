const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Datos de clientes de ejemplo
const sampleClients = [
  {
    name: 'Petróleo Nacional S.A.',
    email: 'contacto@petroleonacional.com',
    phone: '+57 1 234 5678',
    address: 'Carrera 7 #32-16, Bogotá, Colombia',
    logo: '/logos/petroleo-nacional.png',
    contactName: 'Roberto Martínez',
    contactEmail: 'roberto.martinez@petroleonacional.com',
    contactPhone: '+57 300 123 4567'
  },
  {
    name: 'Energía Verde Corp',
    email: 'info@energiaverde.com',
    phone: '+57 1 987 6543',
    address: 'Avenida El Dorado #68-90, Bogotá, Colombia',
    logo: '/logos/energia-verde.png',
    contactName: 'María González',
    contactEmail: 'maria.gonzalez@energiaverde.com',
    contactPhone: '+57 310 987 6543'
  },
  {
    name: 'Campos del Sur Ltda',
    email: 'admin@camposdelsur.com',
    phone: '+57 7 555 0123',
    address: 'Calle 15 #8-45, Barrancabermeja, Colombia',
    logo: '/logos/campos-del-sur.png',
    contactName: 'Carlos Rodríguez',
    contactEmail: 'carlos.rodriguez@camposdelsur.com',
    contactPhone: '+57 320 555 0123'
  }
]

// Datos de contratos de ejemplo
const sampleContracts = [
  {
    name: 'Contrato Exploración Norte',
    description: 'Exploración y extracción en campos del norte del país',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2026-12-31'),
    value: 2500000.00,
    currency: 'USD',
    status: 'active',
    conditions: 'Producción mínima de 1000 bbls/día. Mantenimiento preventivo mensual.',
    terms: 'Contrato por 3 años con opción de renovación. Penalizaciones por incumplimiento de producción.'
  },
  {
    name: 'Contrato Desarrollo Sostenible',
    description: 'Desarrollo de campos con tecnologías limpias',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2027-03-14'),
    value: 1800000.00,
    currency: 'USD',
    status: 'active',
    conditions: 'Cumplimiento de estándares ambientales ISO 14001. Reportes trimestrales obligatorios.',
    terms: 'Contrato con enfoque en sostenibilidad. Bonificaciones por superación de metas ambientales.'
  },
  {
    name: 'Contrato Campos del Sur',
    description: 'Operación integral de campos petroleros del sur',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2025-05-31'),
    value: 3200000.00,
    currency: 'USD',
    status: 'active',
    conditions: 'Mantenimiento de infraestructura existente. Mejoras tecnológicas incluidas.',
    terms: 'Contrato de operación con transferencia de tecnología. Capacitación de personal local.'
  }
]

// Datos de campos por contrato
const sampleFields = [
  // Campos para Contrato 1
  { name: 'Campo Águila Norte', location: 'Casanare, Colombia', description: 'Campo principal con 4 pozos activos' },
  { name: 'Campo Cóndor', location: 'Meta, Colombia', description: 'Campo secundario con alto potencial' },
  
  // Campos para Contrato 2
  { name: 'Campo Verde Esperanza', location: 'Santander, Colombia', description: 'Campo piloto para tecnologías limpias' },
  { name: 'Campo Eco-Petrol', location: 'Boyacá, Colombia', description: 'Campo con certificación ambiental' },
  
  // Campos para Contrato 3
  { name: 'Campo Sur Grande', location: 'Putumayo, Colombia', description: 'Campo de mayor producción del sur' },
  { name: 'Campo Río Negro', location: 'Caquetá, Colombia', description: 'Campo con infraestructura renovada' }
]

// Datos actualizados de pozos con más información técnica
const sampleWells = [
  // Campo Águila Norte - Contrato 1
  { name: 'Pozo Aguila Norte A-1', location: 'Campo Aguila Norte', status: 'active', production: 85.4, pressure: 2850.0, temperature: 92.5, depth: 2500.0, diameter: 8.5, wellType: 'vertical', lastMaintenance: new Date('2024-02-15') },
  { name: 'Pozo Aguila Norte A-2', location: 'Campo Aguila Norte', status: 'active', production: 72.8, pressure: 2650.0, temperature: 88.2, depth: 2800.0, diameter: 8.5, wellType: 'horizontal', lastMaintenance: new Date('2024-01-20') },
  
  // Campo Cóndor - Contrato 1  
  { name: 'Pozo Condor B-1', location: 'Campo Condor', status: 'maintenance', production: 0.0, pressure: 1950.0, temperature: 75.0, depth: 2200.0, diameter: 9.5, wellType: 'direccional', lastMaintenance: new Date('2024-03-05') },
  { name: 'Pozo Condor B-2', location: 'Campo Condor', status: 'active', production: 95.2, pressure: 3150.0, temperature: 95.8, depth: 3000.0, diameter: 8.5, wellType: 'horizontal', lastMaintenance: new Date('2024-01-10') },
  
  // Campo Verde Esperanza - Contrato 2
  { name: 'Pozo Verde C-1', location: 'Campo Verde Esperanza', status: 'active', production: 68.7, pressure: 2480.0, temperature: 84.3, depth: 2400.0, diameter: 7.0, wellType: 'vertical', lastMaintenance: new Date('2024-02-28') },
  { name: 'Pozo Verde C-2', location: 'Campo Verde Esperanza', status: 'active', production: 78.9, pressure: 2720.0, temperature: 89.1, depth: 2600.0, diameter: 7.0, wellType: 'vertical', lastMaintenance: new Date('2024-01-25') },
  
  // Campo Eco-Petrol - Contrato 2
  { name: 'Pozo Eco D-1', location: 'Campo Eco-Petrol', status: 'inactive', production: 0.0, pressure: 1200.0, temperature: 70.5, depth: 1800.0, diameter: 6.0, wellType: 'vertical', lastMaintenance: new Date('2023-12-15') },
  
  // Campo Sur Grande - Contrato 3
  { name: 'Pozo Sur Grande E-1', location: 'Campo Sur Grande', status: 'active', production: 102.3, pressure: 3350.0, temperature: 98.2, depth: 3200.0, diameter: 9.5, wellType: 'horizontal', lastMaintenance: new Date('2024-02-05') },
  { name: 'Pozo Sur Grande E-2', location: 'Campo Sur Grande', status: 'active', production: 56.4, pressure: 2280.0, temperature: 81.7, depth: 2100.0, diameter: 8.5, wellType: 'direccional', lastMaintenance: new Date('2024-03-01') },
  
  // Campo Río Negro - Contrato 3
  { name: 'Pozo Rio Negro F-1', location: 'Campo Rio Negro', status: 'maintenance', production: 0.0, pressure: 2100.0, temperature: 78.9, depth: 2300.0, diameter: 8.5, wellType: 'vertical', lastMaintenance: new Date('2024-03-10') }
]

// Generar datos históricos de producción para los últimos 6 meses
function generateProductionData(wellId, baseProduction) {
  const data = []
  const startDate = new Date('2024-01-01')
  
  for (let i = 0; i < 180; i++) { // 6 meses de datos diarios
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    // Simular variación natural en la producción
    const variation = (Math.random() - 0.5) * 0.2 // ±10% de variación
    const seasonalFactor = Math.sin(i * 0.02) * 0.1 // Factor estacional
    
    const production = Math.max(0, baseProduction * (1 + variation + seasonalFactor))
    const pressureVariation = (Math.random() - 0.5) * 200
    const tempVariation = (Math.random() - 0.5) * 10
    
    data.push({
      wellId,
      production: Math.round(production * 100) / 100,
      pressure: Math.round((2500 + pressureVariation) * 100) / 100,
      temperature: Math.round((85 + tempVariation) * 100) / 100,
      recordDate: date
    })
  }
  
  return data
}

// Generar datos de plan de perforación para cada pozo
function generateDrillingPlan(wellId, totalDepth = 8500) {
  const planData = []
  const formations = ['Surface', 'Intermediate', 'Production', 'Eagle Ford']
  let currentDepth = 0
  
  for (let day = 1; day <= 15; day++) {
    const depthIncrement = Math.floor(Math.random() * 600) + 400 // 400-1000 ft por día
    const newDepth = Math.min(currentDepth + depthIncrement, totalDepth)
    
    // Determinar formación basada en profundidad
    let formation = 'Surface'
    if (newDepth > 1500) formation = 'Intermediate'
    if (newDepth > 3000) formation = 'Production'
    if (newDepth > 5000) formation = 'Eagle Ford'
    
    const plannedROP = 150 + Math.floor(Math.random() * 200) // 150-350 ft/hr
    const operation = day <= 12 ? 'drilling' : 'completion'
    const plannedHours = Math.round((newDepth - currentDepth) / plannedROP * 100) / 100
    
    planData.push({
      wellId,
      day,
      depthFrom: currentDepth,
      depthTo: newDepth,
      plannedROP,
      plannedHours,
      operation,
      formation,
      holeSection: newDepth < 2000 ? 'surface' : newDepth < 5000 ? 'intermediate' : 'production',
      mudType: 'water-based',
      mudDensity: 8.5 + Math.random() * 2,
      bitType: 'PDC',
      bitSize: 8.5 + Math.random() * 1,
      flowRate: 400 + Math.random() * 200,
      rotarySpeed: 100 + Math.random() * 50,
      weightOnBit: 20 + Math.random() * 20,
      daysElapsed: day
    })
    
    currentDepth = newDepth
    if (currentDepth >= totalDepth) break
  }
  
  return planData
}

// Generar datos reales de perforación basados en el plan
function generateDrillingData(wellId, planData) {
  const drillingData = []
  const startDate = new Date('2024-01-01')
  
  for (let i = 0; i < Math.min(12, planData.length); i++) {
    const plan = planData[i]
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    // Generar variaciones realistas del plan
    const depthVariation = (Math.random() - 0.5) * 200 // ±100 ft
    const ropVariation = (Math.random() - 0.5) * 50 // ±25 ft/hr
    
    const actualDepth = Math.max(plan.depthFrom, plan.depthTo + depthVariation)
    const actualROP = Math.max(50, plan.plannedROP + ropVariation)
    
    drillingData.push({
      wellId,
      date,
      depth: Math.round(actualDepth),
      rop: Math.round(actualROP),
      mudDensity: 8.5 + Math.random() * 3, // 8.5-11.5 ppg
      pressure: 500 + i * 200 + Math.random() * 300,
      temperature: 80 + i * 5 + Math.random() * 20,
      rotarySpeed: 100 + Math.random() * 50,
      weightOnBit: 20 + Math.random() * 30,
      standpipePressure: 1000 + i * 150 + Math.random() * 500,
      operation: plan.operation,
      formation: plan.formation
    })
  }
  
  return drillingData
}

async function seed() {
  try {
    console.log('🌱 Iniciando seed de la base de datos...')
    
    // Limpiar datos existentes
    await prisma.productionData.deleteMany()
    await prisma.drillingData.deleteMany()
    await prisma.drillingPlan.deleteMany()
    await prisma.well.deleteMany()
    await prisma.field.deleteMany()
    await prisma.contract.deleteMany()
    await prisma.client.deleteMany()
    await prisma.account.deleteMany()
    await prisma.session.deleteMany()
    await prisma.user.deleteMany()
    
    console.log('🧹 Datos existentes eliminados')
    
    // Crear usuario administrador
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const adminUser = await prisma.user.create({
      data: {
        name: 'Administrador Well Wizards',
        email: 'admin@wellwizards.com',
        password: hashedPassword,
        role: 'admin'
      }
    })
    
    console.log('👤 Usuario administrador creado')
    
    // Crear usuarios de ejemplo
    const users = []
    const usernames = [
      { name: 'Carlos Mendoza', email: 'carlos@wellwizards.com', role: 'engineer' },
      { name: 'Ana Rodriguez', email: 'ana@wellwizards.com', role: 'operator' },
      { name: 'Miguel Torres', email: 'miguel@wellwizards.com', role: 'supervisor' },
      { name: 'Sofia Vargas', email: 'sofia@wellwizards.com', role: 'analyst' }
    ]
    
    for (const userData of usernames) {
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: await bcrypt.hash('password123', 10)
        }
      })
      users.push(user)
    }
    
    console.log('👥 Usuarios de ejemplo creados')
    
    // Crear clientes
    const clients = []
    for (const clientData of sampleClients) {
      const client = await prisma.client.create({
        data: clientData
      })
      clients.push(client)
    }
    
    console.log('🏢 Clientes creados')
    
    // Crear contratos
    const contracts = []
    for (let i = 0; i < sampleContracts.length; i++) {
      const contractData = sampleContracts[i]
      const assignedUser = i === 0 ? adminUser : users[i % users.length]
      const client = clients[i]
      
      const contract = await prisma.contract.create({
        data: {
          ...contractData,
          clientId: client.id,
          userId: assignedUser.id
        }
      })
      contracts.push(contract)
    }
    
    console.log('📄 Contratos creados')
    
    // Crear campos
    const fields = []
    for (let i = 0; i < sampleFields.length; i++) {
      const fieldData = sampleFields[i]
      const contractIndex = Math.floor(i / 2) // 2 campos por contrato
      
      const field = await prisma.field.create({
        data: {
          ...fieldData,
          contractId: contracts[contractIndex].id
        }
      })
      fields.push(field)
    }
    
    console.log('🏞️ Campos creados')
    
    // Crear pozos y asignarlos a campos
    const wells = []
    for (let i = 0; i < sampleWells.length; i++) {
      const wellData = sampleWells[i]
      const assignedUser = i % 2 === 0 ? adminUser : users[i % users.length]
      const fieldIndex = Math.floor(i / 2) // Distribución de pozos por campo
      
      const well = await prisma.well.create({
        data: {
          ...wellData,
          userId: assignedUser.id,
          fieldId: fields[fieldIndex % fields.length].id
        }
      })
      wells.push(well)
    }
    
    console.log('🛢️ Pozos creados')
    
    // Generar datos históricos de producción
    console.log('📊 Generando datos históricos de producción...')
    let totalRecords = 0
    
    for (const well of wells) {
      const productionData = generateProductionData(well.id, well.production)
      
      // Insertar en lotes para mejor rendimiento
      const batchSize = 50
      for (let i = 0; i < productionData.length; i += batchSize) {
        const batch = productionData.slice(i, i + batchSize)
        await prisma.productionData.createMany({
          data: batch
        })
        totalRecords += batch.length
      }
    }
    
    console.log(`📈 ${totalRecords} registros de datos históricos creados`)
    
    // Generar datos de plan de perforación y progreso real
    console.log('🎯 Generando datos de plan de perforación...')
    let totalPlanRecords = 0
    let totalDrillingRecords = 0
    
    for (const well of wells) {
      // Generar plan de perforación
      const planData = generateDrillingPlan(well.id, well.depth || 8500)
      
      for (const plan of planData) {
        await prisma.drillingPlan.create({
          data: plan
        })
        totalPlanRecords++
      }
      
      // Generar datos reales de perforación
      const drillingData = generateDrillingData(well.id, planData)
      
      for (const drilling of drillingData) {
        await prisma.drillingData.create({
          data: drilling
        })
        totalDrillingRecords++
      }
    }
    
    console.log(`🎯 ${totalPlanRecords} registros de plan de perforación creados`)
    console.log(`⚡ ${totalDrillingRecords} registros de progreso real creados`)
    
    // Mostrar resumen
    const wellsCount = await prisma.well.count()
    const usersCount = await prisma.user.count()
    const clientsCount = await prisma.client.count()
    const contractsCount = await prisma.contract.count()
    const fieldsCount = await prisma.field.count()
    const productionCount = await prisma.productionData.count()
    const planCount = await prisma.drillingPlan.count()
    const drillingCount = await prisma.drillingData.count()
    
    console.log('\n✅ Seed completado exitosamente!')
    console.log('📋 Resumen:')
    console.log(`   👤 Usuarios: ${usersCount}`)
    console.log(`   🏢 Clientes: ${clientsCount}`)
    console.log(`   📄 Contratos: ${contractsCount}`)
    console.log(`   🏞️ Campos: ${fieldsCount}`)
    console.log(`   🛢️ Pozos: ${wellsCount}`)
    console.log(`   📊 Registros de producción: ${productionCount}`)
    console.log(`   🎯 Planes de perforación: ${planCount}`)
    console.log(`   ⚡ Datos de perforación: ${drillingCount}`)
    
    console.log('\n🔑 Credenciales de acceso:')
    console.log('   📧 Admin: admin@wellwizards.com')
    console.log('   🔒 Contraseña: admin123')
    
    console.log('\n👥 Usuarios de prueba:')
    console.log('   📧 carlos@wellwizards.com (password123)')
    console.log('   📧 ana@wellwizards.com (password123)')
    console.log('   📧 miguel@wellwizards.com (password123)')
    console.log('   📧 sofia@wellwizards.com (password123)')
    
  } catch (error) {
    console.error('❌ Error en seed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })