"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card } from "@/components/ui/card"
import { BadgeStatus } from "@/components/badge-status"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ClipboardList, Wrench, Clock, CheckCircle2, TrendingUp, Eye } from "lucide-react"
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
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome section */}
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Resumen general – JLaboratories</h2>
            <p className="text-slate-400 mt-1">Vista general del estado del taller y órdenes de servicio</p>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card className="bg-slate-900 border-slate-800 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-sm">Órdenes activas</div>
                <ClipboardList className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-1">59</div>
              <div className="text-xs text-emerald-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% vs mes anterior
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-sm">En diagnóstico</div>
                <Wrench className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-1">12</div>
              <div className="text-xs text-slate-500">Requieren atención</div>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-sm">En proceso</div>
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-1">24</div>
              <div className="text-xs text-slate-500">En reparación</div>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-sm">Listas para entrega</div>
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-1">15</div>
              <div className="text-xs text-slate-500">Notificar clientes</div>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-sm">Completadas (30d)</div>
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-1">156</div>
              <div className="text-xs text-emerald-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8% vs período anterior
              </div>
            </Card>
          </div>

          {/* Chart */}
          <Card className="bg-slate-900 border-slate-800 p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Órdenes por estado (últimos 30 días)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} stroke="#475569" />
                  <YAxis tick={{ fill: "#94a3b8" }} stroke="#475569" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent orders table */}
          <Card className="bg-slate-900 border-slate-800">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-slate-100">Órdenes recientes</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">Folio</TableHead>
                  <TableHead className="text-slate-400">Cliente</TableHead>
                  <TableHead className="text-slate-400">Equipo</TableHead>
                  <TableHead className="text-slate-400">Estado</TableHead>
                  <TableHead className="text-slate-400">Técnico</TableHead>
                  <TableHead className="text-slate-400">Sucursal</TableHead>
                  <TableHead className="text-slate-400">Fecha</TableHead>
                  <TableHead className="text-slate-400">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.folio} className="border-slate-800 hover:bg-slate-800/50 text-slate-300">
                    <TableCell className="font-mono text-sm">{order.folio}</TableCell>
                    <TableCell>{order.cliente}</TableCell>
                    <TableCell>{order.equipo}</TableCell>
                    <TableCell>
                      <BadgeStatus status={order.estado} />
                    </TableCell>
                    <TableCell className="text-slate-400">{order.tecnico}</TableCell>
                    <TableCell className="text-slate-400">{order.sucursal}</TableCell>
                    <TableCell className="text-slate-400">{order.fecha}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
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
