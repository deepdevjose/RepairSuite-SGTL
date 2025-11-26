import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener todos los dispositivos con filtros opcionales
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const activo = searchParams.get('activo')
    const includeInactivos = searchParams.get('includeInactivos') === 'true'

    const whereClause: any = {}

    if (!includeInactivos) {
      whereClause.activo = true
    } else if (activo !== null) {
      whereClause.activo = activo === 'true'
    }

    if (tipo) {
      whereClause.tipo = tipo
    }

    const dispositivos = await prisma.dispositivoTecnologico.findMany({
      where: whereClause,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(dispositivos)
  } catch (error) {
    console.error('Error al obtener dispositivos:', error)
    return NextResponse.json(
      { error: 'Error al obtener dispositivos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo dispositivo
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      tipo,
      marca,
      modelo,
      serie,
      consumoWatts,
      horasUsoMensual = 720,
      huellaMaterialesKgCO2e,
      vidaUtilAnios = 5,
      factorEmisionKwhCO2e = 0.527,
      ubicacion,
      responsable,
      fechaAdquisicion,
      notas,
      usuarioId
    } = body

    // Validaciones básicas
    if (!tipo || !marca || !modelo || !consumoWatts || !huellaMaterialesKgCO2e || !usuarioId) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: tipo, marca, modelo, consumoWatts, huellaMaterialesKgCO2e, usuarioId' },
        { status: 400 }
      )
    }

    // Cálculos automáticos
    const consumoKwhMensual = (Number(consumoWatts) * Number(horasUsoMensual)) / 1000
    const huellaOperativaMensual = consumoKwhMensual * Number(factorEmisionKwhCO2e)
    const huellaMaterialesMensual = Number(huellaMaterialesKgCO2e) / (Number(vidaUtilAnios) * 12)
    const huellaTotalMensual = huellaOperativaMensual + huellaMaterialesMensual

    const dispositivo = await prisma.dispositivoTecnologico.create({
      data: {
        tipo,
        marca,
        modelo,
        serie,
        consumoWatts: Number(consumoWatts),
        horasUsoMensual: Number(horasUsoMensual),
        consumoKwhMensual,
        factorEmisionKwhCO2e: Number(factorEmisionKwhCO2e),
        huellaOperativaMensual,
        huellaMaterialesKgCO2e: Number(huellaMaterialesKgCO2e),
        vidaUtilAnios: Number(vidaUtilAnios),
        huellaMaterialesMensual,
        huellaTotalMensual,
        ubicacion,
        responsable,
        fechaAdquisicion: fechaAdquisicion ? new Date(fechaAdquisicion) : null,
        notas,
        usuarioId,
        activo: true
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(dispositivo, { status: 201 })
  } catch (error) {
    console.error('Error al crear dispositivo:', error)
    return NextResponse.json(
      { error: 'Error al crear dispositivo' },
      { status: 500 }
    )
  }
}
