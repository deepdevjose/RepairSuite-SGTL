import type { ProductCategory } from "@/lib/types/inventory"
import { Cpu, HardDrive, Battery, Monitor, Keyboard, Plug, Wrench, Package } from "lucide-react"
import Image from "next/image"

interface ProductThumbnailProps {
    categoria: ProductCategory
    imagen?: string
    nombre: string
    size?: "sm" | "md" | "lg"
}

export function ProductThumbnail({ categoria, imagen, nombre, size = "md" }: ProductThumbnailProps) {
    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-16 w-16",
    }

    const iconSizeClasses = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-8 w-8",
    }

    const categoryIcons: Record<ProductCategory, typeof Cpu> = {
        RAM: Cpu,
        SSD: HardDrive,
        HDD: HardDrive,
        Batería: Battery,
        Pantalla: Monitor,
        Teclado: Keyboard,
        Cargador: Plug,
        Servicio: Wrench,
        Otro: Package,
    }

    const categoryColors: Record<ProductCategory, string> = {
        RAM: "from-indigo-500/20 to-purple-500/20 text-indigo-400",
        SSD: "from-blue-500/20 to-cyan-500/20 text-blue-400",
        HDD: "from-slate-500/20 to-gray-500/20 text-slate-400",
        Batería: "from-green-500/20 to-emerald-500/20 text-green-400",
        Pantalla: "from-violet-500/20 to-purple-500/20 text-violet-400",
        Teclado: "from-pink-500/20 to-rose-500/20 text-pink-400",
        Cargador: "from-amber-500/20 to-orange-500/20 text-amber-400",
        Servicio: "from-cyan-500/20 to-teal-500/20 text-cyan-400",
        Otro: "from-gray-500/20 to-slate-500/20 text-gray-400",
    }

    const Icon = categoryIcons[categoria]
    const colorClass = categoryColors[categoria]

    if (imagen) {
        return (
            <div className={`${sizeClasses[size]} rounded-lg overflow-hidden bg-slate-800 border border-slate-700`}>
                <Image src={imagen} alt={nombre} width={64} height={64} className="object-cover w-full h-full" />
            </div>
        )
    }

    return (
        <div
            className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br ${colorClass} border border-white/10 flex items-center justify-center`}
        >
            <Icon className={iconSizeClasses[size]} />
        </div>
    )
}
