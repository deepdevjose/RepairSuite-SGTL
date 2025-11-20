"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface NewClientDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave?: (client: any) => void
}

export function NewClientDialog({ open, onOpenChange, onSave }: NewClientDialogProps) {
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        nombre: "",
        telefono: "",
        email: "",
        direccion: "",
        colonia: "",
        ciudad: "",
        codigoPostal: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (!open) {
            setFormData({
                nombre: "",
                telefono: "",
                email: "",
                direccion: "",
                colonia: "",
                ciudad: "",
                codigoPostal: "",
            })
            setErrors({})
        }
    }, [open])

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
        if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es requerido"
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email inválido"
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

        const newClient = {
            ...formData,
            id: `CLI-${Date.now()}`,
            fechaRegistro: new Date().toISOString().split("T")[0],
        }

        console.log("Nuevo cliente creado:", newClient)
        onSave?.(newClient)

        toast({
            title: "Cliente registrado exitosamente",
            description: `Cliente: ${formData.nombre}`,
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Nuevo Cliente</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Datos Personales */}
                    <div className="space-y-2">
                        <Label htmlFor="nombre" className="text-slate-200">
                            Nombre Completo *
                        </Label>
                        <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="bg-slate-800/40 border-slate-700 text-slate-100"
                            placeholder="Juan Pérez García"
                        />
                        {errors.nombre && <p className="text-xs text-red-400">{errors.nombre}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-200">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="bg-slate-800/40 border-slate-700 text-slate-100"
                                placeholder="cliente@ejemplo.com"
                            />
                            {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                        </div>
                    </div>

                    {/* Dirección */}
                    <div className="space-y-2">
                        <Label htmlFor="direccion" className="text-slate-200">
                            Dirección
                        </Label>
                        <Input
                            id="direccion"
                            value={formData.direccion}
                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                            className="bg-slate-800/40 border-slate-700 text-slate-100"
                            placeholder="Calle y número"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="colonia" className="text-slate-200">
                                Colonia
                            </Label>
                            <Input
                                id="colonia"
                                value={formData.colonia}
                                onChange={(e) => setFormData({ ...formData, colonia: e.target.value })}
                                className="bg-slate-800/40 border-slate-700 text-slate-100"
                                placeholder="Centro"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ciudad" className="text-slate-200">
                                Ciudad
                            </Label>
                            <Input
                                id="ciudad"
                                value={formData.ciudad}
                                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                                className="bg-slate-800/40 border-slate-700 text-slate-100"
                                placeholder="CDMX"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="codigoPostal" className="text-slate-200">
                                C.P.
                            </Label>
                            <Input
                                id="codigoPostal"
                                value={formData.codigoPostal}
                                onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                                className="bg-slate-800/40 border-slate-700 text-slate-100"
                                placeholder="01000"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-300">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-500">
                        Registrar Cliente
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
