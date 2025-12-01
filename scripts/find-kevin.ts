
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Searching for Kevin in email...')
    const usersByEmail = await prisma.usuario.findMany({
        where: {
            email: {
                contains: 'kevin'
            }
        }
    })
    console.log('Users by email:', JSON.stringify(usersByEmail, null, 2))

    console.log('Listing first 20 users...')
    const allUsers = await prisma.usuario.findMany({
        take: 20
    })
    console.log('All users:', JSON.stringify(allUsers, null, 2))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
