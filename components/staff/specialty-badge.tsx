import { Badge } from "@/components/ui/badge"
import type { EmployeeSpecialty } from "@/lib/types/staff"

interface SpecialtyBadgeProps {
    especialidad: EmployeeSpecialty
}

export function SpecialtyBadge({ especialidad }: SpecialtyBadgeProps) {
    const colorMap: Record<EmployeeSpecialty, string> = {
        Hardware: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        Software: "bg-purple-500/10 text-purple-300 border-purple-500/20",
        Apple: "bg-slate-500/10 text-slate-300 border-slate-500/20",
        Gaming: "bg-green-500/10 text-green-300 border-green-500/20",
        Redes: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
        Servidores: "bg-orange-500/10 text-orange-300 border-orange-500/20",
        General: "bg-slate-600/10 text-slate-400 border-slate-600/20",
    }

    return (
        <Badge className={`${colorMap[especialidad]} text-[10px] px-1.5 py-0`}>
            {especialidad}
        </Badge>
    )
}
