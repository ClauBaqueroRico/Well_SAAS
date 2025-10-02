const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedContractActivities() {
  try {
    console.log('🌱 Seeding contract activities...')

    // Obtener contratos existentes
    const contracts = await prisma.contract.findMany()

    if (contracts.length === 0) {
      console.log('No contracts found. Creating sample contracts first...')
      
      // Crear cliente y usuario si no existen
      const user = await prisma.user.upsert({
        where: { email: 'admin@wellwizards.com' },
        update: {},
        create: {
          email: 'admin@wellwizards.com',
          name: 'Admin User',
          password: '$2b$12$YourHashedPasswordHere' // Debe ser hash real
        }
      })

      const client = await prisma.client.upsert({
        where: { email: 'petrotech@example.com' },
        update: {},
        create: {
          name: 'PetroTech Energy',
          email: 'petrotech@example.com',
          phone: '+1-555-0123',
          address: 'Houston, TX',
          userId: user.id
        }
      })

      // Crear contrato de ejemplo
      await prisma.contract.create({
        data: {
          name: 'Contrato Perforación Mateguafa',
          description: 'Contrato de perforación para campo Mateguafa',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          value: 5000000.00,
          currency: 'USD',
          status: 'active',
          contractType: 'drilling',
          targetDepth: 3500.0,
          expectedDays: 45,
          dailyRate: 25000.0,
          clientId: client.id,
          userId: user.id
        }
      })
    }

    // Obtener contratos actualizados
    const updatedContracts = await prisma.contract.findMany()

    // Actividades típicas de contratos de perforación
    const drillingActivities = [
      {
        name: 'Perforación de Superficie',
        description: 'Perforación del tramo de superficie del pozo',
        category: 'drilling',
        unit: 'meters',
        targetValue: 500.0,
        priority: 1,
        minRate: 15.0,
        maxRate: 30.0,
        optimalRate: 22.0
      },
      {
        name: 'Perforación Intermedia',
        description: 'Perforación del tramo intermedio del pozo',
        category: 'drilling',
        unit: 'meters',
        targetValue: 1500.0,
        priority: 2,
        minRate: 10.0,
        maxRate: 20.0,
        optimalRate: 15.0
      },
      {
        name: 'Perforación Productora',
        description: 'Perforación del tramo productor del pozo',
        category: 'drilling',
        unit: 'meters',
        targetValue: 1500.0,
        priority: 3,
        minRate: 5.0,
        maxRate: 15.0,
        optimalRate: 10.0
      },
      {
        name: 'Conexiones de Tubería',
        description: 'Tiempo empleado en conexiones de tubería',
        category: 'drilling',
        unit: 'hours',
        targetValue: 120.0,
        priority: 4,
        minRate: 0.5,
        maxRate: 2.0,
        optimalRate: 1.0
      },
      {
        name: 'Circulación y Limpieza',
        description: 'Operaciones de circulación y limpieza del hoyo',
        category: 'completion',
        unit: 'hours',
        targetValue: 48.0,
        priority: 2,
        minRate: 2.0,
        maxRate: 8.0,
        optimalRate: 4.0
      },
      {
        name: 'Pruebas de Formación',
        description: 'Pruebas de evaluación de la formación',
        category: 'testing',
        unit: 'hours',
        targetValue: 24.0,
        priority: 3,
        minRate: 4.0,
        maxRate: 12.0,
        optimalRate: 6.0
      },
      {
        name: 'Mantenimiento Preventivo',
        description: 'Mantenimiento preventivo de equipos',
        category: 'maintenance',
        unit: 'hours',
        targetValue: 40.0,
        priority: 5,
        minRate: 1.0,
        maxRate: 4.0,
        optimalRate: 2.0
      },
      {
        name: 'Preparación de Completación',
        description: 'Preparación para operaciones de completación',
        category: 'completion',
        unit: 'hours',
        targetValue: 72.0,
        priority: 1,
        minRate: 6.0,
        maxRate: 16.0,
        optimalRate: 10.0
      }
    ]

    // Crear actividades para cada contrato
    for (const contract of updatedContracts) {
      console.log(`Creating activities for contract: ${contract.name}`)
      
      for (const activity of drillingActivities) {
        await prisma.contractActivity.create({
          data: {
            ...activity,
            contractId: contract.id
          }
        })
      }
    }

    // Actualizar algunos datos de perforación con actividades específicas
    const wells = await prisma.well.findMany({
      include: {
        field: {
          include: {
            contract: true
          }
        }
      }
    })

    const activities = ['Perforación de Superficie', 'Perforación Intermedia', 'Perforación Productora', 'Conexiones de Tubería']

    for (const well of wells) {
      const drillingData = await prisma.drillingData.findMany({
        where: { wellId: well.id },
        take: 10
      })

      for (const data of drillingData) {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)]
        const randomEfficiency = 70 + Math.random() * 25 // 70-95% efficiency

        await prisma.drillingData.update({
          where: { id: data.id },
          data: {
            contractActivity: randomActivity,
            efficiency: Math.round(randomEfficiency),
            crew: ['Turno A', 'Turno B', 'Turno C'][Math.floor(Math.random() * 3)],
            shift: ['day', 'night'][Math.floor(Math.random() * 2)],
            status: ['drilling', 'tripping', 'maintenance', 'waiting'][Math.floor(Math.random() * 4)]
          }
        })
      }
    }

    console.log('✅ Contract activities seeded successfully!')

  } catch (error) {
    console.error('Error seeding contract activities:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedContractActivities()