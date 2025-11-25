"use client"

import { Badge } from "@/components/ui/badge"
import type { ServiceOrderState } from "@/lib/types/service-order"
import { STATE_METADATA } from "@/lib/utils/state-machine"
import {
    Clock,
    Search,
    CheckCircle,
    AlertCircle,
    UserCheck,
    Wrench,
    Check,
    Package,
    Inbox,
    CheckCircle2,
    XCircle,
} from "lucide-react"

interface OrderStateBadgeProps {
    estado: ServiceOrderState
    showIcon?: boolean
    className?: string
}

const iconMap = {
    clock: Clock,
    search: Search,
    "check-circle": CheckCircle,
    "alert-circle": AlertCircle,
    "user-check": UserCheck,
    wrench: Wrench,
    check: Check,
    package: Package,
    inbox: Inbox,
    "check-circle-2": CheckCircle2,
    "x-circle": XCircle,
}

const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    lime: "bg-lime-500/10 text-lime-400 border-lime-500/20",
    teal: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
}

export function OrderStateBadge({ estado, showIcon = true, className = "" }: OrderStateBadgeProps) {
    const metadata = STATE_METADATA[estado]

    if (!metadata) {
        return (
            <Badge variant="outline" className="border-slate-700 text-slate-400">
                {estado}
            </Badge>
        )
    }

    const IconComponent = iconMap[metadata.icon as keyof typeof iconMap]
    const colorClass = colorMap[metadata.color] || colorMap.blue

    return (
        <Badge
            variant="outline"
            className={`${colorClass} border ${className}`}
            title={metadata.description}
        >
            {showIcon && IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
            {metadata.label}
        </Badge>
    )
}
