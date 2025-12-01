import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🛠️ Agregando servicios al inventario...')

    const services = [
        {
            sku: 'SERV-DIAG',
            nombre: 'Diagnóstico General',
            marca: 'Servicio',
            modelo: 'N/A',
            categoria: 'Servicio',
            descripcion: 'Diagnóstico completo de hardware y software',
            especificaciones: JSON.stringify({ tiempoEstimado: '24-48 hrs' }),
            precioVenta: 350, // Precio estimado
            precioCompra: 0,
            stockActual: 999, // Servicios no tienen stock físico limitado
            stockMinimo: 0,
        },
        {
            sku: 'SERV-MANT-GRAL',
            nombre: 'Mantenimiento General',
            marca: 'Servicio',
            modelo: 'N/A',
            categoria: 'Servicio',
            descripcion: 'Limpieza interna, cambio de pasta térmica y optimización',
            especificaciones: JSON.stringify({ tiempoEstimado: '2-4 hrs' }),
            precioVenta: 550, // Precio estimado
            precioCompra: 50, // Costo estimado de insumos
            stockActual: 999,
            stockMinimo: 0,
        },
        {
            sku: 'SERV-INST-SO',
            nombre: 'Instalación de Sistema Operativo',
            marca: 'Servicio',
            modelo: 'Windows/Linux',
            categoria: 'Servicio',
            descripcion: 'Instalación limpia de SO, drivers y paquetería básica',
            especificaciones: JSON.stringify({ tiempoEstimado: '2-3 hrs' }),
            precioVenta: 600, // Precio estimado
            precioCompra: 0,
            stockActual: 999,
            stockMinimo: 0,
        },
        {
            sku: 'SERV-REINST-SO',
            nombre: 'Reinstalación de Sistema Operativo',
            marca: 'Servicio',
            modelo: 'Windows/Linux',
            categoria: 'Servicio',
            descripcion: 'Formateo y reinstalación de SO con respaldo de información (hasta 50GB)',
            especificaciones: JSON.stringify({ tiempoEstimado: '3-5 hrs' }),
            precioVenta: 800, // Precio estimado
            precioCompra: 0,
            stockActual: 999,
            stockMinimo: 0,
        },
    ]

    for (const service of services) {
        await prisma.producto.upsert({
            where: { sku: service.sku },
            update: service,
            create: {
                ...service,
                tipo: 'Servicio',
                activo: true,
            },
        })
    }

    console.log(`✅ ${services.length} servicios agregados/actualizados correctamente.`)
}

main()
    .catch((e) => {
        console.error('❌ Error al agregar servicios:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
