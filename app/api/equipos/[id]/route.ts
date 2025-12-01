import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE - Eliminar equipo
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const equipo = await prisma.equipo.delete({
            where: { id: params.id }
        })

        return NextResponse.json(equipo)
    } catch (error) {
        console.error('Error al eliminar equipo:', error)
        return NextResponse.json(
            { error: 'Error al eliminar equipo' },
            { status: 500 }
        )
    }
}
