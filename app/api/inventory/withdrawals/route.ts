import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Generar ticket de retiro (Carrito)
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { items, usuarioId } = body // items: { productoId, cantidad }[]

        if (!items || !Array.isArray(items) || items.length === 0 || !usuarioId) {
            return NextResponse.json(
                { error: 'Faltan campos obligatorios o el carrito está vacío' },
                { status: 400 }
            )
        }

        // Verificar stock de todos los items
        for (const item of items) {
            const producto = await prisma.producto.findUnique({
                where: { id: item.productoId }
            })

            if (!producto) {
                return NextResponse.json(
                    { error: `Producto no encontrado: ${item.productoId}` },
                    { status: 404 }
                )
            }

            const stockDisponible = producto.stockActual - producto.stockReservado
            if (stockDisponible < item.cantidad) {
                return NextResponse.json(
                    { error: `Stock insuficiente para ${producto.nombre}` },
                    { status: 400 }
                )
            }
        }

        // Generar código único de 6 caracteres
        const codigo = Math.random().toString(36).substring(2, 8).toUpperCase()

        // Fecha de expiración (24 horas)
        const fechaExpiracion = new Date()
        fechaExpiracion.setHours(fechaExpiracion.getHours() + 24)

        // Transacción: Crear ticket, items y reservar stock
        const result = await prisma.$transaction(async (tx) => {
            // 1. Crear ticket
            const ticket = await tx.ticketRetiro.create({
                data: {
                    codigo,
                    usuarioId,
                    fechaExpiracion,
                    estado: 'Pendiente'
                }
            })

            // 2. Crear items y reservar stock
            for (const item of items) {
                // Crear item de ticket
                await tx.ticketRetiroItem.create({
                    data: {
                        ticketId: ticket.id,
                        productoId: item.productoId,
                        cantidad: item.cantidad
                    }
                })

                // Reservar stock
                await tx.producto.update({
                    where: { id: item.productoId },
                    data: {
                        stockReservado: {
                            increment: item.cantidad
                        }
                    }
                })
            }

            // Retornar ticket con detalles
            return await tx.ticketRetiro.findUnique({
                where: { id: ticket.id },
                include: {
                    usuario: { select: { nombre: true } },
                    items: {
                        include: {
                            producto: { select: { nombre: true, sku: true } }
                        }
                    }
                }
            })
        })

        return NextResponse.json(result, { status: 201 })
    } catch (error) {
        console.error('Error al generar ticket de retiro:', error)
        return NextResponse.json(
            { error: 'Error al generar ticket de retiro' },
            { status: 500 }
        )
    }
}
