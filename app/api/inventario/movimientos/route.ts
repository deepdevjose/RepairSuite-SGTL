import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener movimientos de inventario
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productoId = searchParams.get('productoId')
    const tipo = searchParams.get('tipo')

    const where: any = {}
    if (productoId) where.productoId = productoId
    if (tipo) where.tipo = tipo

    const movimientos = await prisma.movimientoInventario.findMany({
      where,
      include: {
        producto: {
          select: {
            sku: true,
            nombre: true,
          }
        },
        usuario: {
          select: {
            nombre: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limitar a últimos 100 movimientos
    })

    return NextResponse.json(movimientos)
  } catch (error) {
    console.error('Error al obtener movimientos:', error)
    return NextResponse.json(
      { error: 'Error al obtener movimientos' },
      { status: 500 }
    )
  }
}

// POST - Registrar nuevo movimiento de inventario
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar que el usuario existe
    const usuario = await prisma.usuario.findFirst({
      where: { 
        OR: [
          { id: body.usuarioId },
          { activo: true }
        ]
      }
    })
    
    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Crear el movimiento
    const movimiento = await prisma.movimientoInventario.create({
      data: {
        productoId: body.productoId,
        tipo: body.tipo, // Entrada, Salida, Ajuste, Devolucion
        cantidad: body.cantidad,
        motivo: body.motivo,
        usuarioId: usuario.id,
        ordenId: body.ordenId || null,
      },
      include: {
        producto: true,
        usuario: {
          select: {
            nombre: true,
          }
        }
      }
    })

    // Actualizar stock del producto según el tipo de movimiento
    const producto = await prisma.producto.findUnique({
      where: { id: body.productoId }
    })

    if (producto) {
      let nuevoStock = producto.stockActual

      switch (body.tipo) {
        case 'Entrada':
          nuevoStock += body.cantidad
          break
        case 'Salida':
          nuevoStock -= body.cantidad
          break
        case 'Ajuste':
          nuevoStock = body.cantidad // Ajuste absoluto
          break
        case 'Devolucion':
          nuevoStock += body.cantidad
          break
      }

      await prisma.producto.update({
        where: { id: body.productoId },
        data: { stockActual: Math.max(0, nuevoStock) }
      })
    }

    return NextResponse.json(movimiento, { status: 201 })
  } catch (error) {
    console.error('Error al registrar movimiento:', error)
    return NextResponse.json(
      { error: 'Error al registrar movimiento' },
      { status: 500 }
    )
  }
}
