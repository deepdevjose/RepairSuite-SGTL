import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const products = await prisma.producto.findMany({
        where: {
            NOT: {
                categoria: {
                    in: ['Servicio', 'Software']
                }
            },
            OR: [
                { nombre: { contains: 'Diagnostico' } },
                { nombre: { contains: 'Mantenimiento' } },
                { nombre: { contains: 'Instalacion' } },
                { nombre: { contains: 'Servicio' } },
                { nombre: { contains: 'Revisión' } },
                { nombre: { contains: 'Formateo' } },
                { descripcion: { contains: 'Diagnostico' } },
                { descripcion: { contains: 'Mantenimiento' } },
            ]
        },
        select: {
            id: true,
            sku: true,
            nombre: true,
            categoria: true,
            tipo: true
        }
    })

    console.log('--- Potential Services in Refacciones ---')
    if (products.length === 0) {
        console.log('No suspicious items found.')
    }
    products.forEach(p => {
        console.log(`[${p.categoria}] ${p.nombre} (${p.sku}) - ID: ${p.id}`)
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
