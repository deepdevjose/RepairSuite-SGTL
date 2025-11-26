import { PrismaClient } from '@prisma/client'

// Configuración del pool de conexiones para SQL Server
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaReplica: PrismaClient | undefined
}

// Cliente principal (lectura/escritura)
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

// Cliente de réplica (solo lectura) - Opcional
export const prismaReplica = globalForPrisma.prismaReplica ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_REPLICA_URL || process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaReplica = prismaReplica
}

// Helper para queries de lectura pesadas (usa réplica si está disponible)
export const prismaRead = process.env.DATABASE_REPLICA_URL ? prismaReplica : prisma

// Tipos útiles
export type { 
  Usuario, Cliente, Equipo, OrdenServicio, Producto, Venta, Garantia,
  RolUsuario, EstadoOrden, Prioridad, CategoriaProducto, TipoProducto,
  MetodoPago, EstadoVenta
} from '@prisma/client'

export default prisma
