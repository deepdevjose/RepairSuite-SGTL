import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener todos los empleados
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const activeOnly = searchParams.get('active') === 'true'

        const whereClause = activeOnly ? { estado: 'Activo' } : {}

        const empleados = await prisma.empleado.findMany({
            where: whereClause,
            include: {
                usuarios: {
                    select: {
                        id: true,
                        email: true,
                        rol: true,
                        activo: true
                    }
                }
            },
            orderBy: { nombre: 'asc' }
        })

        return NextResponse.json(empleados)
    } catch (error) {
        console.error('Error al obtener empleados:', error)
        return NextResponse.json(
            { error: 'Error al obtener empleados' },
            { status: 500 }
        )
    }
}

// POST - Crear nuevo empleado
export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validar campos requeridos
        if (!body.nombre || !body.apellidos || !body.rolOperativo) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos' },
                { status: 400 }
            )
        }

        // Verificar si el correo interno ya existe
        if (body.correoInterno) {
            const existingEmp = await prisma.empleado.findUnique({
                where: { correoInterno: body.correoInterno }
            })

            if (existingEmp) {
                return NextResponse.json(
                    { error: 'El correo interno ya está registrado' },
                    { status: 400 }
                )
            }
        }

        const empleado = await prisma.empleado.create({
            data: {
                nombre: body.nombre,
                apellidos: body.apellidos,
                nombreCompleto: `${body.nombre} ${body.apellidos}`,
                rolOperativo: body.rolOperativo,
                sucursalAsignada: body.sucursalAsignada || 'Sede A',
                telefono: body.telefono,
                correoInterno: body.correoInterno,
                estado: body.estado || 'Activo',
                horarioTrabajo: body.horarioTrabajo,
                especialidades: body.especialidades ? JSON.stringify(body.especialidades) : '[]',
                avatar: body.avatar
            }
        })

        return NextResponse.json(empleado, { status: 201 })
    } catch (error) {
        console.error('Error al crear empleado:', error)
        return NextResponse.json(
            { error: 'Error al crear empleado' },
            { status: 500 }
        )
    }
}

// PUT - Actualizar empleado
export async function PUT(request: Request) {
    try {
        const body = await request.json()

        if (!body.id) {
            return NextResponse.json(
                { error: 'ID de empleado requerido' },
                { status: 400 }
            )
        }

        const empleado = await prisma.empleado.update({
            where: { id: body.id },
            data: {
                nombre: body.nombre,
                apellidos: body.apellidos,
                nombreCompleto: `${body.nombre} ${body.apellidos}`,
                rolOperativo: body.rolOperativo,
                sucursalAsignada: body.sucursalAsignada,
                telefono: body.telefono,
                correoInterno: body.correoInterno,
                estado: body.estado,
                horarioTrabajo: body.horarioTrabajo,
                especialidades: body.especialidades ? JSON.stringify(body.especialidades) : undefined,
                avatar: body.avatar
            }
        })

        return NextResponse.json(empleado)
    } catch (error) {
        console.error('Error al actualizar empleado:', error)
        return NextResponse.json(
            { error: 'Error al actualizar empleado' },
            { status: 500 }
        )
    }
}
