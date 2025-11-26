import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/notificaciones - Obtener notificaciones (con filtro opcional por usuario)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get("usuarioId")
    const soloNoLeidas = searchParams.get("soloNoLeidas") === "true"

    const where: any = {}

    // Filtrar por usuario específico O notificaciones globales (usuarioId null)
    if (usuarioId) {
      where.OR = [
        { usuarioId: usuarioId },
        { usuarioId: null } // Notificaciones globales
      ]
    }

    if (soloNoLeidas) {
      where.leida = false
    }

    const notificaciones = await prisma.notificacion.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      },
      take: 50 // Límite de 50 notificaciones más recientes
    })

    return NextResponse.json(notificaciones)
  } catch (error) {
    console.error("Error al obtener notificaciones:", error)
    return NextResponse.json(
      { error: "Error al obtener notificaciones" },
      { status: 500 }
    )
  }
}

// POST /api/notificaciones - Crear una nueva notificación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usuarioId, titulo, descripcion, tipo, ordenId } = body

    if (!titulo || !descripcion || !tipo) {
      return NextResponse.json(
        { error: "Título, descripción y tipo son requeridos" },
        { status: 400 }
      )
    }

    const notificacion = await prisma.notificacion.create({
      data: {
        usuarioId: usuarioId || null,
        titulo,
        descripcion,
        tipo,
        ordenId: ordenId || null
      }
    })

    return NextResponse.json(notificacion, { status: 201 })
  } catch (error) {
    console.error("Error al crear notificación:", error)
    return NextResponse.json(
      { error: "Error al crear notificación" },
      { status: 500 }
    )
  }
}
