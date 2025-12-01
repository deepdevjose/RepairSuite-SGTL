import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { addMonths, isAfter, isBefore } from "date-fns"

export async function GET() {
    try {
        // Fetch completed withdrawal tickets with items that have warranty
        const tickets = await prisma.ticketRetiro.findMany({
            where: {
                estado: 'Completado'
            },
            include: {
                usuario: {
                    select: {
                        nombre: true
                    }
                },
                items: {
                    include: {
                        producto: {
                            select: {
                                id: true,
                                nombre: true,
                                sku: true,
                                categoria: true,
                                garantiaMeses: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        }) as any

        // Process items to create warranty records
        const warranties = tickets.flatMap(ticket => {
            return ticket.items
                .filter(item => {
                    // Filter for hardware only (exclude Software and Service)
                    // And ensure product has warranty
                    return (
                        item.producto.garantiaMeses > 0 &&
                        item.producto.categoria !== 'Software' &&
                        item.producto.categoria !== 'Servicio'
                    )
                })
                .map(item => {
                    const fechaInicio = new Date(ticket.updatedAt) // Use ticket completion date as start
                    const fechaFin = addMonths(fechaInicio, item.producto.garantiaMeses)
                    const isExpired = isBefore(fechaFin, new Date())

                    return {
                        id: `${ticket.codigo}-${item.producto.sku}`, // Generate a unique ID
                        cliente: ticket.usuario.nombre, // The technician/user who withdrew it
                        equipo: "N/A", // Not directly linked to a client equipment in this view yet
                        sku: item.producto.sku,
                        descripcion: item.producto.nombre,
                        fecha_inicio: fechaInicio.toISOString(),
                        fecha_fin: fechaFin.toISOString(),
                        estado: isExpired ? "Vencida" : "Activo",
                        os_origen: ticket.codigo, // Using Ticket Code as reference
                        categoria: item.producto.categoria
                    }
                })
        })

        return NextResponse.json(warranties)
    } catch (error) {
        console.error("Error fetching warranties:", error)
        return NextResponse.json(
            { error: "Error al obtener garantías" },
            { status: 500 }
        )
    }
}
