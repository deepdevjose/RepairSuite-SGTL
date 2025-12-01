import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener cliente por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: params.id },
      include: {
        equipos: true
      }
    })

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    // Agregar campo 'nombre' concatenado para compatibilidad
    const clienteConNombre = {
      ...cliente,
      nombre: `${cliente.nombre1}${cliente.nombre2 ? ' ' + cliente.nombre2 : ''} ${cliente.apellidoPaterno}${cliente.apellidoMaterno ? ' ' + cliente.apellidoMaterno : ''}`
    }

    return NextResponse.json(clienteConNombre)
  } catch (error) {
    console.error('Error al obtener cliente:', error)
    return NextResponse.json(
      { error: 'Error al obtener cliente' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar cliente
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const cliente = await prisma.cliente.update({
      where: { id: params.id },
      data: {
        nombre1: body.nombre1,
        nombre2: body.nombre2 || null,
        apellidoPaterno: body.apellidoPaterno,
        apellidoMaterno: body.apellidoMaterno || null,
        telefono: body.telefono,
        email: body.email || null,
        calle: body.calle || null,
        numero: body.numero || null,
        colonia: body.colonia || null,
        municipio: body.municipio || null,
        estado: body.estado || null,
        pais: body.pais || 'México',
        sexo: body.sexo || null,
        edad: body.edad ? parseInt(body.edad) : null,
        rfc: body.rfc || null,
        tipoCliente: body.tipoCliente || null,
        notas: body.notas || null,
        activo: body.activo !== undefined ? body.activo : true,
      }
    })

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Error al actualizar cliente:', error)
    return NextResponse.json(
      { error: 'Error al actualizar cliente' },
      { status: 500 }
    )
  }
}

// DELETE - Desactivar cliente (soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cliente = await prisma.cliente.update({
      where: { id: params.id },
      data: { activo: false }
    })

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Error al desactivar cliente:', error)
    return NextResponse.json(
      { error: 'Error al desactivar cliente' },
      { status: 500 }
    )
  }
}
