// Supplier helper utilities

/**
 * Validate RFC format (Mexican tax ID)
 */
export function validateRFC(rfc: string): boolean {
    // Basic RFC validation for Mexico
    // Person: 13 characters (AAAA######XXX)
    // Company: 12 characters (AAA######XXX)
    const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/
    return rfcPattern.test(rfc.toUpperCase())
}

/**
 * Format address to single line
 */
export function formatAddress(direccion: {
    calle: string
    colonia: string
    municipio: string
    estado: string
    pais: string
    codigoPostal: string
}): string {
    return `${direccion.calle}, ${direccion.colonia}, ${direccion.municipio}, ${direccion.estado}, ${direccion.pais} ${direccion.codigoPostal}`
}

/**
 * Calculate total of purchase order
 */
export function calculateOrderTotal(subtotal: number, envio: number): number {
    return subtotal + envio
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
 * Get payment terms color
 */
export function getPaymentTermsColor(condiciones: string): string {
    const colors: Record<string, string> = {
        "Contado": "text-green-400",
        "15 días": "text-blue-400",
        "30 días": "text-indigo-400",
        "Crédito especial": "text-purple-400",
    }
    return colors[condiciones] || "text-slate-400"
}
