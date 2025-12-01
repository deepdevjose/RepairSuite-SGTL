import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - Obtener todas las órdenes
export async function GET() {
  try {
    const ordenes = await prisma.ordenServicio.findMany({
      include: {
        cliente: true,
        equipo: true,
        tecnico: true,
        pagos: {
          orderBy: {
            fechaPago: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Agregar campo 'nombre' concatenado al cliente
    const ordenesConNombre = ordenes.map(orden => ({
      ...orden,
      cliente: orden.cliente ? {
        ...orden.cliente,
        nombre: `${orden.cliente.nombre1}${orden.cliente.nombre2 ? ' ' + orden.cliente.nombre2 : ''} ${orden.cliente.apellidoPaterno}${orden.cliente.apellidoMaterno ? ' ' + orden.cliente.apellidoMaterno : ''}`
      } : null
    }))

    return NextResponse.json(ordenesConNombre)
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

    // Preparar items para crear
    const itemsToCreate = []
    if (body.items && Array.isArray(body.items)) {
      for (const item of body.items) {
        // Buscar producto por SKU (item.id del frontend es el SKU)
        const product = await prisma.producto.findUnique({
          where: { sku: item.id }
        })

        if (product) {
          itemsToCreate.push({
            productoId: product.id,
            cantidad: 1,
            precioUnitario: item.precio,
          })
        }
      }
    }

    // Crear la orden
    const orden = await prisma.ordenServicio.create({
      data: {
        folio: newFolio,
        clienteId: body.clienteId,
        equipoId: body.equipoId,
        tecnicoId: body.tecnicoId || null,
        problemaReportado: body.problemaReportado,
        estado: 'Esperando inicialización',
        prioridad: body.prioridad || 'Normal',
        tipoServicio: body.tipoServicio,
        anticipoRequerido: body.anticipoRequerido,
        montoTotal: body.montoTotal,
        saldoPendiente: body.montoTotal,
        materiales: {
          create: itemsToCreate
        }
      },
      include: {
        cliente: true,
        equipo: true,
        tecnico: true,
        materiales: {
          include: {
            producto: true
          }
        }
      }
    })

    // Agregar campo 'nombre' concatenado al cliente
    const ordenConNombre = {
      ...orden,
      cliente: orden.cliente ? {
        ...orden.cliente,
        nombre: `${orden.cliente.nombre1}${orden.cliente.nombre2 ? ' ' + orden.cliente.nombre2 : ''} ${orden.cliente.apellidoPaterno}${orden.cliente.apellidoMaterno ? ' ' + orden.cliente.apellidoMaterno : ''}`
      } : null
    }

    return NextResponse.json(ordenConNombre, { status: 201 })
  } catch (error) {
    console.error('Error al crear orden:', error)
    return NextResponse.json(
      { error: 'Error al crear orden' },
      { status: 500 }
    )
  }
}
