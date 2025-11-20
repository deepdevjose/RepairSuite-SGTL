import { Badge } from "@/components/ui/badge"
import { Clock, Truck, CheckCircle, XCircle } from "lucide-react"

interface OrderStatusBadgeProps {
    estado: "Pendiente" | "En tránsito" | "Recibida" | "Cancelada"
    showIcon?: boolean
}

export function OrderStatusBadge({ estado, showIcon = true }: OrderStatusBadgeProps) {
    const variants = {
        Pendiente: {
            className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
            icon: Clock,
        },
        "En tránsito": {
            className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            icon: Truck,
        },
        Recibida: {
            className: "bg-green-500/10 text-green-400 border-green-500/20",
            icon: CheckCircle,
        },
        Cancelada: {
            className: "bg-red-500/10 text-red-400 border-red-500/20",
            icon: XCircle,
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
