import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Users from auth-context.tsx
const JLAB_USERS = [
    {
        id: "user-admin-001",
        email: "admin@jlaboratories.com",
        password: "JoseAdmin",
        name: "Jose Manuel Cortes Ceron",
        role: "Administrador",
    },
    {
        id: "user-tech-001",
        email: "jose.tecnico@jlaboratories.com",
        password: "JoseTech",
        name: "Jose Manuel Cortes Ceron",
        role: "Técnico",
    },
    {
        id: "user-tech-002",
        email: "kevis.salas@jlaboratories.com",
        password: "KevinTech",
        name: "Kevis Salas Jimenez",
        role: "Técnico",
    },
    {
        id: "user-recep-001",
        email: "adriana.ceron@jlaboratories.com",
        password: "Adri123",
        name: "Adriana Ceron Madrigal",
        role: "Recepción",
    },
]

async function main() {
    console.log('Seeding users from auth-context...')

    for (const user of JLAB_USERS) {
        // Upsert user to ensure they exist with the correct ID
        await prisma.usuario.upsert({
            where: { email: user.email },
            update: {
                id: user.id, // Try to update ID if email matches (might fail if ID is PK and referenced, but worth a try or it will just update other fields)
                nombre: user.name,
                password: user.password, // In a real app this should be hashed
                rol: user.role,
                activo: true
            },
            create: {
                id: user.id,
                email: user.email,
                nombre: user.name,
                password: user.password,
                rol: user.role,
                activo: true
            }
        })
        console.log(`Upserted user: ${user.name} (${user.id})`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
