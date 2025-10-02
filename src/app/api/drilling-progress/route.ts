import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const contractId = searchParams.get('contractId')
    const timeframe = searchParams.get('timeframe') || '30'

    // Calcular fecha de inicio basada en el timeframe
    let startDate = new Date()
    if (timeframe !== 'all') {
      const days = parseInt(timeframe)
      startDate.setDate(startDate.getDate() - days)
    }

    // Base query conditions
    const whereCondition: any = {
      ...(timeframe !== 'all' && { date: { gte: startDate } })
    }

    // Si hay un contrato específico, filtrar por él
    if (contractId) {
      whereCondition.well = {
        field: {
          contractId: contractId
        }
      }
    }

    const drillingData = await prisma.drillingData.findMany({
      where: whereCondition,
      include: {
        well: {
          include: {
            field: {
              include: {
                contract: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Procesar datos para el formato requerido
    const processedData = drillingData.map((data: any) => ({
      wellId: data.wellId,
      wellName: data.well.name,
      contractName: data.well.field?.contract.name || 'Sin Contrato',
      day: data.day,
      actualDepth: data.depth,
      plannedDepth: data.plan,
      rop: data.rop || 0,
      efficiency: data.efficiency || 75, // Default efficiency
      status: data.status,
      date: data.date.toISOString(),
      contractActivity: data.contractActivity || 'Perforación',
      crew: data.crew || 'Turno A',
      shift: data.shift
    }))

    return NextResponse.json(processedData)

  } catch (error) {
    console.error('Error fetching drilling progress:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}