import type { ServiceItem, PartItem, PackageItem, CatalogItem } from "@/lib/types/catalog"
import { mockInventoryItems } from "@/lib/data/inventory-mock"
import { getStockStatus as getInventoryStockStatus } from "@/lib/utils/inventory-helpers"

/**
 * Calculate profit margin percentage
 */
export function calculateMargin(costoProveedor: number, precioVenta: number): number {
    if (precioVenta === 0) return 0
    return Number((((precioVenta - costoProveedor) / precioVenta) * 100).toFixed(2))
}

/**
 * Calculate savings in a package
 */
export function calculatePackageSavings(precioIndividualTotal: number, precioPaquete: number): number {
    return precioIndividualTotal - precioPaquete
}

/**
 * Calculate discount percentage in a package
 */
export function calculatePackageDiscount(precioIndividualTotal: number, precioPaquete: number): number {
    if (precioIndividualTotal === 0) return 0
    const ahorro = calculatePackageSavings(precioIndividualTotal, precioPaquete)
    return Number(((ahorro / precioIndividualTotal) * 100).toFixed(2))
}

/**
 * Format time estimate from minutes to human readable
 */
export function formatTimeEstimate(minutos: number): string {
    if (minutos < 60) return `${minutos} min`
    if (minutos < 1440) {
        const horas = Math.floor(minutos / 60)
        const mins = minutos % 60
        return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`
    }
    const dias = Math.floor(minutos / 1440)
    const horas = Math.floor((minutos % 1440) / 60)
    return horas > 0 ? `${dias}d ${horas}h` : `${dias}d`
}

/**
 * Get stock status for a part linked to inventory
 */
export function getPartStockStatus(inventarioSKU?: string): {
    stockTotal: number
    stockDisponible: number
    stockReservado: number
    estado: "OK" | "Bajo" | "Crítico" | "Sin Stock"
} {
    if (!inventarioSKU) {
        return {
            stockTotal: 0,
            stockDisponible: 0,
            stockReservado: 0,
            estado: "Sin Stock",
        }
    }

    const inventoryItem = mockInventoryItems.find((item) => item.sku === inventarioSKU)

    if (!inventoryItem) {
        return {
            stockTotal: 0,
            stockDisponible: 0,
            stockReservado: 0,
            estado: "Sin Stock",
        }
    }

    const disponible = Math.max(0, inventoryItem.stockTotal - inventoryItem.stockReservado)
    const status = getInventoryStockStatus(inventoryItem.stockTotal, inventoryItem.stockMinimo)

    return {
        stockTotal: inventoryItem.stockTotal,
        stockDisponible: disponible,
        stockReservado: inventoryItem.stockReservado,
        estado: status,
    }
}

/**
 * Check if a service is compatible with an equipment type
 */
export function isServiceCompatible(service: ServiceItem, equipmentType: string): boolean {
    return service.equiposCompatibles.includes(equipmentType as any)
}

/**
 * Calculate total price of services in a package
 */
export function calculateTotalPackagePrice(servicios: Array<{ precioIndividual: number }>): number {
    return servicios.reduce((total, servicio) => total + servicio.precioIndividual, 0)
}

/**
 * Filter catalog items by type
 */
export function filterByType(
    items: CatalogItem[],
    tipo: "all" | "Servicio" | "Refacción" | "Paquete"
): CatalogItem[] {
    if (tipo === "all") return items
    return items.filter((item) => item.tipo === tipo)
}

/**
 * Filter services by category
 */
export function filterServicesByCategory(
    services: ServiceItem[],
    categoria: "all" | string
): ServiceItem[] {
    if (categoria === "all") return services
    return services.filter((s) => s.categoria === categoria)
}

/**
 * Filter parts by brand
 */
export function filterPartsByBrand(parts: PartItem[], marca: "all" | string): PartItem[] {
    if (marca === "all") return parts
    return parts.filter((p) => p.marca === marca)
}

/**
 * Filter parts by supplier
 */
export function filterPartsBySupplier(parts: PartItem[], supplierId: "all" | string): PartItem[] {
    if (supplierId === "all") return parts
    return parts.filter((p) => p.proveedor.id === supplierId)
}

/**
 * Search catalog items by SKU or name
 */
export function searchCatalogItems(items: CatalogItem[], searchTerm: string): CatalogItem[] {
    if (!searchTerm.trim()) return items

    const term = searchTerm.toLowerCase()
    return items.filter(
        (item) => item.sku.toLowerCase().includes(term) || item.nombre.toLowerCase().includes(term)
    )
}

/**
 * Get all unique brands from parts
 */
export function getAllBrands(parts: PartItem[]): string[] {
    const brands = new Set<string>()
    parts.forEach((part) => {
        if (part.marca) brands.add(part.marca)
    })
    return Array.from(brands).sort()
}

/**
 * Get all unique service categories
 */
export function getAllServiceCategories(): string[] {
    return ["Hardware", "Software", "Mantenimiento", "Seguridad", "Datos", "Diagnóstico", "Reparación", "Upgrade"]
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
 * Get complexity color class
 */
export function getComplexityColor(nivel: string): string {
    const colors: Record<string, string> = {
        Básico: "text-green-400",
        Intermedio: "text-blue-400",
        Avanzado: "text-orange-400",
        Experto: "text-red-400",
    }
    return colors[nivel] || "text-slate-400"
}

/**
 * Get category color class
 */
export function getCategoryColor(categoria: string): string {
    const colors: Record<string, string> = {
        Hardware: "from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-500/30",
        Software: "from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30",
        Mantenimiento: "from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30",
        Seguridad: "from-red-500/20 to-orange-500/20 text-red-400 border-red-500/30",
        Datos: "from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30",
        Diagnóstico: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
        Reparación: "from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/30",
        Upgrade: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30",
    }
    return colors[categoria] || "from-slate-500/20 to-gray-500/20 text-slate-400 border-slate-500/30"
}
