import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener todas las solicitudes (para Admin) o mis solicitudes (para Técnico)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const estado = searchParams.get('estado')

        const whereClause: any = {}

        if (userId) {
            whereClause.usuarioId = userId
        }

        if (estado) {
            whereClause.estado = estado
        }

        const solicitudes = await prisma.solicitudInventario.findMany({
            where: whereClause,
            include: {
                usuario: {
                    select: {
                        nombre: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(solicitudes)
    } catch (error) {
        console.error('Error al obtener solicitudes:', error)
        return NextResponse.json(
            { error: 'Error al obtener solicitudes' },
            { status: 500 }
        )
    }
}

// POST - Crear nueva solicitud
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { tipo, marca, modelo, descripcion, usuarioId } = body

        if (!tipo || !descripcion || !usuarioId) {
            return NextResponse.json(
                { error: 'Faltan campos obligatorios' },
                { status: 400 }
            )
        }

        const solicitud = await prisma.solicitudInventario.create({
            data: {
                tipo,
                marca,
                modelo,
                descripcion,
                usuarioId,
                estado: 'Pendiente'
            }
        })

        return NextResponse.json(solicitud, { status: 201 })
    } catch (error) {
        console.error('Error al crear solicitud:', error)
        return NextResponse.json(
            { error: 'Error al crear solicitud' },
            { status: 500 }
        )
    }
}
