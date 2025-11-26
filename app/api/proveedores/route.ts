import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener todos los proveedores
export async function GET() {
  try {
    const proveedores = await prisma.proveedor.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' }
    })

    return NextResponse.json(proveedores)
  } catch (error) {
    console.error('Error al obtener proveedores:', error)
    return NextResponse.json(
      { error: 'Error al obtener proveedores' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo proveedor
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const proveedor = await prisma.proveedor.create({
      data: {
        nombre: body.nombre,
        contacto: body.contacto || null,
        telefono: body.telefono,
        email: body.email || null,
        direccion: body.direccion || null,
        notas: body.notas || null,
        activo: true,
      }
    })

    return NextResponse.json(proveedor, { status: 201 })
  } catch (error) {
    console.error('Error al crear proveedor:', error)
    return NextResponse.json(
      { error: 'Error al crear proveedor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar proveedor
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    const proveedor = await prisma.proveedor.update({
      where: { id: body.id },
      data: {
        nombre: body.nombre,
        contacto: body.contacto,
        telefono: body.telefono,
        email: body.email,
        direccion: body.direccion,
        notas: body.notas,
        activo: body.activo,
      }
    })

    return NextResponse.json(proveedor)
  } catch (error) {
    console.error('Error al actualizar proveedor:', error)
    return NextResponse.json(
      { error: 'Error al actualizar proveedor' },
      { status: 500 }
    )
  }
}
