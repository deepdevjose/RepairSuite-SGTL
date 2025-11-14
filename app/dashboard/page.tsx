"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card } from "@/components/ui/card"
import { BadgeStatus } from "@/components/badge-status"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ClipboardList, Wrench, CheckCircle2, TrendingUp, ArrowUpRight, Activity, AlertTriangle, ShieldAlert, ShoppingCart, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const chartData = [
  { name: "En diagnóstico", value: 12, mantenimiento: 4, reparacion: 5, upgrade: 3 },
  { name: "En espera", value: 8, mantenimiento: 2, reparacion: 4, upgrade: 2 },
  { name: "En proceso", value: 24, mantenimiento: 8, reparacion: 12, upgrade: 4 },
  { name: "Listo", value: 15, mantenimiento: 5, reparacion: 7, upgrade: 3 },
  { name: "Completada", value: 42, mantenimiento: 15, reparacion: 20, upgrade: 7 },
]

const recentOrders = [
  {
    folio: "RS-OS-1024",
    cliente: "Juan Pérez",
    equipo: "HP Pavilion 15",
    estado: "En proceso",
    tecnico: "Carlos Gómez",
    sucursal: "Sede A",
    fecha: "2025-01-10",
    importe: 1250.0,
    tiempoReparacion: "2.5 hrs",
  },
  {
    folio: "RS-OS-1023",
    cliente: "María González",
    equipo: 'MacBook Pro 13"',
    estado: "Listo para entrega",
    tecnico: "Ana Martínez",
    sucursal: "Sede A",
    fecha: "2025-01-09",
    importe: 3400.0,
    tiempoReparacion: "4 hrs",
  },
  {
    folio: "RS-OS-1022",
    cliente: "Pedro Ramírez",
    equipo: "Dell XPS 15",
    estado: "En diagnóstico",
    tecnico: "Luis Torres",
    sucursal: "Sede B",
    fecha: "2025-01-09",
    importe: 890.0,
    tiempoReparacion: "0.5 hrs",
  },
  {
    folio: "RS-OS-1021",
    cliente: "Ana López",
    equipo: "Lenovo ThinkPad",
    estado: "En espera de aprobación",
    tecnico: "Carlos Gómez",
    sucursal: "Sede A",
    fecha: "2025-01-08",
    importe: 2100.0,
    tiempoReparacion: "1 hr",
  },
  {
    folio: "RS-OS-1020",
    cliente: "Roberto Silva",
    equipo: "Asus ROG",
    estado: "En proceso",
    tecnico: "Ana Martínez",
    sucursal: "Sede C",
    fecha: "2025-01-08",
    importe: 1850.0,
    tiempoReparacion: "3 hrs",
  },
]

export default function DashboardPage() {
  const [selectedBranch, setSelectedBranch] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("30")
  const [technicianFilter, setTechnicianFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  return (
    <>
      <DashboardHeader title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/20 to-transparent blur-3xl animate-blob-slow" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-violet-600/20 to-transparent blur-3xl animate-blob-slower" />
          <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-blue-600/15 to-transparent blur-3xl animate-blob-slowest" />
        </div>

        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          <div className="space-y-2 animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Resumen general – JLaboratories
            </h2>
            <p className="text-slate-400 text-sm">Vista general del desempeño del taller</p>
          </div>

          <div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            {/* Existing KPIs */}
            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl group-hover:from-indigo-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Órdenes activas</div>
                  <div className="p-2 rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20">
                    <ClipboardList className="h-4 w-4 text-indigo-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-100 mb-2">59</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <TrendingUp className="h-3 w-3" />
                  +12% vs mes anterior
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl group-hover:from-blue-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">En diagnóstico</div>
                  <div className="p-2 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                    <Wrench className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-100 mb-2">12</div>
                <div className="text-xs text-slate-500 font-medium">Requieren atención</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:from-purple-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">En proceso</div>
                  <div className="p-2 rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                    <Activity className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-100 mb-2">24</div>
                <div className="text-xs text-slate-500 font-medium">En reparación</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl group-hover:from-green-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Listas entrega</div>
                  <div className="p-2 rounded-lg bg-green-500/10 ring-1 ring-green-500/20">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-100 mb-2">15</div>
                <div className="text-xs text-slate-500 font-medium">Notificar clientes</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl group-hover:from-amber-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Espera aprobación</div>
                  <div className="p-2 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
                    <Clock className="h-4 w-4 text-amber-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-100 mb-2">8</div>
                <div className="text-xs text-amber-400 flex items-center gap-1 font-medium">
                  <AlertTriangle className="h-3 w-3" />
                  Requieren acción
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-2xl group-hover:from-red-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Inventario crítico</div>
                  <div className="p-2 rounded-lg bg-red-500/10 ring-1 ring-red-500/20">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-100 mb-2">5</div>
                <div className="text-xs text-red-400 flex items-center gap-1 font-medium">
                  <AlertTriangle className="h-3 w-3" />
                  Reponer urgente
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl group-hover:from-orange-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Garantías por vencer</div>
                  <div className="p-2 rounded-lg bg-orange-500/10 ring-1 ring-orange-500/20">
                    <ShieldAlert className="h-4 w-4 text-orange-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-100 mb-2">12</div>
                <div className="text-xs text-slate-500 font-medium">Próximos 30 días</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl group-hover:from-cyan-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Compras pendientes</div>
                  <div className="p-2 rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/20">
                    <ShoppingCart className="h-4 w-4 text-cyan-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-100 mb-2">3</div>
                <div className="text-xs text-slate-500 font-medium">A proveedores</div>
              </div>
            </Card>
          </div>

          <Card
            className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 animate-fade-in-up hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  Órdenes por estado
                  <span className="text-xs font-normal text-slate-500">(últimos {dateFilter} días)</span>
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="h-8 w-[100px] bg-slate-800/40 border-white/5 text-slate-300 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="7" className="text-slate-300 text-xs">
                      7 días
                    </SelectItem>
                    <SelectItem value="30" className="text-slate-300 text-xs">
                      30 días
                    </SelectItem>
                    <SelectItem value="90" className="text-slate-300 text-xs">
                      90 días
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
                  <SelectTrigger className="h-8 w-[140px] bg-slate-800/40 border-white/5 text-slate-300 text-xs">
                    <SelectValue placeholder="Técnico" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="all" className="text-slate-300 text-xs">
                      Todos los técnicos
                    </SelectItem>
                    <SelectItem value="carlos" className="text-slate-300 text-xs">
                      Carlos Gómez
                    </SelectItem>
                    <SelectItem value="ana" className="text-slate-300 text-xs">
                      Ana Martínez
                    </SelectItem>
                    <SelectItem value="luis" className="text-slate-300 text-xs">
                      Luis Torres
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="h-8 w-[120px] bg-slate-800/40 border-white/5 text-slate-300 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="all" className="text-slate-300 text-xs">
                      Todas las sedes
                    </SelectItem>
                    <SelectItem value="sede-a" className="text-slate-300 text-xs">
                      Sede A
                    </SelectItem>
                    <SelectItem value="sede-b" className="text-slate-300 text-xs">
                      Sede B
                    </SelectItem>
                    <SelectItem value="sede-c" className="text-slate-300 text-xs">
                      Sede C
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="mantenimientoGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="reparacionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="upgradeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} stroke="#334155" strokeOpacity={0.3} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} stroke="#334155" strokeOpacity={0.3} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#f1f5f9",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                      fontSize: "12px",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-slate-400">
                        {value === "mantenimiento"
                          ? "Mantenimiento"
                          : value === "reparacion"
                            ? "Reparación"
                            : "Upgrade"}
                      </span>
                    )}
                  />
                  <Bar dataKey="mantenimiento" fill="url(#mantenimientoGradient)" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="reparacion" fill="url(#reparacionGradient)" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="upgrade" fill="url(#upgradeGradient)" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card
            className="bg-slate-900/60 backdrop-blur-sm border-white/5 animate-fade-in-up hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200"
            style={{ animationDelay: "300ms" }}
          >
            <div className="p-6 border-b border-white/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-slate-100">Órdenes recientes</h3>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setStatusFilter("all")}
                    className={`h-7 text-xs ${
                      statusFilter === "all"
                        ? "bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
                        : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    Todos
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setStatusFilter("diagnostico")}
                    className={`h-7 text-xs ${
                      statusFilter === "diagnostico"
                        ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                        : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    En diagnóstico
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setStatusFilter("proceso")}
                    className={`h-7 text-xs ${
                      statusFilter === "proceso"
                        ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                        : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    En proceso
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setStatusFilter("listo")}
                    className={`h-7 text-xs ${
                      statusFilter === "listo"
                        ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                        : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    Listo
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setStatusFilter("aprobacion")}
                    className={`h-7 text-xs ${
                      statusFilter === "aprobacion"
                        ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                        : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    Espera aprobación
                  </Button>
                </div>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                    Folio
                  </TableHead>
                  <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                    Cliente
                  </TableHead>
                  <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                    Equipo
                  </TableHead>
                  <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                    Estado
                  </TableHead>
                  <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                    Técnico
                  </TableHead>
                  <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                    Sucursal
                  </TableHead>
                  <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">
                    Importe
                  </TableHead>
                  <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                    Tiempo rep.
                  </TableHead>
                  <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                    Fecha
                  </TableHead>
                  <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                    Acción
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order, index) => (
                  <TableRow
                    key={order.folio}
                    className="border-white/5 hover:bg-white/[0.02] text-slate-300 transition-all duration-150 group"
                    style={{
                      animation: "fadeInUp 0.3s ease-out forwards",
                      animationDelay: `${400 + index * 50}ms`,
                      opacity: 0,
                    }}
                  >
                    <TableCell className="font-mono text-[13px] text-indigo-400 font-medium">{order.folio}</TableCell>
                    <TableCell className="font-medium text-[13px]">{order.cliente}</TableCell>
                    <TableCell className="text-[13px] text-slate-400">{order.equipo}</TableCell>
                    <TableCell>
                      <BadgeStatus status={order.estado} />
                    </TableCell>
                    <TableCell className="text-slate-400 text-[13px]">{order.tecnico}</TableCell>
                    <TableCell className="text-slate-400 text-[13px]">{order.sucursal}</TableCell>
                    <TableCell className="text-slate-300 text-[13px] font-semibold text-right tabular-nums">
                      ${order.importe.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-slate-400 text-[13px] tabular-nums">{order.tiempoReparacion}</TableCell>
                    <TableCell className="text-slate-400 text-[13px]">{order.fecha}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-3 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all duration-200 group-hover:translate-x-0.5 text-[13px] font-medium"
                      >
                        Detalles
                        <ArrowUpRight className="h-3.5 w-3.5 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </>
  )
}
