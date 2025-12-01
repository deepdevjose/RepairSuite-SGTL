import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Iniciando migración de proveedor HWMex...')

    // 1. Verificar/Crear proveedor HWMex
    let hwmex = await prisma.proveedor.findFirst({
        where: { nombre: 'HWMex' }
    })

    if (!hwmex) {
        console.log('Creando proveedor HWMex...')
        hwmex = await prisma.proveedor.create({
            data: {
                nombre: 'HWMex',
                contacto: 'Soporte HWMex',
                telefono: '555-000-0000',
                email: 'contacto@hwmex.com',
                direccion: 'Ciudad de México',
                notas: 'Proveedor principal de hardware',
                activo: true
            }
        })
        console.log('Proveedor HWMex creado:', hwmex.id)
    } else {
        console.log('Proveedor HWMex ya existe:', hwmex.id)
    }

    // 2. Enlazar productos de tipo "Producto" (Hardware) a HWMex
    console.log('Buscando productos de hardware sin proveedor o para actualizar...')

    // Actualizamos todos los productos de tipo "Producto" para asegurar que estén enlazados
    // O podríamos filtrar solo los que no tienen proveedorId. 
    // El requerimiento dice "los productos (hardware) deben estar si o si enlazados a un proveedor... diremos que estamos usando a HWMex"
    // Así que actualizaremos todos los de tipo "Producto".

    const result = await prisma.producto.updateMany({
        where: {
            tipo: 'Producto'
        },
        data: {
            proveedorId: hwmex.id
        }
    })

    console.log(`Se actualizaron ${result.count} productos de hardware con el proveedor HWMex.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
