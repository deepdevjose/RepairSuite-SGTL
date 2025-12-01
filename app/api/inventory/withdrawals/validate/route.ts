import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Validar ticket de retiro (Admin)
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { codigo, adminId } = body

        if (!codigo || !adminId) {
            return NextResponse.json(
                { error: 'Código y ID de administrador requeridos' },
                { status: 400 }
            )
        }

        // Buscar ticket con items
        const ticket = await prisma.ticketRetiro.findUnique({
            where: { codigo },
            include: {
                items: {
                    include: {
                        producto: true
                    }
                }
            }
        })

        if (!ticket) {
            return NextResponse.json(
                { error: 'Ticket no encontrado' },
                { status: 404 }
            )
        }

        if (ticket.estado !== 'Pendiente') {
            return NextResponse.json(
                { error: `El ticket ya está ${ticket.estado.toLowerCase()}` },
                { status: 400 }
            )
        }

        if (new Date() > ticket.fechaExpiracion) {
            return NextResponse.json(
                { error: 'El ticket ha expirado' },
                { status: 400 }
            )
        }

        // Transacción: Completar ticket, descontar stock real, liberar reserva, registrar movimientos
        const result = await prisma.$transaction(async (tx) => {
            // 1. Actualizar estado del ticket
            const updatedTicket = await tx.ticketRetiro.update({
                where: { id: ticket.id },
                data: {
                    estado: 'Completado'
                }
            })

            // 2. Procesar cada item
            for (const item of ticket.items) {
                // Actualizar producto (Descontar stock real y liberar reserva)
                await tx.producto.update({
                    where: { id: item.productoId },
                    data: {
                        stockActual: {
                            decrement: item.cantidad
                        },
                        stockReservado: {
                            decrement: item.cantidad
                        }
                    }
                })

                // Registrar movimiento de inventario
                await tx.movimientoInventario.create({
                    data: {
                        productoId: item.productoId,
                        tipo: 'Salida',
                        cantidad: item.cantidad,
                        motivo: `Retiro por ticket #${ticket.codigo}`,
                        usuarioId: ticket.usuarioId, // El técnico que retiró
                    }
                })
            }

            return updatedTicket
        })

        return NextResponse.json({
            success: true,
            message: 'Retiro validado exitosamente',
            ticket: result
        })

    } catch (error) {
        console.error('Error al validar ticket:', error)
        return NextResponse.json(
            { error: 'Error al validar ticket' },
            { status: 500 }
        )
    }
}
