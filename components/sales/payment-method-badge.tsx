import { Badge } from "@/components/ui/badge"
import type { PaymentMethod } from "@/lib/types/sales"
import { Banknote, CreditCard, ArrowRightLeft, Smartphone, Building2, Shuffle } from "lucide-react"

interface PaymentMethodBadgeProps {
    metodo: PaymentMethod
    showIcon?: boolean
}

export function PaymentMethodBadge({ metodo, showIcon = true }: PaymentMethodBadgeProps) {
    const variants = {
        Efectivo: {
            className: "bg-green-500/10 text-green-400 border-green-500/20",
            icon: Banknote,
        },
        Tarjeta: {
            className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            icon: CreditCard,
        },
        Transferencia: {
            className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
            icon: ArrowRightLeft,
        },
        MercadoPago: {
            className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
            icon: Smartphone,
        },
        Depósito: {
            className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            icon: Building2,
        },
        Mixto: {
            className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
            icon: Shuffle,
        },
    }

    const variant = variants[metodo]
    const Icon = variant.icon

    return (
        <Badge className={`${variant.className} font-medium text-xs`}>
            {showIcon && <Icon className="h-3 w-3 mr-1" />}
            {metodo}
        </Badge>
    )
}
