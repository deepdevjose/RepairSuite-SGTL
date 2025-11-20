import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { formatTimeEstimate } from "@/lib/utils/catalog-helpers"

interface TimeEstimateBadgeProps {
    minutos: number
    showIcon?: boolean
}

export function TimeEstimateBadge({ minutos, showIcon = true }: TimeEstimateBadgeProps) {
    return (
        <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-medium text-xs">
            {showIcon && <Clock className="h-3 w-3 mr-1" />}
            {formatTimeEstimate(minutos)}
        </Badge>
    )
}
