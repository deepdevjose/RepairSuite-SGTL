import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener todos los usuarios o buscar por email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (email) {
      // Buscar por email específico
      const usuario = await prisma.usuario.findUnique({
        where: { email },
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
          activo: true,
          empleadoId: true,
          createdAt: true,
          updatedAt: true,
        } as any
      })

      return NextResponse.json(usuario ? [usuario] : [])
    }

    // Obtener todos los usuarios
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        empleadoId: true,
        createdAt: true,
        updatedAt: true,
        // No incluir password por seguridad
      } as any,
      orderBy: { nombre: 'asc' }
    })

    return NextResponse.json(usuarios)
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo usuario
export async function POST(request: Request) {
  try {
    const bcrypt = require('bcryptjs')
    const body = await request.json()

    // Verificar si el email ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: body.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password || 'password123', 10)

    const usuario = await prisma.usuario.create({
      data: {
        nombre: body.nombre,
        email: body.email,
        password: hashedPassword,
        rol: body.rol,
        activo: true,
        empleadoId: body.empleadoId,
      } as any,
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        empleadoId: true,
        createdAt: true,
      } as any
    })

    return NextResponse.json(usuario, { status: 201 })
  } catch (error) {
    console.error('Error al crear usuario:', error)
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar usuario
export async function PUT(request: Request) {
  try {
    const body = await request.json()

    const updateData: any = {
      nombre: body.nombre,
      email: body.email,
      rol: body.rol,
      activo: body.activo,
      empleadoId: body.empleadoId,
    }

    // Solo actualizar password si se proporciona uno nuevo
    if (body.password) {
      const bcrypt = require('bcryptjs')
      updateData.password = await bcrypt.hash(body.password, 10)
    }

    const usuario = await prisma.usuario.update({
      where: { id: body.id },
      data: updateData as any,
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        empleadoId: true,
        createdAt: true,
        updatedAt: true,
      } as any
    })

    return NextResponse.json(usuario)
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    )
  }
}
