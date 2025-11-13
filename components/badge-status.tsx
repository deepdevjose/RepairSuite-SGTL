import { cn } from "@/lib/utils"

interface BadgeStatusProps {
  status: string
  className?: string
}

const statusColors: Record<string, string> = {
  // Service Order statuses
  "En diagnóstico": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "En espera de aprobación": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "En proceso": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Listo para entrega": "bg-green-500/10 text-green-400 border-green-500/20",
  "Completada y pagada": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Rechazada: "bg-red-500/10 text-red-400 border-red-500/20",
  Cancelada: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  // Inventory statuses
  OK: "bg-green-500/10 text-green-400 border-green-500/20",
  Bajo: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Crítico: "bg-red-500/10 text-red-400 border-red-500/20",
  // Payment statuses
  Pagado: "bg-green-500/10 text-green-400 border-green-500/20",
  Pendiente: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Parcial: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  // General
  Activo: "bg-green-500/10 text-green-400 border-green-500/20",
  Inactivo: "bg-slate-500/10 text-slate-400 border-slate-500/20",
}

export function BadgeStatus({ status, className }: BadgeStatusProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold",
        statusColors[status] || "bg-slate-500/10 text-slate-400 border-slate-500/20",
        className,
      )}
    >
      {status}
    </span>
  )
}
