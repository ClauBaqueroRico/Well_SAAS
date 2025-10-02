import { prisma } from '@/lib/prisma'

export async function getWells() {
  try {
    const wells = await prisma.well.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            productionData: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return wells
  } catch (error) {
    console.error('Error fetching wells:', error)
    return []
  }
}

export async function getWellsStats() {
  try {
    const totalWells = await prisma.well.count()
    const activeWells = await prisma.well.count({
      where: { status: 'active' }
    })
    const maintenanceWells = await prisma.well.count({
      where: { status: 'maintenance' }
    })
    
    const totalProduction = await prisma.well.aggregate({
      _sum: {
        production: true
      },
      where: {
        status: 'active'
      }
    })

    const avgProduction = await prisma.well.aggregate({
      _avg: {
        production: true,
        pressure: true,
        temperature: true
      },
      where: {
        status: 'active'
      }
    })

    return {
      totalWells,
      activeWells,
      maintenanceWells,
      totalProduction: totalProduction._sum.production || 0,
      avgProduction: avgProduction._avg.production || 0,
      avgPressure: avgProduction._avg.pressure || 0,
      avgTemperature: avgProduction._avg.temperature || 0
    }
  } catch (error) {
    console.error('Error fetching well stats:', error)
    return {
      totalWells: 0,
      activeWells: 0,
      maintenanceWells: 0,
      totalProduction: 0,
      avgProduction: 0,
      avgPressure: 0,
      avgTemperature: 0
    }
  }
}

export async function getProductionHistory(days = 30) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const production = await prisma.productionData.findMany({
      where: {
        recordDate: {
          gte: startDate
        }
      },
      include: {
        well: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        recordDate: 'asc'
      }
    })
    
    return production
  } catch (error) {
    console.error('Error fetching production history:', error)
    return []
  }
}