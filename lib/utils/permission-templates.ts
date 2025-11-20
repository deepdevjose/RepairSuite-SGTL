import type { UserPermissions, SystemRole } from "@/lib/types/staff"

// Permission templates for different system roles

export const ADMIN_PERMISSIONS: UserPermissions = {
    // Ventas y Pagos
    registrarPagos: true,
    verMetricasFinancieras: true,
    verUtilidades: true,

    // Catálogo
    cambiarPrecios: true,
    editarCatalogo: true,

    // Órdenes de Servicio
    crearOrdenes: true,
    aprobarCotizaciones: true,
    cancelarOrdenes: true,
    reasignarTecnicos: true,

    // Inventario
    ajustarInventario: true,
    crearTransferencias: true,
    verCostos: true,

    // Proveedores
    gestionarProveedores: true,
    crearOrdenesCompra: true,

    // Clientes
    editarClientes: true,
    verHistorialCompleto: true,

    // Personal
    gestionarPersonal: true,
    verNomina: true,

    // Reportes
    verReportesAvanzados: true,
    exportarDatos: true,

    // Sistema
    configurarSistema: true,
    verAuditoria: true,
}

export const RECEPCION_PERMISSIONS: UserPermissions = {
    // Ventas y Pagos
    registrarPagos: true,
    verMetricasFinancieras: false,
    verUtilidades: false,

    // Catálogo
    cambiarPrecios: false,
    editarCatalogo: false,

    // Órdenes de Servicio
    crearOrdenes: true,
    aprobarCotizaciones: false,
    cancelarOrdenes: false,
    reasignarTecnicos: false,

    // Inventario
    ajustarInventario: false,
    crearTransferencias: false,
    verCostos: false,

    // Proveedores
    gestionarProveedores: false,
    crearOrdenesCompra: false,

    // Clientes
    editarClientes: true,
    verHistorialCompleto: true,

    // Personal
    gestionarPersonal: false,
    verNomina: false,

    // Reportes
    verReportesAvanzados: false,
    exportarDatos: false,

    // Sistema
    configurarSistema: false,
    verAuditoria: false,
}

export const TECNICO_PERMISSIONS: UserPermissions = {
    // Ventas y Pagos
    registrarPagos: false,
    verMetricasFinancieras: false,
    verUtilidades: false,

    // Catálogo
    cambiarPrecios: false,
    editarCatalogo: false,

    // Órdenes de Servicio
    crearOrdenes: false,
    aprobarCotizaciones: false,
    cancelarOrdenes: false,
    reasignarTecnicos: false,

    // Inventario
    ajustarInventario: false,
    crearTransferencias: false,
    verCostos: false,

    // Proveedores
    gestionarProveedores: false,
    crearOrdenesCompra: false,

    // Clientes
    editarClientes: false,
    verHistorialCompleto: true,

    // Personal
    gestionarPersonal: false,
    verNomina: false,

    // Reportes
    verReportesAvanzados: false,
    exportarDatos: false,

    // Sistema
    configurarSistema: false,
    verAuditoria: false,
}

export const SOLO_LECTURA_PERMISSIONS: UserPermissions = {
    // All permissions set to false
    registrarPagos: false,
    verMetricasFinancieras: false,
    verUtilidades: false,
    cambiarPrecios: false,
    editarCatalogo: false,
    crearOrdenes: false,
    aprobarCotizaciones: false,
    cancelarOrdenes: false,
    reasignarTecnicos: false,
    ajustarInventario: false,
    crearTransferencias: false,
    verCostos: false,
    gestionarProveedores: false,
    crearOrdenesCompra: false,
    editarClientes: false,
    verHistorialCompleto: true, // Can view history
    gestionarPersonal: false,
    verNomina: false,
    verReportesAvanzados: false,
    exportarDatos: false,
    configurarSistema: false,
    verAuditoria: false,
}

/**
 * Get permission template for a system role
 */
export function getPermissionTemplate(role: SystemRole): UserPermissions {
    const templates: Record<SystemRole, UserPermissions> = {
        Administrador: ADMIN_PERMISSIONS,
        Recepción: RECEPCION_PERMISSIONS,
        Técnico: TECNICO_PERMISSIONS,
        "Solo Lectura": SOLO_LECTURA_PERMISSIONS,
    }

    return { ...templates[role] } // Return a copy
}

/**
 * Permission groups for UI organization
 */
export const PERMISSION_GROUPS = [
    {
        name: "Ventas y Pagos",
        permissions: [
            { key: "registrarPagos" as keyof UserPermissions, label: "Registrar pagos" },
            { key: "verMetricasFinancieras" as keyof UserPermissions, label: "Ver métricas financieras" },
            { key: "verUtilidades" as keyof UserPermissions, label: "Ver utilidades" },
        ],
    },
    {
        name: "Catálogo",
        permissions: [
            { key: "cambiarPrecios" as keyof UserPermissions, label: "Cambiar precios" },
            { key: "editarCatalogo" as keyof UserPermissions, label: "Editar catálogo" },
        ],
    },
    {
        name: "Órdenes de Servicio",
        permissions: [
            { key: "crearOrdenes" as keyof UserPermissions, label: "Crear órdenes" },
            { key: "aprobarCotizaciones" as keyof UserPermissions, label: "Aprobar cotizaciones" },
            { key: "cancelarOrdenes" as keyof UserPermissions, label: "Cancelar órdenes" },
            { key: "reasignarTecnicos" as keyof UserPermissions, label: "Reasignar técnicos" },
        ],
    },
    {
        name: "Inventario",
        permissions: [
            { key: "ajustarInventario" as keyof UserPermissions, label: "Ajustar inventario" },
            { key: "crearTransferencias" as keyof UserPermissions, label: "Crear transferencias" },
            { key: "verCostos" as keyof UserPermissions, label: "Ver costos" },
        ],
    },
    {
        name: "Proveedores",
        permissions: [
            { key: "gestionarProveedores" as keyof UserPermissions, label: "Gestionar proveedores" },
            { key: "crearOrdenesCompra" as keyof UserPermissions, label: "Crear órdenes de compra" },
        ],
    },
    {
        name: "Clientes",
        permissions: [
            { key: "editarClientes" as keyof UserPermissions, label: "Editar clientes" },
            { key: "verHistorialCompleto" as keyof UserPermissions, label: "Ver historial completo" },
        ],
    },
    {
        name: "Personal",
        permissions: [
            { key: "gestionarPersonal" as keyof UserPermissions, label: "Gestionar personal" },
            { key: "verNomina" as keyof UserPermissions, label: "Ver nómina" },
        ],
    },
    {
        name: "Reportes",
        permissions: [
            { key: "verReportesAvanzados" as keyof UserPermissions, label: "Ver reportes avanzados" },
            { key: "exportarDatos" as keyof UserPermissions, label: "Exportar datos" },
        ],
    },
    {
        name: "Sistema",
        permissions: [
            { key: "configurarSistema" as keyof UserPermissions, label: "Configurar sistema" },
            { key: "verAuditoria" as keyof UserPermissions, label: "Ver auditoría" },
        ],
    },
]
