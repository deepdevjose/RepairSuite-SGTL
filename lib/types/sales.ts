// Sales and Payments Module Types for RepairSuite SGTL

export type PaymentMethod = "Efectivo" | "Tarjeta" | "Transferencia" | "MercadoPago" | "Depósito" | "Mixto"

export type PaymentStatus = "Pagado" | "Parcial" | "Pendiente" | "Vencido"

// Mixed payment breakdown
export interface MixedPaymentBreakdown {
    efectivo: number
    tarjeta: number
    transferencia: number
    mercadoPago: number
    deposito: number
}

// Individual payment record
export interface Payment {
    id: string
    ordenServicioId: string
    folioOS: string
    monto: number
    metodoPago: PaymentMethod
    mixedBreakdown?: MixedPaymentBreakdown
    fecha: string
    referencia?: string
    comprobante?: string // URL to PDF/image
    notas?: string
    usuarioRegistro: string
    nombreUsuario: string
}

// Sale concept item (service or part)
export interface SaleConceptItem {
    tipo: "Servicio" | "Refacción"
    catalogoSKU: string
    nombre: string
    cantidad: number
    precioUnitario: number
    costoUnitario: number // For profit calculation
    subtotal: number
}

// Complete sale detail
export interface SaleDetail {
    id: string
    ordenServicioId: string
    folioOS: string
    cliente: string
    clienteEmail?: string
    clienteTelefono?: string
    equipo: string
    equipoMarca?: string
    equipoModelo?: string
    fechaCreacion: string
    fechaVencimiento?: string
    conceptos: SaleConceptItem[]
    subtotal: number
    descuento: number
    total: number
    pagado: number
    saldo: number
    utilidad?: number
    estado: PaymentStatus
    pagos: Payment[]
    ultimoPago?: {
        fecha: string
        metodo: PaymentMethod
    }
    tecnicoAsignado?: string
    notas?: string
}

// Daily cash report
export interface DailyCashReport {
    fecha: string
    totalCobrado: number
    porMetodo: Record<PaymentMethod, number>
    numeroTransacciones: number
    usuariosQueCobaron: string[]
    ordenesCompletadas: string[]
}

// Monthly report
export interface MonthlyReport {
    mes: string
    año: number
    serviciosMasVendidos: Array<{ nombre: string; cantidad: number; total: number }>
    refaccionesMasUsadas: Array<{ nombre: string; cantidad: number; total: number }>
    tecnicosTopIngresos: Array<{ nombre: string; ingresos: number; ordenes: number }>
}

// Accounts receivable
export interface AccountReceivable {
    folioOS: string
    cliente: string
    total: number
    pagado: number
    saldo: number
    fechaCreacion: string
    diasVencido: number
}

// Filters for sales
export interface SalesFilters {
    searchTerm: string
    estado: "all" | PaymentStatus
    fechaInicio?: string
    fechaFin?: string
    metodoPago: "all" | PaymentMethod
}

// Profit calculation
export interface ProfitCalculation {
    totalVenta: number
    costoRefacciones: number
    costoManoObra: number
    utilidadNeta: number
    margenPorcentaje: number
}
