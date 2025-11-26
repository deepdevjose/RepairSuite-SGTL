import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener equipos de un cliente
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('clienteId')

    if (clienteId) {
      const equipos = await prisma.equipo.findMany({
        where: { clienteId },
        include: { cliente: true },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(equipos)
    }

    // Si no hay clienteId, devolver todos los equipos
    const equipos = await prisma.equipo.findMany({
      include: { cliente: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(equipos)
  } catch (error) {
    console.error('Error al obtener equipos:', error)
    return NextResponse.json(
      { error: 'Error al obtener equipos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo equipo
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const equipo = await prisma.equipo.create({
      data: {
        clienteId: body.clienteId,
        tipo: body.tipo,
        marca: body.marca,
        modelo: body.modelo,
        numeroSerie: body.numeroSerie || null,
        notas: body.notas || null,
      },
      include: {
        cliente: true
      }
    })

    return NextResponse.json(equipo, { status: 201 })
  } catch (error) {
    console.error('Error al crear equipo:', error)
    return NextResponse.json(
      { error: 'Error al crear equipo' },
      { status: 500 }
    )
  }
}
