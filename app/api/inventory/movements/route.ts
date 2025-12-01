import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { productoId, tipo, cantidad, motivo, usuarioId } = body

        if (!productoId || !tipo || !cantidad || !usuarioId) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios" },
                { status: 400 }
            )
        }

        // Validar tipo de movimiento
        if (!['Entrada', 'Salida'].includes(tipo)) {
            return NextResponse.json(
                { error: "Tipo de movimiento inválido" },
                { status: 400 }
            )
        }

        // Obtener producto actual
        const producto = await prisma.producto.findUnique({
            where: { id: productoId }
        })

        if (!producto) {
            return NextResponse.json(
                { error: "Producto no encontrado" },
                { status: 404 }
            )
        }

        // Validar stock suficiente para salida
        if (tipo === 'Salida' && producto.stockActual < cantidad) {
            return NextResponse.json(
                { error: "Stock insuficiente" },
                { status: 400 }
            )
        }

        // Iniciar transacción
        const result = await prisma.$transaction(async (tx) => {
            // 1. Crear registro de movimiento
            const movimiento = await tx.movimientoInventario.create({
                data: {
                    productoId,
                    tipo,
                    cantidad,
                    motivo: motivo || (tipo === 'Entrada' ? 'Ajuste de entrada' : 'Ajuste de salida'),
                    usuarioId
                }
            })

            // 2. Actualizar stock del producto
            const nuevoStock = tipo === 'Entrada'
                ? producto.stockActual + cantidad
                : producto.stockActual - cantidad

            const productoActualizado = await tx.producto.update({
                where: { id: productoId },
                data: { stockActual: nuevoStock }
            })

            return { movimiento, productoActualizado }
        })

        return NextResponse.json(result)

    } catch (error) {
        console.error("Error processing inventory movement:", error)
        return NextResponse.json(
            { error: "Error al procesar el movimiento" },
            { status: 500 }
        )
    }
}
