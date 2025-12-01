"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { History, Calendar, Package, ChevronRight, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface TicketHistoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    usuarioId: string | undefined
    onSelectTicket: (ticket: any) => void
}

export function TicketHistoryDialog({ open, onOpenChange, usuarioId, onSelectTicket }: TicketHistoryDialogProps) {
    const [tickets, setTickets] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open && usuarioId) {
            fetchHistory()
        }
    }, [open, usuarioId])

    const fetchHistory = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/inventory/withdrawals/history?usuarioId=${usuarioId}`)
            if (res.ok) {
                const data = await res.json()
                setTickets(data)
            }
        } catch (error) {
            console.error("Error fetching history:", error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completado': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            case 'Pendiente': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            case 'Cancelado': return 'bg-red-500/10 text-red-500 border-red-500/20'
            case 'Expirado': return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <History className="h-5 w-5 text-indigo-400" />
                        Historial de Retiros
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Consulta tus tickets de retiro anteriores.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[400px] pr-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400">
                            <Loader2 className="h-8 w-8 animate-spin mb-2" />
                            <p>Cargando historial...</p>
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-slate-500">
                            <History className="h-12 w-12 mb-2 opacity-20" />
                            <p>No tienes retiros registrados.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="bg-slate-800/50 border border-white/5 rounded-lg p-4 hover:bg-slate-800 transition-colors cursor-pointer group"
                                    onClick={() => {
                                        onSelectTicket(ticket)
                                        onOpenChange(false)
                                    }}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono font-bold text-lg text-indigo-400 tracking-wider">
                                                    {ticket.codigo}
                                                </span>
                                                <Badge variant="outline" className={getStatusColor(ticket.estado)}>
                                                    {ticket.estado}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(ticket.createdAt), "PPP p", { locale: es })}
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                    </div>

                                    <div className="bg-slate-900/50 rounded p-2 text-sm text-slate-300">
                                        <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 uppercase font-semibold">
                                            <Package className="h-3 w-3" />
                                            Items ({ticket.items.length})
                                        </div>
                                        <div className="space-y-1">
                                            {ticket.items.slice(0, 2).map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between text-xs">
                                                    <span>{item.producto.nombre}</span>
                                                    <span className="text-slate-500">x{item.cantidad}</span>
                                                </div>
                                            ))}
                                            {ticket.items.length > 2 && (
                                                <div className="text-xs text-slate-500 italic">
                                                    +{ticket.items.length - 2} más...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
