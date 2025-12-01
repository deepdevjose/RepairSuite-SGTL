/**
 * Script de limpieza de base de datos
 * 
 * IMPORTANTE: Este script elimina TODOS los datos excepto los usuarios
 * 
 * Conserva:
 * - Tabla usuarios (con correos y contraseñas)
 * 
 * Elimina datos de:
 * - Clientes
 * - Equipos
 * - Órdenes de servicio
 * - Productos e inventario
 * - Proveedores
 * - Ventas
 * - Pagos
 * - Garantías
 * - Notificaciones
 * - Configuración
 * - Dispositivos tecnológicos
 * - Historial de huella
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function limpiarBaseDeDatos() {
    console.log('🧹 Iniciando limpieza de base de datos...\n')

    try {
        // Desactivar restricciones de foreign key temporalmente
        console.log('⚙️  Desactivando restricciones de foreign key...')

        // Eliminar datos en orden para respetar las relaciones
        console.log('\n📋 Eliminando datos...\n')

        // 1. Historial de huella
        const historialHuella = await prisma.historialHuella.deleteMany({})
        console.log(`✅ Historial de huella: ${historialHuella.count} registros eliminados`)

        // 2. Dispositivos tecnológicos
        const dispositivos = await prisma.dispositivoTecnologico.deleteMany({})
        console.log(`✅ Dispositivos tecnológicos: ${dispositivos.count} registros eliminados`)

        // 3. Notificaciones
        const notificaciones = await prisma.notificacion.deleteMany({})
        console.log(`✅ Notificaciones: ${notificaciones.count} registros eliminados`)

        // 4. Configuración
        const configuracion = await prisma.configuracion.deleteMany({})
        console.log(`✅ Configuración: ${configuracion.count} registros eliminados`)

        // 5. Garantías
        const garantias = await prisma.garantia.deleteMany({})
        console.log(`✅ Garantías: ${garantias.count} registros eliminados`)

        // 6. Pagos de ventas
        const pagosVenta = await prisma.pagoVenta.deleteMany({})
        console.log(`✅ Pagos de ventas: ${pagosVenta.count} registros eliminados`)

        // 7. Items de venta
        const itemsVenta = await prisma.itemVenta.deleteMany({})
        console.log(`✅ Items de venta: ${itemsVenta.count} registros eliminados`)

        // 8. Ventas
        const ventas = await prisma.venta.deleteMany({})
        console.log(`✅ Ventas: ${ventas.count} registros eliminados`)

        // 9. Pagos de órdenes
        const pagos = await prisma.pago.deleteMany({})
        console.log(`✅ Pagos de órdenes: ${pagos.count} registros eliminados`)

        // 10. Materiales de orden
        const materialesOrden = await prisma.materialOrden.deleteMany({})
        console.log(`✅ Materiales de orden: ${materialesOrden.count} registros eliminados`)

        // 11. Movimientos de inventario
        const movimientos = await prisma.movimientoInventario.deleteMany({})
        console.log(`✅ Movimientos de inventario: ${movimientos.count} registros eliminados`)

        // 12. Órdenes de servicio
        const ordenes = await prisma.ordenServicio.deleteMany({})
        console.log(`✅ Órdenes de servicio: ${ordenes.count} registros eliminados`)

        // 13. Equipos
        const equipos = await prisma.equipo.deleteMany({})
        console.log(`✅ Equipos: ${equipos.count} registros eliminados`)

        // 14. Productos
        const productos = await prisma.producto.deleteMany({})
        console.log(`✅ Productos: ${productos.count} registros eliminados`)

        // 15. Proveedores
        const proveedores = await prisma.proveedor.deleteMany({})
        console.log(`✅ Proveedores: ${proveedores.count} registros eliminados`)

        // 16. Clientes (al final porque tienen relaciones con equipos y órdenes)
        const clientes = await prisma.cliente.deleteMany({})
        console.log(`✅ Clientes: ${clientes.count} registros eliminados`)

        // Verificar usuarios conservados
        const usuariosCount = await prisma.usuario.count()
        console.log(`\n👥 Usuarios conservados: ${usuariosCount}`)

        // Mostrar lista de usuarios conservados
        const usuarios = await prisma.usuario.findMany({
            select: {
                nombre: true,
                email: true,
                rol: true,
                activo: true
            }
        })

        console.log('\n📋 Usuarios en el sistema:')
        usuarios.forEach(u => {
            console.log(`   - ${u.nombre} (${u.email}) - ${u.rol} - ${u.activo ? 'Activo' : 'Inactivo'}`)
        })

        console.log('\n✨ ¡Limpieza completada exitosamente!')
        console.log('📊 Resumen:')
        console.log(`   - Usuarios conservados: ${usuariosCount}`)
        console.log(`   - Todos los demás datos han sido eliminados`)

    } catch (error) {
        console.error('\n❌ Error durante la limpieza:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

// Ejecutar con confirmación
console.log('⚠️  ADVERTENCIA: Este script eliminará TODOS los datos excepto los usuarios')
console.log('⚠️  Esta acción NO se puede deshacer\n')

// Ejecutar directamente (comentar la siguiente línea si quieres agregar confirmación manual)
limpiarBaseDeDatos()
    .then(() => {
        console.log('\n✅ Proceso finalizado')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n❌ Error fatal:', error)
        process.exit(1)
    })
