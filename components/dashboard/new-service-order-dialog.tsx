"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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
        equipo: "",
        problemaReportado: "",
        tecnicoAsignado: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (!open) {
            setFormData({
                cliente: "",
                equipo: "",
                problemaReportado: "",
                tecnicoAsignado: "",
            })
            setErrors({})
        }
    }, [open])

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.cliente) newErrors.cliente = "Debe seleccionar un cliente"
        if (!formData.equipo) newErrors.equipo = "Debe seleccionar un equipo"
        if (!formData.problemaReportado.trim()) newErrors.problemaReportado = "La descripción del problema es requerida"
        if (!formData.tecnicoAsignado) newErrors.tecnicoAsignado = "Debe asignar un técnico"

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
            folio: `OS-${Date.now().toString().slice(-6)}`,
            fechaRecepcion: new Date().toISOString(),
            estado: "Recepción",
        }

        console.log("Nueva orden creada:", newOrder)
        onSave?.(newOrder)

        toast({
            title: "Orden de servicio creada",
            description: `Folio: ${newOrder.folio} - Asignada a ${formData.tecnicoAsignado}`,
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Nueva Orden de Servicio</DialogTitle>
                    <p className="text-sm text-slate-400 mt-1">
                        Registra la orden y asígnala a un técnico. El técnico completará el diagnóstico.
                    </p>
                </DialogHeader>

                <div className="space-y-5 py-4">
                    {/* Cliente */}
                    <div className="space-y-2">
                        <Label htmlFor="cliente" className="text-slate-200">
                            Cliente *
                        </Label>
                        <Select value={formData.cliente} onValueChange={(value) => setFormData({ ...formData, cliente: value })}>
                            <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100">
                                <SelectValue placeholder="Seleccionar cliente" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                                <SelectItem value="Juan Pérez">Juan Pérez - 5512345678</SelectItem>
                                <SelectItem value="María González">María González - 5523456789</SelectItem>
                                <SelectItem value="Pedro Ramírez">Pedro Ramírez - 5534567890</SelectItem>
                                <SelectItem value="Ana López">Ana López - 5545678901</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.cliente && <p className="text-xs text-red-400">{errors.cliente}</p>}
                        <p className="text-xs text-slate-500">
                            💡 Si el cliente no está registrado, créalo primero desde el módulo de Clientes
                        </p>
                    </div>

                    {/* Equipo */}
                    <div className="space-y-2">
                        <Label htmlFor="equipo" className="text-slate-200">
                            Equipo del Cliente *
                        </Label>
                        <Select 
                            value={formData.equipo} 
                            onValueChange={(value) => setFormData({ ...formData, equipo: value })}
                            disabled={!formData.cliente}
                        >
                            <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100">
                                <SelectValue placeholder="Seleccionar equipo" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                                <SelectItem value="HP Pavilion 15">HP Pavilion 15 (Laptop)</SelectItem>
                                <SelectItem value="Dell XPS 13">Dell XPS 13 (Laptop)</SelectItem>
                                <SelectItem value="MacBook Pro 13">MacBook Pro 13" (Laptop)</SelectItem>
                                <SelectItem value="Lenovo ThinkPad">Lenovo ThinkPad (Laptop)</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.equipo && <p className="text-xs text-red-400">{errors.equipo}</p>}
                        <p className="text-xs text-slate-500">
                            💡 Si el equipo no está registrado, créalo primero desde el módulo de Equipos
                        </p>
                    </div>

                    {/* Problema Reportado */}
                    <div className="space-y-2">
                        <Label htmlFor="problemaReportado" className="text-slate-200">
                            Problema Reportado por el Cliente *
                        </Label>
                        <Textarea
                            id="problemaReportado"
                            value={formData.problemaReportado}
                            onChange={(e) => setFormData({ ...formData, problemaReportado: e.target.value })}
                            className="bg-slate-800/40 border-slate-700 text-slate-100 min-h-[100px]"
                            placeholder="Ej: La laptop no enciende, se calienta mucho, pantalla rota, etc..."
                        />
                        {errors.problemaReportado && <p className="text-xs text-red-400">{errors.problemaReportado}</p>}
                        <p className="text-xs text-slate-500">
                            📝 Solo registra lo que el cliente reporta. El técnico hará el diagnóstico detallado.
                        </p>
                    </div>

                    {/* Técnico Asignado */}
                    <div className="space-y-2">
                        <Label htmlFor="tecnicoAsignado" className="text-slate-200">
                            Asignar a Técnico *
                        </Label>
                        <Select 
                            value={formData.tecnicoAsignado} 
                            onValueChange={(value) => setFormData({ ...formData, tecnicoAsignado: value })}
                        >
                            <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100">
                                <SelectValue placeholder="Seleccionar técnico" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                                <SelectItem value="Jose Luis">Jose Luis - Técnico Senior</SelectItem>
                                <SelectItem value="Kevis">Kevis - Técnico</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.tecnicoAsignado && <p className="text-xs text-red-400">{errors.tecnicoAsignado}</p>}
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
                    <Button 
                        onClick={handleSubmit} 
                        className="bg-indigo-600 hover:bg-indigo-500"
                    >
                        Crear Orden de Servicio
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
