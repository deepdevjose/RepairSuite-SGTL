import { Badge } from "@/components/ui/badge"

interface PaymentTermsBadgeProps {
    condiciones: string
}

export function PaymentTermsBadge({ condiciones }: PaymentTermsBadgeProps) {
    // Normalize the payment terms
    const normalized = condiciones?.trim() || "Contado"

    const variants: Record<string, { className: string }> = {
        "Contado": {
            className: "bg-green-500/10 text-green-400 border-green-500/20",
        },
        "15 días": {
            className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        },
        "20 días": {
            className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        },
        "30 días": {
            className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        },
        "Crédito especial": {
            className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        },
    }

    const variant = variants[normalized] || variants["Contado"]

    return (
        <Badge className={`${variant.className} font-medium text-xs`}>
            {condiciones}
        </Badge>
    )
}
