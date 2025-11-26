
// ============================================
// DEFAULT ORDER STATUSES
// ============================================

export const DEFAULT_ORDER_STATUSES: OrderStatus[] = [
    {
        id: "status-001",
        nombre: "Recibida",
        tipo: "Proceso",
        color: "#3b82f6", // blue
        orden: 1,
        locked: false,
        notificarCliente: true,
        mensajeNotificacion: "Hemos recibido tu equipo {equipo}. Folio: {folio}",
        cambiarEstadoPago: false,
        cerrarOrden: false,
        descripcion: "Equipo recibido en el taller",
    },
    {
        id: "status-002",
        nombre: "En diagnóstico",
        tipo: "Proceso",
        color: "#8b5cf6", // purple
        orden: 2,
        locked: true,
        notificarCliente: false,
        cambiarEstadoPago: false,
        cerrarOrden: false,
        descripcion: "Técnico está diagnosticando el equipo",
    },
    {
        id: "status-003",
        nombre: "Cotización pendiente",
        tipo: "Aprobación",
        color: "#f59e0b", // amber
        orden: 3,
        locked: false,
        notificarCliente: true,
        mensajeNotificacion: "Tu cotización está lista. Total: {total}. Folio: {folio}",
        cambiarEstadoPago: false,
        cerrarOrden: false,
        descripcion: "Esperando aprobación del cliente",
    },
    {
        id: "status-004",
        nombre: "Aprobada",
        tipo: "Aprobación",
        color: "#10b981", // green
        orden: 4,
        locked: false,
        notificarCliente: false,
        cambiarEstadoPago: false,
        cerrarOrden: false,
        descripcion: "Cliente aprobó la cotización",
    },
    {
        id: "status-005",
        nombre: "En proceso",
        tipo: "Proceso",
        color: "#6366f1", // indigo
        orden: 5,
        locked: true,
        notificarCliente: false,
        cambiarEstadoPago: false,
        cerrarOrden: false,
        descripcion: "Técnico está trabajando en la reparación",
    },
    {
        id: "status-006",
        nombre: "Esperando refacción",
        tipo: "Proceso",
        color: "#f97316", // orange
        orden: 6,
        locked: false,
        notificarCliente: false,
        cambiarEstadoPago: false,
        cerrarOrden: false,
        descripcion: "Esperando llegada de refacciones",
    },
    {
        id: "status-007",
        nombre: "Listo para entrega",
        tipo: "Entrega",
        color: "#22c55e", // green
        orden: 7,
        locked: true,
        notificarCliente: true,
        mensajeNotificacion: "¡Tu equipo {equipo} está listo! Puedes pasar a recogerlo. Folio: {folio}",
        cambiarEstadoPago: false,
        cerrarOrden: false,
        descripcion: "Reparación completada, listo para recoger",
    },
    {
        id: "status-008",
        nombre: "Completada y pagada",
        tipo: "Cierre",
        color: "#059669", // emerald
        orden: 8,
        locked: true,
        notificarCliente: false,
        cambiarEstadoPago: true,
        nuevoEstadoPago: "Pagado",
        cerrarOrden: true,
        descripcion: "Orden completada y pagada en su totalidad",
    },
    {
        id: "status-009",
        nombre: "Entregada",
        tipo: "Cierre",
        color: "#14b8a6", // teal
        orden: 9,
        locked: false,
        notificarCliente: false,
        cambiarEstadoPago: false,
        cerrarOrden: true,
        descripcion: "Equipo entregado al cliente",
    },
    {
        id: "status-010",
        nombre: "Cancelada",
        tipo: "Cancelación",
        color: "#ef4444", // red
        orden: 10,
        locked: true,
        notificarCliente: false,
        cambiarEstadoPago: false,
        cerrarOrden: true,
        descripcion: "Orden cancelada por el cliente o el taller",
    },
    {
        id: "status-011",
        nombre: "Equipo abandonado",
        tipo: "Automático",
        color: "#6b7280", // gray
        orden: 11,
        locked: true,
        notificarCliente: false,
        cambiarEstadoPago: false,
        cerrarOrden: true,
        descripcion: "Cliente no recogió el equipo en el tiempo establecido",
    },
]

// ============================================
// MOCK BRANCHES DATA (Commented - Ready for real API)
// ============================================

/*
    {
        nombre: "Sede A - Centro",
        direccion: {
            calle: "Av. Insurgentes Sur 1234",
            colonia: "Del Valle",
            ciudad: "Ciudad de México",
            estado: "CDMX",
            codigoPostal: "03100",
        },
        telefono: "+52 55 1234 5678",
        email: "centro@repairsuite.mx",
        horario: "Lun-Vie 9:00-19:00, Sáb 9:00-14:00",
        encargado: "Ana Martínez",
        prefijoFolios: "A",
        activa: true,
        tieneInventario: true,
    },
    {
        nombre: "Sede B - Norte",
        direccion: {
            calle: "Av. Politécnico 890",
            colonia: "Lindavista",
            ciudad: "Ciudad de México",
            estado: "CDMX",
            codigoPostal: "07300",
        },
        telefono: "+52 55 8765 4321",
        email: "norte@repairsuite.mx",
        horario: "Lun-Vie 10:00-18:00, Sáb 10:00-15:00",
        encargado: "Carlos Gómez",
        prefijoFolios: "B",
        activa: true,
        tieneInventario: true,
    },
    {
        nombre: "Sede C - Sur",
        direccion: {
            calle: "Calz. Tlalpan 567",
            colonia: "Portales",
            ciudad: "Ciudad de México",
            estado: "CDMX",
            codigoPostal: "03300",
        },
        telefono: "+52 55 5555 1234",
        email: "sur@repairsuite.mx",
        horario: "Lun-Sáb 9:00-18:00",
        encargado: "Luis Torres",
        prefijoFolios: "C",
        activa: true,
        tieneInventario: true,
    },
]
*/

// ============================================
// DEFAULT NOTIFICATION TEMPLATES
// ============================================

export const DEFAULT_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
/*    {
        id: "template-001",
        nombre: "OS Creada",
        tipo: "WhatsApp",
        evento: "OS Creada",
        mensaje:
        activo: true,
    },
    {
        id: "template-002",
        nombre: "Listo para entrega",
        tipo: "WhatsApp",
        evento: "Listo para entrega",
        mensaje:
        activo: true,
    },
    {
        id: "template-003",
        nombre: "Cotización por email",
        tipo: "Email",
        evento: "Cotización",
        asunto: "Cotización para tu {equipo} - Folio {folio}",
        mensaje:
        activo: true,
    },
    {
        id: "template-004",
        nombre: "Pago recibido",
        tipo: "WhatsApp",
        evento: "Pago recibido",
        mensaje: "Hola {cliente}, hemos recibido tu pago de {total}. Folio: {folio}. ¡Gracias!",
        variables: ["cliente", "total", "folio"],
        activo: true,
    },
    {
        id: "template-005",
        nombre: "Recordatorio de pago",
        tipo: "WhatsApp",
        evento: "Recordatorio",
        mensaje:
        activo: true,
    },
*/
]

// ============================================
// DEFAULT SYSTEM CONFIG
// ============================================

export const mockSystemConfig: SystemConfig = {
    // Workshop data
    nombreComercial: "RepairSuite Taller",
    razonSocial: "RepairSuite S.A. de C.V.",
    rfc: "RST850623ABC",
    telefono: "+52 55 1234 5678",
    email: "contacto@repairsuite.mx",
    sitioWeb: "https://repairsuite.mx",
    logo: undefined,


    // Order statuses
    estadosOS: DEFAULT_ORDER_STATUSES,

    // Branches (empty - ready for real API)
    sucursales: [],

    // Policies
    politicas: {
        diasMaximoAlmacenamiento: 90,
        diasAbandonoPotencial: 30,
        diasEquipoAbandonado: 60,
        garantiaEstandarServicios: 30,
        garantiaEstandarRefacciones: 90,
        penalizacionPorAbandono: 500,
        aplicarPenalizacion: true,
        recordarTecnicoDespuesDias: 7,
        recordarRecepcionDespuesDias: 15,
        permitirPagoParcial: true,
        porcentajeMinimoAnticipo: 50,
    },

    // Notification templates
    plantillasNotificaciones: DEFAULT_NOTIFICATION_TEMPLATES,

    // Folio configuration
    formatoFolio: "RS-OS-{numero}",
    siguienteFolio: 1025,

    // Currency
    moneda: "MXN",
    simboloMoneda: "$",
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getSystemConfig(): SystemConfig {
    return mockSystemConfig
}

export function getOrderStatuses(): OrderStatus[] {
    return mockSystemConfig.estadosOS.sort((a, b) => a.orden - b.orden)
}

export function getNotificationTemplates(): NotificationTemplate[] {
    return mockSystemConfig.plantillasNotificaciones
}
