// Utilidades para crear notificaciones automáticas
import { prisma } from "@/lib/prisma"

interface CreateNotificationParams {
  usuarioId?: string | null // Si es null, la notificación es para todos
  titulo: string
  descripcion: string
  tipo: "orden" | "inventario" | "garantia" | "sistema" | "general"
  ordenId?: string
}

export async function crearNotificacion(params: CreateNotificationParams) {
  try {
    const notificacion = await prisma.notificacion.create({
      data: {
        usuarioId: params.usuarioId || null,
        titulo: params.titulo,
        descripcion: params.descripcion,
        tipo: params.tipo,
        ordenId: params.ordenId || null,
      },
    })
    return notificacion
  } catch (error) {
    console.error("Error al crear notificación:", error)
    return null
  }
}

// Ejemplos de uso para eventos comunes del sistema

export async function notificarOrdenListaEntrega(ordenId: string, folio: string, equipoDescripcion: string) {
  return await crearNotificacion({
    titulo: "Orden lista para entrega",
    descripcion: `${folio} - ${equipoDescripcion} completada y lista para entregar`,
    tipo: "orden",
    ordenId,
  })
}

export async function notificarInventarioBajo(productoNombre: string, stockActual: number) {
  return await crearNotificacion({
    titulo: "Inventario bajo",
    descripcion: `${productoNombre} tiene solo ${stockActual} unidades en stock`,
    tipo: "inventario",
  })
}

export async function notificarOrdenAprobada(ordenId: string, folio: string, tecnicoId?: string) {
  return await crearNotificacion({
    usuarioId: tecnicoId,
    titulo: "Orden aprobada por cliente",
    descripcion: `${folio} ha sido aprobada y puede iniciar reparación`,
    tipo: "orden",
    ordenId,
  })
}

export async function notificarGarantiasPorVencer(cantidad: number, dias: number) {
  return await crearNotificacion({
    titulo: "Garantías por vencer",
    descripcion: `${cantidad} garantía${cantidad > 1 ? 's' : ''} vencen en ${dias} días`,
    tipo: "garantia",
  })
}

export async function notificarOrdenNueva(ordenId: string, folio: string, tecnicoId?: string) {
  return await crearNotificacion({
    usuarioId: tecnicoId,
    titulo: "Nueva orden de servicio",
    descripcion: `${folio} ha sido asignada para diagnóstico`,
    tipo: "orden",
    ordenId,
  })
}

export async function notificarPagoRecibido(ordenId: string, folio: string, monto: number) {
  return await crearNotificacion({
    titulo: "Pago recibido",
    descripcion: `Se ha registrado un pago de $${monto.toFixed(2)} para ${folio}`,
    tipo: "orden",
    ordenId,
  })
}

// Notificación global para todos los usuarios
export async function notificarSistemaGlobal(titulo: string, descripcion: string) {
  return await crearNotificacion({
    usuarioId: null, // null = para todos los usuarios
    titulo,
    descripcion,
    tipo: "sistema",
  })
}
