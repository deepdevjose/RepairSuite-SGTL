
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔍 Verifying DB content...')
    try {
        const userCount = await prisma.usuario.count()
        console.log(`✅ Users found: ${userCount}`)

        const users = await prisma.usuario.findMany({ select: { email: true, rol: true } })
        console.log('Users:', users)

        const productCount = await prisma.producto.count()
        console.log(`✅ Products found: ${productCount}`)

        const services = await prisma.producto.findMany({
            where: { tipo: 'Servicio' },
            select: { nombre: true, sku: true }
        })
        console.log('Services:', services)

    } catch (e) {
        console.error('Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
