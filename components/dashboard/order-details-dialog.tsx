"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { BadgeStatus } from "@/components/badge-status"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Wrench, Package, DollarSign, Clock, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface OrderDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onStatusChange?: (newStatus: string) => void
    order: {
        folio: string
        cliente: string
        equipo: string
        estado: string
        tecnico: string
        fecha: string
        importe: number
        tiempoReparacion: string
    } | null
}

export function OrderDetailsDialog({ open, onOpenChange, onStatusChange, order }: OrderDetailsDialogProps) {
    const { toast } = useToast()
    const [selectedStatus, setSelectedStatus] = useState(order?.estado || "")

    if (!order) return null

    const handleStatusChange = () => {
        if (selectedStatus === order.estado) {
            toast({
                title: "Sin cambios",
                description: "El estado seleccionado es el mismo que el actual",
                variant: "destructive",
            })
            return
        }

        onStatusChange?.(selectedStatus)
        toast({
            title: "Estado actualizado",
            description: `El estado de la orden ${order.folio} ha sido cambiado a: ${selectedStatus}`,
        })
    }

    const estadosDisponibles = [
        "En diagnóstico",
        "En espera de aprobación",
        "En proceso",
        "Listo para entrega",
        "Completada",
        "Cancelada",
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Package className="h-5 w-5 text-indigo-400" />
                        Detalles de Orden
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-2xl font-bold text-indigo-400 font-mono">{order.folio}</p>
                            <p className="text-sm text-slate-400 mt-1">Orden de Servicio</p>
                        </div>
                        <BadgeStatus status={order.estado} />
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Cambio de Estado */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Cambiar Estado
                        </h3>
                        <div className="flex items-center gap-3 pl-6">
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="flex-1 bg-slate-800/40 border-slate-700 text-slate-100">
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10">
                                    {estadosDisponibles.map((estado) => (
                                        <SelectItem 
                                            key={estado} 
                                            value={estado}
                                            className="text-slate-300"
                                        >
                                            {estado}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={handleStatusChange}
                                disabled={selectedStatus === order.estado}
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Actualizar
                            </Button>
                        </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Cliente */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Información del Cliente
                        </h3>
                        <div className="grid grid-cols-2 gap-4 pl-6">
                            <div>
                                <p className="text-xs text-slate-500">Nombre</p>
                                <p className="text-sm text-slate-200">{order.cliente}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Teléfono</p>
                                <p className="text-sm text-slate-200">55 1234 5678</p>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Equipo */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Equipo
                        </h3>
                        <div className="grid grid-cols-2 gap-4 pl-6">
                            <div>
                                <p className="text-xs text-slate-500">Tipo</p>
                                <p className="text-sm text-slate-200">{order.equipo}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Marca/Modelo</p>
                                <p className="text-sm text-slate-200">HP Pavilion 15</p>
                            </div>
                        </div>
                        <div className="pl-6">
                            <p className="text-xs text-slate-500">Problema Reportado</p>
                            <p className="text-sm text-slate-200">No enciende, posible falla en fuente de poder</p>
                        </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Asignación */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <Wrench className="h-4 w-4" />
                            Asignación
                        </h3>
                        <div className="pl-6">
                            <div>
                                <p className="text-xs text-slate-500">Técnico</p>
                                <p className="text-sm text-slate-200">{order.tecnico}</p>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Información Financiera */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Información Financiera
                        </h3>
                        <div className="grid grid-cols-3 gap-4 pl-6">
                            <div>
                                <p className="text-xs text-slate-500">Importe Total</p>
                                <p className="text-lg font-semibold text-emerald-400">
                                    ${order.importe.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Anticipo</p>
                                <p className="text-sm text-slate-200">$500.00</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Saldo</p>
                                <p className="text-sm text-amber-400">
                                    ${(order.importe - 500).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Tiempos */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Tiempos
                        </h3>
                        <div className="grid grid-cols-3 gap-4 pl-6">
                            <div>
                                <p className="text-xs text-slate-500">Fecha Ingreso</p>
                                <p className="text-sm text-slate-200">{order.fecha}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Tiempo Reparación</p>
                                <p className="text-sm text-slate-200">{order.tiempoReparacion}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Fecha Estimada</p>
                                <p className="text-sm text-slate-200">2025-01-12</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
