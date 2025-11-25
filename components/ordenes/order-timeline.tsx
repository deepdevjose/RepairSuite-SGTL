"use client"

import { Card } from "@/components/ui/card"
import type { ServiceOrderHistory } from "@/lib/types/service-order"
import { OrderStateBadge } from "./order-state-badge"
import { Clock, User, FileText } from "lucide-react"

interface OrderTimelineProps {
    historial: ServiceOrderHistory[]
    className?: string
}

export function OrderTimeline({ historial, className = "" }: OrderTimelineProps) {
    // Sort history by date (newest first)
    const sortedHistory = [...historial].sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    )

    return (
        <Card className={`bg-slate-800/50 border-slate-700/50 p-5 ${className}`}>
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-400" />
                Historial de cambios
            </h3>

            <div className="space-y-4">
                {sortedHistory.map((entry, index) => {
                    const isFirst = index === 0
                    const date = new Date(entry.fecha)
                    const formattedDate = date.toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })
                    const formattedTime = date.toLocaleTimeString("es-MX", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })

                    return (
                        <div key={entry.id} className="relative pl-6 pb-4 border-l-2 border-slate-700/50 last:border-l-0 last:pb-0">
                            {/* Timeline dot */}
                            <div
                                className={`absolute left-0 top-1 -ml-[9px] h-4 w-4 rounded-full border-2 ${isFirst
                                        ? "bg-indigo-500 border-indigo-400 shadow-lg shadow-indigo-500/50"
                                        : "bg-slate-700 border-slate-600"
                                    }`}
                            />

                            <div className="space-y-2">
                                {/* State change */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {entry.estadoAnterior && (
                                        <>
                                            <OrderStateBadge estado={entry.estadoAnterior} showIcon={false} />
                                            <span className="text-slate-500 text-sm">→</span>
                                        </>
                                    )}
                                    <OrderStateBadge estado={entry.estadoNuevo} />
                                </div>

                                {/* User and date */}
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        <span>{entry.usuario}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>
                                            {formattedDate} {formattedTime}
                                        </span>
                                    </div>
                                </div>

                                {/* Notes */}
                                {entry.notas && (
                                    <div className="flex items-start gap-2 mt-2">
                                        <FileText className="h-3.5 w-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-slate-300">{entry.notas}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {sortedHistory.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No hay historial disponible</p>
            )}
        </Card>
    )
}
