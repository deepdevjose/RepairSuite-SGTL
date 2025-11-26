import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener un producto por SKU con sus movimientos
export async function GET(
  request: Request,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params

    const producto = await prisma.producto.findUnique({
      where: { sku },
      include: {
        proveedor: true,
        movimientos: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      }
    })

    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(producto)
  } catch (error) {
    console.error('Error al obtener producto:', error)
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar producto
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params
    const body = await request.json()
    
    const {
      nombre,
      descripcion,
      categoria,
      tipo,
      marca,
      modelo,
      compatibilidad,
      especificaciones,
      ubicacion,
      precioCompra,
      precioVenta,
      stockActual,
      stockReservado,
      stockMinimo,
      proveedorId,
      activo
    } = body

    // Verificar que el producto existe
    const existente = await prisma.producto.findUnique({
      where: { sku }
    })

    if (!existente) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Validar precios si se proporcionan
    if (precioCompra !== undefined && precioVenta !== undefined && Number(precioVenta) < Number(precioCompra)) {
      return NextResponse.json(
        { error: 'El precio de venta no puede ser menor al precio de compra' },
        { status: 400 }
      )
    }

    const producto = await prisma.producto.update({
      where: { sku },
      data: {
        nombre,
        descripcion,
        categoria,
        tipo,
        marca,
        modelo,
        compatibilidad,
        especificaciones,
        ubicacion,
        precioCompra,
        precioVenta,
        stockActual,
        stockReservado,
        stockMinimo,
        proveedorId,
        activo
      },
      include: {
        proveedor: true
      }
    })

    return NextResponse.json(producto)
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    )
  }
}

// DELETE - Desactivar producto (soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params

    const producto = await prisma.producto.update({
      where: { sku },
      data: { activo: false }
    })

    return NextResponse.json({ 
      message: 'Producto desactivado exitosamente',
      producto 
    })
  } catch (error) {
    console.error('Error al desactivar producto:', error)
    return NextResponse.json(
      { error: 'Error al desactivar producto' },
      { status: 500 }
    )
  }
}
