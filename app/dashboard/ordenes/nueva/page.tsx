"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { DashboardHeader } from "@/components/dashboard-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Check, FileText, MessageSquare, PlayCircle, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

type Cliente = {
  id: string
  nombre: string
  telefono: string
  email: string | null
}

type Equipo = {
  id: string
  clienteId: string
  tipo: string
  marca: string
  modelo: string
  numeroSerie: string | null
}

type Tecnico = {
  id: string
  nombre: string
  email: string
}

export default function NuevaOrdenPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const totalSteps = 2
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Data from API
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])

  // Form data
  const [formData, setFormData] = useState({
    clienteId: "",
    equipoId: "",
    problemaReportado: "",
    tecnicoId: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load data
  useEffect(() => {
    loadClientes()
    loadTecnicos()
  }, [])

  useEffect(() => {
    if (formData.clienteId) {
      loadEquipos(formData.clienteId)
    }
  }, [formData.clienteId])

  const loadClientes = async () => {
    try {
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
      toast({
        title: "Error",
        description: "No se pudieron cargar los equipos",
        variant: "destructive"
      })
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
      toast({
        title: "Error",
        description: "No se pudieron cargar los técnicos",
        variant: "destructive"
      })
    }
  }

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.clienteId) newErrors.clienteId = "Debe seleccionar un cliente"
      if (!formData.equipoId) newErrors.equipoId = "Debe seleccionar un equipo"
    }

    if (currentStep === 2) {
      if (!formData.problemaReportado.trim()) {
        newErrors.problemaReportado = "La descripción del problema es obligatoria"
      }
      if (!formData.tecnicoId) {
        newErrors.tecnicoId = "Debe asignar un técnico"
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

  const handleSubmit = async () => {
    if (!validateStep(step)) return

    setSaving(true)
    try {
      const res = await fetch('/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Error al crear orden')

      const newOrder = await res.json()
      
      toast({
        title: "✅ Orden creada exitosamente",
        description: `Folio: ${newOrder.folio}`,
      })

      router.push("/dashboard/ordenes")
    } catch (error) {
      console.error('Error al crear orden:', error)
      toast({
        title: "Error",
        description: "No se pudo crear la orden de servicio",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <DashboardHeader title="Nueva Orden de Servicio" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress Bar */}
          <Card className="bg-slate-900/50 border-slate-800 p-6 backdrop-blur-sm">
            <div className="space-y-4">
              {/* Step indicators */}
              <div className="flex items-center justify-between">
                {[1, 2].map((stepNum, idx) => (
                  <div key={stepNum} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold transition-all ${
                          step >= stepNum
                            ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {step > stepNum ? <Check className="h-6 w-6" /> : stepNum}
                      </div>
                      <span
                        className={`mt-2 text-sm font-medium text-center ${
                          step >= stepNum ? "text-indigo-400" : "text-slate-500"
                        }`}
                      >
                        {["Cliente", "Recepción"][idx]}
                      </span>
                    </div>
                    {idx < 1 && (
                      <div
                        className={`h-0.5 flex-1 mx-4 transition-all ${
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
                  {/* Cliente */}
                  <div className="space-y-2">
                    <Label htmlFor="cliente" className="text-slate-200 font-medium">
                      Cliente <span className="text-red-400">*</span>
                    </Label>
                    <Select value={formData.clienteId} onValueChange={(value) => {
                      setFormData({ ...formData, clienteId: value, equipoId: "" })
                      setEquipos([])
                    }}>
                      <SelectTrigger className={`bg-slate-800/40 border-slate-700 text-slate-100 ${errors.clienteId ? 'border-red-500' : ''}`}>
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
                    {errors.clienteId && <p className="text-xs text-red-400">{errors.clienteId}</p>}
                    <p className="text-xs text-slate-500">
                      💡 Si el cliente no está registrado, créalo primero desde el módulo de Clientes
                    </p>
                  </div>

                  {/* Equipo */}
                  <div className="space-y-2">
                    <Label htmlFor="equipo" className="text-slate-200 font-medium">
                      Equipo del Cliente <span className="text-red-400">*</span>
                    </Label>
                    <Select 
                      value={formData.equipoId} 
                      onValueChange={(value) => setFormData({ ...formData, equipoId: value })}
                      disabled={!formData.clienteId || loading}
                    >
                      <SelectTrigger className={`bg-slate-800/40 border-slate-700 text-slate-100 ${errors.equipoId ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder={loading ? "Cargando equipos..." : "Seleccionar equipo"} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        {equipos.length === 0 && !loading && (
                          <SelectItem value="no-equipos" disabled>
                            No hay equipos registrados para este cliente
                          </SelectItem>
                        )}
                        {equipos.map((equipo) => (
                          <SelectItem key={equipo.id} value={equipo.id}>
                            {equipo.marca} {equipo.modelo} ({equipo.tipo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.equipoId && <p className="text-xs text-red-400">{errors.equipoId}</p>}
                    <p className="text-xs text-slate-500">
                      💡 Si el equipo no está registrado, créalo primero desde el módulo de Equipos
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 2 - RecepciÃ³n */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">Paso 2: Recepción</h2>
                    <p className="text-sm text-slate-400">Registra el problema y asigna el técnico</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Problema Reportado */}
                  <div className="space-y-2">
                    <Label htmlFor="problemaReportado" className="text-slate-200 font-medium">
                      Problema Reportado por el Cliente <span className="text-red-400">*</span>
                    </Label>
                    <Textarea
                      id="problemaReportado"
                      value={formData.problemaReportado}
                      onChange={(e) => setFormData({ ...formData, problemaReportado: e.target.value })}
                      className={`bg-slate-800/40 border-slate-700 text-slate-100 min-h-[120px] ${errors.problemaReportado ? 'border-red-500' : ''}`}
                      placeholder="Ej: La laptop no enciende, se calienta mucho, pantalla rota, etc..."
                    />
                    {errors.problemaReportado && <p className="text-xs text-red-400">{errors.problemaReportado}</p>}
                    <p className="text-xs text-slate-500">
                      📝 Solo registra lo que el cliente reporta. El técnico hará el diagnóstico detallado.
                    </p>
                  </div>

                  {/* TÃ©cnico Asignado */}
                  <div className="space-y-2">
                    <Label htmlFor="tecnicoAsignado" className="text-slate-200 font-medium">
                      Asignar a Técnico <span className="text-red-400">*</span>
                    </Label>
                    <Select 
                      value={formData.tecnicoId} 
                      onValueChange={(value) => setFormData({ ...formData, tecnicoId: value })}
                    >
                      <SelectTrigger className={`bg-slate-800/40 border-slate-700 text-slate-100 ${errors.tecnicoId ? 'border-red-500' : ''}`}>
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
                    {errors.tecnicoId && <p className="text-xs text-red-400">{errors.tecnicoId}</p>}
                  </div>

                  {/* Info Box */}
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <PlayCircle className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-indigo-300">¿Qué sigue después?</h4>
                        <p className="text-xs text-slate-400">
                          Una vez creada la orden, el técnico asignado recibirá una notificación y podrá:
                        </p>
                        <ul className="text-xs text-slate-400 space-y-1 mt-2 ml-4 list-disc">
                          <li>Revisar el equipo y realizar el diagnóstico completo</li>
                          <li>Crear la cotización detallada de la reparación</li>
                          <li>Iniciar el proceso de reparación una vez aprobado</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-800">
              <Button
                variant="ghost"
                onClick={step === 1 ? () => router.push('/dashboard/ordenes') : handleBack}
                className="text-slate-400 hover:text-slate-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {step === 1 ? 'Cancelar' : 'Anterior'}
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="bg-indigo-600 hover:bg-indigo-500"
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Empezar con el Diagnóstico
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>
    </>
  )
}
