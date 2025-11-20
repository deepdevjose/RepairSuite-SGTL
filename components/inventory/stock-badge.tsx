import type { StockStatus } from "@/lib/types/inventory"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

interface StockBadgeProps {
    status: StockStatus
    showIcon?: boolean
}

export function StockBadge({ status, showIcon = true }: StockBadgeProps) {
    const variants = {
        OK: {
            className: "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20",
            icon: CheckCircle2,
            label: "OK",
        },
        Bajo: {
            className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20",
            icon: AlertTriangle,
            label: "Bajo",
        },
        Crítico: {
            className: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
            icon: XCircle,
            label: "Crítico",
        },
    }

    const variant = variants[status]
    const Icon = variant.icon

    return (
        <Badge className={`${variant.className} font-medium text-xs`}>
            {showIcon && <Icon className="h-3 w-3 mr-1" />}
            {variant.label}
        </Badge>
    )
}
