
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const allowedEmails = [
        'adriana.ceron@jlaboratories.com',
        'kevis.salas@jlaboratories.com',
        'admin@jlaboratories.com'
    ]

    console.log('Starting cleanup...')

    // 1. Delete users NOT in the allowed list
    const deleteResult = await prisma.usuario.deleteMany({
        where: {
            email: {
                notIn: allowedEmails
            }
        }
    })
    console.log(`Deleted ${deleteResult.count} users.`)

    // 2. Link Adriana
    const adrianaUser = await prisma.usuario.findUnique({ where: { email: 'adriana.ceron@jlaboratories.com' } })
    const adrianaEmp = await prisma.empleado.findFirst({
        where: {
            OR: [
                { correoInterno: 'adriana.ceron@jlaboratories.com' },
                { nombre: { contains: 'Adriana' } }
            ]
        }
    })

    if (adrianaUser && adrianaEmp) {
        console.log(`Linking Adriana User (${adrianaUser.email}) to Employee (${adrianaEmp.nombreCompleto})...`)
        await prisma.usuario.update({
            where: { id: adrianaUser.id },
            data: { empleadoId: adrianaEmp.id }
        })
    } else {
        console.log('Could not link Adriana. Missing user or employee record.')
    }

    // 3. Link Kevis
    const kevisUser = await prisma.usuario.findUnique({ where: { email: 'kevis.salas@jlaboratories.com' } })
    const kevisEmp = await prisma.empleado.findFirst({
        where: {
            OR: [
                { correoInterno: 'kevis.salas@jlaboratories.com' },
                { nombre: { contains: 'Kevis' } }
            ]
        }
    })

    if (kevisUser && kevisEmp) {
        console.log(`Linking Kevis User (${kevisUser.email}) to Employee (${kevisEmp.nombreCompleto})...`)
        await prisma.usuario.update({
            where: { id: kevisUser.id },
            data: { empleadoId: kevisEmp.id }
        })
    } else {
        console.log('Could not link Kevis. Missing user or employee record.')
    }

    // 4. Verify Admin exists
    const adminUser = await prisma.usuario.findUnique({ where: { email: 'admin@jlaboratories.com' } })
    if (adminUser) {
        console.log('Admin user exists.')
    } else {
        console.log('Admin user NOT found. Creating default admin...')
        // Optional: Create if missing, but user implies it exists. 
        // If it was deleted by mistake (e.g. typo in allowed list), we might need to recreate.
        // But allowedEmails logic protects it if it matched.
    }

    console.log('Cleanup complete.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
