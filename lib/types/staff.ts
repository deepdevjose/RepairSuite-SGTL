// Staff Management Module Types for RepairSuite SGTL

// Employee operational roles
export type EmployeeRole = "Técnico" | "Recepción" | "Administrador" | "Dueño" | "Gerente" | "Auxiliar"

// Employee status
export type EmployeeStatus = "Activo" | "Inactivo" | "Suspendido" | "Vacaciones"

// Employee specialties
export type EmployeeSpecialty = "Hardware" | "Software" | "Apple" | "Gaming" | "Redes" | "Servidores" | "General"

// System roles (for user accounts)
export type SystemRole = "Administrador" | "Recepción" | "Técnico" | "Solo Lectura"

// Granular permissions for user accounts
export interface UserPermissions {
    // Ventas y Pagos
    registrarPagos: boolean
    verMetricasFinancieras: boolean
    verUtilidades: boolean

    // Catálogo
    cambiarPrecios: boolean
    editarCatalogo: boolean

    // Órdenes de Servicio
    crearOrdenes: boolean
    aprobarCotizaciones: boolean
    cancelarOrdenes: boolean
    reasignarTecnicos: boolean

    // Inventario
    ajustarInventario: boolean
    crearTransferencias: boolean
    verCostos: boolean

    // Proveedores
    gestionarProveedores: boolean
    crearOrdenesCompra: boolean

    // Clientes
    editarClientes: boolean
    verHistorialCompleto: boolean

    // Personal
    gestionarPersonal: boolean
    verNomina: boolean

    // Reportes
    verReportesAvanzados: boolean
    exportarDatos: boolean

    // Sistema
    configurarSistema: boolean
    verAuditoria: boolean
}

// Employee data (person working at the workshop)
export interface Employee {
    id: string
    nombre: string
    apellidos: string
    nombreCompleto: string // Computed: nombre + apellidos
    rolOperativo: EmployeeRole
    telefono: string
    correoInterno: string
    estado: EmployeeStatus

    // Operational data
    fechaAlta: string
    horarioTrabajo?: string // "Lun-Vie 9:00-18:00"
    especialidades: EmployeeSpecialty[]

    // User account linkage
    tieneUsuario: boolean
    usuarioId?: string

    // Avatar
    avatar?: string

    // Computed metrics
    ordenesAtendidas?: number
    ordenesCompletadas?: number
    tasaDevolucion?: number // %
    calificacionPromedio?: number // 1-5
}

// User account (system access)
export interface User {
    id: string
    empleadoId: string
    correoLogin: string
    rolSistema: SystemRole
    permisos: UserPermissions
    activo: boolean
    ultimoAcceso?: string
    fechaCreacion: string
    requiereCambioPassword: boolean
}

// Employee performance metrics
export interface EmployeeMetrics {
    empleadoId: string
    periodo: string // "2025-01"
    ordenesAtendidas: number
    ordenesCompletadas: number
    ordenesEnProceso: number
    tiempoPromedioReparacion: number // hours
    tasaDevolucion: number // %
    ingresosGenerados: number
    calificacionPromedio: number // 1-5
    especialidadMasUsada: EmployeeSpecialty
}

// Filters for staff
export interface StaffFilters {
    searchTerm: string
    rolOperativo: "all" | EmployeeRole
    estado: "all" | EmployeeStatus
    tieneUsuario: "all" | "si" | "no"
}
