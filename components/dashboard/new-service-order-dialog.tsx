"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface NewServiceOrderDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave?: (order: any) => void
}

export function NewServiceOrderDialog({ open, onOpenChange, onSave }: NewServiceOrderDialogProps) {
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        cliente: "",
        telefono: "",
        equipo: "",
        marca: "",
        modelo: "",
        problema: "",
        tecnico: "",
        prioridad: "Normal",
        anticipo: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (!open) {
            setFormData({
                cliente: "",
                telefono: "",
                equipo: "",
                marca: "",
                modelo: "",
                problema: "",
                tecnico: "",
                prioridad: "Normal",
                anticipo: "",
            })
            setErrors({})
        }
    }, [open])

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.cliente.trim()) newErrors.cliente = "El nombre del cliente es requerido"
        if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es requerido"
        if (!formData.equipo.trim()) newErrors.equipo = "El tipo de equipo es requerido"
        if (!formData.problema.trim()) newErrors.problema = "La descripción del problema es requerida"
        if (!formData.tecnico) newErrors.tecnico = "Debe asignar un técnico"

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

        const newOrder = {
            ...formData,
            folio: `RS-OS-${Math.floor(Math.random() * 9000) + 1000}`,
            fecha: new Date().toISOString().split("T")[0],
            estado: "En diagnóstico",
        }

        console.log("Nueva orden creada:", newOrder)
        onSave?.(newOrder)

        toast({
            title: "Orden creada exitosamente",
            description: `Folio: ${newOrder.folio}`,
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Nueva Orden de Servicio</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Cliente */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cliente" className="text-slate-200">
                                Cliente *
                            </Label>
                            <Input
                                id="cliente"
                                value={formData.cliente}
                                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                                className="bg-slate-800/40 border-slate-700 text-slate-100"
                                placeholder="Nombre completo"
                            />
                            {errors.cliente && <p className="text-xs text-red-400">{errors.cliente}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telefono" className="text-slate-200">
                                Teléfono *
                            </Label>
                            <Input
                                id="telefono"
                                value={formData.telefono}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                className="bg-slate-800/40 border-slate-700 text-slate-100"
                                placeholder="5512345678"
                            />
                            {errors.telefono && <p className="text-xs text-red-400">{errors.telefono}</p>}
                        </div>
                    </div>

                    {/* Equipo */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="equipo" className="text-slate-200">
                                Tipo de Equipo *
                            </Label>
                            <Select value={formData.equipo} onValueChange={(value) => setFormData({ ...formData, equipo: value })}>
                                <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100">
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10">
                                    <SelectItem value="Laptop">Laptop</SelectItem>
                                    <SelectItem value="PC Escritorio">PC Escritorio</SelectItem>
                                    <SelectItem value="Tablet">Tablet</SelectItem>
                                    <SelectItem value="Smartphone">Smartphone</SelectItem>
                                    <SelectItem value="Impresora">Impresora</SelectItem>
                                    <SelectItem value="Otro">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.equipo && <p className="text-xs text-red-400">{errors.equipo}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="marca" className="text-slate-200">
                                Marca
                            </Label>
                            <Input
                                id="marca"
                                value={formData.marca}
                                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                                className="bg-slate-800/40 border-slate-700 text-slate-100"
                                placeholder="HP, Dell, etc."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="modelo" className="text-slate-200">
                                Modelo
                            </Label>
                            <Input
                                id="modelo"
                                value={formData.modelo}
                                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                                className="bg-slate-800/40 border-slate-700 text-slate-100"
                                placeholder="Pavilion 15"
                            />
                        </div>
                    </div>

                    {/* Problema */}
                    <div className="space-y-2">
                        <Label htmlFor="problema" className="text-slate-200">
                            Descripción del Problema *
                        </Label>
                        <Textarea
                            id="problema"
                            value={formData.problema}
                            onChange={(e) => setFormData({ ...formData, problema: e.target.value })}
                            className="bg-slate-800/40 border-slate-700 text-slate-100 min-h-[100px]"
                            placeholder="Describe el problema reportado por el cliente..."
                        />
                        {errors.problema && <p className="text-xs text-red-400">{errors.problema}</p>}
                    </div>

                    {/* Asignación */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tecnico" className="text-slate-200">
                                Técnico Asignado *
                            </Label>
                            <Select value={formData.tecnico} onValueChange={(value) => setFormData({ ...formData, tecnico: value })}>
                                <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100">
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10">
                                    <SelectItem value="Ana Martínez">Ana Martínez</SelectItem>
                                    <SelectItem value="Carlos Gómez">Carlos Gómez</SelectItem>
                                    <SelectItem value="Luis Torres">Luis Torres</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.tecnico && <p className="text-xs text-red-400">{errors.tecnico}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prioridad" className="text-slate-200">
                                Prioridad
                            </Label>
                            <Select
                                value={formData.prioridad}
                                onValueChange={(value) => setFormData({ ...formData, prioridad: value })}
                            >
                                <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10">
                                    <SelectItem value="Baja">Baja</SelectItem>
                                    <SelectItem value="Normal">Normal</SelectItem>
                                    <SelectItem value="Alta">Alta</SelectItem>
                                    <SelectItem value="Urgente">Urgente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="anticipo" className="text-slate-200">
                                Anticipo
                            </Label>
                            <Input
                                id="anticipo"
                                type="number"
                                value={formData.anticipo}
                                onChange={(e) => setFormData({ ...formData, anticipo: e.target.value })}
                                className="bg-slate-800/40 border-slate-700 text-slate-100"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-300">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-500">
                        Crear Orden
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
