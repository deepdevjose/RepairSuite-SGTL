"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

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
  activo: boolean
}

interface ClientFormProps {
  onClose: () => void
  onSave?: (data: ClientFormData) => void
  initialData?: Partial<ClientFormData>
}

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
    activo: initialData?.activo ?? true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Información personal</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nombre1" className="text-slate-200">
              Nombre <span className="text-red-400">*</span>
            </Label>
            <Input
              id="nombre1"
              value={formData.nombre1}
              onChange={(e) => setFormData({ ...formData, nombre1: e.target.value })}
              className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.nombre1 ? "border-red-500" : ""}`}
            />
            {errors.nombre1 && <p className="text-xs text-red-400">{errors.nombre1}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="middle_name" className="text-slate-200">
              Segundo nombre
            </Label>
            <Input
              id="middle_name"
              value={formData.middle_name}
              onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellido_paterno" className="text-slate-200">
              Apellido paterno <span className="text-red-400">*</span>
            </Label>
            <Input
              id="apellido_paterno"
              value={formData.apellido_paterno}
              onChange={(e) => setFormData({ ...formData, apellido_paterno: e.target.value })}
              className={`bg-slate-800 border-slate-700 text-slate-100 ${
                errors.apellido_paterno ? "border-red-500" : ""
              }`}
            />
            {errors.apellido_paterno && <p className="text-xs text-red-400">{errors.apellido_paterno}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellido_materno" className="text-slate-200">
              Apellido materno
            </Label>
            <Input
              id="apellido_materno"
              value={formData.apellido_materno}
              onChange={(e) => setFormData({ ...formData, apellido_materno: e.target.value })}
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="telefono" className="text-slate-200">
              Teléfono <span className="text-red-400">*</span>
            </Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="5512345678"
              className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.telefono ? "border-red-500" : ""}`}
            />
            {errors.telefono && <p className="text-xs text-red-400">{errors.telefono}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="correo" className="text-slate-200">
              Correo electrónico
            </Label>
            <Input
              id="correo"
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.correo ? "border-red-500" : ""}`}
            />
            {errors.correo && <p className="text-xs text-red-400">{errors.correo}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rfc" className="text-slate-200">
              RFC
            </Label>
            <Input
              id="rfc"
              value={formData.rfc}
              onChange={(e) => setFormData({ ...formData, rfc: e.target.value })}
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sexo" className="text-slate-200">
              Sexo
            </Label>
            <Select value={formData.sexo} onValueChange={(value) => setFormData({ ...formData, sexo: value })}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
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
              className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.edad ? "border-red-500" : ""}`}
            />
            {errors.edad && <p className="text-xs text-red-400">{errors.edad}</p>}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Dirección</h3>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="calle" className="text-slate-200">
              Calle
            </Label>
            <Input
              id="calle"
              value={formData.calle}
              onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
              className="bg-slate-800 border-slate-700 text-slate-100"
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
              className="bg-slate-800 border-slate-700 text-slate-100"
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
              className="bg-slate-800 border-slate-700 text-slate-100"
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
              className="bg-slate-800 border-slate-700 text-slate-100"
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
              className="bg-slate-800 border-slate-700 text-slate-100"
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
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Status */}
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

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-slate-700 text-slate-300 bg-transparent"
        >
          Cancelar
        </Button>
        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500">
          Guardar cliente
        </Button>
      </div>
    </form>
  )
}
