import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const contracts = await prisma.contract.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            contactName: true
          }
        },
        fields: {
          include: {
            wells: {
              select: {
                id: true,
                name: true,
                status: true,
                finalDepth: true,
                depth: true,
                ropAverage: true,
                elapsedDays: true
              }
            },
          },
        },
        _count: {
          select: {
            fields: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { error: 'Error fetching contracts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const contract = await prisma.contract.create({
      data: {
        name: data.name,
        clientId: data.clientId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        value: data.totalValue || data.value,
        status: data.status,
        description: data.description,
        targetDepth: data.targetDepth,
        expectedDays: data.expectedDays,
        dailyRate: data.dailyRate,
        userId: data.userId || 'default-user-id' // Temporal
      },
      include: {
        client: true,
        _count: {
          select: {
            fields: true,
          },
        },
      },
    });

    return NextResponse.json(contract);
  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json(
      { error: 'Error creating contract' },
      { status: 500 }
    );
  }
}