import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener todas las órdenes
export async function GET() {
  try {
    const ordenes = await prisma.ordenServicio.findMany({
      include: {
        cliente: true,
        equipo: true,
        tecnico: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(ordenes)
  } catch (error) {
    console.error('Error al obtener órdenes:', error)
    return NextResponse.json(
      { error: 'Error al obtener órdenes' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva orden
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Generar folio único
    const lastOrder = await prisma.ordenServicio.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    
    const lastNumber = lastOrder?.folio ? parseInt(lastOrder.folio.split('-')[2]) : 1000
    const newFolio = `RS-OS-${lastNumber + 1}`

    // Crear la orden
    const orden = await prisma.ordenServicio.create({
      data: {
        folio: newFolio,
        clienteId: body.clienteId,
        equipoId: body.equipoId,
        tecnicoId: body.tecnicoId || null,
        problemaReportado: body.problemaReportado,
        estado: 'Esperando diagnóstico',
        prioridad: body.prioridad || 'Normal',
      },
      include: {
        cliente: true,
        equipo: true,
        tecnico: true,
      }
    })

    return NextResponse.json(orden, { status: 201 })
  } catch (error) {
    console.error('Error al crear orden:', error)
    return NextResponse.json(
      { error: 'Error al crear orden' },
      { status: 500 }
    )
  }
}
