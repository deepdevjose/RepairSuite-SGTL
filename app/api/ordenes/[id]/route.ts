import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PATCH - Actualizar una orden de servicio
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { id } = await params

    console.log('[PATCH /api/ordenes/[id]] Actualizando orden:', id, body)

    // Actualizar la orden con los campos proporcionados
    const orden = await prisma.ordenServicio.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date()
      },
      include: {
        cliente: true,
        equipo: true,
        tecnico: true,
        pagos: {
          orderBy: {
            fechaPago: 'desc'
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

    return NextResponse.json(ordenConNombre)
  } catch (error) {
    console.error('[PATCH /api/ordenes/[id]] Error al actualizar orden:', error)
    return NextResponse.json(
      { error: 'Error al actualizar orden', details: error },
      { status: 500 }
    )
  }
}

// GET - Obtener una orden específica
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const orden = await prisma.ordenServicio.findUnique({
      where: { id },
      include: {
        cliente: true,
        equipo: true,
        tecnico: true,
        pagos: {
          orderBy: {
            fechaPago: 'desc'
          }
        }
      }
    })

    if (!orden) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    // Agregar campo 'nombre' concatenado al cliente
    const ordenConNombre = {
      ...orden,
      cliente: orden.cliente ? {
        ...orden.cliente,
        nombre: `${orden.cliente.nombre1}${orden.cliente.nombre2 ? ' ' + orden.cliente.nombre2 : ''} ${orden.cliente.apellidoPaterno}${orden.cliente.apellidoMaterno ? ' ' + orden.cliente.apellidoMaterno : ''}`
      } : null
    }

    return NextResponse.json(ordenConNombre)
  } catch (error) {
    console.error('[GET /api/ordenes/[id]] Error:', error)
    return NextResponse.json(
      { error: 'Error al obtener orden' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar una orden (requiere contraseña de admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { id } = await params
    const { password } = body

    // Verificar contraseña de administrador
    // TODO: En producción, esto debería validar contra la sesión del usuario o un hash en DB
    if (password !== "JoseAdmin") {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }

    console.log('[DELETE /api/ordenes/[id]] Eliminando orden:', id)

    // Eliminar la orden
    // Prisma se encargará de las relaciones configuradas con onDelete: Cascade
    // Para otras, como pagos, se debe asegurar que no existan o eliminarlos manual si es necesario
    // En este schema:
    // - MaterialOrden: Cascade
    // - Pagos: NoAction (se deben eliminar primero o cambiar schema)

    // Primero eliminamos pagos asociados para evitar error de FK
    await prisma.pago.deleteMany({
      where: { ordenServicioId: id }
    })

    // Eliminar garantías asociadas
    await prisma.garantia.deleteMany({
      where: { ordenId: id }
    })

    // Finalmente eliminar la orden
    await prisma.ordenServicio.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Orden eliminada correctamente' })
  } catch (error) {
    console.error('[DELETE /api/ordenes/[id]] Error al eliminar orden:', error)
    return NextResponse.json(
      { error: 'Error al eliminar orden', details: error },
      { status: 500 }
    )
  }
}
