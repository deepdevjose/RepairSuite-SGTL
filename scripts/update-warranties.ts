import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Updating warranties...')

    // Update RAM warranties
    const ramUpdate = await prisma.producto.updateMany({
        where: {
            categoria: 'RAM'
        },
        data: {
            garantiaMeses: 3
        }
    })
    console.log(`Updated ${ramUpdate.count} RAM products with 3 months warranty.`)

    // Update SSD warranties
    const ssdUpdate = await prisma.producto.updateMany({
        where: {
            categoria: 'SSD'
        },
        data: {
            garantiaMeses: 3
        }
    })
    console.log(`Updated ${ssdUpdate.count} SSD products with 3 months warranty.`)

    // Update Software warranties
    const softwareUpdate = await prisma.producto.updateMany({
        where: {
            categoria: 'Software'
        },
        data: {
            garantiaMeses: 6
        }
    })
    console.log(`Updated ${softwareUpdate.count} Software products with 6 months warranty.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
