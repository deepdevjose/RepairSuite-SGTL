import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, XCircle, Ban } from "lucide-react"

interface StockIndicatorProps {
    estado: "OK" | "Bajo" | "Crítico" | "Sin Stock"
    stockDisponible: number
    showIcon?: boolean
}

export function StockIndicator({ estado, stockDisponible, showIcon = true }: StockIndicatorProps) {
    const variants = {
        OK: {
            className: "bg-green-500/10 text-green-400 border-green-500/20",
            icon: CheckCircle2,
        },
        Bajo: {
            className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
            icon: AlertTriangle,
        },
        Crítico: {
            className: "bg-red-500/10 text-red-400 border-red-500/20",
            icon: XCircle,
        },
        "Sin Stock": {
            className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
            icon: Ban,
        },
    }

    const variant = variants[estado]
    const Icon = variant.icon

    return (
        <div className="flex items-center gap-2">
            <Badge className={`${variant.className} font-medium text-xs`}>
                {showIcon && <Icon className="h-3 w-3 mr-1" />}
                {estado}
            </Badge>
            <span className="text-xs text-slate-500 tabular-nums">({stockDisponible})</span>
        </div>
    )
}
