import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Error fetching clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const client = await prisma.client.create({
      data: {
        name: data.name,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        address: data.address,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Error creating client' },
      { status: 500 }
    );
  }
}