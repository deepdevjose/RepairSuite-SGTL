import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener equipos de un cliente
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('clienteId')

    if (clienteId) {
      const equipos = await prisma.equipo.findMany({
        where: { clienteId },
        include: { cliente: true },
        orderBy: { createdAt: 'desc' }
      })

      // Agregar campo 'nombre' concatenado al cliente
      const equiposConNombre = equipos.map(equipo => ({
        ...equipo,
        cliente: equipo.cliente ? {
          ...equipo.cliente,
          nombre: `${equipo.cliente.nombre1}${equipo.cliente.nombre2 ? ' ' + equipo.cliente.nombre2 : ''} ${equipo.cliente.apellidoPaterno}${equipo.cliente.apellidoMaterno ? ' ' + equipo.cliente.apellidoMaterno : ''}`
        } : null
      }))

      return NextResponse.json(equiposConNombre)
    }

    // Si no hay clienteId, devolver todos los equipos
    const equipos = await prisma.equipo.findMany({
      include: { cliente: true },
      orderBy: { createdAt: 'desc' }
    })

    // Agregar campo 'nombre' concatenado al cliente
    const equiposConNombre = equipos.map(equipo => ({
      ...equipo,
      cliente: equipo.cliente ? {
        ...equipo.cliente,
        nombre: `${equipo.cliente.nombre1}${equipo.cliente.nombre2 ? ' ' + equipo.cliente.nombre2 : ''} ${equipo.cliente.apellidoPaterno}${equipo.cliente.apellidoMaterno ? ' ' + equipo.cliente.apellidoMaterno : ''}`
      } : null
    }))

    return NextResponse.json(equiposConNombre)
  } catch (error) {
    console.error('Error al obtener equipos:', error)
    return NextResponse.json(
      { error: 'Error al obtener equipos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo equipo
export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log('Datos recibidos para crear equipo:', JSON.stringify(body, null, 2))

    const equipo = await prisma.equipo.create({
      data: {
        clienteId: body.clienteId,
        tipo: body.tipo || 'Laptop',
        marca: body.marca,
        modelo: body.modelo,
        numeroSerie: body.numeroSerie || null,
        color: body.color || null,
        fechaIngreso: body.fechaIngreso ? new Date(body.fechaIngreso) : new Date(),
        estadoFisico: body.estadoFisico || null,
        accesoriosRecibidos: body.accesoriosRecibidos ? JSON.stringify(body.accesoriosRecibidos) : null,
        enciende: body.enciende || null,
        tieneContrasena: body.tieneContrasena || false,
        contrasena: body.contrasena || null,
        notas: body.notas || null,
      },
      include: {
        cliente: true
      }
    })

    console.log('Equipo creado exitosamente:', equipo.id)
    return NextResponse.json(equipo, { status: 201 })
  } catch (error) {
    console.error('Error detallado al crear equipo:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: 'Error al crear equipo', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
