import type { PaymentMethod } from "@/lib/types/sales"

/**
 * Calculate profit from sale
 */
export function calculateProfit(totalVenta: number, costoRefacciones: number, costoManoObra: number = 0): number {
    return totalVenta - costoRefacciones - costoManoObra
}

/**
 * Calculate profit margin percentage
 */
export function calculateMargin(totalVenta: number, utilidad: number): number {
    if (totalVenta === 0) return 0
    return Number(((utilidad / totalVenta) * 100).toFixed(2))
}

/**
 * Validate mixed payment amounts sum to total
 */
export function validateMixedPayment(
    efectivo: number,
    tarjeta: number,
    transferencia: number,
    mercadoPago: number,
    deposito: number,
    total: number
): boolean {
    const sum = efectivo + tarjeta + transferencia + mercadoPago + deposito
    return Math.abs(sum - total) < 0.01 // Allow for floating point errors
}

/**
 * Generate receipt number
 */
export function generateReceiptNumber(prefix: string = "REC"): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `${prefix}-${timestamp}-${random}`
}

/**
 * Format payment method for display
 */
export function formatPaymentMethod(metodo: PaymentMethod): string {
    const formats: Record<PaymentMethod, string> = {
        Efectivo: "Efectivo",
        Tarjeta: "Tarjeta",
        Transferencia: "Transferencia",
        MercadoPago: "MercadoPago",
        Depósito: "Depósito",
        Mixto: "Pago Mixto",
    }
    return formats[metodo] || metodo
}

/**
 * Check if payment is overdue
 */
export function isPaymentOverdue(fechaVencimiento?: string): boolean {
    if (!fechaVencimiento) return false
    const vencimiento = new Date(fechaVencimiento)
    const hoy = new Date()
    return hoy > vencimiento
}

/**
 * Calculate days overdue
 */
export function calculateDaysOverdue(fechaVencimiento?: string): number {
    if (!fechaVencimiento) return 0
    const vencimiento = new Date(fechaVencimiento)
    const hoy = new Date()
    if (hoy <= vencimiento) return 0

    const diffTime = Math.abs(hoy.getTime() - vencimiento.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
}

/**
 * Format currency for Mexico
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
    }).format(amount)
}

/**
 * Format date
 */
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

/**
 * Format date and time
 */
export function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}
