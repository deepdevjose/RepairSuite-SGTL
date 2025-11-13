"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NuevaOrdenPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    cliente: "",
    equipo: "",
    notas_recepcion: "",
    accesorios: "",
    sucursal: "Sede A",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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
        description: "La orden se ha creado exitosamente.",
      })
      router.push("/dashboard/ordenes")
    }
  }

  return (
    <>
      <DashboardHeader title="Nueva Orden de Servicio" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress */}
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? "text-indigo-400" : "text-slate-500"}`}>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step >= 1 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {step > 1 ? <Check className="h-5 w-5" /> : "1"}
                </div>
                <span className="font-medium">Cliente y Equipo</span>
              </div>

              <div className={`h-0.5 flex-1 mx-4 ${step >= 2 ? "bg-indigo-600" : "bg-slate-800"}`} />

              <div className={`flex items-center gap-2 ${step >= 2 ? "text-indigo-400" : "text-slate-500"}`}>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step >= 2 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {step > 2 ? <Check className="h-5 w-5" /> : "2"}
                </div>
                <span className="font-medium">Datos de Recepción</span>
              </div>

              <div className={`h-0.5 flex-1 mx-4 ${step >= 3 ? "bg-indigo-600" : "bg-slate-800"}`} />

              <div className={`flex items-center gap-2 ${step >= 3 ? "text-indigo-400" : "text-slate-500"}`}>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step >= 3 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-500"
                  }`}
                >
                  3
                </div>
                <span className="font-medium">Resumen</span>
              </div>
            </div>
          </Card>

          {/* Step content */}
          <Card className="bg-slate-900 border-slate-800 p-6">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-100">Paso 1: Cliente y Equipo</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cliente" className="text-slate-200">
                      Cliente <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.cliente}
                      onValueChange={(value) => setFormData({ ...formData, cliente: value })}
                    >
                      <SelectTrigger
                        className={`bg-slate-800 border-slate-700 text-slate-100 ${
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
                    <Label htmlFor="equipo" className="text-slate-200">
                      Equipo <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.equipo}
                      onValueChange={(value) => setFormData({ ...formData, equipo: value })}
                    >
                      <SelectTrigger
                        className={`bg-slate-800 border-slate-700 text-slate-100 ${
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

                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-400">
                      Tip: Si el equipo no está en la lista, puedes registrarlo primero desde el módulo de Equipos.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-100">Paso 2: Datos de Recepción</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sucursal" className="text-slate-200">
                      Sucursal <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.sucursal}
                      onValueChange={(value) => setFormData({ ...formData, sucursal: value })}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="Sede A">Sede A</SelectItem>
                        <SelectItem value="Sede B">Sede B</SelectItem>
                        <SelectItem value="Sede C">Sede C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accesorios" className="text-slate-200">
                      Accesorios recibidos
                    </Label>
                    <Textarea
                      id="accesorios"
                      value={formData.accesorios}
                      onChange={(e) => setFormData({ ...formData, accesorios: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-slate-100 min-h-[100px]"
                      placeholder="Cargador, mouse, estuche, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notas_recepcion" className="text-slate-200">
                      Notas de recepción <span className="text-red-400">*</span>
                    </Label>
                    <Textarea
                      id="notas_recepcion"
                      value={formData.notas_recepcion}
                      onChange={(e) => setFormData({ ...formData, notas_recepcion: e.target.value })}
                      className={`bg-slate-800 border-slate-700 text-slate-100 min-h-[120px] ${
                        errors.notas_recepcion ? "border-red-500" : ""
                      }`}
                      placeholder="Describe el motivo de ingreso y cualquier observación inicial..."
                    />
                    {errors.notas_recepcion && <p className="text-xs text-red-400">{errors.notas_recepcion}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-100">Paso 3: Resumen</h2>

                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <div className="text-sm text-slate-400">Cliente</div>
                      <div className="text-slate-100">Juan Pérez García</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-slate-400">Equipo</div>
                      <div className="text-slate-100">HP Pavilion 15</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-slate-400">Sucursal</div>
                      <div className="text-slate-100">{formData.sucursal}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-slate-400">Fecha</div>
                      <div className="text-slate-100">{new Date().toLocaleDateString("es-MX")}</div>
                    </div>
                  </div>

                  {formData.accesorios && (
                    <div className="space-y-1">
                      <div className="text-sm text-slate-400">Accesorios recibidos</div>
                      <div className="text-slate-100">{formData.accesorios}</div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="text-sm text-slate-400">Notas de recepción</div>
                    <div className="text-slate-100">{formData.notas_recepcion}</div>
                  </div>

                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-400">
                      Al crear la orden, se generará un folio único y se notificará al cliente.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={step === 1 ? () => router.back() : handleBack}
                className="border-slate-700 text-slate-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {step === 1 ? "Cancelar" : "Atrás"}
              </Button>

              {step < 3 ? (
                <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-500">
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-500">
                  <Check className="h-4 w-4 mr-2" />
                  Crear orden
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>
    </>
  )
}
