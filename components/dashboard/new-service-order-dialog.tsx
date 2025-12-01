"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { SERVICE_CATALOG, SOFTWARE_CATALOG, ServiceItem } from "@/lib/constants/service-catalog"
import { formatCurrency } from "@/lib/utils/sales-helpers"
import { AlertCircle, Calculator, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"

interface NewServiceOrderDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave?: (order: any) => void
    initialClientId?: string
    initialEquipmentId?: string
}

type Cliente = {
    id: string
    nombre: string
    telefono: string
}

type Equipo = {
    id: string
    clienteId: string
    tipo: string
    marca: string
    modelo: string
}

type Tecnico = {
    id: string
    nombre: string
}

export function NewServiceOrderDialog({ open, onOpenChange, onSave, initialClientId, initialEquipmentId }: NewServiceOrderDialogProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [equipos, setEquipos] = useState<Equipo[]>([])
    const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
    const [availableServices, setAvailableServices] = useState<ServiceItem[]>([])
    const [availableSoftware, setAvailableSoftware] = useState<ServiceItem[]>([])

    // Form State
    const [formData, setFormData] = useState({
        cliente: "",
        equipo: "",
        problemaReportado: "",
        tecnicoAsignado: "",
        tipoServicio: "diagnostico", // diagnostico | servicio_especifico
        serviciosSeleccionados: [] as string[], // IDs from catalog
        softwareSeleccionado: [] as string[], // IDs from catalog
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const resetForm = () => {
        setFormData({
            cliente: "",
            equipo: "",
            problemaReportado: "",
            tecnicoAsignado: "",
            tipoServicio: "diagnostico",
            serviciosSeleccionados: [],
            softwareSeleccionado: [],
        })
        setErrors({})
        setEquipos([])
    }

    const loadCatalog = async () => {
        try {
            const res = await fetch('/api/productos?tipo=Servicio')
            const data = await res.json()

            const services: ServiceItem[] = []
            const software: ServiceItem[] = []

            data.forEach((item: any) => {
                const serviceItem: ServiceItem = {
                    id: item.sku,
                    type: item.categoria === 'Software' ? 'instalacion_software' : 'mantenimiento', // Simplified mapping
                    label: item.nombre,
                    price: Number(item.precioVenta),
                    requiresDiagnosis: item.sku === 'diagnostico',
                    isSoftware: item.categoria === 'Software'
                }

                if (item.categoria === 'Software') {
                    software.push(serviceItem)
                } else {
                    services.push(serviceItem)
                }
            })

            setAvailableServices(services)
            setAvailableSoftware(software)
        } catch (error) {
            console.error('Error loading catalog:', error)
        }
    }

    const loadClientes = async () => {
        try {
            const res = await fetch('/api/clientes')
            const data = await res.json()
            setClientes(data)
        } catch (error) {
            console.error('Error al cargar clientes:', error)
        }
    }

    const loadEquipos = async (clienteId: string) => {
        try {
            setLoading(true)
            const res = await fetch(`/api/equipos?clienteId=${clienteId}`)
            const data = await res.json()
            setEquipos(data)
        } catch (error) {
            console.error('Error al cargar equipos:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadTecnicos = async () => {
        try {
            const res = await fetch('/api/tecnicos')
            const data = await res.json()
            setTecnicos(data)
        } catch (error) {
            console.error('Error al cargar técnicos:', error)
        }
    }

    // Load initial data
    useEffect(() => {
        if (open) {
            loadClientes()
            loadTecnicos()
            loadCatalog()

            if (initialClientId) {
                setFormData(prev => ({ ...prev, cliente: initialClientId }))
                // If we have both, set both. Equipment loading effect will handle the rest
                if (initialEquipmentId) {
                    // We need to wait for equipment to load, but we can set the ID
                    // The effect below handles loading equipments for the client
                    // We just need to ensure we select it after loading
                    setFormData(prev => ({ ...prev, cliente: initialClientId, equipo: initialEquipmentId }))
                }
            }
        } else {
            resetForm()
        }
    }, [open, initialClientId, initialEquipmentId])

    // Load equipments when client changes
    useEffect(() => {
        if (formData.cliente) {
            loadEquipos(formData.cliente)
        } else {
            setEquipos([])
        }
    }, [formData.cliente])

    // Calculate totals based on selection
    const financialSummary = useMemo(() => {
        let total = 0
        let anticipo = 0
        let items: ServiceItem[] = []

        if (formData.tipoServicio === 'diagnostico') {
            const diagItem = availableServices.find(s => s.id === 'diagnostico')
            if (diagItem) {
                total = diagItem.price
                anticipo = diagItem.price // Diagnosis is usually paid upfront or fully charged
                items.push(diagItem)
            } else {
                // Fallback if not in DB yet
                total = 150
                anticipo = 150
                items.push({
                    id: 'diagnostico',
                    type: 'diagnostico',
                    label: 'Diagnóstico General',
                    price: 150,
                    requiresDiagnosis: true
                })
            }
        } else {
            // Specific services
            formData.serviciosSeleccionados.forEach(id => {
                const item = availableServices.find(s => s.id === id)
                if (item) {
                    total += item.price
                    anticipo += item.price * 0.5 // 50% advance
                    items.push(item)
                }
            })

            // Software
            formData.softwareSeleccionado.forEach(id => {
                const item = availableSoftware.find(s => s.id === id)
                if (item) {
                    total += item.price
                    anticipo += item.price * 0.5 // 50% advance
                    items.push(item)
                }
            })
        }

        return { total, anticipo, items }
    }, [formData.tipoServicio, formData.serviciosSeleccionados, formData.softwareSeleccionado, availableServices, availableSoftware])

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.cliente) newErrors.cliente = "Debe seleccionar un cliente"
        if (!formData.equipo) newErrors.equipo = "Debe seleccionar un equipo"
        if (!formData.tecnicoAsignado) newErrors.tecnicoAsignado = "Debe asignar un técnico"

        if (formData.tipoServicio === 'diagnostico') {
            if (!formData.problemaReportado.trim()) newErrors.problemaReportado = "La descripción del problema es requerida para diagnóstico"
        } else {
            if (formData.serviciosSeleccionados.length === 0 && formData.softwareSeleccionado.length === 0) {
                newErrors.servicios = "Debe seleccionar al menos un servicio o software"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) {
            toast({
                title: "Error de validación",
                description: "Por favor completa todos los campos requeridos",
                variant: "destructive",
            })
            return
        }

        try {
            const ordenData = {
                clienteId: formData.cliente,
                equipoId: formData.equipo,
                tecnicoId: formData.tecnicoAsignado,
                problemaReportado: formData.tipoServicio === 'diagnostico'
                    ? formData.problemaReportado
                    : `Servicio Específico: ${financialSummary.items.map(i => i.label).join(', ')}`,
                prioridad: "Normal",
                tipoServicio: formData.tipoServicio,
                items: financialSummary.items.map(i => ({
                    id: i.id,
                    tipo: i.type,
                    nombre: i.label,
                    precio: i.price
                })),
                montoTotal: financialSummary.total,
                anticipoRequerido: financialSummary.anticipo,
                estado: "Esperando inicialización" // Initial state
            }

            const response = await fetch('/api/ordenes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ordenData),
            })

            if (!response.ok) {
                throw new Error('Error al crear orden')
            }

            const newOrder = await response.json()

            toast({
                title: "Orden de servicio creada",
                description: `Folio: ${newOrder.folio} - Anticipo requerido: ${formatCurrency(financialSummary.anticipo)}`,
            })

            onSave?.(newOrder)
            onOpenChange(false)
        } catch (error) {
            console.error('Error al crear orden:', error)
            toast({
                title: "Error",
                description: "No se pudo crear la orden de servicio. Intenta de nuevo.",
                variant: "destructive",
            })
        }
    }

    const toggleService = (id: string) => {
        setFormData(prev => {
            const current = prev.serviciosSeleccionados
            const updated = current.includes(id)
                ? current.filter(item => item !== id)
                : [...current, id]
            return { ...prev, serviciosSeleccionados: updated }
        })
    }

    const toggleSoftware = (id: string) => {
        setFormData(prev => {
            const current = prev.softwareSeleccionado
            const updated = current.includes(id)
                ? current.filter(item => item !== id)
                : [...current, id]
            return { ...prev, softwareSeleccionado: updated }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 w-full max-w-[95vw] h-[90vh] flex flex-col p-0 sm:max-w-[95vw]">
                <DialogHeader className="px-6 py-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl z-10 shrink-0">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                        Nueva Orden de Servicio
                    </DialogTitle>
                    <p className="text-sm text-slate-400 mt-1">
                        Complete la información para registrar la recepción del equipo.
                    </p>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                        {/* Left Column: Client & Equipment Info (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="space-y-5 p-5 bg-slate-950/30 rounded-xl border border-white/5">
                                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider border-b border-white/10 pb-2 flex items-center gap-2">
                                    <span className="bg-indigo-500/20 text-indigo-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                    Información del Cliente
                                </h3>

                                {/* Cliente */}
                                <div className="space-y-2">
                                    <Label htmlFor="cliente" className="text-slate-200">Cliente *</Label>
                                    <Select value={formData.cliente} onValueChange={(value) => setFormData({ ...formData, cliente: value, equipo: "" })}>
                                        <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100 h-10">
                                            <SelectValue placeholder="Seleccionar cliente" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10">
                                            {clientes.map((cliente) => (
                                                <SelectItem key={cliente.id} value={cliente.id}>
                                                    {cliente.nombre} - {cliente.telefono}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.cliente && <p className="text-xs text-red-400">{errors.cliente}</p>}
                                </div>

                                {/* Equipo */}
                                <div className="space-y-2">
                                    <Label htmlFor="equipo" className="text-slate-200">Equipo *</Label>
                                    <Select
                                        value={formData.equipo}
                                        onValueChange={(value) => setFormData({ ...formData, equipo: value })}
                                        disabled={!formData.cliente || loading}
                                    >
                                        <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100 h-10">
                                            <SelectValue placeholder={loading ? "Cargando..." : "Seleccionar equipo"} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10">
                                            {equipos.length === 0 ? (
                                                <SelectItem value="none" disabled>No hay equipos disponibles</SelectItem>
                                            ) : (
                                                equipos.map((equipo) => (
                                                    <SelectItem key={equipo.id} value={equipo.id}>
                                                        {equipo.marca} {equipo.modelo} ({equipo.tipo})
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.equipo && <p className="text-xs text-red-400">{errors.equipo}</p>}
                                </div>

                                {/* Técnico */}
                                <div className="space-y-2">
                                    <Label htmlFor="tecnico" className="text-slate-200">Técnico Asignado *</Label>
                                    <Select
                                        value={formData.tecnicoAsignado}
                                        onValueChange={(value) => setFormData({ ...formData, tecnicoAsignado: value })}
                                    >
                                        <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100 h-10">
                                            <SelectValue placeholder="Seleccionar técnico" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10">
                                            {tecnicos.map((tecnico) => (
                                                <SelectItem key={tecnico.id} value={tecnico.id}>
                                                    {tecnico.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.tecnicoAsignado && <p className="text-xs text-red-400">{errors.tecnicoAsignado}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Service Selection (8 cols) */}
                        <div className="lg:col-span-8 space-y-6 flex flex-col h-full">
                            <div className="space-y-4 flex flex-col h-full">
                                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider border-b border-white/10 pb-2 flex items-center gap-2 shrink-0">
                                    <span className="bg-indigo-500/20 text-indigo-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                    Detalles del Servicio
                                </h3>

                                <RadioGroup
                                    value={formData.tipoServicio}
                                    onValueChange={(val) => setFormData({ ...formData, tipoServicio: val })}
                                    className="grid grid-cols-2 gap-4 shrink-0"
                                >
                                    <div>
                                        <RadioGroupItem value="diagnostico" id="diagnostico" className="peer sr-only" />
                                        <Label
                                            htmlFor="diagnostico"
                                            className="flex items-center justify-center gap-3 text-center rounded-lg border-2 border-slate-700 bg-slate-800/50 p-3 hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:border-indigo-500 peer-data-[state=checked]:bg-indigo-500/10 peer-data-[state=checked]:text-indigo-400 cursor-pointer transition-all"
                                        >
                                            <AlertCircle className="h-5 w-5" />
                                            <span className="font-medium">Diagnóstico</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="servicio_especifico" id="servicio_especifico" className="peer sr-only" />
                                        <Label
                                            htmlFor="servicio_especifico"
                                            className="flex items-center justify-center gap-3 text-center rounded-lg border-2 border-slate-700 bg-slate-800/50 p-3 hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:border-indigo-500 peer-data-[state=checked]:bg-indigo-500/10 peer-data-[state=checked]:text-indigo-400 cursor-pointer transition-all"
                                        >
                                            <Calculator className="h-5 w-5" />
                                            <span className="font-medium">Servicio / Software</span>
                                        </Label>
                                    </div>
                                </RadioGroup>

                                <div className="flex-1 bg-slate-950/30 rounded-lg border border-white/5 p-4 relative overflow-hidden flex flex-col">
                                    {formData.tipoServicio === 'diagnostico' ? (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                            <div className="flex items-start gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                <AlertCircle className="h-6 w-6 text-blue-400 mt-0.5 shrink-0" />
                                                <div className="text-sm text-blue-200">
                                                    <p className="font-semibold mb-1 text-base">Modo Diagnóstico</p>
                                                    <p className="text-blue-200/70 leading-relaxed">
                                                        Se cobrará un monto fijo de <span className="text-blue-100 font-bold">{formatCurrency(150)}</span> por la revisión técnica.
                                                        <br />
                                                        Si el cliente acepta la reparación posterior, este monto se abonará al costo total del servicio.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="problema" className="text-slate-200">Descripción del Problema *</Label>
                                                <Textarea
                                                    id="problema"
                                                    value={formData.problemaReportado}
                                                    onChange={(e) => setFormData({ ...formData, problemaReportado: e.target.value })}
                                                    className="bg-slate-800/40 border-slate-700 text-slate-100 min-h-[200px] resize-none focus:ring-indigo-500/50 text-base"
                                                    placeholder="Describa detalladamente los síntomas que presenta el equipo..."
                                                />
                                                {errors.problemaReportado && <p className="text-xs text-red-400">{errors.problemaReportado}</p>}
                                            </div>
                                        </div>
                                    ) : (
                                        <ScrollArea className="flex-1 pr-4 -mr-2">
                                            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 pb-4">
                                                {/* Services List */}
                                                <div className="space-y-3">
                                                    <Label className="text-slate-400 text-xs uppercase font-semibold tracking-wider flex items-center gap-2 sticky top-0 bg-slate-900/95 backdrop-blur py-2 z-10">
                                                        <div className="h-px bg-slate-700 flex-1"></div>
                                                        Servicios Disponibles
                                                        <div className="h-px bg-slate-700 flex-1"></div>
                                                    </Label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {availableServices.filter(s => s.id !== 'diagnostico').map((service) => (
                                                            <div
                                                                key={service.id}
                                                                className={`flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-slate-800/50 ${formData.serviciosSeleccionados.includes(service.id)
                                                                    ? 'bg-indigo-500/10 border-indigo-500/50'
                                                                    : 'bg-slate-800/20 border-white/5'
                                                                    }`}
                                                                onClick={() => toggleService(service.id)}
                                                            >
                                                                <Checkbox
                                                                    id={service.id}
                                                                    checked={formData.serviciosSeleccionados.includes(service.id)}
                                                                    onCheckedChange={() => toggleService(service.id)}
                                                                    className="mt-1"
                                                                />
                                                                <div className="grid gap-1 leading-none flex-1">
                                                                    <label
                                                                        htmlFor={service.id}
                                                                        className="text-sm font-medium text-slate-200 cursor-pointer"
                                                                    >
                                                                        {service.label}
                                                                    </label>
                                                                    <div className="flex justify-between items-center mt-1">
                                                                        <span className="text-xs text-slate-400">Precio</span>
                                                                        <span className="text-sm font-semibold text-indigo-400">{formatCurrency(service.price)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Software List */}
                                                <div className="space-y-3">
                                                    <Label className="text-slate-400 text-xs uppercase font-semibold tracking-wider flex items-center gap-2 sticky top-0 bg-slate-900/95 backdrop-blur py-2 z-10">
                                                        <div className="h-px bg-slate-700 flex-1"></div>
                                                        Software
                                                        <div className="h-px bg-slate-700 flex-1"></div>
                                                    </Label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {availableSoftware.map((software) => (
                                                            <div
                                                                key={software.id}
                                                                className={`flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-slate-800/50 ${formData.softwareSeleccionado.includes(software.id)
                                                                    ? 'bg-indigo-500/10 border-indigo-500/50'
                                                                    : 'bg-slate-800/20 border-white/5'
                                                                    }`}
                                                                onClick={() => toggleSoftware(software.id)}
                                                            >
                                                                <Checkbox
                                                                    id={software.id}
                                                                    checked={formData.softwareSeleccionado.includes(software.id)}
                                                                    onCheckedChange={() => toggleSoftware(software.id)}
                                                                    className="mt-1"
                                                                />
                                                                <div className="grid gap-1 leading-none flex-1">
                                                                    <label
                                                                        htmlFor={software.id}
                                                                        className="text-sm font-medium text-slate-200 cursor-pointer"
                                                                    >
                                                                        {software.label}
                                                                    </label>
                                                                    <div className="flex justify-between items-center mt-1">
                                                                        <span className="text-xs text-slate-400">Precio</span>
                                                                        <span className="text-sm font-semibold text-indigo-400">{formatCurrency(software.price)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                {errors.servicios && <p className="text-xs text-red-400 text-center bg-red-500/10 p-2 rounded border border-red-500/20">{errors.servicios}</p>}
                                            </div>
                                        </ScrollArea>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer with Financial Summary */}
                <div className="bg-slate-900 border-t border-white/10 p-4 shrink-0 z-20">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 w-full md:w-auto">
                            <div className="flex items-center gap-6 bg-slate-800/50 rounded-lg p-3 border border-white/5">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Total Estimado</p>
                                    <p className="text-2xl font-bold text-slate-100">{formatCurrency(financialSummary.total)}</p>
                                </div>
                                <div className="h-10 w-px bg-white/10"></div>
                                <div>
                                    <p className="text-xs text-indigo-400 uppercase tracking-wider font-semibold">Anticipo a Cobrar</p>
                                    <p className="text-2xl font-bold text-indigo-400">{formatCurrency(financialSummary.anticipo)}</p>
                                </div>
                                <div className="hidden md:block flex-1 text-right text-xs text-slate-500 max-w-[250px] leading-tight ml-auto">
                                    {formData.tipoServicio === 'diagnostico'
                                        ? "El diagnóstico se cobra por adelantado."
                                        : "Se requiere 50% de anticipo para iniciar."}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <Button
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="flex-1 md:flex-none text-slate-400 hover:text-slate-300 h-12"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-500 min-w-[180px] h-12 text-base font-medium shadow-lg shadow-indigo-500/20"
                            >
                                {loading ? "Creando..." : "Crear Orden"}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent >
        </Dialog >
    )
}
