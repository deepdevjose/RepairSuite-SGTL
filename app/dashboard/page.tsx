"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card } from "@/components/ui/card"
import { BadgeStatus } from "@/components/badge-status"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ClipboardList, Wrench, CheckCircle2, TrendingUp, Eye, ArrowUpRight, Activity } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data
const chartData = [
  { name: "En diagnóstico", value: 12 },
  { name: "En espera", value: 8 },
  { name: "En proceso", value: 24 },
  { name: "Listo", value: 15 },
  { name: "Completada", value: 42 },
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
  },
  {
    folio: "RS-OS-1023",
    cliente: "María González",
    equipo: 'MacBook Pro 13"',
    estado: "Listo para entrega",
    tecnico: "Ana Martínez",
    sucursal: "Sede A",
    fecha: "2025-01-09",
  },
  {
    folio: "RS-OS-1022",
    cliente: "Pedro Ramírez",
    equipo: "Dell XPS 15",
    estado: "En diagnóstico",
    tecnico: "Luis Torres",
    sucursal: "Sede B",
    fecha: "2025-01-09",
  },
  {
    folio: "RS-OS-1021",
    cliente: "Ana López",
    equipo: "Lenovo ThinkPad",
    estado: "En espera de aprobación",
    tecnico: "Carlos Gómez",
    sucursal: "Sede A",
    fecha: "2025-01-08",
  },
]

export default function DashboardPage() {
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
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10 group">
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

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 group">
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

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 group">
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

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10 group">
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

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl group-hover:from-emerald-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Completadas (30d)</div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-100 mb-2">156</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <TrendingUp className="h-3 w-3" />
                  +8% vs período anterior
                </div>
              </div>
            </Card>
          </div>

          <Card
            className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 animate-fade-in-up hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200"
            style={{ animationDelay: "200ms" }}
          >
            <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
              Órdenes por estado
              <span className="text-xs font-normal text-slate-500">(últimos 30 días)</span>
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} stroke="#334155" strokeOpacity={0.3} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} stroke="#334155" strokeOpacity={0.3} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#f1f5f9",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  />
                  <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card
            className="bg-slate-900/60 backdrop-blur-sm border-white/5 animate-fade-in-up hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200"
            style={{ animationDelay: "300ms" }}
          >
            <div className="p-6 border-b border-white/5">
              <h3 className="text-lg font-semibold text-slate-100">Órdenes recientes</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Folio</TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
                    Cliente
                  </TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Equipo</TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Estado</TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
                    Técnico
                  </TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
                    Sucursal
                  </TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Fecha</TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order, index) => (
                  <TableRow
                    key={order.folio}
                    className="border-white/5 hover:bg-white/5 text-slate-300 transition-all duration-150 group"
                    style={{
                      animation: "fadeInUp 0.3s ease-out forwards",
                      animationDelay: `${400 + index * 50}ms`,
                      opacity: 0,
                    }}
                  >
                    <TableCell className="font-mono text-sm text-indigo-400">{order.folio}</TableCell>
                    <TableCell className="font-medium">{order.cliente}</TableCell>
                    <TableCell className="text-sm">{order.equipo}</TableCell>
                    <TableCell>
                      <BadgeStatus status={order.estado} />
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">{order.tecnico}</TableCell>
                    <TableCell className="text-slate-400 text-sm">{order.sucursal}</TableCell>
                    <TableCell className="text-slate-400 text-sm">{order.fecha}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all duration-200 group-hover:translate-x-0.5"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                        <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
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
