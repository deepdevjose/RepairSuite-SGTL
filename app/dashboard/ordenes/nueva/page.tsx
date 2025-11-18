"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { DashboardHeader } from "@/components/dashboard-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Check, Upload, X, Plus, Trash2, FileText, MessageSquare, CheckCircle2, DollarSign, Wrench, Package } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface QuoteItem {
  id: string
  sku: string
  descripcion: string
  cantidad: number
  precio: number
}

export default function NuevaOrdenPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const totalSteps = 7

  // Form data
  const [formData, setFormData] = useState({
    cliente: "",
    equipo: "",
    // Paso 2 - Recepción
    accesorios: [] as string[],
    otros_accesorios: "",
    notas_recepcion: "",
    password_equipo: "",
    sin_password: false,
    // Estado físico
    pantalla_rota: false,
    bisagras_danadas: false,
    teclado_danado: false,
    carcasa_rayada: false,
    golpes_visibles: false,
    // Paso 3 - Diagnóstico
    diagnostico_tecnico: "",
    fallas_comunes: [] as string[],
    // Paso 4 - Cotización
    items_cotizacion: [] as QuoteItem[],
    // Paso 5 - Aprobación
    cotizacion_aprobada: false,
    // Paso 6 - Reparación
    piezas_utilizadas: [] as string[],
    // Paso 7 - Entrega
    monto_pagado: 0,
    metodo_pago: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const accesoriosDisponibles = ["Cargador", "Mouse", "Estuche/Funda", "Cable HDMI", "Adaptadores", "Teclado externo"]

  const fallasComunes = [
    "No enciende",
    "Pantalla sin imagen",
    "Sobrecalentamiento",
    "Ruido en ventilador",
    "Teclado no funciona",
    "Touchpad no responde",
    "Batería no carga",
    "Puertos USB dañados",
  ]

  const toggleAccesorio = (accesorio: string) => {
    setFormData({
      ...formData,
      accesorios: formData.accesorios.includes(accesorio)
        ? formData.accesorios.filter((a) => a !== accesorio)
        : [...formData.accesorios, accesorio],
    })
  }

  const toggleFalla = (falla: string) => {
    setFormData({
      ...formData,
      fallas_comunes: formData.fallas_comunes.includes(falla)
        ? formData.fallas_comunes.filter((f) => f !== falla)
        : [...formData.fallas_comunes, falla],
    })
  }

  const addQuoteItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      sku: "",
      descripcion: "",
      cantidad: 1,
      precio: 0,
    }
    setFormData({ ...formData, items_cotizacion: [...formData.items_cotizacion, newItem] })
  }

  const removeQuoteItem = (id: string) => {
    setFormData({
      ...formData,
      items_cotizacion: formData.items_cotizacion.filter((item) => item.id !== id),
    })
  }

  const updateQuoteItem = (id: string, field: keyof QuoteItem, value: any) => {
    setFormData({
      ...formData,
      items_cotizacion: formData.items_cotizacion.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    })
  }

  const calculateTotal = () => {
    return formData.items_cotizacion.reduce((sum, item) => sum + item.cantidad * item.precio, 0)
  }

  const calculateTax = () => {
    return calculateTotal() * 0.16
  }

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.cliente) newErrors.cliente = "Debe seleccionar un cliente"
      if (!formData.equipo) newErrors.equipo = "Debe seleccionar un equipo"
    }

    if (currentStep === 2) {
      if (!formData.notas_recepcion.trim()) {
        newErrors.notas_recepcion = "Las notas de recepción son obligatorias"
      }
    }

    if (currentStep === 3) {
      if (!formData.diagnostico_tecnico.trim()) {
        newErrors.diagnostico_tecnico = "El diagnóstico técnico es obligatorio"
      }
    }

    if (currentStep === 4) {
      if (formData.items_cotizacion.length === 0) {
        newErrors.items_cotizacion = "Debe agregar al menos un item a la cotización"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = () => {
    if (validateStep(step)) {
      toast({
        title: "Orden de servicio creada",
        description: "La OS se ha creado y está lista para seguimiento.",
      })
      router.push("/dashboard/ordenes")
    }
  }

  return (
    <>
      <DashboardHeader title="Nueva Orden de Servicio" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Progress Bar */}
          <Card className="bg-slate-900/50 border-slate-800 p-6 backdrop-blur-sm">
            <div className="space-y-4">
              {/* Step indicators */}
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4, 5, 6, 7].map((stepNum, idx) => (
                  <div key={stepNum} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all ${
                          step >= stepNum
                            ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {step > stepNum ? <Check className="h-5 w-5" /> : stepNum}
                      </div>
                      <span
                        className={`mt-2 text-xs font-medium text-center ${
                          step >= stepNum ? "text-indigo-400" : "text-slate-500"
                        }`}
                      >
                        {
                          [
                            "Cliente",
                            "Recepción",
                            "Diagnóstico",
                            "Cotización",
                            "Aprobación",
                            "Reparación",
                            "Entrega",
                          ][idx]
                        }
                      </span>
                    </div>
                    {idx < 6 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 transition-all ${
                          step > stepNum ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "bg-slate-800"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Step Content */}
          <Card className="bg-slate-900/50 border-slate-800 p-8 backdrop-blur-sm">
            {/* PASO 1 - Cliente y Equipo */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">Paso 1: Cliente y Equipo</h2>
                    <p className="text-sm text-slate-400">Selecciona el cliente y el equipo a reparar</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="cliente" className="text-slate-200 font-medium">
                      Cliente <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.cliente}
                      onValueChange={(value) => setFormData({ ...formData, cliente: value })}
                    >
                      <SelectTrigger
                        className={`bg-slate-800 border-slate-700 text-slate-100 h-11 ${
                          errors.cliente ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="1">Juan Pérez García</SelectItem>
                        <SelectItem value="2">María González López</SelectItem>
                        <SelectItem value="3">Pedro Ramírez Sánchez</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.cliente && <p className="text-xs text-red-400">{errors.cliente}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="equipo" className="text-slate-200 font-medium">
                      Equipo <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.equipo}
                      onValueChange={(value) => setFormData({ ...formData, equipo: value })}
                    >
                      <SelectTrigger
                        className={`bg-slate-800 border-slate-700 text-slate-100 h-11 ${
                          errors.equipo ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Seleccionar equipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="1">HP Pavilion 15 - HP123456789</SelectItem>
                        <SelectItem value="2">MacBook Pro 13" - MBP987654321</SelectItem>
                        <SelectItem value="3">Dell XPS 15 - DELL456789123</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.equipo && <p className="text-xs text-red-400">{errors.equipo}</p>}
                  </div>

                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-400">
                      💡 Si el equipo no está registrado, puedes agregarlo desde el módulo de Equipos.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 2 - Recepción */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
                    <Package className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">Paso 2: Recepción del Equipo</h2>
                    <p className="text-sm text-slate-400">Registra el estado y accesorios recibidos</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Accesorios recibidos */}
                  <div className="space-y-3">
                    <Label className="text-slate-200 font-medium">Accesorios recibidos</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {accesoriosDisponibles.map((acc) => (
                        <div
                          key={acc}
                          onClick={() => toggleAccesorio(acc)}
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.accesorios.includes(acc)
                              ? "bg-indigo-600/20 border-indigo-600/50 text-indigo-300"
                              : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
                          }`}
                        >
                          <Checkbox checked={formData.accesorios.includes(acc)} />
                          <span className="text-sm">{acc}</span>
                        </div>
                      ))}
                    </div>
                    <Input
                      placeholder="Otros accesorios..."
                      value={formData.otros_accesorios}
                      onChange={(e) => setFormData({ ...formData, otros_accesorios: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-slate-100 mt-2"
                    />
                  </div>

                  {/* Estado físico */}
                  <div className="space-y-3">
                    <Label className="text-slate-200 font-medium">Estado físico del equipo</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: "pantalla_rota", label: "Pantalla rota" },
                        { key: "bisagras_danadas", label: "Bisagras dañadas" },
                        { key: "teclado_danado", label: "Teclado dañado" },
                        { key: "carcasa_rayada", label: "Carcasa rayada" },
                        { key: "golpes_visibles", label: "Golpes visibles" },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                        >
                          <Checkbox
                            checked={formData[item.key as keyof typeof formData] as boolean}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, [item.key]: checked })
                            }
                          />
                          <span className="text-sm text-slate-300">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contraseña del equipo */}
                  <div className="space-y-3">
                    <Label htmlFor="password_equipo" className="text-slate-200 font-medium">
                      Contraseña del equipo
                    </Label>
                    <Input
                      id="password_equipo"
                      type="text"
                      disabled={formData.sin_password}
                      value={formData.password_equipo}
                      onChange={(e) => setFormData({ ...formData, password_equipo: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-slate-100"
                      placeholder="Contraseña proporcionada por el cliente"
                    />
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={formData.sin_password}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, sin_password: checked as boolean, password_equipo: "" })
                        }
                      />
                      <span className="text-sm text-slate-400">El cliente no proporcionó contraseña</span>
                    </div>
                  </div>

                  {/* Fotos del equipo */}
                  <div className="space-y-3">
                    <Label className="text-slate-200 font-medium">Fotos del equipo</Label>
                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-slate-600 transition-colors cursor-pointer">
                      <Upload className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                      <p className="text-sm text-slate-400">
                        Click para subir fotos o arrastra aquí
                      </p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG hasta 10MB</p>
                    </div>
                  </div>

                  {/* Notas de recepción */}
                  <div className="space-y-2">
                    <Label htmlFor="notas_recepcion" className="text-slate-200 font-medium">
                      Notas de recepción <span className="text-red-400">*</span>
                    </Label>
                    <Textarea
                      id="notas_recepcion"
                      value={formData.notas_recepcion}
                      onChange={(e) => setFormData({ ...formData, notas_recepcion: e.target.value })}
                      className={`bg-slate-800 border-slate-700 text-slate-100 min-h-[120px] ${
                        errors.notas_recepcion ? "border-red-500" : ""
                      }`}
                      placeholder="Describe el motivo de ingreso, observaciones iniciales, quejas del cliente..."
                    />
                    {errors.notas_recepcion && <p className="text-xs text-red-400">{errors.notas_recepcion}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* PASO 3 - Diagnóstico */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">Paso 3: Diagnóstico Técnico</h2>
                    <p className="text-sm text-slate-400">Registra el diagnóstico y fallas detectadas</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Checklist de fallas comunes */}
                  <div className="space-y-3">
                    <Label className="text-slate-200 font-medium">Fallas detectadas</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {fallasComunes.map((falla) => (
                        <div
                          key={falla}
                          onClick={() => toggleFalla(falla)}
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.fallas_comunes.includes(falla)
                              ? "bg-red-600/20 border-red-600/50 text-red-300"
                              : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
                          }`}
                        >
                          <Checkbox checked={formData.fallas_comunes.includes(falla)} />
                          <span className="text-sm">{falla}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Diagnóstico detallado */}
                  <div className="space-y-2">
                    <Label htmlFor="diagnostico_tecnico" className="text-slate-200 font-medium">
                      Diagnóstico técnico detallado <span className="text-red-400">*</span>
                    </Label>
                    <Textarea
                      id="diagnostico_tecnico"
                      value={formData.diagnostico_tecnico}
                      onChange={(e) => setFormData({ ...formData, diagnostico_tecnico: e.target.value })}
                      className={`bg-slate-800 border-slate-700 text-slate-100 min-h-[200px] ${
                        errors.diagnostico_tecnico ? "border-red-500" : ""
                      }`}
                      placeholder="Describe en detalle los problemas encontrados, pruebas realizadas, componentes afectados..."
                    />
                    {errors.diagnostico_tecnico && (
                      <p className="text-xs text-red-400">{errors.diagnostico_tecnico}</p>
                    )}
                  </div>

                  {/* Botón agregar evidencia */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Agregar evidencia fotográfica
                  </Button>

                  <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-amber-400">
                      ⚠️ Asegúrate de documentar todas las fallas detectadas antes de generar la cotización.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 4 - Cotización */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">Paso 4: Cotización</h2>
                    <p className="text-sm text-slate-400">Genera la cotización de servicios y piezas</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Tabla de items */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-200 font-medium">Items de cotización</Label>
                      <Button
                        type="button"
                        size="sm"
                        onClick={addQuoteItem}
                        className="bg-indigo-600 hover:bg-indigo-500"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar item
                      </Button>
                    </div>

                    {formData.items_cotizacion.length > 0 ? (
                      <div className="border border-slate-700 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-800/50">
                              <tr>
                                <th className="text-left p-3 text-sm font-medium text-slate-400">SKU</th>
                                <th className="text-left p-3 text-sm font-medium text-slate-400">Descripción</th>
                                <th className="text-center p-3 text-sm font-medium text-slate-400">Cantidad</th>
                                <th className="text-right p-3 text-sm font-medium text-slate-400">Precio</th>
                                <th className="text-right p-3 text-sm font-medium text-slate-400">Total</th>
                                <th className="text-center p-3 text-sm font-medium text-slate-400">Acción</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.items_cotizacion.map((item) => (
                                <tr key={item.id} className="border-t border-slate-700">
                                  <td className="p-2">
                                    <Input
                                      value={item.sku}
                                      onChange={(e) => updateQuoteItem(item.id, "sku", e.target.value)}
                                      className="bg-slate-800 border-slate-700 text-slate-100 h-9"
                                      placeholder="SKU..."
                                    />
                                  </td>
                                  <td className="p-2">
                                    <Input
                                      value={item.descripcion}
                                      onChange={(e) => updateQuoteItem(item.id, "descripcion", e.target.value)}
                                      className="bg-slate-800 border-slate-700 text-slate-100 h-9"
                                      placeholder="Descripción..."
                                    />
                                  </td>
                                  <td className="p-2">
                                    <Input
                                      type="number"
                                      min="1"
                                      value={item.cantidad}
                                      onChange={(e) =>
                                        updateQuoteItem(item.id, "cantidad", parseInt(e.target.value) || 1)
                                      }
                                      className="bg-slate-800 border-slate-700 text-slate-100 h-9 text-center"
                                    />
                                  </td>
                                  <td className="p-2">
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={item.precio}
                                      onChange={(e) =>
                                        updateQuoteItem(item.id, "precio", parseFloat(e.target.value) || 0)
                                      }
                                      className="bg-slate-800 border-slate-700 text-slate-100 h-9 text-right"
                                      placeholder="0.00"
                                    />
                                  </td>
                                  <td className="p-2 text-right">
                                    <span className="text-emerald-400 font-medium">
                                      ${(item.cantidad * item.precio).toFixed(2)}
                                    </span>
                                  </td>
                                  <td className="p-2 text-center">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => removeQuoteItem(item.id)}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Totales */}
                        <div className="bg-slate-800/50 p-4 space-y-2 border-t border-slate-700">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Subtotal:</span>
                            <span className="text-slate-200 font-medium">${calculateTotal().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">IVA (16%):</span>
                            <span className="text-slate-200 font-medium">${calculateTax().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-700">
                            <span className="text-slate-200">Total:</span>
                            <span className="text-emerald-400">
                              ${(calculateTotal() + calculateTax()).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-700 rounded-lg p-12 text-center">
                        <DollarSign className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400">No hay items en la cotización</p>
                        <p className="text-sm text-slate-500 mt-1">Haz click en "Agregar item" para comenzar</p>
                      </div>
                    )}

                    {errors.items_cotizacion && (
                      <p className="text-xs text-red-400">{errors.items_cotizacion}</p>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generar PDF
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Enviar WhatsApp
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-green-700 text-green-400 hover:bg-green-500/10"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Guardar cotización
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 5 - Aprobación */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">Paso 5: Aprobación del Cliente</h2>
                    <p className="text-sm text-slate-400">Confirma la aprobación de la cotización</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Vista previa de cotización */}
                  <Card className="bg-slate-800/50 border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">Resumen de cotización</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total de items:</span>
                        <span className="text-slate-200 font-medium">{formData.items_cotizacion.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subtotal:</span>
                        <span className="text-slate-200 font-medium">${calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">IVA:</span>
                        <span className="text-slate-200 font-medium">${calculateTax().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold pt-3 border-t border-slate-700">
                        <span className="text-slate-200">Total:</span>
                        <span className="text-emerald-400">${(calculateTotal() + calculateTax()).toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Checkbox de aprobación */}
                  <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <Checkbox
                      checked={formData.cotizacion_aprobada}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, cotizacion_aprobada: checked as boolean })
                      }
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <p className="text-green-400 font-medium">Marcar cotización como aprobada</p>
                      <p className="text-sm text-slate-400">
                        El cliente ha revisado y aceptado la cotización. El estado cambiará automáticamente.
                      </p>
                    </div>
                  </div>

                  {formData.cotizacion_aprobada && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <p className="text-sm text-emerald-400 font-medium">
                        ✓ Cotización aprobada - La orden pasará al estado "En reparación"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PASO 6 - Reparación */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">Paso 6: Reparación</h2>
                    <p className="text-sm text-slate-400">Registra las piezas utilizadas y completa la reparación</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-400">
                      💡 En esta etapa el técnico registra las piezas utilizadas y marca la reparación como completada.
                    </p>
                  </div>

                  {/* Piezas utilizadas */}
                  <div className="space-y-3">
                    <Label className="text-slate-200 font-medium">Piezas utilizadas (del inventario)</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                        <SelectValue placeholder="Seleccionar pieza del inventario" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="1">Pantalla 15.6" HD - Stock: 5</SelectItem>
                        <SelectItem value="2">Batería HP Compatible - Stock: 8</SelectItem>
                        <SelectItem value="3">RAM DDR4 8GB - Stock: 12</SelectItem>
                        <SelectItem value="4">Disco SSD 500GB - Stock: 6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Notas de reparación</Label>
                    <Textarea
                      className="bg-slate-800 border-slate-700 text-slate-100 min-h-[120px]"
                      placeholder="Describe el proceso de reparación, pruebas realizadas, ajustes finales..."
                    />
                  </div>

                  <Button
                    type="button"
                    className="w-full bg-green-600 hover:bg-green-500 text-white"
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Marcar reparación como completada
                  </Button>
                </div>
              </div>
            )}

            {/* PASO 7 - Entrega */}
            {step === 7 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
                    <Package className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">Paso 7: Entrega y Pago</h2>
                    <p className="text-sm text-slate-400">Registra el pago y finaliza la orden</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Resumen final */}
                  <Card className="bg-slate-800/50 border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">Resumen de la orden</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cliente:</span>
                        <span className="text-slate-200 font-medium">Juan Pérez García</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Equipo:</span>
                        <span className="text-slate-200 font-medium">HP Pavilion 15</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Diagnóstico:</span>
                        <span className="text-slate-200 font-medium text-right max-w-[300px]">
                          {formData.diagnostico_tecnico.slice(0, 60)}...
                        </span>
                      </div>
                      <div className="flex justify-between text-xl font-bold pt-3 border-t border-slate-700">
                        <span className="text-slate-200">Total a pagar:</span>
                        <span className="text-emerald-400">${(calculateTotal() + calculateTax()).toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Registro de pago */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="monto_pagado" className="text-slate-200 font-medium">
                        Monto pagado
                      </Label>
                      <Input
                        id="monto_pagado"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.monto_pagado}
                        onChange={(e) =>
                          setFormData({ ...formData, monto_pagado: parseFloat(e.target.value) || 0 })
                        }
                        className="bg-slate-800 border-slate-700 text-slate-100"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metodo_pago" className="text-slate-200 font-medium">
                        Método de pago
                      </Label>
                      <Select
                        value={formData.metodo_pago}
                        onValueChange={(value) => setFormData({ ...formData, metodo_pago: value })}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectValue placeholder="Seleccionar método" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="efectivo">Efectivo</SelectItem>
                          <SelectItem value="tarjeta">Tarjeta</SelectItem>
                          <SelectItem value="transferencia">Transferencia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generar comprobante
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generar factura
                    </Button>
                  </div>

                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-400 font-medium">
                      ✓ Al finalizar se creará automáticamente una garantía para esta reparación
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-10 pt-8 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={step === 1 ? () => router.back() : handleBack}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {step === 1 ? "Cancelar" : "Atrás"}
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Finalizar y crear orden
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>
    </>
  )
}
