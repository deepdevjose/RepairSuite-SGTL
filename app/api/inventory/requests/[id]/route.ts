import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const body = await request.json()
        const { estado } = body

        if (!estado) {
            return NextResponse.json(
                { error: 'Estado es requerido' },
                { status: 400 }
            )
        }

        // 1. Update Request Status
        const solicitud = await prisma.solicitudInventario.update({
            where: { id },
            data: { estado },
            include: { usuario: true }
        })

        // 2. Create Notification for the User
        await prisma.notificacion.create({
            data: {
                usuarioId: solicitud.usuarioId,
                titulo: 'Solicitud de Material Actualizada',
                descripcion: `Tu solicitud de ${solicitud.tipo} (${solicitud.marca || ''} ${solicitud.modelo || ''}) ha sido marcada como: ${estado}.`,
                tipo: 'inventario',
                leida: false
            }
        })

        return NextResponse.json(solicitud)
    } catch (error) {
        console.error('Error al actualizar solicitud:', error)
        return NextResponse.json(
            { error: 'Error al actualizar solicitud' },
            { status: 500 }
        )
    }
}
