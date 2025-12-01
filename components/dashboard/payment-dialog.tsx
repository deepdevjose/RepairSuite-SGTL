"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

interface PaymentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave?: () => void
    initialOrderId?: string
    initialAmount?: number
}

interface OrdenServicio {
    id: string
    folio: string
    cliente: {
        nombre: string
    }
    equipo: {
        tipo: string
        marca: string
        modelo: string
    }
    costoTotal: number
    anticipo: number
    saldoPendiente: number
    montoTotal?: number
    pagos?: any[]
}

export function PaymentDialog({ open, onOpenChange, onSave, initialOrderId, initialAmount }: PaymentDialogProps) {
    const { toast } = useToast()
    const { user } = useAuth()
    const [ordenes, setOrdenes] = useState<OrdenServicio[]>([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        ordenId: "",
        monto: "",
        metodoPago: "",
        referencia: "",
        notas: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    // Cargar órdenes pendientes de pago
    useEffect(() => {
        if (open) {
            fetchData()
            if (initialOrderId) {
                setFormData(prev => ({ ...prev, ordenId: initialOrderId }))
            }
            if (initialAmount) {
                setFormData(prev => ({ ...prev, monto: initialAmount.toString() }))
            }
        } else {
            // Reset form
            setFormData({
                ordenId: "",
                monto: "",
                metodoPago: "",
                referencia: "",
                notas: "",
            })
            setErrors({})
        }
    }, [open, initialOrderId, initialAmount])

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch orders with pending balance
            const response = await fetch('/api/ordenes')
            if (!response.ok) throw new Error('Error al cargar órdenes')

            const data = await response.json()

            // Process data to ensure fields exist
            const procesadas = data.map((o: any) => {
                const total = parseFloat(o.montoTotal || o.costoTotal || 0)
                const pagado = o.pagos?.reduce((sum: number, p: any) => sum + parseFloat(p.monto), 0) || 0
                // Use DB saldoPendiente if exists and > 0 (to avoid 0/null issues), otherwise calculate
                const saldo = (o.saldoPendiente !== null && o.saldoPendiente !== undefined)
                    ? parseFloat(o.saldoPendiente)
                    : (total - pagado)

                return {
                    ...o,
                    costoTotal: total,
                    anticipo: pagado, // We use 'anticipo' prop for total paid amount in UI
                    saldoPendiente: saldo > 0 ? saldo : 0
                }
            })

            // Filter orders that have a pending balance OR match the initialOrderId
            const pendientes = procesadas.filter((o: any) => o.saldoPendiente > 0.01 || o.id === initialOrderId)

            setOrdenes(pendientes)
        } catch (error) {
            console.error('Error al cargar datos:', error)
            toast({
                title: "Error",
                description: "No se pudieron cargar las órdenes pendientes",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.ordenId) newErrors.ordenId = "Debe seleccionar una orden"
        if (!formData.monto || parseFloat(formData.monto) <= 0) newErrors.monto = "El monto debe ser mayor a 0"
        if (!formData.metodoPago) newErrors.metodoPago = "Debe seleccionar un método de pago"

        // Validate amount doesn't exceed balance
        const orden = ordenes.find(o => o.id === formData.ordenId)
        if (orden) {
            // Allow small margin for float errors
            if (parseFloat(formData.monto) > orden.saldoPendiente + 0.01) {
                newErrors.monto = `El monto no puede exceder el saldo pendiente ($${orden.saldoPendiente})`
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return

        setSubmitting(true)
        try {
            const response = await fetch('/api/pagos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ordenServicioId: formData.ordenId,
                    monto: parseFloat(formData.monto),
                    metodoPago: formData.metodoPago,
                    referencia: formData.referencia || null,
                    notas: formData.notas || null,
                    usuarioId: 'system', // TODO: get from context
                }),
            })

            if (!response.ok) {
                throw new Error('Error al registrar el pago')
            }

            toast({
                title: "Pago registrado",
                description: "El pago se ha registrado exitosamente",
            })

            onSave?.()
            onOpenChange(false)
        } catch (error) {
            console.error('Error al registrar pago:', error)
            toast({
                title: "Error",
                description: "No se pudo registrar el pago",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    const selectedOrder = ordenes.find(o => o.id === formData.ordenId)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Registrar Pago</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="orden" className="text-slate-200">
                            Orden de Servicio *
                        </Label>
                        <Select
                            value={formData.ordenId}
                            onValueChange={(value) => {
                                setFormData({ ...formData, ordenId: value })
                                // Auto-fill amount with pending balance if not set
                                const orden = ordenes.find(o => o.id === value)
                                if (orden && !formData.monto) {
                                    setFormData(prev => ({ ...prev, ordenId: value, monto: orden.saldoPendiente.toString() }))
                                }
                            }}
                            disabled={loading || !!initialOrderId}
                        >
                            <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100">
                                <SelectValue placeholder={loading ? "Cargando..." : "Seleccionar orden"} />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                                {ordenes.length === 0 ? (
                                    <SelectItem value="none" disabled>
                                        No hay órdenes pendientes
                                    </SelectItem>
                                ) : (
                                    ordenes.map((orden) => (
                                        <SelectItem key={orden.id} value={orden.id}>
                                            {orden.folio} - {orden.cliente.nombre} (${orden.saldoPendiente} pendientes)
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {errors.ordenId && <p className="text-xs text-red-400">{errors.ordenId}</p>}
                    </div>

                    {selectedOrder && (
                        <div className="p-3 bg-slate-800/60 rounded-lg text-sm space-y-1 border border-slate-700">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Equipo:</span>
                                <span className="text-slate-200">{selectedOrder.equipo.tipo} {selectedOrder.equipo.marca}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Total:</span>
                                <span className="text-slate-200">${selectedOrder.costoTotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Pagado:</span>
                                <span className="text-emerald-400">${selectedOrder.anticipo}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                                <span className="text-slate-300">Por pagar:</span>
                                <span className="text-yellow-400">${selectedOrder.saldoPendiente}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="monto" className="text-slate-200">
                            Monto a Pagar *
                        </Label>
                        <Input
                            id="monto"
                            type="number"
                            step="0.01"
                            value={formData.monto}
                            onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                            className="bg-slate-800/40 border-slate-700 text-slate-100"
                            placeholder="0.00"
                        />
                        {errors.monto && <p className="text-xs text-red-400">{errors.monto}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="metodoPago" className="text-slate-200">
                            Método de Pago *
                        </Label>
                        <Select
                            value={formData.metodoPago}
                            onValueChange={(value) => setFormData({ ...formData, metodoPago: value })}
                        >
                            <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100">
                                <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                                <SelectItem value="Efectivo">Efectivo</SelectItem>
                                <SelectItem value="Tarjeta" disabled={user?.role === "Recepción"}>Tarjeta</SelectItem>
                                <SelectItem value="Transferencia" disabled={user?.role === "Recepción"}>Transferencia</SelectItem>
                                {user?.role !== "Recepción" && (
                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.metodoPago && <p className="text-xs text-red-400">{errors.metodoPago}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="referencia" className="text-slate-200">
                            Referencia / No. Transacción
                        </Label>
                        <Input
                            id="referencia"
                            value={formData.referencia}
                            onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
                            className="bg-slate-800/40 border-slate-700 text-slate-100"
                            placeholder="Opcional"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notas" className="text-slate-200">
                            Notas
                        </Label>
                        <Input
                            id="notas"
                            value={formData.notas}
                            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                            className="bg-slate-800/40 border-slate-700 text-slate-100"
                            placeholder="Opcional"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="text-slate-400 hover:text-slate-300"
                        disabled={submitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-emerald-600 hover:bg-emerald-500"
                        disabled={submitting || loading}
                    >
                        {submitting ? "Registrando..." : "Registrar Pago"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
