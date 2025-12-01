import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const usuarioId = searchParams.get("usuarioId")

        if (!usuarioId) {
            return NextResponse.json(
                { error: "Usuario ID requerido" },
                { status: 400 }
            )
        }

        const tickets = await prisma.ticketRetiro.findMany({
            where: {
                usuarioId: usuarioId
            },
            include: {
                items: {
                    include: {
                        producto: {
                            select: {
                                nombre: true,
                                sku: true
                            }
                        }
                    }
                },
                usuario: {
                    select: {
                        nombre: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(tickets)
    } catch (error) {
        console.error("Error fetching withdrawal history:", error)
        return NextResponse.json(
            { error: "Error al obtener el historial" },
            { status: 500 }
        )
    }
}
