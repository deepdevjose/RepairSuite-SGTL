const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const services = await prisma.producto.findMany({
        where: {
            tipo: 'Servicio'
        },
        select: {
            id: true,
            sku: true,
            nombre: true,
            categoria: true
        }
    })
    console.log(JSON.stringify(services, null, 2))
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
