import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? 'PRESENTE' : 'AUSENTE',
    nextAuthUrl: process.env.NEXTAUTH_URL || 'NO CONFIGURADO',
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'PRESENTE' : 'AUSENTE',
    timestamp: new Date().toISOString(),
    message: 'Información de configuración del servidor'
  });
}