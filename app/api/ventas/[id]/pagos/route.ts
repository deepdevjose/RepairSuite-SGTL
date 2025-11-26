import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Registrar un pago para una venta
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const ventaId = params.id

    // Verificar que la venta existe
    const venta = await prisma.venta.findUnique({
      where: { id: ventaId }
    })

    if (!venta) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      )
    }

    // Crear el pago
    const pago = await prisma.pagoVenta.create({
      data: {
        ventaId,
        monto: body.monto,
        metodoPago: body.metodoPago,
        referencia: body.referencia || null,
        comprobante: body.comprobante || null,
        notas: body.notas || null,
        usuarioId: body.usuarioId,
      },
      include: {
        usuario: {
          select: {
            nombre: true
          }
        }
      }
    })

    // Actualizar montos en la venta
    const nuevoMontoPagado = venta.montoPagado.toNumber() + body.monto
    const nuevoSaldo = venta.total.toNumber() - nuevoMontoPagado

    const nuevoEstadoPago = nuevoMontoPagado >= venta.total.toNumber() ? 'Pagado' :
                           nuevoMontoPagado > 0 ? 'Parcial' : 'Pendiente'

    await prisma.venta.update({
      where: { id: ventaId },
      data: {
        montoPagado: nuevoMontoPagado,
        saldoPendiente: nuevoSaldo,
        estadoPago: nuevoEstadoPago,
        fechaCompletado: nuevoEstadoPago === 'Pagado' ? new Date() : null
      }
    })

    return NextResponse.json(pago, { status: 201 })
  } catch (error) {
    console.error('Error al registrar pago:', error)
    return NextResponse.json(
      { error: 'Error al registrar pago' },
      { status: 500 }
    )
  }
}

// GET - Obtener todos los pagos de una venta
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pagos = await prisma.pagoVenta.findMany({
      where: { ventaId: params.id },
      include: {
        usuario: {
          select: {
            nombre: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
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
