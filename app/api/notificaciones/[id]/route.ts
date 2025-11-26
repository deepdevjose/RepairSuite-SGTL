import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PATCH /api/notificaciones/[id] - Marcar notificación como leída
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { leida } = body

    const notificacion = await prisma.notificacion.update({
      where: { id },
      data: { leida }
    })

    return NextResponse.json(notificacion)
  } catch (error) {
    console.error("Error al actualizar notificación:", error)
    return NextResponse.json(
      { error: "Error al actualizar notificación" },
      { status: 500 }
    )
  }
}

// DELETE /api/notificaciones/[id] - Eliminar una notificación
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.notificacion.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Notificación eliminada" })
  } catch (error) {
    console.error("Error al eliminar notificación:", error)
    return NextResponse.json(
      { error: "Error al eliminar notificación" },
      { status: 500 }
    )
  }
}
