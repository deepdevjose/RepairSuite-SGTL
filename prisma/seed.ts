import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de base de datos...')

  // Limpiar datos existentes (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Limpiando datos existentes...')
    await prisma.itemVenta.deleteMany()
    await prisma.venta.deleteMany()
    await prisma.materialOrden.deleteMany()
    await prisma.garantia.deleteMany()
    await prisma.ordenServicio.deleteMany()
    await prisma.movimientoInventario.deleteMany()
    await prisma.producto.deleteMany()
    await prisma.proveedor.deleteMany()
    await prisma.equipo.deleteMany()
    await prisma.cliente.deleteMany()
    await prisma.usuario.deleteMany()
    await prisma.configuracion.deleteMany()
  }

  // =====================================================
  // USUARIOS
  // =====================================================
  console.log('👤 Creando usuarios...')
  
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const usuarios = await Promise.all([
    prisma.usuario.create({
      data: {
        nombre: 'Jose Luis',
        email: 'jose@jlaboratories.com',
        password: hashedPassword,
        rol: 'Administrador',
        activo: true,
      },
    }),
    prisma.usuario.create({
      data: {
        nombre: 'Kevis',
        email: 'kevis@jlaboratories.com',
        password: hashedPassword,
        rol: 'Tecnico',
        activo: true,
      },
    }),
    prisma.usuario.create({
      data: {
        nombre: 'Adriana Ceron',
        email: 'adriana@jlaboratories.com',
        password: hashedPassword,
        rol: 'Recepcion',
        activo: true,
      },
    }),
  ])

  console.log(`✅ ${usuarios.length} usuarios creados`)

  // =====================================================
  // CLIENTES
  // =====================================================
  console.log('🧑 Creando clientes...')
  
  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        nombre: 'Juan Pérez',
        telefono: '5512345678',
        email: 'juan@example.com',
        direccion: 'Calle Principal 123, CDMX',
      },
    }),
    prisma.cliente.create({
      data: {
        nombre: 'María González',
        telefono: '5523456789',
        email: 'maria@example.com',
      },
    }),
    prisma.cliente.create({
      data: {
        nombre: 'Pedro Ramírez',
        telefono: '5534567890',
      },
    }),
  ])

  console.log(`✅ ${clientes.length} clientes creados`)

  // =====================================================
  // EQUIPOS
  // =====================================================
  console.log('💻 Creando equipos...')
  
  const equipos = await Promise.all([
    prisma.equipo.create({
      data: {
        clienteId: clientes[0].id,
        tipo: 'Laptop',
        marca: 'HP',
        modelo: 'Pavilion 15',
        numeroSerie: 'HP123456789',
      },
    }),
    prisma.equipo.create({
      data: {
        clienteId: clientes[0].id,
        tipo: 'Laptop',
        marca: 'Dell',
        modelo: 'XPS 13',
        numeroSerie: 'DELL987654321',
      },
    }),
    prisma.equipo.create({
      data: {
        clienteId: clientes[1].id,
        tipo: 'Laptop',
        marca: 'Apple',
        modelo: 'MacBook Pro 13"',
        numeroSerie: 'MBP2023001',
      },
    }),
  ])

  console.log(`✅ ${equipos.length} equipos creados`)

  // =====================================================
  // PROVEEDORES
  // =====================================================
  console.log('📦 Creando proveedores...')
  
  const proveedores = await Promise.all([
    prisma.proveedor.create({
      data: {
        nombre: 'Tech Parts MX',
        contacto: 'Carlos Distribuciones',
        telefono: '5555555555',
        email: 'ventas@techparts.mx',
      },
    }),
    prisma.proveedor.create({
      data: {
        nombre: 'Computadoras y Más',
        telefono: '5566666666',
      },
    }),
  ])

  console.log(`✅ ${proveedores.length} proveedores creados`)

  // =====================================================
  // PRODUCTOS
  // =====================================================
  console.log('🛒 Creando productos...')
  
  const productos = await Promise.all([
    prisma.producto.create({
      data: {
        sku: 'MEM-DDR4-8GB',
        nombre: 'Memoria RAM DDR4 8GB',
        descripcion: 'Memoria RAM DDR4 2666MHz',
        categoria: 'Memorias',
        tipo: 'Producto',
        precioCompra: 350,
        precioVenta: 550,
        stockActual: 15,
        stockMinimo: 5,
        proveedorId: proveedores[0].id,
      },
    }),
    prisma.producto.create({
      data: {
        sku: 'SSD-256GB',
        nombre: 'SSD 256GB SATA',
        categoria: 'Discos',
        tipo: 'Producto',
        precioCompra: 450,
        precioVenta: 700,
        stockActual: 10,
        stockMinimo: 3,
        proveedorId: proveedores[0].id,
      },
    }),
    prisma.producto.create({
      data: {
        sku: 'PANT-15.6-HD',
        nombre: 'Pantalla 15.6" HD',
        categoria: 'Pantallas',
        tipo: 'Producto',
        precioCompra: 1200,
        precioVenta: 1800,
        stockActual: 5,
        stockMinimo: 2,
        proveedorId: proveedores[1].id,
      },
    }),
    prisma.producto.create({
      data: {
        sku: 'SERV-DIAGNOSTICO',
        nombre: 'Diagnóstico Técnico',
        categoria: 'Servicios',
        tipo: 'Servicio',
        precioCompra: 0,
        precioVenta: 150,
        stockActual: 0,
        stockMinimo: 0,
      },
    }),
  ])

  console.log(`✅ ${productos.length} productos creados`)

  // =====================================================
  // CONFIGURACIÓN
  // =====================================================
  console.log('⚙️ Creando configuración inicial...')
  
  await prisma.configuracion.createMany({
    data: [
      { clave: 'empresa_nombre', valor: 'JLaboratories', tipo: 'string' },
      { clave: 'empresa_telefono', valor: '5555555555', tipo: 'string' },
      { clave: 'empresa_email', valor: 'contacto@jlaboratories.com', tipo: 'string' },
      { clave: 'garantia_dias_default', valor: '90', tipo: 'number' },
      { clave: 'iva_porcentaje', valor: '16', tipo: 'number' },
    ],
  })

  console.log('✅ Configuración inicial creada')

  console.log('\n🎉 Seed completado exitosamente!')
  console.log('\n📝 Credenciales de prueba:')
  console.log('   Admin: jose@jlaboratories.com / password123')
  console.log('   Técnico: kevis@jlaboratories.com / password123')
  console.log('   Recepción: adriana@jlaboratories.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
