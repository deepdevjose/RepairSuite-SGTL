"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

interface ClientFormData {
  nombre1: string
  nombre2: string
  apellidoPaterno: string
  apellidoMaterno: string
  telefono: string
  email: string
  sexo: string
  edad: string
  calle: string
  numero: string
  colonia: string
  municipio: string
  estado: string
  pais: string
  rfc: string
  tipoCliente: string
  notas: string
  activo: boolean
}

interface ClientFormProps {
  onClose: () => void
  onSuccess?: (client?: any) => void
  initialData?: Partial<ClientFormData>
}

export function ClientForm({ onClose, onSuccess, initialData }: ClientFormProps) {
  const { toast } = useToast()
  const [sectionPersonal, setSectionPersonal] = useState(true)
  const [sectionDireccion, setSectionDireccion] = useState(false)
  const [sectionOtros, setSectionOtros] = useState(false)

  const [formData, setFormData] = useState<ClientFormData>({
    nombre1: initialData?.nombre1 || "",
    nombre2: initialData?.nombre2 || "",
    apellidoPaterno: initialData?.apellidoPaterno || "",
    apellidoMaterno: initialData?.apellidoMaterno || "",
    telefono: initialData?.telefono || "",
    email: initialData?.email || "",
    sexo: initialData?.sexo || "",
    edad: initialData?.edad || "",
    calle: initialData?.calle || "",
    numero: initialData?.numero || "",
    colonia: initialData?.colonia || "",
    municipio: initialData?.municipio || "",
    estado: initialData?.estado || "",
    pais: initialData?.pais || "México",
    rfc: initialData?.rfc || "",
    tipoCliente: initialData?.tipoCliente || "",
    notas: initialData?.notas || "",
    activo: initialData?.activo !== undefined ? initialData.activo : true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre1.trim()) {
      newErrors.nombre1 = "El primer nombre es requerido"
    }

    if (!formData.apellidoPaterno.trim()) {
      newErrors.apellidoPaterno = "El apellido paterno es requerido"
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido"
    } else if (formData.telefono.length < 10) {
      newErrors.telefono = "El teléfono debe tener al menos 10 dígitos"
    }

    if (formData.email && !formData.email.includes("@")) {
      newErrors.email = "El email no es válido"
    }

    if (formData.rfc && formData.rfc !== "XAXX010101000") {
      const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/
      if (!rfcPattern.test(formData.rfc)) {
        newErrors.rfc = "El RFC no tiene un formato válido"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const url = initialData ? `/api/clientes/${(initialData as any).id}` : '/api/clientes'
      const method = initialData ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Error al ${initialData ? 'actualizar' : 'crear'} cliente`)
      }

      const updatedClient = await response.json()

      toast({
        title: initialData ? "Cliente actualizado" : "Cliente creado",
        description: `El cliente se ha ${initialData ? 'actualizado' : 'registrado'} exitosamente`,
      })

      onSuccess?.(updatedClient)
      onClose()
    } catch (error) {
      console.error('Error al guardar cliente:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar el cliente. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof ClientFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const sugerirRFCGenerico = () => {
    handleChange('rfc', 'XAXX010101000')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Información Personal */}
      <div className="border border-slate-700/50 rounded-lg p-4 bg-slate-800/30">
        <button
          type="button"
          onClick={() => setSectionPersonal(!sectionPersonal)}
          className="flex items-center justify-between w-full mb-3 font-semibold text-slate-200"
        >
          Información Personal
          {sectionPersonal ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {sectionPersonal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre1" className="text-slate-200 flex items-center gap-1.5">
                  Primer Nombre <span className="text-red-400">*</span>
                  {formData.nombre1 && !errors.nombre1 && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </Label>
                <Input
                  id="nombre1"
                  value={formData.nombre1}
                  onChange={(e) => handleChange('nombre1', e.target.value)}
                  className={`bg-slate-800/50 border-slate-700/50 text-slate-100 ${errors.nombre1 ? 'border-red-500/50' : ''
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
                <Label htmlFor="nombre2" className="text-slate-200">Segundo Nombre</Label>
                <Input
                  id="nombre2"
                  value={formData.nombre2}
                  onChange={(e) => handleChange('nombre2', e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apellidoPaterno" className="text-slate-200 flex items-center gap-1.5">
                  Apellido Paterno <span className="text-red-400">*</span>
                  {formData.apellidoPaterno && !errors.apellidoPaterno && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </Label>
                <Input
                  id="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={(e) => handleChange('apellidoPaterno', e.target.value)}
                  className={`bg-slate-800/50 border-slate-700/50 text-slate-100 ${errors.apellidoPaterno ? 'border-red-500/50' : ''
                    }`}
                />
                {errors.apellidoPaterno && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.apellidoPaterno}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidoMaterno" className="text-slate-200">Apellido Materno</Label>
                <Input
                  id="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={(e) => handleChange('apellidoMaterno', e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-slate-200 flex items-center gap-1.5">
                  Teléfono <span className="text-red-400">*</span>
                  {formData.telefono && !errors.telefono && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  className={`bg-slate-800/50 border-slate-700/50 text-slate-100 ${errors.telefono ? 'border-red-500/50' : ''
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
                <Label htmlFor="email" className="text-slate-200 flex items-center gap-1.5">
                  Email
                  {formData.email && !errors.email && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`bg-slate-800/50 border-slate-700/50 text-slate-100 ${errors.email ? 'border-red-500/50' : ''
                    }`}
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
                <Label htmlFor="sexo" className="text-slate-200">Sexo</Label>
                <Select value={formData.sexo} onValueChange={(value) => handleChange('sexo', value)}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                    <SelectItem value="O">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edad" className="text-slate-200">Edad</Label>
                <Input
                  id="edad"
                  type="number"
                  value={formData.edad}
                  onChange={(e) => handleChange('edad', e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dirección */}
      <div className="border border-slate-700/50 rounded-lg p-4 bg-slate-800/30">
        <button
          type="button"
          onClick={() => setSectionDireccion(!sectionDireccion)}
          className="flex items-center justify-between w-full mb-3 font-semibold text-slate-200"
        >
          Dirección
          {sectionDireccion ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {sectionDireccion && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="calle" className="text-slate-200">Calle</Label>
                <Input
                  id="calle"
                  value={formData.calle}
                  onChange={(e) => handleChange('calle', e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero" className="text-slate-200">Número</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => handleChange('numero', e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colonia" className="text-slate-200">Colonia</Label>
              <Input
                id="colonia"
                value={formData.colonia}
                onChange={(e) => handleChange('colonia', e.target.value)}
                className="bg-slate-800/50 border-slate-700/50 text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="municipio" className="text-slate-200">Municipio / Delegación</Label>
                <Input
                  id="municipio"
                  value={formData.municipio}
                  onChange={(e) => handleChange('municipio', e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado" className="text-slate-200">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => handleChange('estado', e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pais" className="text-slate-200">País</Label>
              <Input
                id="pais"
                value={formData.pais}
                onChange={(e) => handleChange('pais', e.target.value)}
                className="bg-slate-800/50 border-slate-700/50 text-slate-100"
              />
            </div>
          </div>
        )}
      </div>

      {/* Otros Datos */}
      <div className="border border-slate-700/50 rounded-lg p-4 bg-slate-800/30">
        <button
          type="button"
          onClick={() => setSectionOtros(!sectionOtros)}
          className="flex items-center justify-between w-full mb-3 font-semibold text-slate-200"
        >
          Otros Datos
          {sectionOtros ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {sectionOtros && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rfc" className="text-slate-200 flex items-center gap-1.5">
                RFC
                {formData.rfc && !errors.rfc && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                )}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="rfc"
                  value={formData.rfc}
                  onChange={(e) => handleChange('rfc', e.target.value.toUpperCase())}
                  placeholder="XAXX010101000"
                  className={`bg-slate-800/50 border-slate-700/50 text-slate-100 ${errors.rfc ? 'border-red-500/50' : ''
                    }`}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={sugerirRFCGenerico}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800"
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

            <div className="space-y-2">
              <Label htmlFor="tipoCliente" className="text-slate-200">Tipo de Cliente</Label>
              <Select value={formData.tipoCliente} onValueChange={(value) => handleChange('tipoCliente', value)}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publico_general">Público General</SelectItem>
                  <SelectItem value="empresa">Empresa</SelectItem>
                  <SelectItem value="recurrente">Recurrente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas" className="text-slate-200">Notas Internas</Label>
              <Textarea
                id="notas"
                value={formData.notas}
                onChange={(e) => handleChange('notas', e.target.value)}
                rows={4}
                className="bg-slate-800/50 border-slate-700/50 text-slate-100 resize-none"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/50">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            initialData ? 'Actualizar cliente' : 'Guardar cliente'
          )}
        </Button>
      </div>
    </form>
  )
}
