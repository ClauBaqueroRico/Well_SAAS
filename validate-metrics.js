const { PrismaClient } = require('@prisma/client');

async function validatePerformanceMetrics() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== VALIDACIÓN DE MÉTRICAS DE RENDIMIENTO ===\n');
    
    // 1. Verificar cálculos de ROP desde DrillingData
    console.log('📊 1. VERIFICANDO CÁLCULOS DE ROP:');
    const sampleWells = await prisma.well.findMany({
      take: 5,
      include: {
        field: {
          include: {
            contract: {
              include: {
                client: true
              }
            }
          }
        },
        drillingData: {
          take: 10,
          orderBy: {
            date: 'desc'
          }
        }
      },
      where: {
        ropAverage: {
          not: null
        }
      }
    });
    
    sampleWells.forEach(well => {
      console.log(`\n🔧 Pozo: ${well.name} (${well.field?.contract?.name})`);
      console.log(`   - ROP Almacenado: ${well.ropAverage} m/h`);
      
      if (well.drillingData.length > 0) {
        const calculatedROP = well.drillingData.reduce((sum, data) => sum + (data.rop || 0), 0) / well.drillingData.length;
        console.log(`   - ROP Calculado (${well.drillingData.length} registros): ${calculatedROP.toFixed(2)} m/h`);
        console.log(`   - Diferencia: ${Math.abs((well.ropAverage || 0) - calculatedROP).toFixed(2)} m/h`);
        
        // Mostrar últimos registros de perforación
        console.log('   📈 Últimos registros ROP:');
        well.drillingData.slice(0, 3).forEach(data => {
          console.log(`      ${data.date.toISOString().split('T')[0]}: ${data.rop || 0} m/h a ${data.depth}m`);
        });
      } else {
        console.log('   ⚠️  Sin registros de perforación');
      }
    });
    
    // 2. Verificar métricas de profundidad
    console.log('\n\n📏 2. VERIFICANDO MÉTRICAS DE PROFUNDIDAD:');
    const depthMetrics = await prisma.well.findMany({
      select: {
        name: true,
        depth: true,
        finalDepth: true,
        initialDepth: true,
        field: {
          select: {
            name: true,
            contract: {
              select: {
                name: true,
                targetDepth: true
              }
            }
          }
        }
      },
      take: 10
    });
    
    depthMetrics.forEach(well => {
      console.log(`\n📐 ${well.name}:`);
      console.log(`   - Profundidad inicial: ${well.initialDepth || 'N/A'}m`);
      console.log(`   - Profundidad actual: ${well.depth || 'N/A'}m`);
      console.log(`   - Profundidad final: ${well.finalDepth || 'N/A'}m`);
      console.log(`   - Objetivo del contrato: ${well.field?.contract?.targetDepth || 'N/A'}m`);
      
      if (well.finalDepth && well.field?.contract?.targetDepth) {
        const progress = (well.finalDepth / well.field.contract.targetDepth) * 100;
        console.log(`   - Progreso: ${progress.toFixed(1)}%`);
      }
    });
    
    // 3. Verificar métricas temporales
    console.log('\n\n⏱️ 3. VERIFICANDO MÉTRICAS TEMPORALES:');
    const timeMetrics = await prisma.well.findMany({
      select: {
        name: true,
        elapsedDays: true,
        elapsedHours: true,
        initialDate: true,
        actualDate: true,
        field: {
          select: {
            contract: {
              select: {
                name: true,
                expectedDays: true
              }
            }
          }
        }
      },
      where: {
        elapsedDays: {
          not: null
        }
      },
      take: 10
    });
    
    timeMetrics.forEach(well => {
      console.log(`\n⏰ ${well.name}:`);
      console.log(`   - Días transcurridos: ${well.elapsedDays || 'N/A'}`);
      console.log(`   - Horas transcurridas: ${well.elapsedHours || 'N/A'}`);
      console.log(`   - Fecha inicial: ${well.initialDate?.toISOString().split('T')[0] || 'N/A'}`);
      console.log(`   - Fecha actual: ${well.actualDate?.toISOString().split('T')[0] || 'N/A'}`);
      console.log(`   - Días esperados (contrato): ${well.field?.contract?.expectedDays || 'N/A'}`);
      
      if (well.elapsedDays && well.field?.contract?.expectedDays) {
        const timeEfficiency = ((well.field.contract.expectedDays - well.elapsedDays) / well.field.contract.expectedDays) * 100;
        console.log(`   - Eficiencia temporal: ${timeEfficiency.toFixed(1)}%`);
      }
    });
    
    // 4. Verificar consistencia de datos entre Well y DrillingData
    console.log('\n\n🔄 4. VERIFICANDO CONSISTENCIA DE DATOS:');
    const consistencyCheck = await prisma.well.findMany({
      include: {
        drillingData: {
          orderBy: {
            date: 'desc'
          },
          take: 1
        }
      },
      take: 5
    });
    
    consistencyCheck.forEach(well => {
      const latestDrilling = well.drillingData[0];
      console.log(`\n🔍 ${well.name}:`);
      console.log(`   - Profundidad en Well: ${well.depth || 'N/A'}m`);
      console.log(`   - Profundidad final en Well: ${well.finalDepth || 'N/A'}m`);
      
      if (latestDrilling) {
        console.log(`   - Última profundidad en DrillingData: ${latestDrilling.depth}m`);
        console.log(`   - Fecha del último registro: ${latestDrilling.date.toISOString().split('T')[0]}`);
        
        const depthDifference = Math.abs((well.finalDepth || well.depth || 0) - latestDrilling.depth);
        if (depthDifference > 100) {
          console.log(`   ⚠️  INCONSISTENCIA: Diferencia de ${depthDifference.toFixed(0)}m`);
        } else {
          console.log(`   ✅ Consistente (diferencia: ${depthDifference.toFixed(0)}m)`);
        }
      } else {
        console.log('   ⚠️  Sin registros de perforación');
      }
    });
    
    // 5. Resumen de estadísticas
    console.log('\n\n📈 5. RESUMEN DE ESTADÍSTICAS:');
    const stats = await prisma.well.aggregate({
      _avg: {
        ropAverage: true,
        finalDepth: true,
        elapsedDays: true
      },
      _min: {
        ropAverage: true,
        finalDepth: true,
        elapsedDays: true
      },
      _max: {
        ropAverage: true,
        finalDepth: true,
        elapsedDays: true
      },
      _count: {
        ropAverage: true,
        finalDepth: true,
        elapsedDays: true
      }
    });
    
    console.log('📊 ROP (Rate of Penetration):');
    console.log(`   - Promedio: ${stats._avg.ropAverage?.toFixed(2) || 'N/A'} m/h`);
    console.log(`   - Mínimo: ${stats._min.ropAverage?.toFixed(2) || 'N/A'} m/h`);
    console.log(`   - Máximo: ${stats._max.ropAverage?.toFixed(2) || 'N/A'} m/h`);
    console.log(`   - Pozos con ROP: ${stats._count.ropAverage || 0}`);
    
    console.log('\n📏 Profundidad Final:');
    console.log(`   - Promedio: ${stats._avg.finalDepth?.toFixed(0) || 'N/A'} m`);
    console.log(`   - Mínimo: ${stats._min.finalDepth?.toFixed(0) || 'N/A'} m`);
    console.log(`   - Máximo: ${stats._max.finalDepth?.toFixed(0) || 'N/A'} m`);
    console.log(`   - Pozos con profundidad: ${stats._count.finalDepth || 0}`);
    
    console.log('\n⏱️ Días Transcurridos:');
    console.log(`   - Promedio: ${stats._avg.elapsedDays?.toFixed(1) || 'N/A'} días`);
    console.log(`   - Mínimo: ${stats._min.elapsedDays?.toFixed(1) || 'N/A'} días`);
    console.log(`   - Máximo: ${stats._max.elapsedDays?.toFixed(1) || 'N/A'} días`);
    console.log(`   - Pozos con tiempo: ${stats._count.elapsedDays || 0}`);
    
  } catch (error) {
    console.error('❌ Error validando métricas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

validatePerformanceMetrics();