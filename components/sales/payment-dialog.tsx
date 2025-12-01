"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import type { SaleDetail, PaymentMethod, MixedPaymentBreakdown } from "@/lib/types/sales"
import { formatCurrency, validateMixedPayment } from "@/lib/utils/sales-helpers"
import { AlertCircle, DollarSign, Upload } from "lucide-react"

interface PaymentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    sale: SaleDetail | null
    onPaymentRegistered?: () => void
}

export function PaymentDialog({ open, onOpenChange, sale, onPaymentRegistered }: PaymentDialogProps) {
    const { toast } = useToast()
    const { user } = useAuth()
    const [metodoPago, setMetodoPago] = useState<PaymentMethod>("Efectivo")
    const [monto, setMonto] = useState("")
    const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0])
    const [referencia, setReferencia] = useState("")
    const [notas, setNotas] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Mixed payment breakdown
    const [mixedPayment, setMixedPayment] = useState<MixedPaymentBreakdown>({
        efectivo: 0,
        tarjeta: 0,
        transferencia: 0,
        mercadoPago: 0,
        deposito: 0,
    })

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (!open) {
            setMetodoPago("Efectivo")
            setMonto("")
            setFecha(new Date().toISOString().split("T")[0])
            setReferencia("")
            setNotas("")
            setMixedPayment({
                efectivo: 0,
                tarjeta: 0,
                transferencia: 0,
                mercadoPago: 0,
                deposito: 0,
            })
            setErrors({})
        }
    }, [open])

    // Calculate total for mixed payment
    const mixedTotal =
        mixedPayment.efectivo +
        mixedPayment.tarjeta +
        mixedPayment.transferencia +
        mixedPayment.mercadoPago +
        mixedPayment.deposito

    // Validate form
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (metodoPago === "Mixto") {
            // Validate mixed payment
            const targetAmount = parseFloat(monto) || 0
            if (targetAmount <= 0) {
                newErrors.monto = "El monto debe ser mayor a 0"
            } else if (!validateMixedPayment(
                mixedPayment.efectivo,
                mixedPayment.tarjeta,
                mixedPayment.transferencia,
                mixedPayment.mercadoPago,
                mixedPayment.deposito,
                targetAmount
            )) {
                newErrors.mixedPayment = `La suma debe ser exactamente ${formatCurrency(targetAmount)}`
            }
        } else {
            // Validate simple payment
            const amount = parseFloat(monto)
            if (!monto || amount <= 0) {
                newErrors.monto = "El monto debe ser mayor a 0"
            } else if (sale && amount > sale.saldo) {
                newErrors.monto = `El monto no puede exceder el saldo de ${formatCurrency(sale.saldo)}`
            }
        }

        if (!fecha) {
            newErrors.fecha = "La fecha es requerida"
        } else {
            const fechaPago = new Date(fecha)
            const hoy = new Date()
            if (fechaPago > hoy) {
                newErrors.fecha = "La fecha no puede ser futura"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle submit
    const handleSubmit = () => {
        if (!validate()) return

        // Here you would normally save the payment to the backend
        toast({
            title: "Pago registrado",
            description: `Se registró un pago de ${formatCurrency(parseFloat(monto))} correctamente.`,
        })

        onPaymentRegistered?.()
        onOpenChange(false)
    }

    if (!sale) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-slate-100 text-xl">Registrar Pago</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Order Info */}
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-slate-500 text-xs">Cliente</div>
                                <div className="font-medium text-slate-200">{sale.cliente}</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs">Orden</div>
                                <div className="font-mono text-indigo-400">{sale.folioOS}</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs">Equipo</div>
                                <div className="font-medium text-slate-200">{sale.equipo}</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs">Sucursal</div>
                                <div className="font-medium text-slate-200">{sale.sucursal}</div>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-700 grid grid-cols-3 gap-4">
                            <div>
                                <div className="text-slate-500 text-xs">Total</div>
                                <div className="text-lg font-bold text-slate-100">{formatCurrency(sale.total)}</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs">Pagado</div>
                                <div className="text-lg font-bold text-green-400">{formatCurrency(sale.pagado)}</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs">Saldo</div>
                                <div className="text-2xl font-bold text-yellow-400">{formatCurrency(sale.saldo)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="space-y-4">
                        {/* Amount */}
                        <div className="space-y-2">
                            <Label htmlFor="monto" className="text-slate-200">
                                Monto a pagar <span className="text-red-400">*</span>
                            </Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                    id="monto"
                                    type="number"
                                    step="0.01"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    className={`pl-10 bg-slate-800 border-slate-700 text-slate-100 ${errors.monto ? "border-red-500" : ""
                                        }`}
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.monto && (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.monto}
                                </p>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-2">
                            <Label htmlFor="metodoPago" className="text-slate-200">
                                Método de pago <span className="text-red-400">*</span>
                            </Label>
                            <Select value={metodoPago} onValueChange={(value: PaymentMethod) => setMetodoPago(value)}>
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    <SelectItem value="Efectivo" className="text-slate-300">
                                        Efectivo
                                    </SelectItem>
                                    <SelectItem value="Tarjeta" className="text-slate-300" disabled={user?.role === "Recepción"}>
                                        Tarjeta
                                    </SelectItem>
                                    <SelectItem value="Transferencia" className="text-slate-300" disabled={user?.role === "Recepción"}>
                                        Transferencia
                                    </SelectItem>
                                    <SelectItem value="MercadoPago" className="text-slate-300">
                                        MercadoPago
                                    </SelectItem>
                                    <SelectItem value="Depósito" className="text-slate-300">
                                        Depósito
                                    </SelectItem>
                                    <SelectItem value="Mixto" className="text-slate-300">
                                        Pago Mixto
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Mixed Payment Breakdown */}
                        {metodoPago === "Mixto" && (
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-slate-200 font-semibold">Desglose de Pago Mixto</Label>
                                    <div className="text-sm">
                                        <span className="text-slate-500">Total: </span>
                                        <span className={`font-bold ${mixedTotal === parseFloat(monto || "0") ? "text-green-400" : "text-yellow-400"}`}>
                                            {formatCurrency(mixedTotal)}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-slate-300 text-xs">Efectivo</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={mixedPayment.efectivo || ""}
                                            onChange={(e) =>
                                                setMixedPayment({ ...mixedPayment, efectivo: parseFloat(e.target.value) || 0 })
                                            }
                                            className="bg-slate-800 border-slate-700 text-slate-100"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-slate-300 text-xs">Tarjeta</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={mixedPayment.tarjeta || ""}
                                            onChange={(e) =>
                                                setMixedPayment({ ...mixedPayment, tarjeta: parseFloat(e.target.value) || 0 })
                                            }
                                            className="bg-slate-800 border-slate-700 text-slate-100"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-slate-300 text-xs">Transferencia</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={mixedPayment.transferencia || ""}
                                            onChange={(e) =>
                                                setMixedPayment({ ...mixedPayment, transferencia: parseFloat(e.target.value) || 0 })
                                            }
                                            className="bg-slate-800 border-slate-700 text-slate-100"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-slate-300 text-xs">MercadoPago</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={mixedPayment.mercadoPago || ""}
                                            onChange={(e) =>
                                                setMixedPayment({ ...mixedPayment, mercadoPago: parseFloat(e.target.value) || 0 })
                                            }
                                            className="bg-slate-800 border-slate-700 text-slate-100"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-slate-300 text-xs">Depósito</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={mixedPayment.deposito || ""}
                                            onChange={(e) =>
                                                setMixedPayment({ ...mixedPayment, deposito: parseFloat(e.target.value) || 0 })
                                            }
                                            className="bg-slate-800 border-slate-700 text-slate-100"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {errors.mixedPayment && (
                                    <p className="text-xs text-red-400 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.mixedPayment}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Date */}
                        <div className="space-y-2">
                            <Label htmlFor="fecha" className="text-slate-200">
                                Fecha del pago <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="fecha"
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.fecha ? "border-red-500" : ""}`}
                            />
                            {errors.fecha && (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.fecha}
                                </p>
                            )}
                        </div>

                        {/* Reference */}
                        <div className="space-y-2">
                            <Label htmlFor="referencia" className="text-slate-200">
                                Referencia / Folio
                            </Label>
                            <Input
                                id="referencia"
                                value={referencia}
                                onChange={(e) => setReferencia(e.target.value)}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                                placeholder="Número de transacción, folio, etc."
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notas" className="text-slate-200">
                                Notas
                            </Label>
                            <Textarea
                                id="notas"
                                value={notas}
                                onChange={(e) => setNotas(e.target.value)}
                                className="bg-slate-800 border-slate-700 text-slate-100 min-h-[80px]"
                                placeholder="Comentarios adicionales..."
                            />
                        </div>

                        {/* Comprobante Upload (placeholder) */}
                        <div className="space-y-2">
                            <Label className="text-slate-200">Comprobante (opcional)</Label>
                            <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center hover:border-slate-600 transition-colors cursor-pointer">
                                <Upload className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                                <p className="text-sm text-slate-400">Arrastra un archivo o haz clic para seleccionar</p>
                                <p className="text-xs text-slate-600 mt-1">PDF o imagen (máx. 5MB)</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-500 text-white">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Registrar Pago
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
