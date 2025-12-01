"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Upload, X, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

const accessoriesList = ["Cargador", "Mouse", "Estuche", "Base de enfriamiento", "Batería adicional", "Cable HDMI"]

type Cliente = {
    id: string
    nombre: string
    telefono: string
}

type NewEquipmentDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialClientId?: string
    onSuccess?: (equipment?: any) => void
}

export function NewEquipmentDialog({ open, onOpenChange, onSuccess, initialClientId }: NewEquipmentDialogProps) {
    const { toast } = useToast()
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [loadingClientes, setLoadingClientes] = useState(false)
    const [equipos, setEquipos] = useState<any[]>([])

    const [formData, setFormData] = useState({
        cliente: "",
        marca: "",
        modelo: "",
        color: "",
        numero_serie: "",
        fecha_ingreso: new Date().toISOString().split("T")[0],
        estado_fisico: "",
        accesorios_texto: "",
        accesorios_chips: [] as string[],
        enciende: "",
        tiene_contrasena: false,
        contrasena: "",
        no_proporciono_contrasena: false,
        notas_generales: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [serialDuplicate, setSerialDuplicate] = useState(false)
    const [collapsedSections, setCollapsedSections] = useState({
        equipmentData: false,
        physicalState: false,
        accessories: false,
        diagnosis: false,
        notes: false,
    })

    useEffect(() => {
        if (open) {
            loadClientes()
            loadEquipos()
            if (initialClientId) {
                setFormData(prev => ({ ...prev, cliente: initialClientId }))
            }
        }
    }, [open, initialClientId])

    const loadClientes = async () => {
        try {
            setLoadingClientes(true)
            const res = await fetch('/api/clientes')
            const data = await res.json()
            setClientes(data)
        } catch (error) {
            console.error('Error al cargar clientes:', error)
            toast({
                title: "Error",
                description: "No se pudieron cargar los clientes",
                variant: "destructive"
            })
        } finally {
            setLoadingClientes(false)
        }
    }

    const loadEquipos = async () => {
        try {
            const res = await fetch('/api/equipos')
            const data = await res.json()
            setEquipos(data)
        } catch (error) {
            console.error('Error al cargar equipos:', error)
        }
    }

    const checkSerialDuplicate = (serial: string) => {
        const exists = equipos.some((eq) => eq.numeroSerie?.toLowerCase() === serial.toLowerCase())
        setSerialDuplicate(exists)
        return exists
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.cliente) newErrors.cliente = "El cliente es obligatorio"
        if (!formData.marca.trim()) newErrors.marca = "La marca es obligatoria"
        if (!formData.modelo.trim()) newErrors.modelo = "El modelo es obligatorio"
        if (!formData.numero_serie.trim()) newErrors.numero_serie = "El número de serie es obligatorio"
        else if (serialDuplicate) newErrors.numero_serie = "Este número de serie ya está registrado"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            const equipoData = {
                clienteId: formData.cliente,
                tipo: "Laptop",
                marca: formData.marca,
                modelo: formData.modelo,
                numeroSerie: formData.numero_serie,
                color: formData.color || null,
                fechaIngreso: formData.fecha_ingreso,
                estadoFisico: formData.estado_fisico,
                accesoriosRecibidos: formData.accesorios_chips.length > 0
                    ? formData.accesorios_chips
                    : (formData.accesorios_texto ? [formData.accesorios_texto] : []),
                enciende: formData.enciende || null,
                tieneContrasena: formData.tiene_contrasena,
                contrasena: formData.contrasena || null,
                notas: formData.notas_generales || null,
            }

            const response = await fetch('/api/equipos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(equipoData),
            })

            if (!response.ok) {
                throw new Error('Error al registrar equipo')
            }

            toast({
                title: "Equipo registrado",
                description: "El equipo se ha registrado correctamente en la base de datos.",
            })

            onOpenChange(false)
            resetForm()
            if (onSuccess) onSuccess(await response.json())
        } catch (error) {
            console.error('Error al guardar equipo:', error)
            toast({
                title: "Error",
                description: "No se pudo registrar el equipo. Intenta de nuevo.",
                variant: "destructive",
            })
        }
    }

    const resetForm = () => {
        setFormData({
            cliente: "",
            marca: "",
            modelo: "",
            color: "",
            numero_serie: "",
            fecha_ingreso: new Date().toISOString().split("T")[0],
            fecha_ingreso: new Date().toISOString().split("T")[0],
            estado_fisico: "",
            accesorios_texto: "",
            accesorios_chips: [],
            enciende: "",
            tiene_contrasena: false,
            contrasena: "",
            no_proporciono_contrasena: false,
            notas_generales: "",
        })
        setErrors({})
        setSerialDuplicate(false)
    }

    const toggleSection = (section: keyof typeof collapsedSections) => {
        setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }))
    }

    const toggleAccessory = (accessory: string) => {
        setFormData((prev) => ({
            ...prev,
            accesorios_chips: prev.accesorios_chips.includes(accessory)
                ? prev.accesorios_chips.filter((a) => a !== accessory)
                : [...prev.accesorios_chips, accessory],
        }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-slate-100 flex items-center gap-2">
                        <Plus className="h-6 w-6 text-indigo-400" />
                        Registrar nuevo equipo
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section 1: Equipment Data */}
                    <div className="border border-slate-800 rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={() => toggleSection("equipmentData")}
                            className="w-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-4 flex items-center justify-between hover:from-indigo-600/30 hover:to-purple-600/30 transition-colors"
                        >
                            <span className="text-lg font-semibold text-slate-200">1. Datos del equipo</span>
                            {collapsedSections.equipmentData ? (
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                            ) : (
                                <ChevronUp className="h-5 w-5 text-slate-400" />
                            )}
                        </button>
                        {!collapsedSections.equipmentData && (
                            <div className="p-4 space-y-4 bg-slate-900/50">
                                <div className="space-y-2">
                                    <Label htmlFor="cliente" className="text-slate-200">
                                        Cliente <span className="text-red-400">*</span>
                                    </Label>
                                    <Select
                                        value={formData.cliente}
                                        onValueChange={(value) => setFormData({ ...formData, cliente: value })}
                                        disabled={loadingClientes}
                                    >
                                        <SelectTrigger
                                            className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.cliente ? "border-red-500" : ""}`}
                                        >
                                            <SelectValue placeholder={loadingClientes ? "Cargando clientes..." : "Seleccionar cliente"} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            {clientes.length === 0 ? (
                                                <SelectItem value="no-clientes" disabled>
                                                    {loadingClientes ? "Cargando..." : "No hay clientes registrados"}
                                                </SelectItem>
                                            ) : (
                                                clientes.map((cliente) => (
                                                    <SelectItem key={cliente.id} value={cliente.id}>
                                                        {cliente.nombre} - {cliente.telefono}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.cliente && <p className="text-xs text-red-400">{errors.cliente}</p>}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="marca" className="text-slate-200">
                                            Marca <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            id="marca"
                                            value={formData.marca}
                                            onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                                            placeholder="HP, Dell, Apple..."
                                            className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.marca ? "border-red-500" : ""}`}
                                        />
                                        {errors.marca && <p className="text-xs text-red-400">{errors.marca}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="modelo" className="text-slate-200">
                                            Modelo <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            id="modelo"
                                            value={formData.modelo}
                                            onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                                            placeholder="Pavilion 15, XPS 13..."
                                            className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.modelo ? "border-red-500" : ""}`}
                                        />
                                        {errors.modelo && <p className="text-xs text-red-400">{errors.modelo}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="color" className="text-slate-200">
                                            Color
                                        </Label>
                                        <Input
                                            id="color"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            placeholder="Negro, plata..."
                                            className="bg-slate-800 border-slate-700 text-slate-100"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="numero_serie" className="text-slate-200">
                                            Número de serie <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            id="numero_serie"
                                            value={formData.numero_serie}
                                            onChange={(e) => {
                                                setFormData({ ...formData, numero_serie: e.target.value })
                                                if (e.target.value.trim()) {
                                                    checkSerialDuplicate(e.target.value)
                                                } else {
                                                    setSerialDuplicate(false)
                                                }
                                            }}
                                            placeholder="Número único del equipo"
                                            className={`bg-slate-800 border-slate-700 text-slate-100 font-mono ${errors.numero_serie || serialDuplicate ? "border-red-500" : ""
                                                }`}
                                        />
                                        {serialDuplicate && (
                                            <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/30">
                                                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                                <span>Este número de serie ya existe en el sistema</span>
                                            </div>
                                        )}
                                        {errors.numero_serie && <p className="text-xs text-red-400">{errors.numero_serie}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fecha_ingreso" className="text-slate-200">
                                        Fecha de ingreso
                                    </Label>
                                    <Input
                                        id="fecha_ingreso"
                                        type="date"
                                        value={formData.fecha_ingreso}
                                        onChange={(e) => setFormData({ ...formData, fecha_ingreso: e.target.value })}
                                        className="bg-slate-800 border-slate-700 text-slate-100"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 2: Physical State */}
                    <div className="border border-slate-800 rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={() => toggleSection("physicalState")}
                            className="w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 flex items-center justify-between hover:from-purple-600/30 hover:to-pink-600/30 transition-colors"
                        >
                            <span className="text-lg font-semibold text-slate-200">2. Estado físico</span>
                            {collapsedSections.physicalState ? (
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                            ) : (
                                <ChevronUp className="h-5 w-5 text-slate-400" />
                            )}
                        </button>
                        {!collapsedSections.physicalState && (
                            <div className="p-4 bg-slate-900/50">
                                <Textarea
                                    value={formData.estado_fisico}
                                    onChange={(e) => setFormData({ ...formData, estado_fisico: e.target.value })}
                                    className="bg-slate-800 border-slate-700 text-slate-100 min-h-[100px]"
                                    placeholder="Describa el estado físico del equipo (golpes, rayones, bisagras, pantalla, etc.)"
                                />
                            </div>
                        )}
                    </div>

                    {/* Section 3: Accessories */}
                    <div className="border border-slate-800 rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={() => toggleSection("accessories")}
                            className="w-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-4 flex items-center justify-between hover:from-blue-600/30 hover:to-cyan-600/30 transition-colors"
                        >
                            <span className="text-lg font-semibold text-slate-200">3. Accesorios recibidos</span>
                            {collapsedSections.accessories ? (
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                            ) : (
                                <ChevronUp className="h-5 w-5 text-slate-400" />
                            )}
                        </button>
                        {!collapsedSections.accessories && (
                            <div className="p-4 space-y-4 bg-slate-900/50">
                                <div className="space-y-2">
                                    <Label className="text-slate-200">Accesorios comunes</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {accessoriesList.map((accessory) => (
                                            <button
                                                key={accessory}
                                                type="button"
                                                onClick={() => toggleAccessory(accessory)}
                                                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${formData.accesorios_chips.includes(accessory)
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                                    }`}
                                            >
                                                {accessory}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="accesorios_texto" className="text-slate-200">
                                        Otros accesorios (texto libre)
                                    </Label>
                                    <Textarea
                                        id="accesorios_texto"
                                        value={formData.accesorios_texto}
                                        onChange={(e) => setFormData({ ...formData, accesorios_texto: e.target.value })}
                                        className="bg-slate-800 border-slate-700 text-slate-100 min-h-[80px]"
                                        placeholder="Describe otros accesorios no listados..."
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 4: Initial Diagnosis */}
                    <div className="border border-slate-800 rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={() => toggleSection("diagnosis")}
                            className="w-full bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-4 flex items-center justify-between hover:from-green-600/30 hover:to-emerald-600/30 transition-colors"
                        >
                            <span className="text-lg font-semibold text-slate-200">4. Diagnóstico inicial</span>
                            {collapsedSections.diagnosis ? (
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                            ) : (
                                <ChevronUp className="h-5 w-5 text-slate-400" />
                            )}
                        </button>
                        {!collapsedSections.diagnosis && (
                            <div className="p-4 space-y-4 bg-slate-900/50">
                                <div className="space-y-2">
                                    <Label className="text-slate-200">¿El equipo enciende?</Label>
                                    <Select value={formData.enciende} onValueChange={(value) => setFormData({ ...formData, enciende: value })}>
                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            <SelectItem value="si">Sí</SelectItem>
                                            <SelectItem value="no">No</SelectItem>
                                            <SelectItem value="intermitente">Intermitente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="tiene_contrasena"
                                            checked={formData.tiene_contrasena}
                                            onCheckedChange={(checked) =>
                                                setFormData({ ...formData, tiene_contrasena: checked === true })
                                            }
                                            className="border-slate-600 data-[state=checked]:bg-green-600"
                                        />
                                        <Label htmlFor="tiene_contrasena" className="text-slate-300 cursor-pointer">
                                            ¿El equipo trae contraseña?
                                        </Label>
                                    </div>

                                    {formData.tiene_contrasena && (
                                        <>
                                            <Input
                                                placeholder="Contraseña proporcionada"
                                                value={formData.contrasena}
                                                onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                                                disabled={formData.no_proporciono_contrasena}
                                                className="bg-slate-800 border-slate-700 text-slate-100"
                                            />
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="no_proporciono"
                                                    checked={formData.no_proporciono_contrasena}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({ ...formData, no_proporciono_contrasena: checked === true, contrasena: "" })
                                                    }
                                                    className="border-slate-600 data-[state=checked]:bg-amber-600"
                                                />
                                                <Label htmlFor="no_proporciono" className="text-slate-400 cursor-pointer text-sm">
                                                    El cliente no proporcionó la contraseña
                                                </Label>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>



                    {/* Section 6: General Notes */}
                    <div className="border border-slate-800 rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={() => toggleSection("notes")}
                            className="w-full bg-gradient-to-r from-slate-600/20 to-slate-700/20 p-4 flex items-center justify-between hover:from-slate-600/30 hover:to-slate-700/30 transition-colors"
                        >
                            <span className="text-lg font-semibold text-slate-200">6. Notas generales</span>
                            {collapsedSections.notes ? (
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                            ) : (
                                <ChevronUp className="h-5 w-5 text-slate-400" />
                            )}
                        </button>
                        {!collapsedSections.notes && (
                            <div className="p-4 bg-slate-900/50">
                                <Textarea
                                    value={formData.notas_generales}
                                    onChange={(e) => setFormData({ ...formData, notas_generales: e.target.value })}
                                    className="bg-slate-800 border-slate-700 text-slate-100 min-h-[120px]"
                                    placeholder="Observaciones adicionales, comentarios del cliente, detalles relevantes..."
                                />
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false)
                                resetForm()
                            }}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                        >
                            Registrar equipo
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
