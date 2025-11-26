"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card } from "@/components/ui/card"
import { BadgeStatus } from "@/components/badge-status"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  ClipboardList,
  Wrench,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Activity,
  AlertTriangle,
  ShoppingCart,
  Clock,
  DollarSign,
  Plus,
  UserPlus,
  ShoppingBag,
  Star,
  Award,
  Bell,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NewServiceOrderDialog } from "@/components/dashboard/new-service-order-dialog"
import { PaymentDialog } from "@/components/dashboard/payment-dialog"
import { NewClientDialog } from "@/components/dashboard/new-client-dialog"
import { NewSaleDialog } from "@/components/dashboard/new-sale-dialog"
import { OrderDetailsDialog } from "@/components/dashboard/order-details-dialog"

const chartData: any[] = []

const recentOrders: any[] = []

const topTechnicians: any[] = []

const recentActivity: any[] = []

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [dateFilter, setDateFilter] = useState<string>("30")
  const [technicianFilter, setTechnicianFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Dialog states
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isNewClientOpen, setIsNewClientOpen] = useState(false)
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<typeof recentOrders[0] | null>(null)

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

          {/* Fila 1: KPIs Operativos */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl group-hover:from-indigo-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Órdenes activas</div>
                  <div className="p-2 rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20">
                    <ClipboardList className="h-4 w-4 text-indigo-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-100 mb-2">0</div>
                <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  Sin datos
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
                <div className="text-4xl font-bold text-slate-100 mb-2">0</div>
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
                <div className="text-4xl font-bold text-slate-100 mb-2">0</div>
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
                <div className="text-4xl font-bold text-slate-100 mb-2">0</div>
                <div className="text-xs text-slate-500 font-medium">Notificar clientes</div>
              </div>
            </Card>
          </div>

          {/* Fila 2: KPIs Financieros */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl group-hover:from-emerald-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Ingresos del mes</div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-100 mb-2">$0</div>
                <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  Sin datos
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl group-hover:from-cyan-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Ticket promedio</div>
                  <div className="p-2 rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/20">
                    <ShoppingCart className="h-4 w-4 text-cyan-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-100 mb-2">$0</div>
                <div className="text-xs text-slate-500 font-medium">Por orden de servicio</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-2xl group-hover:from-violet-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Tasa conversión</div>
                  <div className="p-2 rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20">
                    <TrendingUp className="h-4 w-4 text-violet-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-100 mb-2">0%</div>
                <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  Sin datos
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl group-hover:from-amber-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Por cobrar</div>
                  <div className="p-2 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
                    <Clock className="h-4 w-4 text-amber-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-100 mb-2">$0</div>
                <div className="text-xs text-slate-500 font-medium">Pendiente de pago</div>
              </div>
            </Card>
          </div>

          {/* Acciones Rápidas y Alertas */}
          <div className="grid gap-4 md:grid-cols-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {/* Acciones Rápidas - Solo para Admin y Recepción */}
            {user?.role !== "Técnico" && (
              <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-400" />
                  Acciones Rápidas
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => setIsNewOrderOpen(true)}
                    className="h-20 flex-col gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 hover:text-indigo-200"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="text-sm">Nueva OS</span>
                  </Button>
                  <Button
                    onClick={() => setIsPaymentOpen(true)}
                    className="h-20 flex-col gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 hover:text-emerald-200"
                  >
                    <DollarSign className="h-5 w-5" />
                    <span className="text-sm">Registrar Pago</span>
                  </Button>
                  <Button
                    onClick={() => setIsNewClientOpen(true)}
                    className="h-20 flex-col gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 hover:text-blue-200"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span className="text-sm">Nuevo Cliente</span>
                  </Button>
                  <Button
                    onClick={() => setIsNewSaleOpen(true)}
                    className="h-20 flex-col gap-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 hover:text-purple-200"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span className="text-sm">Nueva Venta</span>
                  </Button>
                </div>
              </Card>
            )}

            {/* Notificaciones de Órdenes Asignadas - Solo para Técnicos */}
            {user?.role === "Técnico" && (
              <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-indigo-400" />
                  Órdenes Asignadas Recientemente
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-start gap-3">
                    <Bell className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-indigo-300">Nueva orden: RS-OS-1024</p>
                      <p className="text-xs text-indigo-400/80">HP Pavilion 15 - Juan Pérez</p>
                      <p className="text-xs text-slate-500 mt-1">Hace 15 minutos</p>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
                    <Wrench className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-300">Nueva orden: RS-OS-1022</p>
                      <p className="text-xs text-blue-400/80">Dell XPS 15 - Pedro Ramírez</p>
                      <p className="text-xs text-slate-500 mt-1">Hace 2 horas</p>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-purple-300">Cotización aprobada: RS-OS-1018</p>
                      <p className="text-xs text-purple-400/80">MacBook Pro - Ana López</p>
                      <p className="text-xs text-slate-500 mt-1">Hace 4 horas</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Alertas */}
            <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-400" />
                Alertas y Notificaciones
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-300">0 órdenes retrasadas</p>
                    <p className="text-xs text-red-400/80">Sin alertas</p>
                  </div>
                </div>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
                  <Clock className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-300">0 cotizaciones sin respuesta</p>
                    <p className="text-xs text-amber-400/80">Sin pendientes</p>
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-300">0 equipos listos</p>
                    <p className="text-xs text-green-400/80">Sin notificaciones</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Técnicos y Actividad Reciente */}
          <div className="grid gap-4 md:grid-cols-2 animate-fade-in-up" style={{ animationDelay: "250ms" }}>
            {/* Top Técnicos */}
            <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-400" />
                Top Técnicos del Mes
              </h3>
              <div className="space-y-3">
                {topTechnicians.map((tech, index) => (
                  <div
                    key={tech.id}
                    className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {tech.avatar}
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Award className="h-3 w-3 text-yellow-900" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-slate-200">{tech.nombre}</span>
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-slate-400">{tech.calificacion}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>{tech.ordenesCompletadas} órdenes</span>
                          <span className="text-emerald-400">
                            ${(tech.ingresosGenerados / 1000).toFixed(1)}K generados
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actividad Reciente */}
            <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                Actividad Reciente
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-slate-800/50 ${activity.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-300">{activity.mensaje}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{activity.tiempo}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Gráfico de Órdenes por Estado - Solo visible para Admin y Técnico */}
          {user?.role !== "Recepción" && (
            <Card
              className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 animate-fade-in-up hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200"
              style={{ animationDelay: "300ms" }}
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
          )}

          {/* Tabla de Órdenes Recientes */}
          <Card
            className="bg-slate-900/60 backdrop-blur-sm border-white/5 animate-fade-in-up hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200"
            style={{ animationDelay: "350ms" }}
          >
            <div className="p-6 border-b border-white/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-slate-100">
                  {user?.role === "Técnico" ? "Mis Órdenes Asignadas" : "Órdenes recientes"}
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setStatusFilter("all")}
                    className={`h-7 text-xs ${statusFilter === "all"
                      ? "bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
                      : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
                      }`}
                  >
                    Todos
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setStatusFilter("En diagnóstico")}
                    className={`h-7 text-xs ${statusFilter === "En diagnóstico"
                      ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                      : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
                      }`}
                  >
                    En diagnóstico
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setStatusFilter("En proceso")}
                    className={`h-7 text-xs ${statusFilter === "En proceso"
                      ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                      : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
                      }`}
                  >
                    En proceso
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setStatusFilter("Listo para entrega")}
                    className={`h-7 text-xs ${statusFilter === "Listo para entrega"
                      ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                      : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
                      }`}
                  >
                    Listo
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setStatusFilter("En espera de aprobación")}
                    className={`h-7 text-xs ${statusFilter === "En espera de aprobación"
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
                  {user?.role !== "Técnico" && (
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Técnico
                    </TableHead>
                  )}
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
                {recentOrders
                  .filter((order) => statusFilter === "all" || order.estado === statusFilter)
                  .map((order) => (
                  <TableRow
                    key={order.folio}
                    className="border-white/5 hover:bg-white/[0.02] text-slate-300 transition-all duration-150 group"
                  >
                    <TableCell className="font-mono text-[13px] text-indigo-400 font-medium">{order.folio}</TableCell>
                    <TableCell className="font-medium text-[13px]">{order.cliente}</TableCell>
                    <TableCell className="text-[13px] text-slate-400">{order.equipo}</TableCell>
                    <TableCell>
                      <BadgeStatus status={order.estado} />
                    </TableCell>
                    {user?.role !== "Técnico" && (
                      <TableCell className="text-slate-400 text-[13px]">{order.tecnico}</TableCell>
                    )}
                    <TableCell className="text-slate-300 text-[13px] font-semibold text-right tabular-nums">
                      ${order.importe.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-slate-400 text-[13px] tabular-nums">{order.tiempoReparacion}</TableCell>
                    <TableCell className="text-slate-400 text-[13px]">{order.fecha}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsOrderDetailsOpen(true)
                        }}
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

      {/* Modals */}
      <NewServiceOrderDialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen} />
      <PaymentDialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen} />
      <NewClientDialog open={isNewClientOpen} onOpenChange={setIsNewClientOpen} />
      <NewSaleDialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen} />
      <OrderDetailsDialog 
        open={isOrderDetailsOpen} 
        onOpenChange={setIsOrderDetailsOpen} 
        order={selectedOrder}
        onStatusChange={(newStatus) => {
          console.log(`Estado cambiado a: ${newStatus}`)
          // Aquí se actualizaría el estado en la base de datos
        }}
      />
    </>
  )
}
