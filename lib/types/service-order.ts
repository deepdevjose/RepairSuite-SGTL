/**
 * Service Order Type Definitions
 * Complete type system for managing repair service orders
 */

// Service Order States
export type ServiceOrderState =
    | "Esperando diagnóstico"      // Recepcionista creó OS, cobró diagnóstico ($150), asignó técnico
    | "En diagnóstico"             // Técnico está revisando el equipo
    | "Diagnóstico terminado"      // Técnico completó diagnóstico y agregó cotización
    | "Esperando aprobación"       // Recepción contacta cliente, esperando respuesta
    | "En reparación"              // Cliente aprobó, técnico está reparando
    | "Reparación terminada"       // Técnico terminó, puso piezas usadas
    | "Lista para entrega"         // En recepción, esperando que cliente recoja
    | "Pagado y entregado"         // Cliente pagó y recogió su equipo (estado final)
    | "Cancelada"                  // Orden cancelada

// Payment Types
export type PaymentType = "Diagnóstico" | "Anticipo" | "Pago parcial" | "Pago final"
export type PaymentMethod = "Efectivo" | "Tarjeta" | "Transferencia" | "Otro"

// Inventory Request Status
export type InventoryRequestStatus = "Pendiente" | "Aprobada" | "Rechazada"

// Priority Levels
export type ServiceOrderPriority = "Baja" | "Normal" | "Alta" | "Urgente"

/**
 * Payment Record
 * Tracks individual payments made for a service order
 */
export interface PaymentRecord {
    id: string
    tipo: PaymentType
    monto: number
    metodo: PaymentMethod
    fecha: string // ISO date string
    recibidoPor: string // User who received payment
    notas?: string
    referencia?: string // For transfers/card payments
}

/**
 * Inventory Request
 * Represents a material request from technician to admin
 */
export interface InventoryRequest {
    id: string
    productoId: string
    productoNombre: string
    cantidad: number
    solicitadoPor: string // Technician name
    fechaSolicitud: string // ISO date string
    estado: InventoryRequestStatus
    justificacion?: string
    aprobadoPor?: string // Admin name
    fechaAprobacion?: string // ISO date string
    notasAprobacion?: string
}

/**
 * Service Order History Entry
 * Tracks state changes and important events
 */
export interface ServiceOrderHistory {
    id: string
    fecha: string // ISO date string
    estadoAnterior?: ServiceOrderState
    estadoNuevo: ServiceOrderState
    usuario: string // User who made the change
    notas?: string
}

/**
 * Diagnosis Result
 * Information provided by technician after diagnosis
 */
export interface DiagnosisResult {
    problema: string // Detailed problem description
    solucion: string // Proposed solution
    costoEstimado: number
    tiempoEstimado: string // e.g., "2-3 días"
    materialesNecesarios?: string[]
    fotos?: string[] // URLs to uploaded photos
    fecha: string // ISO date string
    tecnico: string
}

/**
 * Repair Completion Info
 * Information provided by technician when repair is done
 */
export interface RepairCompletion {
    trabajoRealizado: string
    materialesUsados: string[] // IDs of approved inventory requests
    notasFinales?: string
    fotos?: string[] // URLs to photos of completed work
    fecha: string // ISO date string
    tecnico: string
}

/**
 * Main Service Order Interface
 */
export interface ServiceOrder {
    // Basic Information
    id: string
    folio: string // e.g., "RS-OS-1024"
    fechaCreacion: string // ISO date string

    // Client & Equipment
    clienteId: string
    clienteNombre: string
    clienteTelefono: string
    equipoId: string
    equipoTipo: string // e.g., "Laptop", "PC Escritorio"
    equipoMarca: string
    equipoModelo: string
    equipoSerie?: string

    // Service Details
    problemaReportado: string // Initial problem description from client
    estado: ServiceOrderState
    prioridad: ServiceOrderPriority

    // Assignment
    tecnicoAsignadoId?: string
    tecnicoAsignadoNombre?: string

    // Diagnosis
    diagnostico?: DiagnosisResult

    // Repair
    reparacion?: RepairCompletion

    // Financial
    costoDiagnostico: number // Usually 150
    costoReparacion: number // From diagnosis estimate
    totalPagado: number // Sum of all payments
    pagos: PaymentRecord[]

    // Inventory
    solicitudesInventario: InventoryRequest[]

    // History & Tracking
    historial: ServiceOrderHistory[]
    ultimaActualizacion: string // ISO date string

    // Flags
    esGarantia: boolean
    clienteAprobado: boolean // Client approved the repair after diagnosis

    // Delivery
    fechaEntrega?: string // ISO date string
    entregadoA?: string // Name of person who received the equipment

    // Notes
    notasInternas?: string
}

/**
 * Service Order Summary (for list views)
 */
export interface ServiceOrderSummary {
    id: string
    folio: string
    clienteNombre: string
    equipoTipo: string
    equipoMarca: string
    estado: ServiceOrderState
    tecnicoAsignadoNombre?: string
    totalEstimado: number
    ultimaActualizacion: string
    esGarantia: boolean
    prioridad: ServiceOrderPriority
}

/**
 * Create Service Order DTO
 */
export interface CreateServiceOrderDTO {
    clienteId: string
    equipoId: string
    problemaReportado: string
    tecnicoAsignadoId: string
    prioridad: ServiceOrderPriority
    costoDiagnostico: number
    pagoInicial: {
        monto: number
        metodo: PaymentMethod
        referencia?: string
    }
    esGarantia: boolean
    notasInternas?: string
}

/**
 * Update Service Order State DTO
 */
export interface UpdateServiceOrderStateDTO {
    ordenId: string
    nuevoEstado: ServiceOrderState
    usuario: string
    notas?: string
}
