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

export function PaymentDialog({ open, onOpenChange, onSave }: PaymentDialogProps) {
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        folio: "",
        monto: "",
        metodoPago: "",
        referencia: "",
        notas: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (!open) {
            setFormData({
                folio: "",
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

        if (!formData.folio) newErrors.folio = "Debe seleccionar una orden"
        if (!formData.monto || parseFloat(formData.monto) <= 0) newErrors.monto = "El monto debe ser mayor a 0"
        if (!formData.metodoPago) newErrors.metodoPago = "Debe seleccionar un método de pago"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (!validate()) {
            toast({
                title: "Error de validación",
                description: "Por favor completa todos los campos requeridos",
                variant: "destructive",
            })
            return
        }

        const payment = {
            ...formData,
            fecha: new Date().toISOString(),
            id: `PAY-${Date.now()}`,
        }

        console.log("Pago registrado:", payment)
        onSave?.(payment)

        toast({
            title: "Pago registrado exitosamente",
            description: `Monto: $${parseFloat(formData.monto).toLocaleString("es-MX")}`,
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Registrar Pago</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="folio" className="text-slate-200">
                            Orden de Servicio *
                        </Label>
                        <Select value={formData.folio} onValueChange={(value) => setFormData({ ...formData, folio: value })}>
                            <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100">
                                <SelectValue placeholder="Seleccionar orden" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                                <SelectItem value="RS-OS-1024">RS-OS-1024 - Juan Pérez</SelectItem>
                                <SelectItem value="RS-OS-1023">RS-OS-1023 - María González</SelectItem>
                                <SelectItem value="RS-OS-1022">RS-OS-1022 - Pedro Ramírez</SelectItem>
                                <SelectItem value="RS-OS-1021">RS-OS-1021 - Ana López</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.folio && <p className="text-xs text-red-400">{errors.folio}</p>}
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
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-300">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-500">
                        Registrar Pago
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
