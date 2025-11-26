import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener todos los clientes
export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' }
    })

    return NextResponse.json(clientes)
  } catch (error) {
    console.error('Error al obtener clientes:', error)
    return NextResponse.json(
      { error: 'Error al obtener clientes' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo cliente
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const cliente = await prisma.cliente.create({
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

    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    console.error('Error al crear cliente:', error)
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    )
  }
}
