import { Badge } from "@/components/ui/badge"
import type { PaymentStatus } from "@/lib/types/sales"
import { CheckCircle, Clock, AlertCircle, AlertTriangle } from "lucide-react"

interface PaymentStatusBadgeProps {
    estado: PaymentStatus
    showIcon?: boolean
}

export function PaymentStatusBadge({ estado, showIcon = true }: PaymentStatusBadgeProps) {
    const variants = {
        Pagado: {
            className: "bg-green-500/10 text-green-400 border-green-500/20",
            icon: CheckCircle,
        },
        Parcial: {
            className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
            icon: Clock,
        },
        Pendiente: {
            className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
            icon: AlertCircle,
        },
        Vencido: {
            className: "bg-red-500/10 text-red-400 border-red-500/20",
            icon: AlertTriangle,
        },
    }

    const variant = variants[estado]
    const Icon = variant.icon

    return (
        <Badge className={`${variant.className} font-medium text-xs`}>
            {showIcon && <Icon className="h-3 w-3 mr-1" />}
            {estado}
        </Badge>
    )
}
