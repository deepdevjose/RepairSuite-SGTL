"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OrderStateBadge } from "./order-state-badge"
import type { ServiceOrder } from "@/lib/types/service-order"
import {
    User,
    Package,
    Wrench,
    Building2,
    Clock,
    DollarSign,
    FileText,
    Shield,
    Edit,
    Printer,
    CreditCard
} from 'lucide-react'

interface OrderDetailsDialogProps {
    order: ServiceOrder | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
    if (!order) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-slate-100 text-2xl flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                            <FileText className="h-6 w-6 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <span className="font-mono">{order.folio}</span>
                                {order.esGarantia && (
                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                        <Shield className="h-3 w-3 mr-1" />
                                        Garantía
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        <OrderStateBadge estado={order.estado} />
                        <span className="text-xs text-slate-500">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Actualizado: {new Date(order.ultimaActualizacion).toLocaleString("es-MX", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                    </div>

                    {/* Client and Equipment Information */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="bg-slate-800/50 border-slate-700/50 p-5">
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-indigo-400" />
                                Información del cliente
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Cliente</p>
                                    <p className="text-sm text-slate-200">{order.clienteNombre}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-slate-800/50 border-slate-700/50 p-5">
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <Package className="h-5 w-5 text-indigo-400" />
                                Equipo
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Modelo</p>
                                    <p className="text-sm text-slate-200">{order.equipoTipo}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Marca</p>
                                    <p className="text-sm text-slate-200">{order.equipoMarca}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Service Information */}
                    <Card className="bg-slate-800/50 border-slate-700/50 p-5">
                        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                            <Wrench className="h-5 w-5 text-indigo-400" />
                            Información del servicio
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Técnico asignado</p>
                                <p className="text-sm text-slate-200 flex items-center gap-2 mt-1">
                                    <User className="h-4 w-4 text-slate-400" />
                                    {order.tecnicoAsignadoNombre || "No asignado"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Sucursal</p>
                                <p className="text-sm text-slate-200 flex items-center gap-2 mt-1">
                                    <Building2 className="h-4 w-4 text-slate-400" />
                                    {order.sucursal}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Diagnosis */}
                    <Card className="bg-slate-800/50 border-slate-700/50 p-5">
                        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-indigo-400" />
                            Diagnóstico
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            {order.diagnostico?.problema || order.problemaReportado}
                        </p>
                    </Card>

                    {/* Total Estimated */}
                    <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-emerald-400" />
                                <h3 className="text-lg font-semibold text-slate-100">Total estimado</h3>
                            </div>
                            <div className="text-right">
                                {(order.costoDiagnostico + order.costoReparacion) > 0 ? (
                                    <p className="text-2xl font-bold text-emerald-400">
                                        ${(order.costoDiagnostico + order.costoReparacion).toLocaleString()}
                                    </p>
                                ) : (
                                    <p className="text-lg text-slate-500">Pendiente</p>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800/50">
                        <Button
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
                            onClick={() => {
                                console.log('[OrderDetails] Editar orden:', order.folio)
                            }}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar orden
                        </Button>
                        <Button
                            variant="outline"
                            className="border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
                            onClick={() => {
                                console.log('[OrderDetails] Agregar pago:', order.folio)
                            }}
                        >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Agregar pago
                        </Button>
                        <Button
                            variant="outline"
                            className="border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
                            onClick={() => {
                                console.log('[OrderDetails] Imprimir orden:', order.folio)
                            }}
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Imprimir
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
