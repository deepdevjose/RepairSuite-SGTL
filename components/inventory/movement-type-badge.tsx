import type { MovementType } from "@/lib/types/inventory"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, ArrowLeftRight, Lock, Settings, Trash2 } from "lucide-react"

interface MovementTypeBadgeProps {
    tipo: MovementType
    showIcon?: boolean
}

export function MovementTypeBadge({ tipo, showIcon = true }: MovementTypeBadgeProps) {
    const variants: Record<
        MovementType,
        {
            className: string
            icon: typeof Plus
            label: string
        }
    > = {
        Entrada: {
            className: "bg-green-500/10 text-green-400 border-green-500/20",
            icon: Plus,
            label: "Entrada",
        },
        Salida: {
            className: "bg-red-500/10 text-red-400 border-red-500/20",
            icon: Minus,
            label: "Salida",
        },
        Transferencia: {
            className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            icon: ArrowLeftRight,
            label: "Transferencia",
        },
        "Reserva OS": {
            className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            icon: Lock,
            label: "Reserva OS",
        },
        Ajuste: {
            className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
            icon: Settings,
            label: "Ajuste",
        },
        Merma: {
            className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
            icon: Trash2,
            label: "Merma",
        },
    }

    const variant = variants[tipo]
    const Icon = variant.icon

    return (
        <Badge className={`${variant.className} font-medium text-xs`}>
            {showIcon && <Icon className="h-3 w-3 mr-1" />}
            {variant.label}
        </Badge>
    )
}
