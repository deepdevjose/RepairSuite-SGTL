"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import type { Branch } from "@/lib/types/config"
import { AlertCircle } from "lucide-react"

interface BranchFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    branch?: Branch | null
    onSave?: (branch: Partial<Branch>) => void
}

export function BranchFormDialog({ open, onOpenChange, branch, onSave }: BranchFormDialogProps) {
    const { toast } = useToast()
    const isEditing = !!branch

    const [formData, setFormData] = useState({
        nombre: "",
        calle: "",
        colonia: "",
        ciudad: "",
        estado: "",
        codigoPostal: "",
        telefono: "",
        email: "",
        horario: "Lun-Vie 9:00-18:00",
        encargado: "",
        prefijoFolios: "",
        activa: true,
        tieneInventario: true,
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (branch) {
            setFormData({
                nombre: branch.nombre,
                calle: branch.direccion.calle,
                colonia: branch.direccion.colonia,
                ciudad: branch.direccion.ciudad,
                estado: branch.direccion.estado,
                codigoPostal: branch.direccion.codigoPostal,
                telefono: branch.telefono,
                email: branch.email,
                horario: branch.horario,
                encargado: branch.encargado,
                prefijoFolios: branch.prefijoFolios,
                activa: branch.activa,
                tieneInventario: branch.tieneInventario,
            })
        } else {
            setFormData({
                nombre: "",
                calle: "",
                colonia: "",
                ciudad: "",
                estado: "",
                codigoPostal: "",
                telefono: "",
                email: "",
                horario: "Lun-Vie 9:00-18:00",
                encargado: "",
                prefijoFolios: "",
                activa: true,
                tieneInventario: true,
            })
        }
        setErrors({})
    }, [branch, open])

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
        if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es requerido"
        if (!formData.email.trim()) {
            newErrors.email = "El email es requerido"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Formato de email inválido"
        }
        if (!formData.prefijoFolios.trim()) newErrors.prefijoFolios = "El prefijo es requerido"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (!validate()) return

        const branchData: Partial<Branch> = {
            nombre: formData.nombre,
            direccion: {
                calle: formData.calle,
                colonia: formData.colonia,
                ciudad: formData.ciudad,
                estado: formData.estado,
                codigoPostal: formData.codigoPostal,
            },
            telefono: formData.telefono,
            email: formData.email,
            horario: formData.horario,
            encargado: formData.encargado,
            prefijoFolios: formData.prefijoFolios,
            activa: formData.activa,
            tieneInventario: formData.tieneInventario,
        }

        onSave?.(branchData)

        toast({
            title: isEditing ? "Sucursal actualizada" : "Sucursal creada",
            description: `${formData.nombre} ha sido ${isEditing ? "actualizada" : "agregada"} correctamente.`,
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-slate-100 text-xl">
                        {isEditing ? "Editar Sucursal" : "Nueva Sucursal"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre" className="text-slate-200">
                            Nombre de la Sucursal <span className="text-red-400">*</span>
                        </Label>
                        <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.nombre ? "border-red-500" : ""}`}
                            placeholder="Sede A - Centro"
                        />
                        {errors.nombre && (
                            <p className="text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.nombre}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="calle" className="text-slate-200">
                                Calle
                            </Label>
                            <Input
                                id="calle"
                                value={formData.calle}
                                onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                                placeholder="Av. Principal 123"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="colonia" className="text-slate-200">
                                Colonia
                            </Label>
                            <Input
                                id="colonia"
                                value={formData.colonia}
                                onChange={(e) => setFormData({ ...formData, colonia: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                                placeholder="Centro"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="ciudad" className="text-slate-200">
                                Ciudad
                            </Label>
                            <Input
                                id="ciudad"
                                value={formData.ciudad}
                                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="estado" className="text-slate-200">
                                Estado
                            </Label>
                            <Input
                                id="estado"
                                value={formData.estado}
                                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="codigoPostal" className="text-slate-200">
                                CP
                            </Label>
                            <Input
                                id="codigoPostal"
                                value={formData.codigoPostal}
                                onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="telefono" className="text-slate-200">
                                Teléfono <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="telefono"
                                value={formData.telefono}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.telefono ? "border-red-500" : ""}`}
                                placeholder="+52 55 1234 5678"
                            />
                            {errors.telefono && (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.telefono}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-200">
                                Email <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.email ? "border-red-500" : ""}`}
                                placeholder="sucursal@ejemplo.com"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="horario" className="text-slate-200">
                                Horario
                            </Label>
                            <Input
                                id="horario"
                                value={formData.horario}
                                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                                placeholder="Lun-Vie 9:00-18:00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="encargado" className="text-slate-200">
                                Encargado
                            </Label>
                            <Input
                                id="encargado"
                                value={formData.encargado}
                                onChange={(e) => setFormData({ ...formData, encargado: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="prefijoFolios" className="text-slate-200">
                            Prefijo de Folios <span className="text-red-400">*</span>
                        </Label>
                        <Input
                            id="prefijoFolios"
                            value={formData.prefijoFolios}
                            onChange={(e) => setFormData({ ...formData, prefijoFolios: e.target.value.toUpperCase() })}
                            className={`bg-slate-800 border-slate-700 text-slate-100 max-w-xs ${errors.prefijoFolios ? "border-red-500" : ""}`}
                            placeholder="A"
                            maxLength={3}
                        />
                        {errors.prefijoFolios && (
                            <p className="text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.prefijoFolios}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="activa"
                                checked={formData.activa}
                                onCheckedChange={(checked) => setFormData({ ...formData, activa: checked as boolean })}
                                className="border-slate-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                            <label htmlFor="activa" className="text-sm text-slate-300 cursor-pointer">
                                Sucursal activa
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="tieneInventario"
                                checked={formData.tieneInventario}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, tieneInventario: checked as boolean })
                                }
                                className="border-slate-600"
                            />
                            <label htmlFor="tieneInventario" className="text-sm text-slate-300 cursor-pointer">
                                Tiene inventario
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                        {isEditing ? "Actualizar" : "Crear"} Sucursal
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
