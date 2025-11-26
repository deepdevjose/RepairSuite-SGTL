import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener todos los técnicos
export async function GET() {
  try {
    const tecnicos = await prisma.usuario.findMany({
      where: {
        rol: 'Tecnico',
        activo: true
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true
      },
      orderBy: { nombre: 'asc' }
    })

    return NextResponse.json(tecnicos)
  } catch (error) {
    console.error('Error al obtener técnicos:', error)
    return NextResponse.json(
      { error: 'Error al obtener técnicos' },
      { status: 500 }
    )
  }
}
