import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const wellId = searchParams.get('wellId')
    
    if (!wellId) {
      return NextResponse.json({ error: 'wellId is required' }, { status: 400 })
    }

    // Obtener plan de perforación
    const drillingPlan = await prisma.drillingPlan.findMany({
      where: {
        wellId: wellId
      },
      orderBy: {
        day: 'asc'
      }
    })

    // Obtener datos reales de perforación
    const actualDrillingData = await prisma.drillingData.findMany({
      where: {
        wellId: wellId
      },
      orderBy: {
        day: 'asc'
      }
    })

    // Obtener información del pozo
    const well = await prisma.well.findUnique({
      where: { id: wellId },
      include: {
        field: {
          include: {
            contract: {
              include: {
                client: true
              }
            }
          }
        }
      }
    })

    if (!well) {
      return NextResponse.json({ error: 'Well not found' }, { status: 404 })
    }

    // Combinar datos para crear dataset Plan vs Real
    const maxDays = Math.max(
      drillingPlan.length > 0 ? Math.max(...drillingPlan.map(p => p.day)) : 0,
      actualDrillingData.length > 0 ? Math.max(...actualDrillingData.map(d => d.day)) : 0
    )

    const combinedData = []
    
    for (let day = 1; day <= maxDays; day++) {
      const planData = drillingPlan.find(p => p.day === day)
      const actualData = actualDrillingData.find(d => d.day === day)
      
      combinedData.push({
        day,
        planDepth: planData?.depthTo || null,
        actualDepth: actualData?.depth || null,
        planROP: planData?.plannedROP || null,
        actualROP: actualData?.rop || null,
        planHours: planData?.plannedHours || null,
        actualHours: actualData?.drillingTime || null,
        formation: planData?.formation || actualData?.formation || null,
        holeSection: planData?.holeSection || actualData?.holeSection || null,
        operation: planData?.operation || actualData?.operation || null,
        variance: planData && actualData ? 
          ((actualData.depth - planData.depthTo) / planData.depthTo * 100) : null,
        efficiency: planData && actualData && planData.plannedROP > 0 ? 
          (actualData.rop / planData.plannedROP * 100) : null
      })
    }

    // Calcular estadísticas de performance
    const stats = {
      totalPlanDays: drillingPlan.length,
      totalActualDays: actualDrillingData.length,
      planTargetDepth: drillingPlan.length > 0 ? 
        Math.max(...drillingPlan.map(p => p.depthTo)) : 0,
      actualFinalDepth: actualDrillingData.length > 0 ? 
        Math.max(...actualDrillingData.map(d => d.depth)) : 0,
      avgPlanROP: drillingPlan.length > 0 ? 
        drillingPlan.reduce((sum, p) => sum + (p.plannedROP || 0), 0) / drillingPlan.length : 0,
      avgActualROP: actualDrillingData.length > 0 ? 
        actualDrillingData.reduce((sum, d) => sum + (d.rop || 0), 0) / actualDrillingData.length : 0,
      overallEfficiency: 0,
      daysAheadBehind: 0
    }

    // Calcular eficiencia general
    if (stats.avgPlanROP > 0) {
      stats.overallEfficiency = (stats.avgActualROP / stats.avgPlanROP) * 100
    }

    // Calcular días de adelanto/atraso
    stats.daysAheadBehind = stats.totalActualDays - stats.totalPlanDays

    return NextResponse.json({
      well,
      plan: drillingPlan,
      actual: actualDrillingData,
      combined: combinedData,
      stats
    })

  } catch (error) {
    console.error('Error fetching drilling plan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}