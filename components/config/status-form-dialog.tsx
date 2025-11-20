"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { OrderStatus, OrderStatusType } from "@/lib/types/config"
import { AlertCircle } from "lucide-react"

interface StatusFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    status?: OrderStatus | null
    onSave?: (status: Partial<OrderStatus>) => void
}

const COLORS = [
    { value: "#3b82f6", label: "Azul" },
    { value: "#8b5cf6", label: "Púrpura" },
    { value: "#f59e0b", label: "Ámbar" },
    { value: "#10b981", label: "Verde" },
    { value: "#6366f1", label: "Índigo" },
    { value: "#f97316", label: "Naranja" },
    { value: "#22c55e", label: "Verde claro" },
    { value: "#059669", label: "Esmeralda" },
    { value: "#14b8a6", label: "Teal" },
    { value: "#ef4444", label: "Rojo" },
    { value: "#6b7280", label: "Gris" },
]

export function StatusFormDialog({ open, onOpenChange, status, onSave }: StatusFormDialogProps) {
    const { toast } = useToast()
    const isEditing = !!status

    const [formData, setFormData] = useState({
        nombre: "",
        tipo: "Proceso" as OrderStatusType,
        color: "#3b82f6",
        descripcion: "",
        notificarCliente: false,
        mensajeNotificacion: "",
        cambiarEstadoPago: false,
        nuevoEstadoPago: "Pendiente" as "Pendiente" | "Parcial" | "Pagado",
        cerrarOrden: false,
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (status) {
            setFormData({
                nombre: status.nombre,
                tipo: status.tipo,
                color: status.color,
                descripcion: status.descripcion || "",
                notificarCliente: status.notificarCliente,
                mensajeNotificacion: status.mensajeNotificacion || "",
                cambiarEstadoPago: status.cambiarEstadoPago,
                nuevoEstadoPago: status.nuevoEstadoPago || "Pendiente",
                cerrarOrden: status.cerrarOrden,
            })
        } else {
            setFormData({
                nombre: "",
                tipo: "Proceso",
                color: "#3b82f6",
                descripcion: "",
                notificarCliente: false,
                mensajeNotificacion: "",
                cambiarEstadoPago: false,
                nuevoEstadoPago: "Pendiente",
                cerrarOrden: false,
            })
        }
        setErrors({})
    }, [status, open])

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
        if (formData.notificarCliente && !formData.mensajeNotificacion.trim()) {
            newErrors.mensajeNotificacion = "El mensaje es requerido si se notifica al cliente"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (!validate()) return

        const statusData: Partial<OrderStatus> = {
            nombre: formData.nombre,
            tipo: formData.tipo,
            color: formData.color,
            descripcion: formData.descripcion,
            notificarCliente: formData.notificarCliente,
            mensajeNotificacion: formData.notificarCliente ? formData.mensajeNotificacion : undefined,
            cambiarEstadoPago: formData.cambiarEstadoPago,
            nuevoEstadoPago: formData.cambiarEstadoPago ? formData.nuevoEstadoPago : undefined,
            cerrarOrden: formData.cerrarOrden,
        }

        onSave?.(statusData)

        toast({
            title: isEditing ? "Estado actualizado" : "Estado creado",
            description: `${formData.nombre} ha sido ${isEditing ? "actualizado" : "agregado"} correctamente.`,
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-slate-100 text-xl">
                        {isEditing ? "Editar Estado" : "Nuevo Estado"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre" className="text-slate-200">
                            Nombre del Estado <span className="text-red-400">*</span>
                        </Label>
                        <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.nombre ? "border-red-500" : ""}`}
                            placeholder="En diagnóstico"
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
                            <Label htmlFor="tipo" className="text-slate-200">
                                Tipo
                            </Label>
                            <Select value={formData.tipo} onValueChange={(value: OrderStatusType) => setFormData({ ...formData, tipo: value })}>
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    <SelectItem value="Proceso" className="text-slate-300">
                                        Proceso
                                    </SelectItem>
                                    <SelectItem value="Aprobación" className="text-slate-300">
                                        Aprobación
                                    </SelectItem>
                                    <SelectItem value="Pago" className="text-slate-300">
                                        Pago
                                    </SelectItem>
                                    <SelectItem value="Entrega" className="text-slate-300">
                                        Entrega
                                    </SelectItem>
                                    <SelectItem value="Cierre" className="text-slate-300">
                                        Cierre
                                    </SelectItem>
                                    <SelectItem value="Cancelación" className="text-slate-300">
                                        Cancelación
                                    </SelectItem>
                                    <SelectItem value="Automático" className="text-slate-300">
                                        Automático
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="color" className="text-slate-200">
                                Color
                            </Label>
                            <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    {COLORS.map((color) => (
                                        <SelectItem key={color.value} value={color.value} className="text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
                                                {color.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descripcion" className="text-slate-200">
                            Descripción
                        </Label>
                        <Textarea
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            className="bg-slate-800 border-slate-700 text-slate-100"
                            placeholder="Descripción del estado..."
                            rows={2}
                        />
                    </div>

                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 space-y-3">
                        <h4 className="text-sm font-semibold text-slate-300">Automaciones</h4>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="notificarCliente"
                                    checked={formData.notificarCliente}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, notificarCliente: checked as boolean })
                                    }
                                    className="border-slate-600"
                                />
                                <label htmlFor="notificarCliente" className="text-sm text-slate-300 cursor-pointer">
                                    Notificar al cliente
                                </label>
                            </div>

                            {formData.notificarCliente && (
                                <div className="ml-6 space-y-2">
                                    <Label htmlFor="mensajeNotificacion" className="text-slate-200 text-xs">
                                        Mensaje de notificación
                                    </Label>
                                    <Textarea
                                        id="mensajeNotificacion"
                                        value={formData.mensajeNotificacion}
                                        onChange={(e) => setFormData({ ...formData, mensajeNotificacion: e.target.value })}
                                        className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.mensajeNotificacion ? "border-red-500" : ""}`}
                                        placeholder="Usa {cliente}, {equipo}, {folio}, etc."
                                        rows={2}
                                    />
                                    {errors.mensajeNotificacion && (
                                        <p className="text-xs text-red-400 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.mensajeNotificacion}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="cambiarEstadoPago"
                                    checked={formData.cambiarEstadoPago}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, cambiarEstadoPago: checked as boolean })
                                    }
                                    className="border-slate-600"
                                />
                                <label htmlFor="cambiarEstadoPago" className="text-sm text-slate-300 cursor-pointer">
                                    Cambiar estado de pago
                                </label>
                            </div>

                            {formData.cambiarEstadoPago && (
                                <div className="ml-6">
                                    <Select
                                        value={formData.nuevoEstadoPago}
                                        onValueChange={(value: "Pendiente" | "Parcial" | "Pagado") =>
                                            setFormData({ ...formData, nuevoEstadoPago: value })
                                        }
                                    >
                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700">
                                            <SelectItem value="Pendiente" className="text-slate-300">
                                                Pendiente
                                            </SelectItem>
                                            <SelectItem value="Parcial" className="text-slate-300">
                                                Parcial
                                            </SelectItem>
                                            <SelectItem value="Pagado" className="text-slate-300">
                                                Pagado
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="cerrarOrden"
                                checked={formData.cerrarOrden}
                                onCheckedChange={(checked) => setFormData({ ...formData, cerrarOrden: checked as boolean })}
                                className="border-slate-600"
                            />
                            <label htmlFor="cerrarOrden" className="text-sm text-slate-300 cursor-pointer">
                                Cerrar orden automáticamente
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
                        {isEditing ? "Actualizar" : "Crear"} Estado
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
