const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedDrillingPlan() {
  console.log('🚀 Starting Drilling Plan seeding...')

  try {
    // Obtener todos los pozos existentes
    const wells = await prisma.well.findMany({
      include: {
        field: {
          include: {
            contract: true
          }
        }
      }
    })

    console.log(`Found ${wells.length} wells to create drilling plans for`)

    for (const well of wells) {
      console.log(`\n📋 Creating drilling plan for: ${well.name}`)
      
      // Limpiar planes existentes para este pozo
      await prisma.drillingPlan.deleteMany({
        where: { wellId: well.id }
      })

      // Calcular parámetros base del plan
      const targetDepth = well.finalDepth || well.depth || 12000
      const estimatedDays = well.elapsedDays || 45
      const avgROP = well.ropAverage || 20
      
      // Crear plan día por día
      const drillingPlan = []
      let currentDepth = 1000 // Profundidad inicial típica
      
      for (let day = 1; day <= estimatedDays && currentDepth < targetDepth; day++) {
        // Calcular progreso diario basado en secciones de hoyo
        let dailyProgress, rop, holeSection, formation, operation
        
        if (currentDepth < 3000) {
          // Superficie - más rápido
          holeSection = 'Surface'
          formation = 'Overburden'
          operation = 'Drilling - Surface Hole'
          rop = avgROP * 1.5 // 50% más rápido en superficie
          dailyProgress = rop * 16 // 16 horas operativas
        } else if (currentDepth < 8000) {
          // Intermedio
          holeSection = 'Intermediate'
          formation = well.formation || 'Shale'
          operation = 'Drilling - Intermediate Hole'
          rop = avgROP * 1.2 // 20% más rápido
          dailyProgress = rop * 14 // 14 horas operativas
        } else {
          // Sección productiva - más lento
          holeSection = 'Production'
          formation = well.formation || 'Reservoir'
          operation = 'Drilling - Production Hole'
          rop = avgROP * 0.8 // 20% más lento
          dailyProgress = rop * 12 // 12 horas operativas
        }

        const depthTo = Math.min(currentDepth + dailyProgress, targetDepth)

        // Agregar variabilidad realista
        const variability = 0.1 // 10% de variabilidad
        const randomFactor = 1 + (Math.random() - 0.5) * variability
        const adjustedDepthTo = Math.min(currentDepth + (dailyProgress * randomFactor), targetDepth)

        // Parámetros específicos por sección
        let mudType, mudDensity, bitType, flowRate, rotarySpeed, weightOnBit

        if (holeSection === 'Surface') {
          mudType = 'Water-based'
          mudDensity = 8.5 + Math.random() * 0.5
          bitType = 'PDC'
          flowRate = 400 + Math.random() * 100
          rotarySpeed = 120 + Math.random() * 40
          weightOnBit = 15 + Math.random() * 10
        } else if (holeSection === 'Intermediate') {
          mudType = 'Water-based'
          mudDensity = 9.0 + Math.random() * 0.8
          bitType = 'PDC'
          flowRate = 350 + Math.random() * 80
          rotarySpeed = 100 + Math.random() * 30
          weightOnBit = 20 + Math.random() * 15
        } else {
          mudType = 'Oil-based'
          mudDensity = 10.0 + Math.random() * 1.0
          bitType = 'PDC'
          flowRate = 300 + Math.random() * 60
          rotarySpeed = 80 + Math.random() * 20
          weightOnBit = 25 + Math.random() * 20
        }

        // Calcular costos diarios
        const baseDailyCost = 50000 + (currentDepth / 100) * 200 // Costo aumenta con profundidad
        const equipmentCost = baseDailyCost * 0.4
        const consumablesCost = baseDailyCost * 0.3
        const dailyCost = baseDailyCost + (Math.random() - 0.5) * baseDailyCost * 0.2

        // Nivel de riesgo basado en profundidad y formación
        let riskLevel = 'low'
        let contingencyTime = 2
        
        if (currentDepth > 8000) {
          riskLevel = 'medium'
          contingencyTime = 4
        }
        if (currentDepth > 10000) {
          riskLevel = 'high'
          contingencyTime = 6
        }

        drillingPlan.push({
          wellId: well.id,
          day: day,
          depthFrom: Math.round(currentDepth),
          depthTo: Math.round(adjustedDepthTo),
          plannedROP: Math.round(rop * 10) / 10,
          plannedHours: holeSection === 'Surface' ? 16 : holeSection === 'Intermediate' ? 14 : 12,
          formation: formation,
          holeSection: holeSection,
          operation: operation,
          mudType: mudType,
          mudDensity: Math.round(mudDensity * 10) / 10,
          bitType: bitType,
          bitSize: holeSection === 'Surface' ? 17.5 : holeSection === 'Intermediate' ? 12.25 : 8.5,
          flowRate: Math.round(flowRate),
          rotarySpeed: Math.round(rotarySpeed),
          weightOnBit: Math.round(weightOnBit),
          drillingTime: 12,
          connectionTime: 1.5,
          circulationTime: 2,
          trippingTime: holeSection === 'Production' ? 4 : 2,
          dailyCost: Math.round(dailyCost),
          consumablesCost: Math.round(consumablesCost),
          equipmentCost: Math.round(equipmentCost),
          riskLevel: riskLevel,
          contingencyTime: contingencyTime,
          expectedEfficiency: 85 + Math.random() * 10,
          qualityTargets: `Maintain ${holeSection.toLowerCase()} hole stability`,
          complications: riskLevel === 'high' ? 'Potential formation instability' : null
        })

        currentDepth = adjustedDepthTo
      }

      // Insertar todo el plan de una vez
      await prisma.drillingPlan.createMany({
        data: drillingPlan
      })

      console.log(`✅ Created ${drillingPlan.length} days of drilling plan for ${well.name}`)
      console.log(`   Target depth: ${targetDepth}m, Final planned depth: ${Math.round(currentDepth)}m`)
    }

    console.log('\n🎉 Drilling Plan seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error seeding drilling plan:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el seed si es llamado directamente
if (require.main === module) {
  seedDrillingPlan()
    .catch((e) => {
      console.error('❌ Drilling Plan seeding failed:', e)
      process.exit(1)
    })
}

module.exports = { seedDrillingPlan }