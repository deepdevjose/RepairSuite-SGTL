import { Badge } from "@/components/ui/badge"
import type { EmployeeStatus } from "@/lib/types/staff"
import { CheckCircle, XCircle, AlertCircle, Palmtree } from "lucide-react"

interface EmployeeStatusBadgeProps {
    estado: EmployeeStatus
}

export function EmployeeStatusBadge({ estado }: EmployeeStatusBadgeProps) {
    const config = {
        Activo: {
            icon: CheckCircle,
            className: "bg-green-500/10 text-green-400 border-green-500/20",
        },
        Inactivo: {
            icon: XCircle,
            className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        },
        Suspendido: {
            icon: AlertCircle,
            className: "bg-red-500/10 text-red-400 border-red-500/20",
        },
        Vacaciones: {
            icon: Palmtree,
            className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        },
    }

    const { icon: Icon, className } = config[estado]

    return (
        <Badge className={`${className} text-xs`}>
            <Icon className="h-3 w-3 mr-1" />
            {estado}
        </Badge>
    )
}
