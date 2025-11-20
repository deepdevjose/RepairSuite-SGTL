import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MarginIndicatorProps {
    margen: number
    showPercentage?: boolean
}

export function MarginIndicator({ margen, showPercentage = true }: MarginIndicatorProps) {
    const getColor = () => {
        if (margen >= 30) return "text-green-400"
        if (margen >= 20) return "text-yellow-400"
        if (margen >= 10) return "text-orange-400"
        return "text-red-400"
    }

    const getIcon = () => {
        if (margen >= 25) return TrendingUp
        if (margen >= 15) return Minus
        return TrendingDown
    }

    const Icon = getIcon()
    const colorClass = getColor()

    return (
        <div className={`flex items-center gap-1 ${colorClass} font-semibold text-xs`}>
            <Icon className="h-3 w-3" />
            {showPercentage && <span>{margen.toFixed(1)}%</span>}
        </div>
    )
}
