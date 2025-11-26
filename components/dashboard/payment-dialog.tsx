"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface PaymentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave?: (payment: any) => void
}

interface OrdenServicio {
    id: string
    folio: string
    cliente: {
        nombre: string
    }
    montoTotal: number | null
    saldoPendiente: number | null
    estado: string
}

export function PaymentDialog({ open, onOpenChange, onSave }: PaymentDialogProps) {
    const { toast } = useToast()
    const [ordenes, setOrdenes] = useState<OrdenServicio[]>([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    
    const [formData, setFormData] = useState({
        ordenServicioId: "",
        monto: "",
        metodoPago: "",
        referencia: "",
        notas: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    // Cargar órdenes pendientes de pago
    useEffect(() => {
        if (open) {
            fetchOrdenes()
        }
    }, [open])

    const fetchOrdenes = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/ordenes')
            if (!response.ok) throw new Error('Error al cargar órdenes')
            
            const data = await response.json()
            // Filtrar órdenes que no estén pagadas completamente o canceladas
            const ordenesPendientes = data.filter((orden: OrdenServicio) => 
                orden.estado !== 'Pagado y entregado' &&
                orden.estado !== 'Cancelada'
            )
            setOrdenes(ordenesPendientes)
        } catch (error) {
            console.error('Error al cargar órdenes:', error)
            toast({
                title: "Error",
                description: "No se pudieron cargar las órdenes de servicio",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!open) {
            setFormData({
                ordenServicioId: "",
                monto: "",
                metodoPago: "",
                referencia: "",
                notas: "",
            })
            setErrors({})
        }
    }, [open])

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.ordenServicioId) newErrors.ordenServicioId = "Debe seleccionar una orden"
        if (!formData.monto || parseFloat(formData.monto) <= 0) newErrors.monto = "El monto debe ser mayor a 0"
        if (!formData.metodoPago) newErrors.metodoPago = "Debe seleccionar un método de pago"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) {
            toast({
                title: "Error de validación",
                description: "Por favor completa todos los campos requeridos",
                variant: "destructive",
            })
            return
        }

        setSubmitting(true)
        try {
            const response = await fetch('/api/pagos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ordenServicioId: formData.ordenServicioId,
                    monto: parseFloat(formData.monto),
                    metodoPago: formData.metodoPago,
                    referencia: formData.referencia || null,
                    notas: formData.notas || null,
                }),
            })

            if (!response.ok) {
                throw new Error('Error al registrar el pago')
            }

            const pago = await response.json()

            toast({
                title: "Pago registrado exitosamente",
                description: `Monto: $${parseFloat(formData.monto).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
            })

            onSave?.(pago)
            onOpenChange(false)
        } catch (error) {
            console.error('Error al registrar pago:', error)
            toast({
                title: "Error",
                description: "No se pudo registrar el pago. Intenta nuevamente.",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

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
                            value={formData.ordenServicioId} 
                            onValueChange={(value) => {
                                const ordenSeleccionada = ordenes.find(o => o.id === value)
                                if (ordenSeleccionada) {
                                    // Auto-llenar monto con el saldo pendiente, o dejar en blanco si no hay monto
                                    const montoPendiente = ordenSeleccionada.saldoPendiente ?? ordenSeleccionada.montoTotal ?? 0
                                    setFormData(prev => ({ 
                                        ...prev, 
                                        ordenServicioId: value,
                                        monto: montoPendiente > 0 ? montoPendiente.toString() : '' 
                                    }))
                                } else {
                                    setFormData({ ...formData, ordenServicioId: value })
                                }
                            }}
                            disabled={loading}
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
                                    ordenes.map((orden) => {
                                        const saldoPendiente = orden.saldoPendiente ?? orden.montoTotal
                                        const montoTexto = saldoPendiente 
                                            ? `$${saldoPendiente.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`
                                            : '(Sin cotizar)'
                                        return (
                                            <SelectItem key={orden.id} value={orden.id}>
                                                {orden.folio} - {orden.cliente.nombre} - {montoTexto}
                                            </SelectItem>
                                        )
                                    })
                                )}
                            </SelectContent>
                        </Select>
                        {errors.ordenServicioId && <p className="text-xs text-red-400">{errors.ordenServicioId}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="monto" className="text-slate-200">
                                Monto *
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
                                    <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.metodoPago && <p className="text-xs text-red-400">{errors.metodoPago}</p>}
                        </div>
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
