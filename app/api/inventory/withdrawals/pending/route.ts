import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const tickets = await prisma.ticketRetiro.findMany({
            where: {
                estado: 'Pendiente'
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
                                nombre: true,
                                sku: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }) as any

        return NextResponse.json(tickets)
    } catch (error) {
        console.error("Error fetching pending withdrawals:", error)
        return NextResponse.json(
            { error: "Error al obtener retiros pendientes" },
            { status: 500 }
        )
    }
}
