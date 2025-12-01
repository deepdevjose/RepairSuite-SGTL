import type { CatalogItemType } from "@/lib/types/catalog"
import { Badge } from "@/components/ui/badge"
import { Wrench, Package as PackageIcon, Cpu } from "lucide-react"

interface ProductTypeBadgeProps {
    tipo: CatalogItemType
    showIcon?: boolean
}

export function ProductTypeBadge({ tipo, showIcon = true }: ProductTypeBadgeProps) {
    const variants = {
        Servicio: {
            className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            icon: Wrench,
        },
        Refacción: {
            className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            icon: Cpu,
        },
        Paquete: {
            className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
            icon: PackageIcon,
        },
        // Map "Producto" to Refacción style for backward compatibility
        Producto: {
            className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            icon: Cpu,
        },
    }

    const variant = variants[tipo as keyof typeof variants] || variants['Refacción']
    const Icon = variant.icon

    return (
        <Badge className={`${variant.className} font-medium text-xs`}>
            {showIcon && <Icon className="h-3 w-3 mr-1" />}
            {tipo === 'Producto' ? 'Refacción' : tipo}
        </Badge>
    )
}
