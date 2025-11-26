import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener todas las garantías
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ordenId = searchParams.get('ordenId')
    const activa = searchParams.get('activa')

    const where: any = {}
    if (ordenId) where.ordenId = ordenId
    if (activa !== null && activa !== undefined) {
      where.activa = activa === 'true'
    }

    const garantias = await prisma.garantia.findMany({
      where,
      include: {
        orden: {
          include: {
            cliente: true,
            equipo: true,
          }
        }
      },
      orderBy: { fechaInicio: 'desc' }
    })

    return NextResponse.json(garantias)
  } catch (error) {
    console.error('Error al obtener garantías:', error)
    return NextResponse.json(
      { error: 'Error al obtener garantías' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva garantía
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const fechaInicio = new Date()
    const fechaVencimiento = new Date(fechaInicio)
    fechaVencimiento.setDate(fechaVencimiento.getDate() + body.diasGarantia)

    const garantia = await prisma.garantia.create({
      data: {
        ordenId: body.ordenId,
        diasGarantia: body.diasGarantia,
        fechaInicio,
        fechaVencimiento,
        descripcion: body.descripcion,
        activa: true,
      },
      include: {
        orden: {
          include: {
            cliente: true,
            equipo: true,
          }
        }
      }
    })

    return NextResponse.json(garantia, { status: 201 })
  } catch (error) {
    console.error('Error al crear garantía:', error)
    return NextResponse.json(
      { error: 'Error al crear garantía' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar garantía
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    const garantia = await prisma.garantia.update({
      where: { id: body.id },
      data: {
        activa: body.activa,
        descripcion: body.descripcion,
      },
      include: {
        orden: {
          include: {
            cliente: true,
            equipo: true,
          }
        }
      }
    })

    return NextResponse.json(garantia)
  } catch (error) {
    console.error('Error al actualizar garantía:', error)
    return NextResponse.json(
      { error: 'Error al actualizar garantía' },
      { status: 500 }
    )
  }
}
