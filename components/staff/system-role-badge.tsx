import { Badge } from "@/components/ui/badge"
import type { SystemRole } from "@/lib/types/staff"
import { Shield, Eye, Wrench, UserCircle } from "lucide-react"

interface SystemRoleBadgeProps {
    rol: SystemRole
}

export function SystemRoleBadge({ rol }: SystemRoleBadgeProps) {
    const config = {
        Administrador: {
            icon: Shield,
            className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        },
        Recepción: {
            icon: UserCircle,
            className: "bg-green-500/10 text-green-400 border-green-500/20",
        },
        Técnico: {
            icon: Wrench,
            className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        },
        "Solo Lectura": {
            icon: Eye,
            className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        },
    }

    // Normalize role to handle potential database inconsistencies (e.g. missing accents)
    const normalizedRol = (rol as string) === "Recepcion" ? "Recepción" : rol
    const roleConfig = config[normalizedRol as keyof typeof config] || {
        icon: UserCircle,
        className: "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }

    const { icon: Icon, className } = roleConfig

    return (
        <Badge className={`${className} text-xs`}>
            <Icon className="h-3 w-3 mr-1" />
            {rol}
        </Badge>
    )
}
