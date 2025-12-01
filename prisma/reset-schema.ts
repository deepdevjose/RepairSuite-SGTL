
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetSchema() {
    console.log('🧹 Dropping all tables to reset schema...\n')

    const tables = [
        'historial_huella',
        'dispositivos_tecnologicos',
        'notificaciones',
        'configuracion',
        'garantias',
        'pagos_venta',
        'items_venta',
        'ventas',
        'pagos',
        'materiales_orden',
        'movimientos_inventario',
        'ordenes_servicio',
        'equipos',
        'productos',
        'proveedores',
        'clientes',
        'usuarios',
        '_prisma_migrations' // Also drop migration history if it exists
    ]

    try {
        // Disable constraints globally if possible, or just rely on order
        // For SQL Server, dropping in order is usually best.

        for (const table of tables) {
            try {
                console.log(`Dropping table ${table}...`)
                await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS [${table}]`)
            } catch (e) {
                // Ignore if it doesn't exist or other minor errors, but log them
                console.log(`Note: Could not drop ${table} (might not exist or has constraints). Error: ${e.message.split('\n')[0]}`)
            }
        }

        console.log('\n✨ Tables dropped. You can now run `npx prisma db push`')

    } catch (error) {
        console.error('\n❌ Error during reset:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

resetSchema()
