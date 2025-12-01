import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener todos los clientes
export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      where: { activo: true },
      orderBy: { nombre1: 'asc' }
    })

    // Agregar campo 'nombre' concatenado para compatibilidad
    const clientesConNombre = clientes.map(cliente => ({
      ...cliente,
      nombre: `${cliente.nombre1}${cliente.nombre2 ? ' ' + cliente.nombre2 : ''} ${cliente.apellidoPaterno}${cliente.apellidoMaterno ? ' ' + cliente.apellidoMaterno : ''}`
    }))

    return NextResponse.json(clientesConNombre)
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
    
    console.log('Datos recibidos para crear cliente:', JSON.stringify(body, null, 2))
    
    // Preparar datos con validación
    const clienteData: any = {
      nombre1: body.nombre1?.trim(),
      apellidoPaterno: body.apellidoPaterno?.trim(),
      telefono: body.telefono?.trim(),
    }

    // Campos opcionales solo si tienen valor
    if (body.nombre2?.trim()) clienteData.nombre2 = body.nombre2.trim()
    if (body.apellidoMaterno?.trim()) clienteData.apellidoMaterno = body.apellidoMaterno.trim()
    if (body.email?.trim()) clienteData.email = body.email.trim()
    if (body.calle?.trim()) clienteData.calle = body.calle.trim()
    if (body.numero?.trim()) clienteData.numero = body.numero.trim()
    if (body.colonia?.trim()) clienteData.colonia = body.colonia.trim()
    if (body.municipio?.trim()) clienteData.municipio = body.municipio.trim()
    if (body.estado?.trim()) clienteData.estado = body.estado.trim()
    if (body.pais?.trim()) clienteData.pais = body.pais.trim()
    if (body.sexo?.trim()) clienteData.sexo = body.sexo.trim()
    if (body.edad) clienteData.edad = parseInt(body.edad)
    if (body.rfc?.trim()) clienteData.rfc = body.rfc.trim()
    if (body.tipoCliente?.trim()) clienteData.tipoCliente = body.tipoCliente.trim()
    if (body.notas?.trim()) clienteData.notas = body.notas.trim()
    if (body.activo !== undefined) clienteData.activo = body.activo

    console.log('Datos procesados para Prisma:', JSON.stringify(clienteData, null, 2))
    
    const cliente = await prisma.cliente.create({
      data: clienteData
    })

    console.log('Cliente creado exitosamente:', cliente.id)
    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    console.error('Error detallado al crear cliente:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: 'Error al crear cliente', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
