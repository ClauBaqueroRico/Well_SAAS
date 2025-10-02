import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const contract = await prisma.contract.findUnique({
      where: {
        id: params.id,
      },
      include: {
        client: true,
        fields: {
          include: {
            wells: true,
          },
        },
        _count: {
          select: {
            fields: true,
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(contract);
  } catch (error) {
    console.error('Error fetching contract:', error);
    return NextResponse.json(
      { error: 'Error fetching contract' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const contract = await prisma.contract.update({
      where: {
        id: params.id,
      },
      data: {
        name: data.name,
        contractNumber: data.contractNumber,
        clientId: data.clientId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        totalValue: data.totalValue,
        status: data.status,
        description: data.description,
        targetDepth: data.targetDepth,
        plannedWells: data.plannedWells,
        budgetAFE: data.budgetAFE,
        actualCost: data.actualCost,
        dailyRate: data.dailyRate,
        updatedAt: new Date(),
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
    console.error('Error updating contract:', error);
    return NextResponse.json(
      { error: 'Error updating contract' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if contract has associated fields/wells
    const contract = await prisma.contract.findUnique({
      where: {
        id: params.id,
      },
      include: {
        _count: {
          select: {
            fields: true,
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    if (contract._count.fields > 0) {
      return NextResponse.json(
        { error: 'Cannot delete contract with associated fields/wells' },
        { status: 400 }
      );
    }

    await prisma.contract.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contract:', error);
    return NextResponse.json(
      { error: 'Error deleting contract' },
      { status: 500 }
    );
  }
}