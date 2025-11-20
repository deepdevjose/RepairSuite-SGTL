import { Badge } from "@/components/ui/badge"
import type { EmployeeRole } from "@/lib/types/staff"
import { Wrench, UserCircle, Shield, Crown, Briefcase, Users } from "lucide-react"

interface EmployeeRoleBadgeProps {
    rol: EmployeeRole
}

export function EmployeeRoleBadge({ rol }: EmployeeRoleBadgeProps) {
    const config = {
        Técnico: {
            icon: Wrench,
            className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        },
        Recepción: {
            icon: UserCircle,
            className: "bg-green-500/10 text-green-400 border-green-500/20",
        },
        Administrador: {
            icon: Shield,
            className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        },
        Gerente: {
            icon: Briefcase,
            className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        },
        Dueño: {
            icon: Crown,
            className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        },
        Auxiliar: {
            icon: Users,
            className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        },
    }

    const { icon: Icon, className } = config[rol]

    return (
        <Badge className={`${className} text-xs`}>
            <Icon className="h-3 w-3 mr-1" />
            {rol}
        </Badge>
    )
}
