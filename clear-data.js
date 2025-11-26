const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function clearData() {
  try {
    console.log('🧹 Limpiando datos mock de la base de datos...')
    
    await prisma.itemVenta.deleteMany()
    console.log('✅ ItemVenta eliminados')
    
    await prisma.venta.deleteMany()
    console.log('✅ Ventas eliminadas')
    
    await prisma.pago.deleteMany()
    console.log('✅ Pagos eliminados')
    
    await prisma.materialOrden.deleteMany()
    console.log('✅ MaterialOrden eliminados')
    
    await prisma.garantia.deleteMany()
    console.log('✅ Garantías eliminadas')
    
    await prisma.ordenServicio.deleteMany()
    console.log('✅ Órdenes de servicio eliminadas')
    
    await prisma.movimientoInventario.deleteMany()
    console.log('✅ Movimientos de inventario eliminados')
    
    await prisma.producto.deleteMany()
    console.log('✅ Productos eliminados')
    
    await prisma.proveedor.deleteMany()
    console.log('✅ Proveedores eliminados')
    
    await prisma.equipo.deleteMany()
    console.log('✅ Equipos eliminados')
    
    await prisma.cliente.deleteMany()
    console.log('✅ Clientes eliminados')
    
    console.log('\n✨ Base de datos limpia! Solo quedan usuarios y configuración.')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

clearData()
