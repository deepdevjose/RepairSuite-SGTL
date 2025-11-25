"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Package } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { InventoryRequest } from "@/lib/types/service-order"

interface RepairCompletionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    ordenId: string
    ordenFolio: string
    materialesAprobados?: InventoryRequest[]
    onSubmit?: (completion: any) => void
}

export function RepairCompletionDialog({
    open,
    onOpenChange,
    ordenId,
    ordenFolio,
    materialesAprobados = [],
    onSubmit,
}: RepairCompletionDialogProps) {
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        trabajoRealizado: "",
        notasFinales: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.trabajoRealizado.trim()) {
            newErrors.trabajoRealizado = "La descripción del trabajo realizado es requerida"
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

        const completion = {
            trabajoRealizado: formData.trabajoRealizado,
            materialesUsados: materialesAprobados.map((m) => m.id),
            notasFinales: formData.notasFinales || undefined,
        }

        console.log("[RepairCompletionDialog] Reparación completada:", completion)
        onSubmit?.(completion)

        toast({
            title: "Reparación completada",
            description: "La orden ha sido marcada como terminada",
        })

        // Reset form
        setFormData({
            trabajoRealizado: "",
            notasFinales: "",
        })
        setErrors({})
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        Completar Reparación
                    </DialogTitle>
                    <p className="text-sm text-slate-400 mt-1">Orden: {ordenFolio}</p>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Work Performed */}
                    <div className="space-y-2">
                        <Label htmlFor="trabajoRealizado" className="text-slate-200">
                            Trabajo realizado *
                        </Label>
                        <Textarea
                            id="trabajoRealizado"
                            value={formData.trabajoRealizado}
                            onChange={(e) => setFormData({ ...formData, trabajoRealizado: e.target.value })}
                            placeholder="Describe detalladamente el trabajo realizado..."
                            className="bg-slate-800/40 border-slate-700 text-slate-100 min-h-[120px]"
                        />
                        {errors.trabajoRealizado && <p className="text-xs text-red-400">{errors.trabajoRealizado}</p>}
                    </div>

                    {/* Materials Used */}
                    {materialesAprobados.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-slate-200">Materiales utilizados</Label>
                            <Card className="bg-slate-800/40 border-slate-700 p-4">
                                <div className="space-y-2">
                                    {materialesAprobados.map((material) => (
                                        <div
                                            key={material.id}
                                            className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-slate-400" />
                                                <span className="text-sm text-slate-300">{material.productoNombre}</span>
                                            </div>
                                            <span className="text-sm text-slate-400">Cantidad: {material.cantidad}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                            <p className="text-xs text-slate-500">
                                Estos materiales fueron aprobados y se registrarán como usados en esta reparación
                            </p>
                        </div>
                    )}

                    {materialesAprobados.length === 0 && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                            <p className="text-sm text-yellow-300">
                                <strong>Nota:</strong> No hay materiales de inventario registrados para esta reparación.
                                Si usaste materiales, asegúrate de haberlos solicitado y que hayan sido aprobados.
                            </p>
                        </div>
                    )}

                    {/* Final Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notasFinales" className="text-slate-200">
                            Notas finales (opcional)
                        </Label>
                        <Textarea
                            id="notasFinales"
                            value={formData.notasFinales}
                            onChange={(e) => setFormData({ ...formData, notasFinales: e.target.value })}
                            placeholder="Agrega cualquier nota adicional, recomendaciones para el cliente, etc..."
                            className="bg-slate-800/40 border-slate-700 text-slate-100 min-h-[80px]"
                        />
                    </div>

                    {/* Info Box */}
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <p className="text-sm text-green-300">
                            <strong>Al completar:</strong> La orden cambiará automáticamente a "Reparación terminada" y luego a
                            "Esperando entrega". El equipo estará listo para ser entregado al cliente.
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
                    <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-500">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar como terminada
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
