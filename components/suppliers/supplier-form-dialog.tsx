"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { Supplier } from "@/lib/types/catalog"
import { AlertCircle } from "lucide-react"

interface SupplierFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    supplier?: Supplier | null
    onSave?: (supplier: Partial<Supplier>) => void
}

export function SupplierFormDialog({ open, onOpenChange, supplier, onSave }: SupplierFormDialogProps) {
    const { toast } = useToast()
    const isEditing = !!supplier

    const [formData, setFormData] = useState({
        nombreComercial: supplier?.nombreComercial || "",
        razonSocial: supplier?.razonSocial || "",
        contactoPrincipal: supplier?.contactoPrincipal || "",
        telefono: supplier?.telefono || "",
        email: supplier?.email || "",
        sitioWeb: supplier?.sitioWeb || "",
        rfc: supplier?.rfc || "",
        direccion: {
            calle: supplier?.direccion?.calle || "",
            colonia: supplier?.direccion?.colonia || "",
            codigoPostal: supplier?.direccion?.codigoPostal || "",
            municipio: supplier?.direccion?.municipio || "",
            estado: supplier?.direccion?.estado || "",
            pais: supplier?.direccion?.pais || "México",
        },
        condicionesPago: supplier?.condicionesPago || ("Contado" as "Contado" | "15 días" | "30 días" | "Crédito especial"),
        tiempoEntregaPromedioDias: supplier?.tiempoEntregaPromedioDias || 1,
        metodoEnvio: supplier?.metodoEnvio || ("Paquetería" as "Paquetería" | "Entrega local" | "Recolección"),
        costoPromedioEnvio: supplier?.costoPromedioEnvio || 0,
        notas: supplier?.notas || "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.nombreComercial.trim()) {
            newErrors.nombreComercial = "El nombre comercial es obligatorio"
        }

        if (!formData.razonSocial.trim()) {
            newErrors.razonSocial = "La razón social es obligatoria"
        }

        if (!formData.contactoPrincipal.trim()) {
            newErrors.contactoPrincipal = "El contacto principal es obligatorio"
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = "El teléfono es obligatorio"
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email inválido"
        }

        if (!formData.rfc.trim()) {
            newErrors.rfc = "El RFC es obligatorio"
        } else if (!/^[A-Z]{3,4}\d{6}[A-Z0-9]{3}$/.test(formData.rfc)) {
            newErrors.rfc = "RFC inválido"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (!validateForm()) {
            toast({
                title: "Error de validación",
                description: "Por favor corrige los errores en el formulario",
                variant: "destructive",
            })
            return
        }

        onSave?.(formData)
        onOpenChange(false)

        toast({
            title: isEditing ? "Proveedor actualizado" : "Proveedor creado",
            description: `${formData.nombreComercial} ha sido ${isEditing ? "actualizado" : "creado"} exitosamente`,
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-slate-100 text-xl">
                        {isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="fiscal">Datos Fiscales</TabsTrigger>
                        <TabsTrigger value="comercial">Comercial</TabsTrigger>
                    </TabsList>

                    {/* Tab 1: General */}
                    <TabsContent value="general" className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombreComercial" className="text-slate-200">
                                Nombre Comercial <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="nombreComercial"
                                value={formData.nombreComercial}
                                onChange={(e) => setFormData({ ...formData, nombreComercial: e.target.value })}
                                className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.nombreComercial ? "border-red-500" : ""}`}
                                placeholder="Ej: Distribuidora TechParts"
                            />
                            {errors.nombreComercial && (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.nombreComercial}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="razonSocial" className="text-slate-200">
                                Razón Social <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="razonSocial"
                                value={formData.razonSocial}
                                onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                                className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.razonSocial ? "border-red-500" : ""}`}
                                placeholder="Ej: Distribuidora TechParts S.A. de C.V."
                            />
                            {errors.razonSocial && (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.razonSocial}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contactoPrincipal" className="text-slate-200">
                                Contacto Principal <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="contactoPrincipal"
                                value={formData.contactoPrincipal}
                                onChange={(e) => setFormData({ ...formData, contactoPrincipal: e.target.value })}
                                className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.contactoPrincipal ? "border-red-500" : ""}`}
                                placeholder="Ej: Juan Pérez"
                            />
                            {errors.contactoPrincipal && (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.contactoPrincipal}
                                </p>
                            )}
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
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.email ? "border-red-500" : ""}`}
                                    placeholder="contacto@proveedor.com"
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-400 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sitioWeb" className="text-slate-200">
                                Sitio Web
                            </Label>
                            <Input
                                id="sitioWeb"
                                value={formData.sitioWeb}
                                onChange={(e) => setFormData({ ...formData, sitioWeb: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                                placeholder="https://www.proveedor.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notas" className="text-slate-200">
                                Notas
                            </Label>
                            <Textarea
                                id="notas"
                                value={formData.notas}
                                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-slate-100 min-h-[100px]"
                                placeholder="Información adicional sobre el proveedor..."
                            />
                        </div>
                    </TabsContent>

                    {/* Tab 2: Fiscal */}
                    <TabsContent value="fiscal" className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="rfc" className="text-slate-200">
                                RFC <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="rfc"
                                value={formData.rfc}
                                onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                                className={`bg-slate-800 border-slate-700 text-slate-100 font-mono ${errors.rfc ? "border-red-500" : ""}`}
                                placeholder="ABC123456XYZ"
                                maxLength={13}
                            />
                            {errors.rfc && (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.rfc}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Label className="text-slate-200 font-semibold">Dirección Fiscal</Label>

                            <div className="space-y-2">
                                <Label htmlFor="calle" className="text-slate-300 text-sm">
                                    Calle y número
                                </Label>
                                <Input
                                    id="calle"
                                    value={formData.direccion.calle}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            direccion: { ...formData.direccion, calle: e.target.value },
                                        })
                                    }
                                    className="bg-slate-800 border-slate-700 text-slate-100"
                                    placeholder="Av. Insurgentes Sur 1234"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="colonia" className="text-slate-300 text-sm">
                                        Colonia
                                    </Label>
                                    <Input
                                        id="colonia"
                                        value={formData.direccion.colonia}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                direccion: { ...formData.direccion, colonia: e.target.value },
                                            })
                                        }
                                        className="bg-slate-800 border-slate-700 text-slate-100"
                                        placeholder="Del Valle"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="codigoPostal" className="text-slate-300 text-sm">
                                        Código Postal
                                    </Label>
                                    <Input
                                        id="codigoPostal"
                                        value={formData.direccion.codigoPostal}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                direccion: { ...formData.direccion, codigoPostal: e.target.value },
                                            })
                                        }
                                        className="bg-slate-800 border-slate-700 text-slate-100"
                                        placeholder="03100"
                                        maxLength={5}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="municipio" className="text-slate-300 text-sm">
                                        Municipio
                                    </Label>
                                    <Input
                                        id="municipio"
                                        value={formData.direccion.municipio}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                direccion: { ...formData.direccion, municipio: e.target.value },
                                            })
                                        }
                                        className="bg-slate-800 border-slate-700 text-slate-100"
                                        placeholder="Benito Juárez"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="estado" className="text-slate-300 text-sm">
                                        Estado
                                    </Label>
                                    <Input
                                        id="estado"
                                        value={formData.direccion.estado}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                direccion: { ...formData.direccion, estado: e.target.value },
                                            })
                                        }
                                        className="bg-slate-800 border-slate-700 text-slate-100"
                                        placeholder="CDMX"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pais" className="text-slate-300 text-sm">
                                    País
                                </Label>
                                <Input
                                    id="pais"
                                    value={formData.direccion.pais}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            direccion: { ...formData.direccion, pais: e.target.value },
                                        })
                                    }
                                    className="bg-slate-800 border-slate-700 text-slate-100"
                                    placeholder="México"
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Tab 3: Comercial */}
                    <TabsContent value="comercial" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="condicionesPago" className="text-slate-200">
                                    Condiciones de Pago
                                </Label>
                                <Select
                                    value={formData.condicionesPago}
                                    onValueChange={(value: any) => setFormData({ ...formData, condicionesPago: value })}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700">
                                        <SelectItem value="Contado" className="text-slate-300">
                                            Contado
                                        </SelectItem>
                                        <SelectItem value="15 días" className="text-slate-300">
                                            15 días
                                        </SelectItem>
                                        <SelectItem value="30 días" className="text-slate-300">
                                            30 días
                                        </SelectItem>
                                        <SelectItem value="Crédito especial" className="text-slate-300">
                                            Crédito especial
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tiempoEntrega" className="text-slate-200">
                                    Tiempo de Entrega (días)
                                </Label>
                                <Input
                                    id="tiempoEntrega"
                                    type="number"
                                    min="1"
                                    value={formData.tiempoEntregaPromedioDias}
                                    onChange={(e) => setFormData({ ...formData, tiempoEntregaPromedioDias: parseInt(e.target.value) || 1 })}
                                    className="bg-slate-800 border-slate-700 text-slate-100"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="metodoEnvio" className="text-slate-200">
                                Método de Envío
                            </Label>
                            <Select
                                value={formData.metodoEnvio}
                                onValueChange={(value: any) => setFormData({ ...formData, metodoEnvio: value })}
                            >
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    <SelectItem value="Paquetería" className="text-slate-300">
                                        Paquetería
                                    </SelectItem>
                                    <SelectItem value="Entrega local" className="text-slate-300">
                                        Entrega local
                                    </SelectItem>
                                    <SelectItem value="Recolección" className="text-slate-300">
                                        Recolección
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="costoEnvio" className="text-slate-200">
                                Costo Promedio de Envío
                            </Label>
                            <Input
                                id="costoEnvio"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.costoPromedioEnvio}
                                onChange={(e) => setFormData({ ...formData, costoPromedioEnvio: parseFloat(e.target.value) || 0 })}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                                placeholder="0.00"
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Actions */}
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
                        {isEditing ? "Actualizar" : "Crear"} Proveedor
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
