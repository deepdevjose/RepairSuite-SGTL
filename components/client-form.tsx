"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Info } from 'lucide-react'

interface ClientFormData {
  nombre1: string
  middle_name: string
  apellido_paterno: string
  apellido_materno: string
  telefono: string
  correo: string
  sexo: string
  edad: string
  calle: string
  numero: string
  colonia: string
  municipio: string
  estado: string
  pais: string
  rfc: string
  tipo_cliente: string
  notas_internas: string
  activo: boolean
}

interface ClientFormProps {
  onClose: () => void
  onSave?: (data: ClientFormData) => void
  initialData?: Partial<ClientFormData>
}

const existingClients = [
  { telefono: "5512345678", correo: "juan.perez@email.com", nombre: "Juan Pérez García" },
  { telefono: "5587654321", correo: "maria.gonzalez@email.com", nombre: "María González López" },
]

export function ClientForm({ onClose, onSave, initialData }: ClientFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<ClientFormData>({
    nombre1: initialData?.nombre1 || "",
    middle_name: initialData?.middle_name || "",
    apellido_paterno: initialData?.apellido_paterno || "",
    apellido_materno: initialData?.apellido_materno || "",
    telefono: initialData?.telefono || "",
    correo: initialData?.correo || "",
    sexo: initialData?.sexo || "",
    edad: initialData?.edad || "",
    calle: initialData?.calle || "",
    numero: initialData?.numero || "",
    colonia: initialData?.colonia || "",
    municipio: initialData?.municipio || "",
    estado: initialData?.estado || "",
    pais: initialData?.pais || "México",
    rfc: initialData?.rfc || "",
    tipo_cliente: initialData?.tipo_cliente || "",
    notas_internas: initialData?.notas_internas || "",
    activo: initialData?.activo ?? true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sectionsOpen, setSectionsOpen] = useState({
    personal: true,
    direccion: true,
    otros: true,
  })
  const [duplicateWarning, setDuplicateWarning] = useState<string>("")

  useEffect(() => {
    if (formData.rfc && formData.rfc.length > 0) {
      const rfcRegex = /^([A-ZÑ&]{3,4})?(\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))?([A-Z\d]{2}[A\d])?$/
      if (!rfcRegex.test(formData.rfc.toUpperCase())) {
        setErrors((prev) => ({ ...prev, rfc: "Formato de RFC inválido" }))
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.rfc
          return newErrors
        })
      }
    }
  }, [formData.rfc])

  useEffect(() => {
    if (formData.telefono.length >= 10 || formData.correo.includes("@")) {
      const duplicate = existingClients.find(
        (c) => c.telefono === formData.telefono || c.correo === formData.correo,
      )
      if (duplicate) {
        setDuplicateWarning(`Posible duplicado: ${duplicate.nombre}`)
      } else {
        setDuplicateWarning("")
      }
    }
  }, [formData.telefono, formData.correo])

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 10) {
      return numbers
    }
    return numbers.slice(0, 10)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre1.trim()) {
      newErrors.nombre1 = "El nombre es obligatorio"
    }

    if (!formData.apellido_paterno.trim()) {
      newErrors.apellido_paterno = "El apellido paterno es obligatorio"
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio"
    } else if (!/^\d{10}$/.test(formData.telefono.replace(/\D/g, ""))) {
      newErrors.telefono = "El teléfono debe tener 10 dígitos"
    }

    if (formData.correo && !/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "El formato del correo no es válido"
    }

    if (formData.edad && (isNaN(Number(formData.edad)) || Number(formData.edad) < 0)) {
      newErrors.edad = "La edad debe ser un número válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor, corrige los errores antes de continuar.",
        variant: "destructive",
      })
      return
    }

    if (onSave) {
      onSave(formData)
    }

    toast({
      title: "Cliente guardado",
      description: "Los datos del cliente se han guardado correctamente.",
    })

    onClose()
  }

  const suggestGenericRFC = () => {
    setFormData({ ...formData, rfc: "XAXX010101000" })
    toast({
      title: "RFC genérico aplicado",
      description: "Se ha asignado el RFC genérico para público en general.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {duplicateWarning && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-200">Cliente potencialmente duplicado</p>
            <p className="text-xs text-amber-300/80 mt-0.5">{duplicateWarning}</p>
          </div>
        </div>
      )}

      <div className="space-y-4 border border-slate-800/50 rounded-lg p-4 bg-slate-900/30">
        <button
          type="button"
          onClick={() => setSectionsOpen({ ...sectionsOpen, personal: !sectionsOpen.personal })}
          className="flex items-center justify-between w-full text-left group"
        >
          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-violet-400 transition-colors">
            Información personal
          </h3>
          {sectionsOpen.personal ? (
            <ChevronUp className="h-5 w-5 text-slate-400 group-hover:text-violet-400 transition-colors" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-violet-400 transition-colors" />
          )}
        </button>

        {sectionsOpen.personal && (
          <div className="space-y-4 pt-2 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre1" className="text-slate-200 flex items-center gap-1.5">
                  Nombre <span className="text-red-400">*</span>
                  {formData.nombre1 && !errors.nombre1 && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </Label>
                <Input
                  id="nombre1"
                  value={formData.nombre1}
                  onChange={(e) => setFormData({ ...formData, nombre1: e.target.value })}
                  className={`bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all ${
                    errors.nombre1 ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : ""
                  }`}
                />
                {errors.nombre1 && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.nombre1}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middle_name" className="text-slate-200">
                  Segundo nombre
                </Label>
                <Input
                  id="middle_name"
                  value={formData.middle_name}
                  onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido_paterno" className="text-slate-200 flex items-center gap-1.5">
                  Apellido paterno <span className="text-red-400">*</span>
                  {formData.apellido_paterno && !errors.apellido_paterno && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </Label>
                <Input
                  id="apellido_paterno"
                  value={formData.apellido_paterno}
                  onChange={(e) => setFormData({ ...formData, apellido_paterno: e.target.value })}
                  className={`bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all ${
                    errors.apellido_paterno ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : ""
                  }`}
                />
                {errors.apellido_paterno && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.apellido_paterno}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido_materno" className="text-slate-200">
                  Apellido materno
                </Label>
                <Input
                  id="apellido_materno"
                  value={formData.apellido_materno}
                  onChange={(e) => setFormData({ ...formData, apellido_materno: e.target.value })}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-slate-200 flex items-center gap-1.5">
                  Teléfono <span className="text-red-400">*</span>
                  {formData.telefono.length === 10 && !errors.telefono && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: formatPhone(e.target.value) })}
                  placeholder="5512345678"
                  maxLength={10}
                  className={`bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all ${
                    errors.telefono ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : ""
                  }`}
                />
                {errors.telefono && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.telefono}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="correo" className="text-slate-200 flex items-center gap-1.5">
                  Correo electrónico
                  {formData.correo && !errors.correo && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                </Label>
                <Input
                  id="correo"
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  className={`bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all ${
                    errors.correo ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : ""
                  }`}
                />
                {errors.correo && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.correo}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rfc" className="text-slate-200 flex items-center gap-1.5">
                  RFC
                  {formData.rfc && !errors.rfc && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="rfc"
                    value={formData.rfc}
                    onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                    className={`bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all ${
                      errors.rfc ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : ""
                    }`}
                    placeholder="XAXX010101000"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={suggestGenericRFC}
                    className="border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800 shrink-0"
                  >
                    Genérico
                  </Button>
                </div>
                {errors.rfc && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.rfc}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="sexo" className="text-slate-200">
                  Sexo
                </Label>
                <Select value={formData.sexo} onValueChange={(value) => setFormData({ ...formData, sexo: value })}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                    <SelectItem value="O">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edad" className="text-slate-200">
                  Edad
                </Label>
                <Input
                  id="edad"
                  type="number"
                  value={formData.edad}
                  onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                  className={`bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all ${
                    errors.edad ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : ""
                  }`}
                />
                {errors.edad && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.edad}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_cliente" className="text-slate-200">
                  Tipo de cliente
                </Label>
                <Select
                  value={formData.tipo_cliente}
                  onValueChange={(value) => setFormData({ ...formData, tipo_cliente: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="publico_general">Público general</SelectItem>
                    <SelectItem value="empresa">Empresa</SelectItem>
                    <SelectItem value="recurrente">Recurrente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 border border-slate-800/50 rounded-lg p-4 bg-slate-900/30">
        <button
          type="button"
          onClick={() => setSectionsOpen({ ...sectionsOpen, direccion: !sectionsOpen.direccion })}
          className="flex items-center justify-between w-full text-left group"
        >
          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-violet-400 transition-colors">
            Dirección
          </h3>
          {sectionsOpen.direccion ? (
            <ChevronUp className="h-5 w-5 text-slate-400 group-hover:text-violet-400 transition-colors" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-violet-400 transition-colors" />
          )}
        </button>

        {sectionsOpen.direccion && (
          <div className="space-y-4 pt-2 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="calle" className="text-slate-200">
                  Calle
                </Label>
                <Input
                  id="calle"
                  value={formData.calle}
                  onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero" className="text-slate-200">
                  Número
                </Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="colonia" className="text-slate-200">
                  Colonia
                </Label>
                <Input
                  id="colonia"
                  value={formData.colonia}
                  onChange={(e) => setFormData({ ...formData, colonia: e.target.value })}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipio" className="text-slate-200">
                  Municipio
                </Label>
                <Input
                  id="municipio"
                  value={formData.municipio}
                  onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="estado" className="text-slate-200">
                  Estado
                </Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pais" className="text-slate-200">
                  País
                </Label>
                <Input
                  id="pais"
                  value={formData.pais}
                  onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 border border-slate-800/50 rounded-lg p-4 bg-slate-900/30">
        <button
          type="button"
          onClick={() => setSectionsOpen({ ...sectionsOpen, otros: !sectionsOpen.otros })}
          className="flex items-center justify-between w-full text-left group"
        >
          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-violet-400 transition-colors">
            Otros datos
          </h3>
          {sectionsOpen.otros ? (
            <ChevronUp className="h-5 w-5 text-slate-400 group-hover:text-violet-400 transition-colors" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-violet-400 transition-colors" />
          )}
        </button>

        {sectionsOpen.otros && (
          <div className="space-y-4 pt-2 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="notas_internas" className="text-slate-200 flex items-center gap-1.5">
                Notas internas
                <Info className="h-3.5 w-3.5 text-slate-500" />
              </Label>
              <Textarea
                id="notas_internas"
                value={formData.notas_internas}
                onChange={(e) => setFormData({ ...formData, notas_internas: e.target.value })}
                placeholder="Información adicional visible solo para el personal..."
                rows={4}
                className="bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all resize-none"
              />
              <p className="text-xs text-slate-500">Solo visible para el personal del taller</p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="activo"
                checked={formData.activo}
                onCheckedChange={(checked) => setFormData({ ...formData, activo: !!checked })}
              />
              <Label htmlFor="activo" className="text-slate-200 cursor-pointer">
                Cliente activo
              </Label>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-slate-700/50 text-slate-300 bg-transparent hover:bg-slate-800/50"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:shadow-indigo-500/30 hover:scale-[1.02]"
        >
          Guardar cliente
        </Button>
      </div>
    </form>
  )
}
