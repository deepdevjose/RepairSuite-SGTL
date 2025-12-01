const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Update "Instalación de S.O."
    await prisma.producto.updateMany({
        where: { sku: 'instalacion_so' },
        data: { nombre: 'Instalación de S.O. (Limpio)' }
    })

    // Update "Reinstalación de S.O."
    await prisma.producto.updateMany({
        where: { sku: 'reinstalacion_so' },
        data: { nombre: 'Reinstalación de S.O. (Con Respaldo)' }
    })

    console.log('Service names updated successfully.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
