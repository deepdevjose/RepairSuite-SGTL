import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Registrar un nuevo pago
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Crear el pago
    const pago = await prisma.pago.create({
      data: {
        ordenServicioId: body.ordenServicioId,
        monto: body.monto,
        metodoPago: body.metodoPago,
        referencia: body.referencia || null,
        notas: body.notas || null,
        fechaPago: new Date(),
      },
      include: {
        ordenServicio: {
          include: {
            cliente: true,
            equipo: true,
          }
        }
      }
    })

    // Calcular total pagado para la orden
    const todosPagos = await prisma.pago.findMany({
      where: { ordenServicioId: body.ordenServicioId }
    })

    const totalPagado = todosPagos.reduce((sum: number, p: any) => sum + Number(p.monto), 0)
    const orden = await prisma.ordenServicio.findUnique({
      where: { id: body.ordenServicioId }
    })

    // Actualizar saldoPendiente de la orden
    if (orden) {
      let montoTotalOrden = orden.montoTotal ? Number(orden.montoTotal) : 0
      
      // Si no hay montoTotal y este es el primer pago, usar el monto del pago como montoTotal
      if (!orden.montoTotal && todosPagos.length === 1) {
        montoTotalOrden = Number(body.monto)
        await prisma.ordenServicio.update({
          where: { id: body.ordenServicioId },
          data: { montoTotal: montoTotalOrden }
        })
      }
      
      const nuevoSaldo = montoTotalOrden - totalPagado
      
      await prisma.ordenServicio.update({
        where: { id: body.ordenServicioId },
        data: { 
          saldoPendiente: nuevoSaldo,
          // Si está completamente pagado, actualizar estado
          estado: nuevoSaldo <= 0 ? 'Pagado y entregado' : orden.estado
        }
      })
    }

    return NextResponse.json(pago, { status: 201 })
  } catch (error) {
    console.error('Error al registrar pago:', error)
    return NextResponse.json(
      { error: 'Error al registrar pago', details: error },
      { status: 500 }
    )
  }
}

// GET - Obtener pagos de una orden específica
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ordenId = searchParams.get('ordenId')

    if (ordenId) {
      const pagos = await prisma.pago.findMany({
        where: { ordenServicioId: ordenId },
        include: {
          ordenServicio: {
            include: {
              cliente: true,
            }
          }
        },
        orderBy: { fechaPago: 'desc' }
      })
      return NextResponse.json(pagos)
    }

    // Si no hay ordenId, devolver todos los pagos
    const pagos = await prisma.pago.findMany({
      include: {
        ordenServicio: {
          include: {
            cliente: true,
          }
        }
      },
      orderBy: { fechaPago: 'desc' }
    })

    return NextResponse.json(pagos)
  } catch (error) {
    console.error('Error al obtener pagos:', error)
    return NextResponse.json(
      { error: 'Error al obtener pagos' },
      { status: 500 }
    )
  }
}
