"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockStates = [
  "En diagnóstico",
  "En espera de aprobación",
  "En proceso",
  "Listo para entrega",
  "Completada y pagada",
  "Rechazada",
  "Cancelada",
]

export default function ConfiguracionPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [states, setStates] = useState(mockStates)
  const [newState, setNewState] = useState("")
  const [settings, setSettings] = useState({
    dias_abandono_potencial: "30",
    dias_equipo_abandonado: "90",
    nombre_comercial: "JLaboratories",
    rfc: "JLA123456789",
    telefono: "5512345678",
    direccion: "Av. Principal #123, Col. Centro",
  })

  if (!hasPermission("configuracion")) {
    return (
      <>
        <DashboardHeader title="Configuración" />
        <AccessDenied />
      </>
    )
  }

  const handleAddState = () => {
    if (newState.trim()) {
      setStates([...states, newState.trim()])
      setNewState("")
      toast({
        title: "Estado agregado",
        description: "El estado se ha agregado correctamente.",
      })
    }
  }

  const handleRemoveState = (state: string) => {
    setStates(states.filter((s) => s !== state))
    toast({
      title: "Estado eliminado",
      description: "El estado se ha eliminado correctamente.",
    })
  }

  const handleSaveSettings = () => {
    toast({
      title: "Configuración guardada",
      description: "Los cambios se han guardado correctamente.",
    })
  }

  return (
    <>
      <DashboardHeader title="Configuración" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-lg bg-indigo-600 p-2">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-100">Configuración del sistema</h2>
                <p className="text-sm text-slate-400">Administra los parámetros generales de RepairSuite</p>
              </div>
            </div>

            <Tabs defaultValue="estados" className="space-y-6">
              <TabsList className="bg-slate-800 border-slate-700">
                <TabsTrigger value="estados" className="data-[state=active]:bg-slate-700">
                  Estados de OS
                </TabsTrigger>
                <TabsTrigger value="parametros" className="data-[state=active]:bg-slate-700">
                  Parámetros
                </TabsTrigger>
                <TabsTrigger value="taller" className="data-[state=active]:bg-slate-700">
                  Datos del taller
                </TabsTrigger>
              </TabsList>

              {/* Estados tab */}
              <TabsContent value="estados" className="space-y-4">
                <div>
                  <Label className="text-slate-200 mb-3 block">Estados disponibles</Label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {states.map((state) => (
                      <Badge
                        key={state}
                        variant="secondary"
                        className="bg-slate-800 text-slate-200 border-slate-700 px-3 py-1.5 text-sm"
                      >
                        {state}
                        <button
                          onClick={() => handleRemoveState(state)}
                          className="ml-2 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    placeholder="Nuevo estado..."
                    className="bg-slate-800 border-slate-700 text-slate-100"
                    onKeyPress={(e) => e.key === "Enter" && handleAddState()}
                  />
                  <Button onClick={handleAddState} className="bg-indigo-600 hover:bg-indigo-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </TabsContent>

              {/* Parametros tab */}
              <TabsContent value="parametros" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dias_abandono" className="text-slate-200">
                    Días para "Abandono potencial"
                  </Label>
                  <Input
                    id="dias_abandono"
                    type="number"
                    value={settings.dias_abandono_potencial}
                    onChange={(e) => setSettings({ ...settings, dias_abandono_potencial: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100 max-w-xs"
                  />
                  <p className="text-xs text-slate-500">
                    Número de días sin movimiento para marcar una OS como potencialmente abandonada
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dias_abandonado" className="text-slate-200">
                    Días para "Equipo abandonado"
                  </Label>
                  <Input
                    id="dias_abandonado"
                    type="number"
                    value={settings.dias_equipo_abandonado}
                    onChange={(e) => setSettings({ ...settings, dias_equipo_abandonado: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100 max-w-xs"
                  />
                  <p className="text-xs text-slate-500">
                    Número de días sin movimiento para considerar un equipo como abandonado
                  </p>
                </div>

                <Button onClick={handleSaveSettings} className="bg-indigo-600 hover:bg-indigo-500 mt-6">
                  Guardar parámetros
                </Button>
              </TabsContent>

              {/* Taller tab */}
              <TabsContent value="taller" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre_comercial" className="text-slate-200">
                    Nombre comercial
                  </Label>
                  <Input
                    id="nombre_comercial"
                    value={settings.nombre_comercial}
                    onChange={(e) => setSettings({ ...settings, nombre_comercial: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="rfc" className="text-slate-200">
                      RFC
                    </Label>
                    <Input
                      id="rfc"
                      value={settings.rfc}
                      onChange={(e) => setSettings({ ...settings, rfc: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-slate-200">
                      Teléfono
                    </Label>
                    <Input
                      id="telefono"
                      value={settings.telefono}
                      onChange={(e) => setSettings({ ...settings, telefono: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion" className="text-slate-200">
                    Dirección
                  </Label>
                  <Input
                    id="direccion"
                    value={settings.direccion}
                    onChange={(e) => setSettings({ ...settings, direccion: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>

                <Button onClick={handleSaveSettings} className="bg-indigo-600 hover:bg-indigo-500 mt-6">
                  Guardar datos del taller
                </Button>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </>
  )
}
