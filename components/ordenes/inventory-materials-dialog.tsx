"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Package, Search, Plus, Trash2, AlertCircle } from "lucide-react"
import type { InventoryRequest } from "@/lib/types/service-order"

interface InventoryMaterialsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    ordenId: string
    ordenFolio: string
    materialesNecesarios?: string[] // From diagnosis
    onSubmit?: (requests: Omit<InventoryRequest, "id" | "fechaSolicitud" | "estado">[]) => void
}

interface MaterialRequest {
    productoId: string
    productoNombre: string
    cantidad: number
    justificacion: string
}

export function InventoryMaterialsDialog({
    open,
    onOpenChange,
    ordenId,
    ordenFolio,
    materialesNecesarios = [],
    onSubmit,
}: InventoryMaterialsDialogProps) {
    const { toast } = useToast()
    const [requests, setRequests] = useState<MaterialRequest[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    // Initialize with materials from diagnosis
    const initializeFromDiagnosis = () => {
        if (materialesNecesarios.length > 0 && requests.length === 0) {
            const initialRequests = materialesNecesarios.map((material, index) => ({
                productoId: `prod-${index + 1}`, // In real app, search products
                productoNombre: material,
                cantidad: 1,
                justificacion: `Material necesario según diagnóstico para OS ${ordenFolio}`,
            }))
            setRequests(initialRequests)
        }
    }

    const addMaterialRequest = () => {
        setRequests([
            ...requests,
            {
                productoId: "",
                productoNombre: "",
                cantidad: 1,
                justificacion: "",
            },
        ])
    }

    const updateRequest = (index: number, field: keyof MaterialRequest, value: string | number) => {
        const updated = [...requests]
        updated[index] = { ...updated[index], [field]: value }
        setRequests(updated)
    }

    const removeRequest = (index: number) => {
        setRequests(requests.filter((_, i) => i !== index))
    }

    const handleSubmit = () => {
        // Validate
        if (requests.length === 0) {
            toast({
                title: "Error",
                description: "Debes agregar al menos un material",
                variant: "destructive",
            })
            return
        }

        const hasErrors = requests.some(
            (req) => !req.productoNombre || req.cantidad <= 0 || !req.justificacion
        )

        if (hasErrors) {
            toast({
                title: "Error de validación",
                description: "Completa todos los campos de cada material",
                variant: "destructive",
            })
            return
        }

        // Submit requests
        console.log("[InventoryMaterialsDialog] Submitting requests:", requests)
        onSubmit?.(
            requests.map((req) => ({
                productoId: req.productoId || `temp-${Date.now()}`,
                productoNombre: req.productoNombre,
                cantidad: req.cantidad,
                solicitadoPor: "", // Will be filled by action
                justificacion: req.justificacion,
            }))
        )

        toast({
            title: "Solicitudes enviadas",
            description: "Las solicitudes de materiales han sido enviadas al administrador",
        })

        // Reset
        setRequests([])
        onOpenChange(false)
    }

    return (
        <Dialog 
            open={open} 
            onOpenChange={(isOpen) => {
                if (isOpen && requests.length === 0) {
                    initializeFromDiagnosis()
                }
                onOpenChange(isOpen)
            }}
        >
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Package className="h-5 w-5 text-cyan-400" />
                        Solicitar Materiales de Inventario
                    </DialogTitle>
                    <p className="text-sm text-slate-400 mt-1">Orden: {ordenFolio}</p>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Info */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm text-blue-300">
                                    Solicita los materiales que necesitas del inventario. El administrador revisará
                                    y aprobará tus solicitudes antes de que puedas proceder con la reparación.
                                </p>
                                {materialesNecesarios.length > 0 && (
                                    <p className="text-xs text-blue-400 mt-2">
                                        ✓ Se pre-cargaron los materiales del diagnóstico
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Material Requests */}
                    <div className="space-y-3">
                        {requests.map((request, index) => (
                            <div
                                key={index}
                                className="bg-slate-800/40 border border-slate-700 rounded-lg p-4 space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-slate-300">
                                        Material #{index + 1}
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeRequest(index)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-slate-200">Nombre del producto *</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <Input
                                                value={request.productoNombre}
                                                onChange={(e) =>
                                                    updateRequest(index, "productoNombre", e.target.value)
                                                }
                                                placeholder="Buscar producto en inventario..."
                                                className="pl-10 bg-slate-800/60 border-slate-600 text-slate-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-200">Cantidad *</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={request.cantidad}
                                            onChange={(e) =>
                                                updateRequest(index, "cantidad", parseInt(e.target.value) || 1)
                                            }
                                            className="bg-slate-800/60 border-slate-600 text-slate-100"
                                        />
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-slate-200">Justificación *</Label>
                                        <Textarea
                                            value={request.justificacion}
                                            onChange={(e) =>
                                                updateRequest(index, "justificacion", e.target.value)
                                            }
                                            placeholder="¿Por qué necesitas este material?"
                                            className="bg-slate-800/60 border-slate-600 text-slate-100 min-h-[60px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Material Button */}
                    <Button
                        variant="outline"
                        onClick={addMaterialRequest}
                        className="w-full border-slate-700 hover:bg-slate-800"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar otro material
                    </Button>

                    {requests.length === 0 && (
                        <div className="text-center py-8">
                            <Package className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400 text-sm">
                                No hay materiales agregados
                            </p>
                            <Button
                                variant="outline"
                                onClick={addMaterialRequest}
                                className="mt-3 border-slate-700 hover:bg-slate-800"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar material
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setRequests([])
                            onOpenChange(false)
                        }}
                        className="text-slate-400 hover:text-slate-300"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={requests.length === 0}
                        className="bg-cyan-600 hover:bg-cyan-500"
                    >
                        <Package className="h-4 w-4 mr-2" />
                        Enviar solicitudes ({requests.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
