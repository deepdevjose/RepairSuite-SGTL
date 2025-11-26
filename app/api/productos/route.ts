import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener todos los productos con filtros opcionales
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')
    const stockBajo = searchParams.get('stockBajo') === 'true'
    const tipo = searchParams.get('tipo')
    const includeInactivos = searchParams.get('includeInactivos') === 'true'

    const whereClause: any = {}

    if (!includeInactivos) {
      whereClause.activo = true
    }

    if (categoria) {
      whereClause.categoria = categoria
    }

    if (tipo) {
      whereClause.tipo = tipo
    }

    if (stockBajo) {
      whereClause.stockActual = {
        lte: prisma.producto.fields.stockMinimo
      }
    }

    const productos = await prisma.producto.findMany({
      where: whereClause,
      include: {
        proveedor: {
          select: {
            id: true,
            nombre: true,
            telefono: true,
            email: true
          }
        }
      },
      orderBy: { nombre: 'asc' }
    })

    return NextResponse.json(productos)
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo producto
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      sku,
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

    // Validaciones básicas
    if (!sku || !nombre || !categoria || !tipo) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: sku, nombre, categoria, tipo' },
        { status: 400 }
      )
    }

    if (precioCompra !== undefined && precioVenta !== undefined && Number(precioVenta) < Number(precioCompra)) {
      return NextResponse.json(
        { error: 'El precio de venta no puede ser menor al precio de compra' },
        { status: 400 }
      )
    }

    // Verificar que el SKU no exista
    const existente = await prisma.producto.findUnique({
      where: { sku }
    })

    if (existente) {
      return NextResponse.json(
        { error: 'Ya existe un producto con ese SKU' },
        { status: 400 }
      )
    }

    const producto = await prisma.producto.create({
      data: {
        sku,
        nombre,
        descripcion,
        categoria,
        tipo,
        marca,
        modelo,
        compatibilidad,
        especificaciones,
        ubicacion,
        precioCompra: precioCompra || 0,
        precioVenta: precioVenta || 0,
        stockActual: stockActual || 0,
        stockReservado: stockReservado || 0,
        stockMinimo: stockMinimo || 5,
        proveedorId,
        activo: activo !== undefined ? activo : true
      },
      include: {
        proveedor: true
      }
    })

    return NextResponse.json(producto, { status: 201 })
  } catch (error) {
    console.error('Error al crear producto:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}
