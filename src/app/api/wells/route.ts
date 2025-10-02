import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const contractId = searchParams.get('contractId')
    
    const whereCondition: any = {}
    
    // Si hay un contrato específico, filtrar por él
    if (contractId) {
      whereCondition.field = {
        contractId: contractId
      }
    }

    const wells = await prisma.well.findMany({
      where: whereCondition,
      include: {
        field: {
          include: {
            contract: {
              select: {
                id: true,
                name: true,
                contractType: true,
                targetDepth: true,
                expectedDays: true,
                dailyRate: true,
                client: {
                  select: {
                    id: true,
                    name: true,
                    contactName: true
                  }
                }
              }
            }
          }
        },
        productionData: {
          take: 1,
          orderBy: {
            recordDate: 'desc'
          }
        },
        drillingData: {
          take: 10,
          orderBy: {
            recordDate: 'desc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Procesar datos para el formato requerido
    const processedWells = wells.map((well: any) => {
      const latestProduction = well.productionData[0]
      const latestDrilling = well.drillingData[0]
      
      // Calcular ROP promedio y WCR
      const avgROP = well.drillingData.length > 0
        ? well.drillingData.reduce((sum: number, d: any) => sum + (d.rop || 0), 0) / well.drillingData.length
        : well.ropAverage || 0
      
      return {
        id: well.id,
        name: well.name,
        location: well.location,
        status: well.status,
        field: well.field ? {
          name: well.field.name,
          contract: well.field.contract
        } : undefined,
        
        // Datos de producción
        production: latestProduction?.production || well.production || 0,
        pressure: latestProduction?.pressure || well.pressure || 0,
        temperature: latestProduction?.temperature || well.temperature || 0,
        
        // Datos de perforación
        depth: latestDrilling?.depth || well.depth || 0,
        finalDepth: well.finalDepth || latestDrilling?.depth || 0,
        ropAverage: avgROP,
        wellConstructionRate: well.wellConstructionRate || avgROP * 0.8, // Estimación
        
        // Nuevos campos técnicos
        formation: well.formation || 'Unknown Formation',
        holeSection: well.holeSection || 'Production',
        operation: well.operation || 'drilling',
        mudType: well.mudType || 'water-based',
        mudDensity: well.mudDensity || 9.2,
        casingSize: well.casingSize || '9 5/8"',
        drillPipeSize: well.drillPipeSize || '5"',
        bitType: well.bitType || 'PDC',
        bitSize: well.bitSize || 8.5,
        flowRate: well.flowRate || 350,
        rotarySpeed: well.rotarySpeed || 120,
        weightOnBit: well.weightOnBit || 25,
        torque: well.torque || 8500,
        standpipePressure: well.standpipePressure || 2800,
        
        // Datos geológicos
        formationTop: well.formationTop || null,
        formationBottom: well.formationBottom || null,
        lithology: well.lithology || 'Sandstone',
        porosity: well.porosity || null,
        permeability: well.permeability || null,
        
        // Datos económicos
        budgetAFE: well.budgetAFE || null,
        actualCost: well.actualCost || null,
        dailyRate: well.dailyRate || 25000,
        
        // Fechas y tiempos
        initialDate: well.initialDate?.toISOString(),
        actualDate: well.actualDate?.toISOString(),
        elapsedDays: well.elapsedDays,
        elapsedHours: well.elapsedHours,
        
        // Metadatos
        createdAt: well.createdAt.toISOString(),
        updatedAt: well.updatedAt.toISOString()
      }
    })

    return NextResponse.json(processedWells)

  } catch (error) {
    console.error('Error fetching wells:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const well = await prisma.well.create({
      data: {
        name: body.name,
        location: body.location,
        status: body.status || 'active',
        depth: body.depth || 0,
        diameter: body.diameter,
        wellType: body.wellType || 'vertical',
        latitude: body.latitude,
        longitude: body.longitude,
        userId: body.userId,
        fieldId: body.fieldId,
        
        // Datos de perforación opcionales
        initialDate: body.initialDate ? new Date(body.initialDate) : null,
        actualDate: body.actualDate ? new Date(body.actualDate) : null,
        elapsedDays: body.elapsedDays,
        elapsedHours: body.elapsedHours,
        finalDepth: body.finalDepth,
        ropAverage: body.ropAverage,
        wellConstructionRate: body.wellConstructionRate
      },
      include: {
        field: {
          include: {
            contract: true
          }
        }
      }
    })

    return NextResponse.json(well, { status: 201 })

  } catch (error) {
    console.error('Error creating well:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}