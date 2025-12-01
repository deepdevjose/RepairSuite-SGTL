import type { InventoryItem, StockStatus, ProductCategory } from "@/lib/types/inventory"

/**
 * Determine stock status based on current stock and minimum threshold
 */
export function getStockStatus(stockActual: number, stockMinimo: number): StockStatus {
    if (stockActual === 0) return "Crítico"
    if (stockActual <= stockMinimo) return "Bajo"
    return "OK"
}

/**
 * Calculate available stock (total - reserved)
 */
export function calculateAvailableStock(stockTotal: number, stockReservado: number): number {
    return Math.max(0, stockTotal - stockReservado)
}

/**
 * Format movement type for display
 */
export function formatMovementType(tipo: string): string {
    const types: Record<string, string> = {
        Entrada: "Entrada",
        Salida: "Salida",
        Transferencia: "Transferencia",
        "Reserva OS": "Reserva OS",
        Ajuste: "Ajuste",
        Merma: "Merma",
    }
    return types[tipo] || tipo
}

/**
 * Filter products by category
 */
export function getProductsByCategory(
    products: InventoryItem[],
    categoria: ProductCategory | "all"
): InventoryItem[] {
    if (categoria === "all") return products
    return products.filter((p) => p.categoria === categoria)
}

/**
 * Get products with low stock
 */
export function getLowStockProducts(products: InventoryItem[]): InventoryItem[] {
    return products.filter((p) => {
        const status = getStockStatus(p.stockTotal, p.stockMinimo)
        return status === "Bajo"
    })
}

/**
 * Get products with critical stock
 */
export function getCriticalStockProducts(products: InventoryItem[]): InventoryItem[] {
    return products.filter((p) => {
        const status = getStockStatus(p.stockTotal, p.stockMinimo)
        return status === "Crítico"
    })
}

/**
 * Get products with OK stock
 */
export function getOKStockProducts(products: InventoryItem[]): InventoryItem[] {
    return products.filter((p) => {
        const status = getStockStatus(p.stockTotal, p.stockMinimo)
        return status === "OK"
    })
}

/**
 * Filter products by stock status
 */
export function filterByStockStatus(
    products: InventoryItem[],
    status: "all" | StockStatus
): InventoryItem[] {
    if (status === "all") return products

    return products.filter((p) => {
        const productStatus = getStockStatus(p.stockTotal, p.stockMinimo)
        return productStatus === status
    })
}

/**
 * Search products by SKU or name
 */
export function searchProducts(products: InventoryItem[], searchTerm: string): InventoryItem[] {
    if (!searchTerm.trim()) return products

    const term = searchTerm.toLowerCase()
    return products.filter(
        (p) => p.sku.toLowerCase().includes(term) || p.nombre.toLowerCase().includes(term)
    )
}

/**
 * Get products that need reordering (critical or low stock)
 */
export function getProductsNeedingReorder(products: InventoryItem[]): InventoryItem[] {
    return products.filter((p) => {
        const status = getStockStatus(p.stockTotal, p.stockMinimo)
        return status === "Crítico" || status === "Bajo"
    })
}

/**
 * Calculate total inventory value
 */
export function calculateInventoryValue(products: InventoryItem[]): number {
    return products.reduce((total, p) => total + p.stockTotal * p.costoProveedor, 0)
}

/**
 * Get category icon name
 */
export function getCategoryIcon(categoria: ProductCategory): string {
    const icons: Record<ProductCategory, string> = {
        RAM: "Cpu",
        SSD: "HardDrive",
        HDD: "HardDrive",
        Batería: "Battery",
        Pantalla: "Monitor",
        Teclado: "Keyboard",
        Cargador: "Plug",
        Servicio: "Wrench",
        Otro: "Package",
    }
    return icons[categoria] || "Package"
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
 * Format date for display
 */
export function formatDate(dateString: string | Date | undefined | null): string {
    if (!dateString) return "N/A"
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return "Fecha inválida"

        return new Intl.DateTimeFormat("es-MX", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    } catch (error) {
        return "Fecha inválida"
    }
}

/**
 * Format relative time (e.g., "hace 2 días")
 */
export function formatRelativeTime(dateString: string | Date | undefined | null): string {
    if (!dateString) return "N/A"
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return "Fecha inválida"

        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return "Hoy"
        if (diffDays === 1) return "Ayer"
        if (diffDays < 7) return `Hace ${diffDays} días`
        if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
        return formatDate(dateString)
    } catch (error) {
        return "Fecha inválida"
    }
}
