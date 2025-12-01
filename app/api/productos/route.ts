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

    // Mapeo de campos de precio según el tipo de producto
    const precioVentaFinal = precioVenta ?? body.precioBase ?? body.precioPaquete ?? 0
    const precioCompraFinal = precioCompra ?? body.costoProveedor ?? 0

    // Recopilar datos adicionales para especificaciones
    const especificacionesObj = especificaciones ? JSON.parse(especificaciones) : {}

    // Campos específicos de servicios
    if (body.tiempoEstimadoMinutos) especificacionesObj.tiempoEstimadoMinutos = body.tiempoEstimadoMinutos
    if (body.nivelComplejidad) especificacionesObj.nivelComplejidad = body.nivelComplejidad
    if (body.desglose) especificacionesObj.desglose = body.desglose

    // Campos específicos de refacciones
    if (body.garantiaClienteDias) especificacionesObj.garantiaClienteDias = body.garantiaClienteDias
    if (body.garantiaProveedorDias) especificacionesObj.garantiaProveedorDias = body.garantiaProveedorDias

    // Campos específicos de paquetes
    if (body.serviciosIncluidos) especificacionesObj.serviciosIncluidos = body.serviciosIncluidos
    if (body.ahorro) especificacionesObj.ahorro = body.ahorro

    // Garantía general (si viene como campo suelto)
    if (body.garantiaDias) especificacionesObj.garantiaDias = body.garantiaDias

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
        especificaciones: JSON.stringify(especificacionesObj),
        ubicacion,
        precioCompra: precioCompraFinal,
        precioVenta: precioVentaFinal,
        stockActual: stockActual || 0,
        stockReservado: stockReservado || 0,
        stockMinimo: stockMinimo || 5,
        proveedorId,
        garantiaMeses: body.garantiaMeses || 0,
        activo: activo !== undefined ? activo : true
      } as any,
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
