
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Searching for Adriana...')
    const users = await prisma.usuario.findMany({
        where: {
            nombre: {
                contains: 'Adriana'
            }
        }
    })

    console.log('Found users:', JSON.stringify(users, null, 2))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
