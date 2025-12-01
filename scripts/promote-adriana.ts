
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const userEmail = 'adriana.ceron@jlaboratories.com'

    // 1. Find the user
    const user = await prisma.usuario.findUnique({
        where: { email: userEmail }
    })

    if (!user) {
        console.error(`User with email ${userEmail} not found`)
        return
    }

    console.log('Found user:', user.nombre)

    // 2. Check if employee already exists
    const existingEmployee = await prisma.empleado.findUnique({
        where: { correoInterno: userEmail }
    })

    if (existingEmployee) {
        console.log('Employee already exists:', existingEmployee.nombreCompleto)

        // Ensure link
        if (user.empleadoId !== existingEmployee.id) {
            console.log('Linking user to existing employee...')
            await prisma.usuario.update({
                where: { id: user.id },
                data: { empleadoId: existingEmployee.id }
            })
        }
        return
    }

    // 3. Create Employee
    console.log('Creating new employee record...')
    const newEmployee = await prisma.empleado.create({
        data: {
            nombre: 'Adriana',
            apellidos: 'Ceron Madrigal',
            nombreCompleto: 'Adriana Ceron Madrigal',
            rolOperativo: 'Recepción',
            sucursalAsignada: 'Sede A',
            telefono: '', // Unknown
            correoInterno: userEmail,
            estado: 'Activo',
            horarioTrabajo: 'Lun-Vie 9:00-18:00',
            especialidades: JSON.stringify(['General']),
            avatar: null
        }
    })

    console.log('Created employee:', newEmployee.id)

    // 4. Link User to Employee
    console.log('Linking user to new employee...')
    await prisma.usuario.update({
        where: { id: user.id },
        data: { empleadoId: newEmployee.id }
    })

    console.log('Successfully promoted Adriana to Employee!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
