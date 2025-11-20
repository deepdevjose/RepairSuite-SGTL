"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { NotificationTemplate } from "@/lib/types/config"
import { NOTIFICATION_VARIABLES } from "@/lib/types/config"
import { AlertCircle } from "lucide-react"

interface NotificationTemplateEditorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    template?: NotificationTemplate | null
    onSave?: (template: Partial<NotificationTemplate>) => void
}

export function NotificationTemplateEditor({ open, onOpenChange, template, onSave }: NotificationTemplateEditorProps) {
    const { toast } = useToast()
    const isEditing = !!template

    const [formData, setFormData] = useState({
        nombre: "",
        tipo: "WhatsApp" as "WhatsApp" | "Email" | "SMS",
        evento: "OS Creada" as "OS Creada" | "Listo para entrega" | "Cotización" | "Pago recibido" | "Recordatorio",
        asunto: "",
        mensaje: "",
        activo: true,
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (template) {
            setFormData({
                nombre: template.nombre,
                tipo: template.tipo,
                evento: template.evento,
                asunto: template.asunto || "",
                mensaje: template.mensaje,
                activo: template.activo,
            })
        } else {
            setFormData({
                nombre: "",
                tipo: "WhatsApp",
                evento: "OS Creada",
                asunto: "",
                mensaje: "",
                activo: true,
            })
        }
        setErrors({})
    }, [template, open])

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
        if (!formData.mensaje.trim()) newErrors.mensaje = "El mensaje es requerido"
        if (formData.tipo === "Email" && !formData.asunto.trim()) {
            newErrors.asunto = "El asunto es requerido para emails"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (!validate()) return

        const templateData: Partial<NotificationTemplate> = {
            nombre: formData.nombre,
            tipo: formData.tipo,
            evento: formData.evento,
            asunto: formData.tipo === "Email" ? formData.asunto : undefined,
            mensaje: formData.mensaje,
            activo: formData.activo,
        }

        onSave?.(templateData)

        toast({
            title: isEditing ? "Plantilla actualizada" : "Plantilla creada",
            description: `${formData.nombre} ha sido ${isEditing ? "actualizada" : "creada"} correctamente.`,
        })

        onOpenChange(false)
    }

    const insertVariable = (variable: string) => {
        const textarea = document.getElementById("mensaje") as HTMLTextAreaElement
        if (textarea) {
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const text = formData.mensaje
            const before = text.substring(0, start)
            const after = text.substring(end, text.length)
            setFormData({ ...formData, mensaje: before + variable + after })
            setTimeout(() => {
                textarea.focus()
                textarea.setSelectionRange(start + variable.length, start + variable.length)
            }, 0)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-slate-100 text-xl">
                        {isEditing ? "Editar Plantilla" : "Nueva Plantilla de Notificación"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre" className="text-slate-200">
                            Nombre de la Plantilla <span className="text-red-400">*</span>
                        </Label>
                        <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.nombre ? "border-red-500" : ""}`}
                            placeholder="OS Creada"
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
                            <Select
                                value={formData.tipo}
                                onValueChange={(value: "WhatsApp" | "Email" | "SMS") => setFormData({ ...formData, tipo: value })}
                            >
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    <SelectItem value="WhatsApp" className="text-slate-300">
                                        WhatsApp
                                    </SelectItem>
                                    <SelectItem value="Email" className="text-slate-300">
                                        Email
                                    </SelectItem>
                                    <SelectItem value="SMS" className="text-slate-300">
                                        SMS
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="evento" className="text-slate-200">
                                Evento
                            </Label>
                            <Select
                                value={formData.evento}
                                onValueChange={(
                                    value: "OS Creada" | "Listo para entrega" | "Cotización" | "Pago recibido" | "Recordatorio"
                                ) => setFormData({ ...formData, evento: value })}
                            >
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    <SelectItem value="OS Creada" className="text-slate-300">
                                        OS Creada
                                    </SelectItem>
                                    <SelectItem value="Listo para entrega" className="text-slate-300">
                                        Listo para entrega
                                    </SelectItem>
                                    <SelectItem value="Cotización" className="text-slate-300">
                                        Cotización
                                    </SelectItem>
                                    <SelectItem value="Pago recibido" className="text-slate-300">
                                        Pago recibido
                                    </SelectItem>
                                    <SelectItem value="Recordatorio" className="text-slate-300">
                                        Recordatorio
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {formData.tipo === "Email" && (
                        <div className="space-y-2">
                            <Label htmlFor="asunto" className="text-slate-200">
                                Asunto <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="asunto"
                                value={formData.asunto}
                                onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                                className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.asunto ? "border-red-500" : ""}`}
                                placeholder="Cotización para tu {equipo}"
                            />
                            {errors.asunto && (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.asunto}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="mensaje" className="text-slate-200">
                            Mensaje <span className="text-red-400">*</span>
                        </Label>
                        <Textarea
                            id="mensaje"
                            value={formData.mensaje}
                            onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                            className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.mensaje ? "border-red-500" : ""}`}
                            placeholder="Hola {cliente}, tu equipo {equipo} está listo..."
                            rows={4}
                        />
                        {errors.mensaje && (
                            <p className="text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.mensaje}
                            </p>
                        )}
                    </div>

                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Variables Disponibles</h4>
                        <p className="text-xs text-slate-400 mb-3">Haz clic en una variable para insertarla en el mensaje</p>
                        <div className="flex flex-wrap gap-2">
                            {NOTIFICATION_VARIABLES.map((variable) => (
                                <Badge
                                    key={variable.key}
                                    className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs cursor-pointer hover:bg-indigo-500/20"
                                    onClick={() => insertVariable(variable.key)}
                                >
                                    {variable.key}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="activo"
                            checked={formData.activo}
                            onCheckedChange={(checked) => setFormData({ ...formData, activo: checked as boolean })}
                            className="border-slate-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                        <label htmlFor="activo" className="text-sm text-slate-300 cursor-pointer">
                            Plantilla activa
                        </label>
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
                        {isEditing ? "Actualizar" : "Crear"} Plantilla
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
