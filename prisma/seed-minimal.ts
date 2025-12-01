
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
    console.log('🌱 Creating basic data...')

    // Hash for 'password123'
    const hashedPassword = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

    // 1. Create Admin User
    const admin = await prisma.usuario.create({
        data: {
            nombre: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            rol: 'Administrador',
            activo: true
        }
    })
    console.log('✅ Admin user created: admin@example.com / password123')

    // 2. Create Client
    const client = await prisma.cliente.create({
        data: {
            nombre1: 'Cliente',
            apellidoPaterno: 'Prueba',
            telefono: '5555555555',
            email: 'cliente@example.com',
            direccion: 'Conocido',
            pais: 'México'
        }
    })
    console.log('✅ Client created')

    // 3. Create Provider
    const provider = await prisma.proveedor.create({
        data: {
            nombre: 'Proveedor General',
            telefono: '5555555555',
            email: 'proveedor@example.com'
        }
    })
    console.log('✅ Provider created')
}

seed()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
