"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Zap,
  Leaf,
  PackageCheck,
  Plus,
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Dispositivo {
  id: string
  tipo: string
  marca: string
  modelo: string
  serie?: string
  consumoWatts: number
  consumoKwhMensual: number
  huellaOperativaMensual: number
  huellaMaterialesMensual: number
  huellaTotalMensual: number
  ubicacion?: string
  responsable?: string
  fechaAdquisicion?: string
  createdAt: string
}

interface Stats {
  totalConsumoKwh: number
  totalHuellaOperativa: number
  totalHuellaMateriales: number
  totalHuella: number
  dispositivosActivos: number
  promedioConsumoDispositivo: number
  dispositivosPorTipo: Array<{
    tipo: string
    cantidad: number
    consumoTotal: number
    huellaTotal: number
  }>
}

export default function JLabEcoPage() {
  const { hasPermission, user } = useAuth()
  const { toast } = useToast()
  
  const [stats, setStats] = useState<Stats | null>(null)
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [formData, setFormData] = useState({
    tipo: "Router",
    marca: "",
    modelo: "",
    serie: "",
    consumoWatts: "",
    horasUsoMensual: "720",
    huellaMaterialesKgCO2e: "",
    vidaUtilAnios: "5",
    ubicacion: "",
    responsable: "",
    fechaAdquisicion: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [statsRes, dispositivosRes] = await Promise.all([
        fetch('/api/jlabeco/stats'),
        fetch('/api/jlabeco/dispositivos')
      ])
      
      const statsData = await statsRes.json()
      const dispositivosData = await dispositivosRes.json()
      
      setStats(statsData)
      setDispositivos(dispositivosData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de JLabEco",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.marca || !formData.modelo || !formData.consumoWatts || !formData.huellaMaterialesKgCO2e) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      })
      return
    }

    if (!user?.email) {
      toast({
        title: "Error de autenticación",
        description: "No se pudo identificar el usuario",
        variant: "destructive"
      })
      return
    }

    try {
      // Obtener ID del usuario desde la API
      const userResponse = await fetch(`/api/usuarios?email=${encodeURIComponent(user.email)}`)
      const users = await userResponse.json()
      
      if (!users || users.length === 0) {
        throw new Error('Usuario no encontrado')
      }

      const response = await fetch('/api/jlabeco/dispositivos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          usuarioId: users[0].id
        })
      })

      if (!response.ok) {
        throw new Error('Error al registrar dispositivo')
      }

      toast({
        title: "✅ Dispositivo registrado",
        description: `${formData.marca} ${formData.modelo} agregado correctamente`
      })

      // Reset form
      setFormData({
        tipo: "Router",
        marca: "",
        modelo: "",
        serie: "",
        consumoWatts: "",
        horasUsoMensual: "720",
        huellaMaterialesKgCO2e: "",
        vidaUtilAnios: "5",
        ubicacion: "",
        responsable: "",
        fechaAdquisicion: new Date().toISOString().split('T')[0]
      })

      // Refresh data
      fetchData()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudo registrar el dispositivo",
        variant: "destructive"
      })
    }
  }

  if (!hasPermission("configuracion")) {
    return (
      <>
        <DashboardHeader title="JLabEco" />
        <AccessDenied />
      </>
    )
  }

  const recentDevices = dispositivos.slice(0, 5)

  return (
    <>
      <DashboardHeader title="JLabEco - Huella de Carbono" />
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-green-600/30 to-transparent blur-3xl animate-blob-slow" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-emerald-600/30 to-transparent blur-3xl animate-blob-slower" />
        </div>

        <div className="max-w-[1600px] mx-auto space-y-6 relative z-10">
          {/* Header Section */}
          <div className="space-y-2 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 ring-1 ring-green-500/30">
                <Leaf className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                  JLabEco
                </h2>
                <p className="text-slate-400 text-sm">Monitoreo de Huella de Carbono Tecnológica</p>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-3 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            {/* Consumo Eléctrico */}
            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/10 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-2xl group-hover:from-yellow-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Consumo Eléctrico</div>
                  <div className="p-2.5 rounded-lg bg-yellow-500/10 ring-1 ring-yellow-500/20">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-slate-100">
                    {loading ? "..." : stats?.totalConsumoKwh.toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-400">kWh / mes</div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Info className="h-3 w-3" />
                    <span>~{loading ? "..." : ((stats?.totalConsumoKwh || 0) * 30 / 1000).toFixed(2)} MWh/año</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Huella Operativa */}
            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/10 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl group-hover:from-orange-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Huella Operativa</div>
                  <div className="p-2.5 rounded-lg bg-orange-500/10 ring-1 ring-orange-500/20">
                    <TrendingUp className="h-5 w-5 text-orange-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-slate-100">
                    {loading ? "..." : stats?.totalHuellaOperativa.toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-400">kg CO₂e / mes</div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Info className="h-3 w-3" />
                    <span>Uso energético mensual</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Huella de Materiales */}
            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl group-hover:from-green-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Huella de Materiales</div>
                  <div className="p-2.5 rounded-lg bg-green-500/10 ring-1 ring-green-500/20">
                    <PackageCheck className="h-5 w-5 text-green-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-slate-100">
                    {loading ? "..." : stats?.totalHuellaMateriales.toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-400">kg CO₂e / mes</div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Info className="h-3 w-3" />
                    <span>Fabricación amortizada</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Registro Rápido */}
            <Card 
              className="lg:col-span-2 bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Plus className="h-5 w-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-slate-100">Registro Rápido</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label className="text-xs text-slate-400">Tipo de Dispositivo *</Label>
                      <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                        <SelectTrigger className="mt-1 bg-slate-800/40 border-slate-700 text-slate-200 h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          <SelectItem value="Router">Router</SelectItem>
                          <SelectItem value="Switch">Switch</SelectItem>
                          <SelectItem value="Servidor">Servidor</SelectItem>
                          <SelectItem value="PC">PC de Escritorio</SelectItem>
                          <SelectItem value="Laptop">Laptop</SelectItem>
                          <SelectItem value="Monitor">Monitor</SelectItem>
                          <SelectItem value="Impresora">Impresora</SelectItem>
                          <SelectItem value="UPS">UPS</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs text-slate-400">Marca *</Label>
                      <Input
                        value={formData.marca}
                        onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                        placeholder="Cisco, HP, Dell..."
                        className="mt-1 bg-slate-800/40 border-slate-700 text-slate-200 h-9 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-slate-400">Modelo *</Label>
                      <Input
                        value={formData.modelo}
                        onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                        placeholder="RV340, ProCurve..."
                        className="mt-1 bg-slate-800/40 border-slate-700 text-slate-200 h-9 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-slate-400">Consumo (Watts) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.consumoWatts}
                        onChange={(e) => setFormData({ ...formData, consumoWatts: e.target.value })}
                        placeholder="25"
                        className="mt-1 bg-slate-800/40 border-slate-700 text-slate-200 h-9 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-slate-400">Horas/mes</Label>
                      <Input
                        type="number"
                        value={formData.horasUsoMensual}
                        onChange={(e) => setFormData({ ...formData, horasUsoMensual: e.target.value })}
                        className="mt-1 bg-slate-800/40 border-slate-700 text-slate-200 h-9 text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-slate-400">Huella Materiales (kg CO₂e) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.huellaMaterialesKgCO2e}
                        onChange={(e) => setFormData({ ...formData, huellaMaterialesKgCO2e: e.target.value })}
                        placeholder="45.5"
                        className="mt-1 bg-slate-800/40 border-slate-700 text-slate-200 h-9 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-slate-400">Vida Útil (años)</Label>
                      <Input
                        type="number"
                        value={formData.vidaUtilAnios}
                        onChange={(e) => setFormData({ ...formData, vidaUtilAnios: e.target.value })}
                        className="mt-1 bg-slate-800/40 border-slate-700 text-slate-200 h-9 text-sm"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label className="text-xs text-slate-400">Ubicación</Label>
                      <Input
                        value={formData.ubicacion}
                        onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                        placeholder="Sala de Servidores, Piso 2..."
                        className="mt-1 bg-slate-800/40 border-slate-700 text-slate-200 h-9 text-sm"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full h-9 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium shadow-lg shadow-green-600/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Dispositivo
                  </Button>
                </form>
              </div>
            </Card>

            {/* Resumen Reciente */}
            <Card 
              className="lg:col-span-3 bg-slate-900/60 backdrop-blur-sm border-white/5 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-400" />
                    <h3 className="text-lg font-semibold text-slate-100">Adquisiciones Recientes</h3>
                  </div>
                  <div className="text-xs text-slate-500">
                    {dispositivos.length} dispositivo{dispositivos.length !== 1 ? 's' : ''} total
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-slate-500 text-[11px] font-semibold uppercase">Dispositivo</TableHead>
                      <TableHead className="text-slate-500 text-[11px] font-semibold uppercase text-right">Consumo</TableHead>
                      <TableHead className="text-slate-500 text-[11px] font-semibold uppercase text-right">Huella Operativa</TableHead>
                      <TableHead className="text-slate-500 text-[11px] font-semibold uppercase text-right">Huella Materiales</TableHead>
                      <TableHead className="text-slate-500 text-[11px] font-semibold uppercase text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                          Cargando...
                        </TableCell>
                      </TableRow>
                    ) : recentDevices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                          No hay dispositivos registrados
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentDevices.map((device) => (
                        <TableRow key={device.id} className="border-white/5 hover:bg-white/[0.02]">
                          <TableCell>
                            <div>
                              <div className="text-sm font-medium text-slate-200">{device.marca} {device.modelo}</div>
                              <div className="text-xs text-slate-500">{device.tipo}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-sm text-slate-300">{Number(device.consumoKwhMensual).toFixed(1)}</div>
                            <div className="text-xs text-slate-500">kWh/mes</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-sm text-orange-400">{Number(device.huellaOperativaMensual).toFixed(1)}</div>
                            <div className="text-xs text-slate-500">kg CO₂e</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-sm text-green-400">{Number(device.huellaMaterialesMensual).toFixed(1)}</div>
                            <div className="text-xs text-slate-500">kg CO₂e</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-sm font-semibold text-slate-100">{Number(device.huellaTotalMensual).toFixed(1)}</div>
                            <div className="text-xs text-slate-500">kg CO₂e</div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Total Impact Card */}
          <Card 
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm border-white/5 p-8 animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm mb-2">Huella Total Mensual</div>
                <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {loading ? "..." : stats?.totalHuella.toFixed(1)} kg CO₂e
                </div>
                <div className="text-slate-500 text-sm mt-2">
                  ≈ {loading ? "..." : ((stats?.totalHuella || 0) * 12 / 1000).toFixed(2)} toneladas CO₂e al año
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 ring-1 ring-green-500/30">
                <Leaf className="h-16 w-16 text-green-400" />
              </div>
            </div>
          </Card>
        </div>
      </main>
    </>
  )
}
