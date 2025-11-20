import type { Employee, User, EmployeeMetrics } from "@/lib/types/staff"
import { ADMIN_PERMISSIONS, RECEPCION_PERMISSIONS, TECNICO_PERMISSIONS, SOLO_LECTURA_PERMISSIONS } from "@/lib/utils/permission-templates"

// ============================================
// EMPLOYEES
// ============================================

export const mockEmployees: Employee[] = [
    {
        id: "emp-001",
        nombre: "Carlos",
        apellidos: "Gómez Martínez",
        nombreCompleto: "Carlos Gómez Martínez",
        rolOperativo: "Técnico",
        sucursalAsignada: "Sede A",
        telefono: "+52 55 1234 5678",
        correoInterno: "carlos.gomez@repairsuite.com",
        estado: "Activo",
        fechaAlta: "2023-01-15T00:00:00Z",
        horarioTrabajo: "Lun-Vie 9:00-18:00",
        especialidades: ["Hardware", "Software", "Gaming"],
        tieneUsuario: true,
        usuarioId: "user-001",
        avatar: "/avatars/carlos.jpg",
        ordenesAtendidas: 145,
        ordenesCompletadas: 138,
        tasaDevolucion: 2.1,
        calificacionPromedio: 4.8,
    },
    {
        id: "emp-002",
        nombre: "Ana",
        apellidos: "Martínez López",
        nombreCompleto: "Ana Martínez López",
        rolOperativo: "Recepción",
        sucursalAsignada: "Sede A",
        telefono: "+52 55 2345 6789",
        correoInterno: "ana.martinez@repairsuite.com",
        estado: "Activo",
        fechaAlta: "2023-02-01T00:00:00Z",
        horarioTrabajo: "Lun-Vie 8:00-17:00",
        especialidades: ["General"],
        tieneUsuario: true,
        usuarioId: "user-002",
        avatar: "/avatars/ana.jpg",
    },
    {
        id: "emp-003",
        nombre: "Luis",
        apellidos: "Torres Ramírez",
        nombreCompleto: "Luis Torres Ramírez",
        rolOperativo: "Técnico",
        sucursalAsignada: "Sede B",
        telefono: "+52 55 3456 7890",
        correoInterno: "luis.torres@repairsuite.com",
        estado: "Activo",
        fechaAlta: "2023-03-10T00:00:00Z",
        horarioTrabajo: "Lun-Vie 10:00-19:00",
        especialidades: ["Apple", "Hardware"],
        tieneUsuario: true,
        usuarioId: "user-003",
        avatar: "/avatars/luis.jpg",
        ordenesAtendidas: 98,
        ordenesCompletadas: 92,
        tasaDevolucion: 3.2,
        calificacionPromedio: 4.6,
    },
    {
        id: "emp-004",
        nombre: "María",
        apellidos: "González Pérez",
        nombreCompleto: "María González Pérez",
        rolOperativo: "Administrador",
        sucursalAsignada: "Sede A",
        telefono: "+52 55 4567 8901",
        correoInterno: "maria.gonzalez@repairsuite.com",
        estado: "Activo",
        fechaAlta: "2022-11-01T00:00:00Z",
        horarioTrabajo: "Lun-Vie 9:00-18:00",
        especialidades: ["General"],
        tieneUsuario: true,
        usuarioId: "user-004",
        avatar: "/avatars/maria.jpg",
    },
    {
        id: "emp-005",
        nombre: "Roberto",
        apellidos: "Silva Hernández",
        nombreCompleto: "Roberto Silva Hernández",
        rolOperativo: "Técnico",
        sucursalAsignada: "Sede C",
        telefono: "+52 55 5678 9012",
        correoInterno: "roberto.silva@repairsuite.com",
        estado: "Activo",
        fechaAlta: "2023-04-20T00:00:00Z",
        horarioTrabajo: "Lun-Sab 9:00-18:00",
        especialidades: ["Redes", "Servidores", "Hardware"],
        tieneUsuario: true,
        usuarioId: "user-005",
        avatar: "/avatars/roberto.jpg",
        ordenesAtendidas: 76,
        ordenesCompletadas: 71,
        tasaDevolucion: 4.5,
        calificacionPromedio: 4.5,
    },
    {
        id: "emp-006",
        nombre: "Laura",
        apellidos: "Díaz Morales",
        nombreCompleto: "Laura Díaz Morales",
        rolOperativo: "Recepción",
        sucursalAsignada: "Sede B",
        telefono: "+52 55 6789 0123",
        correoInterno: "laura.diaz@repairsuite.com",
        estado: "Activo",
        fechaAlta: "2023-05-15T00:00:00Z",
        horarioTrabajo: "Lun-Vie 8:00-17:00",
        especialidades: ["General"],
        tieneUsuario: true,
        usuarioId: "user-006",
        avatar: "/avatars/laura.jpg",
    },
    {
        id: "emp-007",
        nombre: "Pedro",
        apellidos: "Ramírez Castro",
        nombreCompleto: "Pedro Ramírez Castro",
        rolOperativo: "Técnico",
        sucursalAsignada: "Sede A",
        telefono: "+52 55 7890 1234",
        correoInterno: "pedro.ramirez@repairsuite.com",
        estado: "Vacaciones",
        fechaAlta: "2023-06-01T00:00:00Z",
        horarioTrabajo: "Lun-Vie 9:00-18:00",
        especialidades: ["Software", "Gaming"],
        tieneUsuario: false,
        avatar: "/avatars/pedro.jpg",
        ordenesAtendidas: 54,
        ordenesCompletadas: 50,
        tasaDevolucion: 5.1,
        calificacionPromedio: 4.3,
    },
    {
        id: "emp-008",
        nombre: "Carmen",
        apellidos: "Rodríguez Vega",
        nombreCompleto: "Carmen Rodríguez Vega",
        rolOperativo: "Gerente",
        sucursalAsignada: "Sede B",
        telefono: "+52 55 8901 2345",
        correoInterno: "carmen.rodriguez@repairsuite.com",
        estado: "Activo",
        fechaAlta: "2022-10-01T00:00:00Z",
        horarioTrabajo: "Lun-Vie 9:00-18:00",
        especialidades: ["General"],
        tieneUsuario: false,
        avatar: "/avatars/carmen.jpg",
    },
    {
        id: "emp-009",
        nombre: "Jorge",
        apellidos: "Fernández Ruiz",
        nombreCompleto: "Jorge Fernández Ruiz",
        rolOperativo: "Auxiliar",
        sucursalAsignada: "Sede C",
        telefono: "+52 55 9012 3456",
        correoInterno: "jorge.fernandez@repairsuite.com",
        estado: "Activo",
        fechaAlta: "2024-01-10T00:00:00Z",
        horarioTrabajo: "Lun-Vie 10:00-19:00",
        especialidades: ["General"],
        tieneUsuario: false,
        avatar: "/avatars/jorge.jpg",
    },
    {
        id: "emp-010",
        nombre: "Patricia",
        apellidos: "Sánchez Ortiz",
        nombreCompleto: "Patricia Sánchez Ortiz",
        rolOperativo: "Técnico",
        sucursalAsignada: "Sede A",
        telefono: "+52 55 0123 4567",
        correoInterno: "patricia.sanchez@repairsuite.com",
        estado: "Suspendido",
        fechaAlta: "2023-07-01T00:00:00Z",
        horarioTrabajo: "Lun-Vie 9:00-18:00",
        especialidades: ["Apple", "Software"],
        tieneUsuario: false,
        avatar: "/avatars/patricia.jpg",
        ordenesAtendidas: 32,
        ordenesCompletadas: 28,
        tasaDevolucion: 8.2,
        calificacionPromedio: 3.9,
    },
]

// ============================================
// USERS
// ============================================

export const mockUsers: User[] = [
    {
        id: "user-001",
        empleadoId: "emp-001",
        correoLogin: "carlos.gomez@repairsuite.com",
        rolSistema: "Técnico",
        permisos: TECNICO_PERMISSIONS,
        activo: true,
        ultimoAcceso: "2025-01-20T16:30:00Z",
        fechaCreacion: "2023-01-15T00:00:00Z",
        requiereCambioPassword: false,
    },
    {
        id: "user-002",
        empleadoId: "emp-002",
        correoLogin: "ana.martinez@repairsuite.com",
        rolSistema: "Recepción",
        permisos: RECEPCION_PERMISSIONS,
        activo: true,
        ultimoAcceso: "2025-01-20T17:45:00Z",
        fechaCreacion: "2023-02-01T00:00:00Z",
        requiereCambioPassword: false,
    },
    {
        id: "user-003",
        empleadoId: "emp-003",
        correoLogin: "luis.torres@repairsuite.com",
        rolSistema: "Técnico",
        permisos: TECNICO_PERMISSIONS,
        activo: true,
        ultimoAcceso: "2025-01-20T15:20:00Z",
        fechaCreacion: "2023-03-10T00:00:00Z",
        requiereCambioPassword: false,
    },
    {
        id: "user-004",
        empleadoId: "emp-004",
        correoLogin: "maria.gonzalez@repairsuite.com",
        rolSistema: "Administrador",
        permisos: ADMIN_PERMISSIONS,
        activo: true,
        ultimoAcceso: "2025-01-20T18:00:00Z",
        fechaCreacion: "2022-11-01T00:00:00Z",
        requiereCambioPassword: false,
    },
    {
        id: "user-005",
        empleadoId: "emp-005",
        correoLogin: "roberto.silva@repairsuite.com",
        rolSistema: "Técnico",
        permisos: {
            ...TECNICO_PERMISSIONS,
            verCostos: true, // Permiso adicional
        },
        activo: true,
        ultimoAcceso: "2025-01-20T14:10:00Z",
        fechaCreacion: "2023-04-20T00:00:00Z",
        requiereCambioPassword: false,
    },
    {
        id: "user-006",
        empleadoId: "emp-006",
        correoLogin: "laura.diaz@repairsuite.com",
        rolSistema: "Solo Lectura",
        permisos: SOLO_LECTURA_PERMISSIONS,
        activo: true,
        ultimoAcceso: "2025-01-19T16:30:00Z",
        fechaCreacion: "2023-05-15T00:00:00Z",
        requiereCambioPassword: true,
    },
]

// ============================================
// EMPLOYEE METRICS
// ============================================

export const mockEmployeeMetrics: EmployeeMetrics[] = [
    {
        empleadoId: "emp-001",
        periodo: "2025-01",
        ordenesAtendidas: 23,
        ordenesCompletadas: 21,
        ordenesEnProceso: 2,
        tiempoPromedioReparacion: 4.2,
        tasaDevolucion: 2.1,
        ingresosGenerados: 45800,
        calificacionPromedio: 4.8,
        especialidadMasUsada: "Hardware",
    },
    {
        empleadoId: "emp-003",
        periodo: "2025-01",
        ordenesAtendidas: 18,
        ordenesCompletadas: 17,
        ordenesEnProceso: 1,
        tiempoPromedioReparacion: 5.1,
        tasaDevolucion: 3.2,
        ingresosGenerados: 38200,
        calificacionPromedio: 4.6,
        especialidadMasUsada: "Apple",
    },
    {
        empleadoId: "emp-005",
        periodo: "2025-01",
        ordenesAtendidas: 15,
        ordenesCompletadas: 14,
        ordenesEnProceso: 1,
        tiempoPromedioReparacion: 6.3,
        tasaDevolucion: 4.5,
        ingresosGenerados: 32100,
        calificacionPromedio: 4.5,
        especialidadMasUsada: "Redes",
    },
    {
        empleadoId: "emp-007",
        periodo: "2025-01",
        ordenesAtendidas: 12,
        ordenesCompletadas: 11,
        ordenesEnProceso: 1,
        tiempoPromedioReparacion: 5.8,
        tasaDevolucion: 5.1,
        ingresosGenerados: 24500,
        calificacionPromedio: 4.3,
        especialidadMasUsada: "Software",
    },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getEmployeeById(id: string): Employee | undefined {
    return mockEmployees.find((e) => e.id === id)
}

export function getUserById(id: string): User | undefined {
    return mockUsers.find((u) => u.id === id)
}

export function getUserByEmployeeId(empleadoId: string): User | undefined {
    return mockUsers.find((u) => u.empleadoId === empleadoId)
}

export function getEmployeeMetrics(empleadoId: string, periodo: string): EmployeeMetrics | undefined {
    return mockEmployeeMetrics.find((m) => m.empleadoId === empleadoId && m.periodo === periodo)
}

export function getEmployeesWithoutUser(): Employee[] {
    return mockEmployees.filter((e) => !e.tieneUsuario)
}

export function getActiveEmployees(): Employee[] {
    return mockEmployees.filter((e) => e.estado === "Activo")
}

export function getTechnicians(): Employee[] {
    return mockEmployees.filter((e) => e.rolOperativo === "Técnico")
}
