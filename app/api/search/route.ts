import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
        return NextResponse.json([])
    }

    try {
        const [ordenes, clientes, equipos] = await Promise.all([
            // Buscar Órdenes
            prisma.ordenServicio.findMany({
                where: {
                    OR: [
                        { folio: { contains: query } },
                        { cliente: { nombre1: { contains: query } } },
                        { cliente: { apellidoPaterno: { contains: query } } },
                    ]
                },
                take: 5,
                include: {
                    cliente: true,
                    equipo: true
                }
            }),
            // Buscar Clientes
            prisma.cliente.findMany({
                where: {
                    OR: [
                        { nombre1: { contains: query } },
                        { apellidoPaterno: { contains: query } },
                        { telefono: { contains: query } },
                        { email: { contains: query } }
                    ]
                },
                take: 5
            }),
            // Buscar Equipos
            prisma.equipo.findMany({
                where: {
                    OR: [
                        { marca: { contains: query } },
                        { modelo: { contains: query } },
                        { numeroSerie: { contains: query } }
                    ]
                },
                take: 5,
                include: {
                    cliente: true
                }
            })
        ])

        const results = [
            ...ordenes.map(o => ({
                type: "Orden",
                label: o.folio,
                subtitle: `${o.cliente.nombre1} ${o.cliente.apellidoPaterno} - ${o.equipo.marca} ${o.equipo.modelo}`,
                url: `/dashboard/ordenes?id=${o.id}`
            })),
            ...clientes.map(c => ({
                type: "Cliente",
                label: `${c.nombre1} ${c.apellidoPaterno}`,
                subtitle: `Tel: ${c.telefono}`,
                url: `/dashboard/clientes?id=${c.id}`
            })),
            ...equipos.map(e => ({
                type: "Equipo",
                label: `${e.marca} ${e.modelo}`,
                subtitle: `S/N: ${e.numeroSerie || 'N/A'} - ${e.cliente.nombre1}`,
                url: `/dashboard/equipos?id=${e.id}`
            }))
        ]

        return NextResponse.json(results)
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json({ error: 'Error searching' }, { status: 500 })
    }
}
