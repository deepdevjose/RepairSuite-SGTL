// System Configuration Module Types for RepairSuite SGTL

// Order status types
export type OrderStatusType = "Proceso" | "Aprobación" | "Pago" | "Entrega" | "Cierre" | "Cancelación" | "Automático"

// Order status with automations
export interface OrderStatus {
    id: string
    nombre: string
    tipo: OrderStatusType
    color: string
    orden: number // For drag & drop ordering
    locked: boolean // Cannot be deleted

    // Automations
    notificarCliente: boolean
    mensajeNotificacion?: string
    cambiarEstadoPago: boolean
    nuevoEstadoPago?: "Pendiente" | "Parcial" | "Pagado"
    cerrarOrden: boolean

    // Metadata
    descripcion?: string
    icono?: string
}

// Business policies
export interface BusinessPolicy {
    // Storage and abandonment
    diasMaximoAlmacenamiento: number
    diasAbandonoPotencial: number
    diasEquipoAbandonado: number

    // Warranties
    garantiaEstandarServicios: number // days
    garantiaEstandarRefacciones: number // days

    // Penalties
    penalizacionPorAbandono: number // amount
    aplicarPenalizacion: boolean

    // Reminders
    recordarTecnicoDespuesDias: number
    recordarRecepcionDespuesDias: number

    // Payments
    permitirPagoParcial: boolean
    porcentajeMinimoAnticipo: number // percentage
}

// Notification template
export interface NotificationTemplate {
    id: string
    nombre: string
    tipo: "WhatsApp" | "Email" | "SMS"
    evento: "OS Creada" | "Listo para entrega" | "Cotización" | "Pago recibido" | "Recordatorio"
    asunto?: string // For email
    mensaje: string
    variables: string[] // ["cliente", "folio", "total", "fecha"]
    activo: boolean
}

// System configuration
export interface SystemConfig {
    // Workshop data
    nombreComercial: string
    razonSocial: string
    rfc: string
    telefono: string
    email: string
    sitioWeb?: string
    logo?: string // URL

    // Order statuses
    estadosOS: OrderStatus[]

    // Policies
    politicas: BusinessPolicy

    // Notification templates
    plantillasNotificaciones: NotificationTemplate[]

    // Folio configuration
    formatoFolio: string // "RS-OS-{numero}"
    siguienteFolio: number

    // Currency
    moneda: string // "MXN"
    simboloMoneda: string // "$"
}

// Available variables for notification templates
export const NOTIFICATION_VARIABLES = [
    { key: "{cliente}", description: "Nombre del cliente" },
    { key: "{folio}", description: "Folio de la orden" },
    { key: "{total}", description: "Total de la orden" },
    { key: "{fecha}", description: "Fecha actual" },
    { key: "{equipo}", description: "Equipo del cliente" },
    { key: "{tecnico}", description: "Técnico asignado" },
    { key: "{telefono}", description: "Teléfono del taller" },
]
