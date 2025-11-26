"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { FileText, DollarSign, Clock } from "lucide-react"

interface DiagnosisDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    ordenId: string
    ordenFolio: string
    onSubmit?: (diagnosis: any) => void
}

export function DiagnosisDialog({
    open,
    onOpenChange,
    ordenId,
    ordenFolio,
    onSubmit,
}: DiagnosisDialogProps) {
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        problema: "",
        solucion: "",
        costoEstimado: "",
        tiempoEstimado: "",
        materialesNecesarios: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.problema.trim()) {
            newErrors.problema = "La descripción del problema es requerida"
        }
        if (!formData.solucion.trim()) {
            newErrors.solucion = "La solución propuesta es requerida"
        }
        if (!formData.costoEstimado || Number.parseFloat(formData.costoEstimado) <= 0) {
            newErrors.costoEstimado = "El costo estimado debe ser mayor a 0"
        }
        if (!formData.tiempoEstimado.trim()) {
            newErrors.tiempoEstimado = "El tiempo estimado es requerido"
        }

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

        const diagnosis = {
            problema: formData.problema,
            solucion: formData.solucion,
            costoEstimado: Number.parseFloat(formData.costoEstimado),
            tiempoEstimado: formData.tiempoEstimado,
            materialesNecesarios: formData.materialesNecesarios
                ? formData.materialesNecesarios.split("\n").filter((m) => m.trim())
                : [],
        }

        console.log("[DiagnosisDialog] Diagnóstico completado:", diagnosis)
        onSubmit?.(diagnosis)

        toast({
            title: "Diagnóstico guardado",
            description: "El diagnóstico ha sido registrado exitosamente",
        })

        // Reset form
        setFormData({
            problema: "",
            solucion: "",
            costoEstimado: "",
            tiempoEstimado: "",
            materialesNecesarios: "",
        })
        setErrors({})
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-400" />
                        Completar Diagnóstico
                    </DialogTitle>
                    <p className="text-sm text-slate-400 mt-1">Orden: {ordenFolio}</p>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Problem Description */}
                    <div className="space-y-2">
                        <Label htmlFor="problema" className="text-slate-200">
                            Descripción detallada del problema *
                        </Label>
                        <Textarea
                            id="problema"
                            value={formData.problema}
                            onChange={(e) => setFormData({ ...formData, problema: e.target.value })}
                            placeholder="Describe el problema encontrado durante el diagnóstico..."
                            className="bg-slate-800/40 border-slate-700 text-slate-100 min-h-[100px]"
                        />
                        {errors.problema && <p className="text-xs text-red-400">{errors.problema}</p>}
                    </div>

                    {/* Solution */}
                    <div className="space-y-2">
                        <Label htmlFor="solucion" className="text-slate-200">
                            Solución propuesta *
                        </Label>
                        <Textarea
                            id="solucion"
                            value={formData.solucion}
                            onChange={(e) => setFormData({ ...formData, solucion: e.target.value })}
                            placeholder="Describe la solución recomendada..."
                            className="bg-slate-800/40 border-slate-700 text-slate-100 min-h-[100px]"
                        />
                        {errors.solucion && <p className="text-xs text-red-400">{errors.solucion}</p>}
                    </div>

                    {/* Cost and Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="costoEstimado" className="text-slate-200">
                                Costo estimado de reparación *
                            </Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                    id="costoEstimado"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.costoEstimado}
                                    onChange={(e) => setFormData({ ...formData, costoEstimado: e.target.value })}
                                    placeholder="0.00"
                                    className="pl-10 bg-slate-800/40 border-slate-700 text-slate-100"
                                />
                            </div>
                            {errors.costoEstimado && <p className="text-xs text-red-400">{errors.costoEstimado}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tiempoEstimado" className="text-slate-200">
                                Tiempo estimado *
                            </Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                    id="tiempoEstimado"
                                    value={formData.tiempoEstimado}
                                    onChange={(e) => setFormData({ ...formData, tiempoEstimado: e.target.value })}
                                    placeholder="Ej: 2-3 días"
                                    className="pl-10 bg-slate-800/40 border-slate-700 text-slate-100"
                                />
                            </div>
                            {errors.tiempoEstimado && <p className="text-xs text-red-400">{errors.tiempoEstimado}</p>}
                        </div>
                    </div>

                    {/* Materials Needed */}
                    <div className="space-y-2">
                        <Label htmlFor="materialesNecesarios" className="text-slate-200">
                            Materiales necesarios (opcional)
                        </Label>
                        <Textarea
                            id="materialesNecesarios"
                            value={formData.materialesNecesarios}
                            onChange={(e) => setFormData({ ...formData, materialesNecesarios: e.target.value })}
                            placeholder="Lista los materiales necesarios, uno por línea&#10;Ej:&#10;Pantalla HP 15.6' HD&#10;Kit bisagras HP Pavilion 15&#10;Cable flex pantalla"
                            className="bg-slate-800/40 border-slate-700 text-slate-100 min-h-[100px]"
                        />
                        <p className="text-xs text-slate-500">Escribe cada material en una línea separada</p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <p className="text-sm text-blue-300">
                            <strong>Nota:</strong> Una vez completado el diagnóstico y cotización, la orden cambiará a estado "Diagnóstico terminado"
                            y se notificará a recepción para que contacte al cliente con la cotización.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="text-slate-400 hover:text-slate-300"
                    >
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-500">
                        Guardar diagnóstico
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
