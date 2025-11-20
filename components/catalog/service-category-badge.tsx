import type { ServiceCategory } from "@/lib/types/catalog"
import { Badge } from "@/components/ui/badge"
import { getCategoryColor } from "@/lib/utils/catalog-helpers"

interface ServiceCategoryBadgeProps {
    categoria: ServiceCategory
}

export function ServiceCategoryBadge({ categoria }: ServiceCategoryBadgeProps) {
    const colorClass = getCategoryColor(categoria)

    return (
        <Badge className={`bg-gradient-to-r ${colorClass} font-medium text-xs border`}>
            {categoria}
        </Badge>
    )
}
