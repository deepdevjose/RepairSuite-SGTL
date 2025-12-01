import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Crear una nueva venta
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar que el usuario existe
    const usuario = await prisma.usuario.findFirst({
      where: { 
        OR: [
          { id: body.usuarioId },
          { rol: 'Recepcion', activo: true }
        ]
      }
    })
    
    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Generar folio único
    const lastSale = await prisma.venta.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    
    const lastNumber = lastSale?.folio ? parseInt(lastSale.folio.split('-')[2]) : 2000
    const newFolio = `RS-VTA-${lastNumber + 1}`

    // Calcular totales
    const subtotal = body.items.reduce((sum: number, item: any) => {
      return sum + (item.cantidad * item.precioUnitario)
    }, 0)

    const descuento = body.descuento || 0
    const impuestos = (subtotal - descuento) * 0.16 // 16% IVA
    const total = subtotal - descuento + impuestos
    const saldoPendiente = total - (body.montoPagado || 0)

    // Determinar estado de pago
    const estadoPago = body.montoPagado >= total ? 'Pagado' : 
                       body.montoPagado > 0 ? 'Parcial' : 'Pendiente'

    // Crear la venta con sus items
    const venta = await prisma.venta.create({
      data: {
        folio: newFolio,
        clienteId: body.clienteId,
        usuarioId: usuario.id,
        ordenServicioId: body.ordenServicioId || null,
        subtotal,
        descuento,
        impuestos,
        total,
        montoPagado: body.montoPagado || 0,
        saldoPendiente,
        metodoPago: body.metodoPago,
        estadoPago,
        estado: 'Completada',
        fechaVencimiento: body.fechaVencimiento || null,
        notas: body.notas || null,
        items: {
          create: body.items.map((item: any) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            costoUnitario: item.costoUnitario || 0,
            subtotal: item.cantidad * item.precioUnitario,
            tipo: item.tipo || 'Producto',
          }))
        }
      },
      include: {
        cliente: true,
        items: {
          include: {
            producto: true
          }
        }
      }
    })

    // Actualizar stock de productos y registrar movimientos
    for (const item of body.items) {
      if (item.tipo !== 'Servicio') {
        await prisma.producto.update({
          where: { id: item.productoId },
          data: {
            stockActual: {
              decrement: item.cantidad
            }
          }
        })

        // Registrar movimiento de inventario
        await prisma.movimientoInventario.create({
          data: {
            productoId: item.productoId,
            tipo: 'Salida',
            cantidad: item.cantidad,
            motivo: `Venta ${newFolio}`,
            usuarioId: usuario.id,
          }
        })
      }
    }

    return NextResponse.json(venta, { status: 201 })
  } catch (error) {
    console.error('Error al crear venta:', error)
    return NextResponse.json(
      { error: 'Error al crear venta', details: error },
      { status: 500 }
    )
  }
}

// GET - Obtener todas las ventas
export async function GET() {
  try {
    const ventas = await prisma.venta.findMany({
      include: {
        cliente: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        },
        ordenServicio: {
          select: {
            id: true,
            folio: true,
            equipo: {
              select: {
                marca: true,
                modelo: true
              }
            }
          }
        },
        items: {
          include: {
            producto: true
          }
        },
        pagos: {
          include: {
            usuario: {
              select: {
                nombre: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Add virtual nombre field to each venta's cliente
    const ventasConNombre = ventas.map(venta => ({
      ...venta,
      cliente: {
        ...venta.cliente,
        nombre: `${venta.cliente.nombre1}${venta.cliente.nombre2 ? ' ' + venta.cliente.nombre2 : ''} ${venta.cliente.apellidoPaterno}${venta.cliente.apellidoMaterno ? ' ' + venta.cliente.apellidoMaterno : ''}`
      }
    }))

    return NextResponse.json(ventasConNombre)
  } catch (error) {
    console.error('Error al obtener ventas:', error)
    return NextResponse.json(
      { error: 'Error al obtener ventas' },
      { status: 500 }
    )
  }
}
