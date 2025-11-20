"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import type { Employee, EmployeeRole, EmployeeStatus, EmployeeSpecialty } from "@/lib/types/staff"
import { AlertCircle } from "lucide-react"

interface EmployeeFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    employee?: Employee | null
    onSave?: (employee: Partial<Employee>) => void
}

const ESPECIALIDADES: EmployeeSpecialty[] = ["Hardware", "Software", "Apple", "Gaming", "Redes", "Servidores", "General"]

export function EmployeeFormDialog({ open, onOpenChange, employee, onSave }: EmployeeFormDialogProps) {
    const { toast } = useToast()
    const isEditing = !!employee

    const [formData, setFormData] = useState({
        nombre: "",
        apellidos: "",
        telefono: "",
        correoInterno: "",
        rolOperativo: "Técnico" as EmployeeRole,
        sucursalAsignada: "Sede A",
        estado: "Activo" as EmployeeStatus,
        fechaAlta: new Date().toISOString().split("T")[0],
        horarioTrabajo: "Lun-Vie 9:00-18:00",
        especialidades: [] as EmployeeSpecialty[],
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    // Load employee data when editing
    useEffect(() => {
        if (employee) {
            setFormData({
                nombre: employee.nombre,
                apellidos: employee.apellidos,
                telefono: employee.telefono,
                correoInterno: employee.correoInterno,
                rolOperativo: employee.rolOperativo,
                sucursalAsignada: employee.sucursalAsignada,
                estado: employee.estado,
                fechaAlta: employee.fechaAlta.split("T")[0],
                horarioTrabajo: employee.horarioTrabajo || "Lun-Vie 9:00-18:00",
                especialidades: employee.especialidades,
            })
        } else {
            // Reset form
            setFormData({
                nombre: "",
                apellidos: "",
                telefono: "",
                correoInterno: "",
                rolOperativo: "Técnico",
                sucursalAsignada: "Sede A",
                estado: "Activo",
                fechaAlta: new Date().toISOString().split("T")[0],
                horarioTrabajo: "Lun-Vie 9:00-18:00",
                especialidades: [],
            })
        }
        setErrors({})
    }, [employee, open])

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.nombre.trim()) {
            newErrors.nombre = "El nombre es requerido"
        }
        if (!formData.apellidos.trim()) {
            newErrors.apellidos = "Los apellidos son requeridos"
        }
        if (!formData.telefono.trim()) {
            newErrors.telefono = "El teléfono es requerido"
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.telefono)) {
            newErrors.telefono = "Formato de teléfono inválido"
        }
        if (!formData.correoInterno.trim()) {
            newErrors.correoInterno = "El correo es requerido"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoInterno)) {
            newErrors.correoInterno = "Formato de correo inválido"
        }
        if (formData.especialidades.length === 0) {
            newErrors.especialidades = "Selecciona al menos una especialidad"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (!validate()) return

        const employeeData: Partial<Employee> = {
            ...formData,
            nombreCompleto: `${formData.nombre} ${formData.apellidos}`,
            fechaAlta: `${formData.fechaAlta}T00:00:00Z`,
        }

        onSave?.(employeeData)

        toast({
            title: isEditing ? "Empleado actualizado" : "Empleado creado",
            description: `${formData.nombre} ${formData.apellidos} ha sido ${isEditing ? "actualizado" : "agregado"} correctamente.`,
        })

        onOpenChange(false)
    }

    const toggleEspecialidad = (esp: EmployeeSpecialty) => {
        setFormData((prev) => ({
            ...prev,
            especialidades: prev.especialidades.includes(esp)
                ? prev.especialidades.filter((e) => e !== esp)
                : [...prev.especialidades, esp],
        }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-slate-100 text-xl">
                        {isEditing ? "Editar Empleado" : "Nuevo Empleado"}
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                        <TabsTrigger value="personal">Información Personal</TabsTrigger>
                        <TabsTrigger value="operativo">Datos Operativos</TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Personal Info */}
                    <TabsContent value="personal" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombre" className="text-slate-200">
                                    Nombre <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.nombre ? "border-red-500" : ""
                                        }`}
                                    placeholder="Juan"
                                />
                                {errors.nombre && (
                                    <p className="text-xs text-red-400 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.nombre}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="apellidos" className="text-slate-200">
                                    Apellidos <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="apellidos"
                                    value={formData.apellidos}
                                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                                    className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.apellidos ? "border-red-500" : ""
                                        }`}
                                    placeholder="Pérez García"
                                />
                                {errors.apellidos && (
                                    <p className="text-xs text-red-400 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.apellidos}
                                    </p>
                                )}
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
                                    className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.telefono ? "border-red-500" : ""
                                        }`}
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
                                <Label htmlFor="correoInterno" className="text-slate-200">
                                    Correo Interno <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="correoInterno"
                                    type="email"
                                    value={formData.correoInterno}
                                    onChange={(e) => setFormData({ ...formData, correoInterno: e.target.value })}
                                    className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.correoInterno ? "border-red-500" : ""
                                        }`}
                                    placeholder="juan.perez@repairsuite.com"
                                />
                                {errors.correoInterno && (
                                    <p className="text-xs text-red-400 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.correoInterno}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="rolOperativo" className="text-slate-200">
                                    Rol Operativo <span className="text-red-400">*</span>
                                </Label>
                                <Select
                                    value={formData.rolOperativo}
                                    onValueChange={(value: EmployeeRole) =>
                                        setFormData({ ...formData, rolOperativo: value })
                                    }
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700">
                                        <SelectItem value="Técnico" className="text-slate-300">
                                            Técnico
                                        </SelectItem>
                                        <SelectItem value="Recepción" className="text-slate-300">
                                            Recepción
                                        </SelectItem>
                                        <SelectItem value="Administrador" className="text-slate-300">
                                            Administrador
                                        </SelectItem>
                                        <SelectItem value="Gerente" className="text-slate-300">
                                            Gerente
                                        </SelectItem>
                                        <SelectItem value="Dueño" className="text-slate-300">
                                            Dueño
                                        </SelectItem>
                                        <SelectItem value="Auxiliar" className="text-slate-300">
                                            Auxiliar
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sucursalAsignada" className="text-slate-200">
                                    Sucursal <span className="text-red-400">*</span>
                                </Label>
                                <Select
                                    value={formData.sucursalAsignada}
                                    onValueChange={(value) => setFormData({ ...formData, sucursalAsignada: value })}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700">
                                        <SelectItem value="Sede A" className="text-slate-300">
                                            Sede A
                                        </SelectItem>
                                        <SelectItem value="Sede B" className="text-slate-300">
                                            Sede B
                                        </SelectItem>
                                        <SelectItem value="Sede C" className="text-slate-300">
                                            Sede C
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="estado" className="text-slate-200">
                                Estado <span className="text-red-400">*</span>
                            </Label>
                            <Select
                                value={formData.estado}
                                onValueChange={(value: EmployeeStatus) => setFormData({ ...formData, estado: value })}
                            >
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    <SelectItem value="Activo" className="text-slate-300">
                                        Activo
                                    </SelectItem>
                                    <SelectItem value="Inactivo" className="text-slate-300">
                                        Inactivo
                                    </SelectItem>
                                    <SelectItem value="Suspendido" className="text-slate-300">
                                        Suspendido
                                    </SelectItem>
                                    <SelectItem value="Vacaciones" className="text-slate-300">
                                        Vacaciones
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>

                    {/* Tab 2: Operational Data */}
                    <TabsContent value="operativo" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fechaAlta" className="text-slate-200">
                                    Fecha de Alta <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="fechaAlta"
                                    type="date"
                                    value={formData.fechaAlta}
                                    onChange={(e) => setFormData({ ...formData, fechaAlta: e.target.value })}
                                    className="bg-slate-800 border-slate-700 text-slate-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="horarioTrabajo" className="text-slate-200">
                                    Horario de Trabajo
                                </Label>
                                <Input
                                    id="horarioTrabajo"
                                    value={formData.horarioTrabajo}
                                    onChange={(e) => setFormData({ ...formData, horarioTrabajo: e.target.value })}
                                    className="bg-slate-800 border-slate-700 text-slate-100"
                                    placeholder="Lun-Vie 9:00-18:00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-200">
                                Especialidades <span className="text-red-400">*</span>
                            </Label>
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-2">
                                {ESPECIALIDADES.map((esp) => (
                                    <div key={esp} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`esp-${esp}`}
                                            checked={formData.especialidades.includes(esp)}
                                            onCheckedChange={() => toggleEspecialidad(esp)}
                                            className="border-slate-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                        />
                                        <label
                                            htmlFor={`esp-${esp}`}
                                            className="text-sm text-slate-300 cursor-pointer"
                                        >
                                            {esp}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {errors.especialidades && (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.especialidades}
                                </p>
                            )}
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
                        {isEditing ? "Actualizar" : "Crear"} Empleado
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
