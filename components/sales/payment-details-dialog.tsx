"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency, formatDate } from "@/lib/utils/sales-helpers"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    CreditCard,
    Calendar,
    User,
    FileText,
    DollarSign,
    Package,
    Clock
} from "lucide-react"

export interface PaymentDetailItem {
    id: string
    folio: string
    tipo: 'venta' | 'orden'
    cliente: string
    descripcion: string
    total: number
    montoPagado: number
    saldoPendiente: number
    estadoPago: string
    fecha: string
    pagos: Array<{
        id?: string
        fecha: string
        monto: number
        metodo: string
        referencia?: string
        registradoPor?: string
    }>
    items?: Array<{
        cantidad: number
        descripcion: string
        precio: number
        total: number
    }>
}

interface PaymentDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: PaymentDetailItem | null
}

export function PaymentDetailsDialog({
    open,
    onOpenChange,
    data
}: PaymentDetailsDialogProps) {
    if (!data) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-4 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <FileText className="h-5 w-5 text-indigo-400" />
                            Detalle de {data.tipo === 'venta' ? 'Venta' : 'Orden de Servicio'}
                        </DialogTitle>
                        <Badge
                            variant="outline"
                            className={`
                ${data.estadoPago === 'Pagado' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                ${data.estadoPago === 'Parcial' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
                ${data.estadoPago === 'Pendiente' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
              `}
                        >
                            {data.estadoPago}
                        </Badge>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                        {/* Header Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Folio</p>
                                <p className="text-lg font-mono font-medium text-slate-200">{data.folio}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Fecha</p>
                                <div className="flex items-center justify-end gap-1.5 text-slate-200">
                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                    <span>{formatDate(data.fecha)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Client & Description */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-800/30 rounded-lg border border-slate-800">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <User className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Cliente</span>
                                </div>
                                <p className="text-sm font-medium text-slate-200 pl-6">{data.cliente}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Package className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">
                                        {data.tipo === 'venta' ? 'Productos' : 'Equipo'}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-slate-200 pl-6">{data.descripcion}</p>
                            </div>
                        </div>

                        {/* Items Table (Only for Sales) */}
                        {data.items && data.items.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                    <Package className="h-4 w-4 text-indigo-400" />
                                    Productos
                                </h3>
                                <div className="rounded-md border border-slate-800 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-900/50">
                                            <TableRow className="border-slate-800 hover:bg-transparent">
                                                <TableHead className="h-9 text-xs font-medium text-slate-400">Descripción</TableHead>
                                                <TableHead className="h-9 text-xs font-medium text-slate-400 text-right">Cant.</TableHead>
                                                <TableHead className="h-9 text-xs font-medium text-slate-400 text-right">Precio</TableHead>
                                                <TableHead className="h-9 text-xs font-medium text-slate-400 text-right">Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.items.map((item, idx) => (
                                                <TableRow key={idx} className="border-slate-800 hover:bg-slate-800/30">
                                                    <TableCell className="py-2 text-xs text-slate-300">{item.descripcion}</TableCell>
                                                    <TableCell className="py-2 text-xs text-slate-300 text-right">{item.cantidad}</TableCell>
                                                    <TableCell className="py-2 text-xs text-slate-300 text-right">{formatCurrency(item.precio)}</TableCell>
                                                    <TableCell className="py-2 text-xs text-slate-300 text-right font-medium">{formatCurrency(item.total)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}

                        {/* Financial Summary */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-400" />
                                Resumen Financiero
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-800">
                                    <p className="text-xs text-slate-500 mb-1">Total</p>
                                    <p className="text-lg font-bold text-slate-200">{formatCurrency(data.total)}</p>
                                </div>
                                <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                                    <p className="text-xs text-green-500/70 mb-1">Pagado</p>
                                    <p className="text-lg font-bold text-green-400">{formatCurrency(data.montoPagado)}</p>
                                </div>
                                <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                                    <p className="text-xs text-red-500/70 mb-1">Pendiente</p>
                                    <p className="text-lg font-bold text-red-400">{formatCurrency(data.saldoPendiente)}</p>
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-slate-800" />

                        {/* Payment History */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-400" />
                                Historial de Pagos
                            </h3>
                            {data.pagos.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 text-sm bg-slate-800/30 rounded-lg border border-slate-800 border-dashed">
                                    No hay pagos registrados
                                </div>
                            ) : (
                                <div className="rounded-md border border-slate-800 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-900/50">
                                            <TableRow className="border-slate-800 hover:bg-transparent">
                                                <TableHead className="h-9 text-xs font-medium text-slate-400">Fecha</TableHead>
                                                <TableHead className="h-9 text-xs font-medium text-slate-400">Método</TableHead>
                                                <TableHead className="h-9 text-xs font-medium text-slate-400">Referencia</TableHead>
                                                <TableHead className="h-9 text-xs font-medium text-slate-400 text-right">Monto</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.pagos.map((pago, idx) => (
                                                <TableRow key={idx} className="border-slate-800 hover:bg-slate-800/30">
                                                    <TableCell className="py-2 text-xs text-slate-300">
                                                        {formatDate(pago.fecha)}
                                                    </TableCell>
                                                    <TableCell className="py-2 text-xs text-slate-300 capitalize">
                                                        <div className="flex items-center gap-1.5">
                                                            <CreditCard className="h-3 w-3 text-slate-500" />
                                                            {pago.metodo}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-2 text-xs text-slate-400 italic">
                                                        {pago.referencia || '-'}
                                                    </TableCell>
                                                    <TableCell className="py-2 text-xs font-medium text-green-400 text-right">
                                                        {formatCurrency(pago.monto)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
