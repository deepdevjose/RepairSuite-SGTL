import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🛠️ Iniciando actualización de precios y limpieza...')

    // 1. Update Prices
    const priceUpdates = [
        // SSDs
        { sku: 'SSD-ADATA-SU630-240G', precioVenta: 689 },
        { sku: 'SSD-KING-A400-240G', precioVenta: 720 },
        { sku: 'SSD-ADATA-SU650-240G', precioVenta: 696 },
        { sku: 'SSD-KING-NV1-250G', precioVenta: 1020 },
        { sku: 'SSD-ADATA-LEG700-512G', precioVenta: 719 },
        { sku: 'SSD-KING-A400-480G', precioVenta: 923 },
        { sku: 'SSD-ADATA-SU800-512G', precioVenta: 1140 },
        { sku: 'SSD-KING-NV2-500G', precioVenta: 1080 },
        { sku: 'SSD-ADATA-LEG710-512G', precioVenta: 960 },
        { sku: 'SSD-ADATA-SATA-1T', precioVenta: 1680 },
        { sku: 'SSD-KING-SATA-1T', precioVenta: 1740 },
        { sku: 'SSD-ADATA-NVME-1T', precioVenta: 1920 },
        { sku: 'SSD-KING-NVME-1T', precioVenta: 2040 },

        // RAMs
        { sku: 'RAM-GEN-DDR4-4G', precioVenta: 299 },
        { sku: 'RAM-KING-DDR4-4G', precioVenta: 360 },
        { sku: 'RAM-KING-DDR4-8G', precioVenta: 720 },
        { sku: 'RAM-SAM-DDR4-8G', precioVenta: 958 },
        { sku: 'RAM-ADATA-DDR4-8G', precioVenta: 840 },
        { sku: 'RAM-KING-FURY-16G', precioVenta: 1799 },
        { sku: 'RAM-SAM-DDR4-16G', precioVenta: 1680 },
        { sku: 'RAM-ADATA-DDR4-16G', precioVenta: 1440 },
    ]

    console.log(`📊 Actualizando precios de ${priceUpdates.length} productos...`)

    for (const update of priceUpdates) {
        await prisma.producto.update({
            where: { sku: update.sku },
            data: { precioVenta: update.precioVenta },
        }).catch(e => {
            console.warn(`⚠️ No se pudo actualizar ${update.sku}: ${e.message}`)
        })
    }

    // 2. Cleanup Duplicates
    const duplicatesToDelete = [
        'diagnostico',
        'instalacion_so',
        'mantenimiento',
        'reinstalacion_so'
    ]

    console.log(`🗑️ Eliminando ${duplicatesToDelete.length} servicios duplicados...`)

    // First, find the IDs of the products to delete
    const productsToDelete = await prisma.producto.findMany({
        where: { sku: { in: duplicatesToDelete } },
        select: { id: true }
    })

    const productIds = productsToDelete.map(p => p.id)

    if (productIds.length > 0) {
        console.log(`   - Eliminando dependencias para ${productIds.length} productos...`)

        // 1. Delete related InventoryMovements
        await prisma.movimientoInventario.deleteMany({
            where: { productoId: { in: productIds } }
        })

        // 2. Delete related MaterialOrden
        await prisma.materialOrden.deleteMany({
            where: { productoId: { in: productIds } }
        })

        // 3. Delete related ItemVenta
        await prisma.itemVenta.deleteMany({
            where: { productoId: { in: productIds } }
        })

        // 4. Delete related TicketRetiro
        await prisma.ticketRetiro.deleteMany({
            where: { productoId: { in: productIds } }
        })

        // Now delete the products
        const deleteResult = await prisma.producto.deleteMany({
            where: {
                id: {
                    in: productIds
                }
            }
        })


        console.log(`✅ ${deleteResult.count} productos duplicados eliminados.`)
    } else {
        console.log('ℹ️ No se encontraron productos duplicados para eliminar.')
    }

    console.log(`✅ Precios actualizados.`)
}

main()
    .catch((e) => {
        console.error('❌ Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
