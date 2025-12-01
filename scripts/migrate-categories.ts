import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🛠️ Migrando categorías...')

    // Update 'Servicios' to 'Servicio'
    const result = await prisma.producto.updateMany({
        where: {
            categoria: 'Servicios' // Old plural category
        },
        data: {
            categoria: 'Servicio' // New singular category
        }
    })

    console.log(`✅ Actualizados ${result.count} productos de 'Servicios' a 'Servicio'.`)

    // Also check for any other variations if needed
    // For now, just this one seems to be the issue based on the logs.
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
