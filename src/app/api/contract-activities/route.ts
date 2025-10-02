import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const contractId = searchParams.get('contractId')

    const whereCondition: any = contractId ? { contractId } : {}

    const contractActivities = await prisma.contractActivity.findMany({
      where: whereCondition,
      include: {
        contract: {
          select: {
            name: true,
            contractType: true
          }
        }
      },
      orderBy: [
        { priority: 'asc' },
        { name: 'asc' }
      ]
    })

    // Procesar datos para el formato requerido
    const processedData = contractActivities.map((activity: any) => ({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      category: activity.category,
      unit: activity.unit,
      targetValue: activity.targetValue,
      priority: activity.priority,
      isActive: activity.isActive,
      minRate: activity.minRate,
      maxRate: activity.maxRate,
      optimalRate: activity.optimalRate,
      contractName: activity.contract.name,
      contractType: activity.contract.contractType
    }))

    return NextResponse.json(processedData)

  } catch (error) {
    console.error('Error fetching contract activities:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const contractActivity = await prisma.contractActivity.create({
      data: {
        contractId: body.contractId,
        name: body.name,
        description: body.description,
        category: body.category,
        unit: body.unit,
        targetValue: body.targetValue,
        priority: body.priority || 1,
        isActive: body.isActive !== undefined ? body.isActive : true,
        minRate: body.minRate,
        maxRate: body.maxRate,
        optimalRate: body.optimalRate
      },
      include: {
        contract: {
          select: {
            name: true,
            contractType: true
          }
        }
      }
    })

    return NextResponse.json(contractActivity, { status: 201 })

  } catch (error) {
    console.error('Error creating contract activity:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}