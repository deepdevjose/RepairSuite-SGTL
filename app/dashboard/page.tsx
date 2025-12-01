"use client"

import { useState, useEffect } from "react"
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
import { NewEquipmentDialog } from "@/components/dashboard/new-equipment-dialog"
import { OrderDetailsDialog } from "@/components/dashboard/order-details-dialog"
import { PendingRequestsDialog } from "@/components/inventory/pending-requests-dialog"
import { useToast } from "@/hooks/use-toast"

const chartData: any[] = []

type Orden = {
  id: string
  folio: string
  estado: string
  tipoServicio?: string // Added
  cliente: { nombre?: string, telefono?: string }
  equipo: { marca: string, modelo: string, tipo: string }
  tecnico?: { nombre: string }
  createdAt: string
  montoTotal?: number
  anticipo?: number
  saldoPendiente?: number
  tiempoReparacion?: string
  problemaReportado?: string
  fechaCompletado?: string
  fechaEstimadaFin?: string
  pagos?: Array<{ monto: number, fechaPago: string }>
  diagnostico?: string
  cotizacion?: number
}

type Venta = {
  id: string
  montoPagado: number
  saldoPendiente: number
  total: number
  createdAt: string
}

const recentOrders: any[] = []



const recentActivity: any[] = []

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [dateFilter, setDateFilter] = useState<string>("30")
  const [technicianFilter, setTechnicianFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Dialog states
  // Dialog states
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isNewClientOpen, setIsNewClientOpen] = useState(false)
  const [isNewEquipmentOpen, setIsNewEquipmentOpen] = useState(false)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [isPendingRequestsOpen, setIsPendingRequestsOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Orden | null>(null)

  // Chaining states
  const [createdClientId, setCreatedClientId] = useState<string | undefined>(undefined)
  const [createdEquipmentId, setCreatedEquipmentId] = useState<string | undefined>(undefined)
  const [createdOrderId, setCreatedOrderId] = useState<string | undefined>(undefined)
  const [paymentAmount, setPaymentAmount] = useState<number | undefined>(undefined)

  // Stats
  const [stats, setStats] = useState({
    totalActivas: 0,
    enDiagnostico: 0,
    enReparacion: 0,
    listasEntrega: 0,
    pendientesInventario: 0,
  })
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [ventas, setVentas] = useState<Venta[]>([])
  const [financialStats, setFinancialStats] = useState({
    ingresosMes: 0,
    porCobrar: 0,
  })
  const [technicianOrders, setTechnicianOrders] = useState<Orden[]>([])
  const [recentActivityList, setRecentActivityList] = useState<any[]>([])
  const [chartDataList, setChartDataList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
        console.log('🔄 Cargando datos del dashboard...')
      }

      // Cargar órdenes
      const resOrdenes = await fetch('/api/ordenes', { cache: 'no-store' })
      if (!resOrdenes.ok) {
        throw new Error(`Error al cargar órdenes: ${resOrdenes.status}`)
      }
      const dataOrdenes = await resOrdenes.json()
      if (showLoading) console.log('📦 Órdenes cargadas:', dataOrdenes.length)
      setOrdenes(dataOrdenes)

      // Calcular estadísticas de órdenes
      const totalActivas = dataOrdenes.filter((o: Orden) =>
        !['Completada', 'Cancelada', 'Entregada', 'Pagado y entregado'].includes(o.estado)
      ).length

      const enDiagnostico = dataOrdenes.filter((o: Orden) =>
        ['Esperando diagnóstico', 'En diagnóstico', 'Diagnóstico terminado', 'Esperando aprobación', 'En espera de aprobación'].includes(o.estado)
      ).length

      const enReparacion = dataOrdenes.filter((o: Orden) =>
        ['En reparación', 'En proceso', 'Reparación terminada'].includes(o.estado)
      ).length

      const listasEntrega = dataOrdenes.filter((o: Orden) =>
        ['Lista para entrega', 'Listo para entrega'].includes(o.estado)
      ).length

      setStats({
        totalActivas,
        enDiagnostico,
        enReparacion,
        listasEntrega,
        pendientesInventario: 0,
      })

      // Fetch pending inventory withdrawals count
      try {
        const resPending = await fetch('/api/inventory/withdrawals/pending')
        if (resPending.ok) {
          const pendingData = await resPending.json()
          setStats(prev => ({ ...prev, pendientesInventario: pendingData.length }))
        }
      } catch (e) {
        console.error("Error loading pending withdrawals count", e)
      }

      // --- Technician Specific Data ---
      if (user?.role === "Técnico") {
        // Assigned Orders
        const myOrders = dataOrdenes
          .filter((o: Orden) => {
            if (!o.tecnico?.nombre) return false
            const techName = o.tecnico.nombre.toLowerCase()
            const userName = user.name.toLowerCase()
            return userName.includes(techName) || techName.includes(userName)
          })
          .sort((a: Orden, b: Orden) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)

        setTechnicianOrders(myOrders)
      }

      // Recent Activity (Global or Technician specific could be implemented here)
      // For now, we'll show global recent activity derived from orders
      const activity = dataOrdenes
        .sort((a: Orden, b: Orden) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map((o: Orden) => ({
          id: o.id,
          mensaje: `Orden ${o.folio} - ${o.estado}`,
          tiempo: new Date(o.createdAt).toLocaleDateString('es-MX', { hour: '2-digit', minute: '2-digit' }),
          icon: Activity, // Default icon
          color: 'text-blue-400'
        }))
      setRecentActivityList(activity)

      // Chart Data (Orders by State)
      const statusCounts = dataOrdenes.reduce((acc: any, o: Orden) => {
        const status = o.estado
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {})

      const diagnosticoCount =
        (statusCounts['Esperando diagnóstico'] || 0) +
        (statusCounts['En diagnóstico'] || 0) +
        (statusCounts['Diagnóstico terminado'] || 0) +
        (statusCounts['Esperando aprobación'] || 0) +
        (statusCounts['En espera de aprobación'] || 0)

      const reparacionCount =
        (statusCounts['En reparación'] || 0) +
        (statusCounts['En proceso'] || 0) +
        (statusCounts['Reparación terminada'] || 0) +
        (statusCounts['Esperando repuestos'] || 0)

      const entregaCount =
        (statusCounts['Listo para entrega'] || 0) +
        (statusCounts['Lista para entrega'] || 0)

      const chartData = [
        { name: 'Diagnóstico', mantenimiento: diagnosticoCount },
        { name: 'Reparación', reparacion: reparacionCount },
        { name: 'Entrega', upgrade: entregaCount },
      ]
      setChartDataList(chartData)
      // --------------------------------

      // Cargar ventas para estadísticas financieras
      const resVentas = await fetch('/api/ventas')
      if (!resVentas.ok) {
        console.warn('⚠️ Error al cargar ventas:', resVentas.status)
        setVentas([])
      } else {
        const dataVentas = await resVentas.json()
        if (showLoading) console.log('💰 Ventas cargadas:', dataVentas.length)
        setVentas(dataVentas)
      }

      // Calcular ingresos del mes actual (ventas + pagos de órdenes)
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      // Ingresos de ventas del mes
      const resVentasData = await fetch('/api/ventas').then(r => r.ok ? r.json() : []).catch(() => [])
      const ingresosVentas = resVentasData
        .filter((v: Venta) => new Date(v.createdAt) >= firstDayOfMonth)
        .reduce((sum: number, v: Venta) => sum + Number(v.montoPagado || 0), 0)

      // Ingresos de pagos de órdenes del mes
      const ingresosPagosOrdenes = dataOrdenes.reduce((sum: number, orden: any) => {
        if (!orden.pagos || orden.pagos.length === 0) return sum

        const pagosDelMes = orden.pagos.filter((p: any) => new Date(p.fechaPago) >= firstDayOfMonth)
        const totalPagosDelMes = pagosDelMes.reduce((pSum: number, p: any) => pSum + Number(p.monto || 0), 0)
        return sum + totalPagosDelMes
      }, 0)

      const ingresosMes = ingresosVentas + ingresosPagosOrdenes

      // Calcular total por cobrar (ventas + órdenes)
      const porCobrarVentas = resVentasData
        .reduce((sum: number, v: Venta) => sum + Number(v.saldoPendiente || 0), 0)

      // Para órdenes: calcular saldo pendiente = montoTotal - suma de pagos
      const porCobrarOrdenes = dataOrdenes.reduce((sum: number, orden: any) => {
        const montoTotal = Number(orden.montoTotal || 0)

        // Calcular total pagado de esta orden
        const totalPagado = (orden.pagos || []).reduce((pSum: number, p: any) =>
          pSum + Number(p.monto || 0), 0
        )

        // Saldo pendiente = total - pagado
        const saldoPendiente = montoTotal - totalPagado

        // Solo sumar si hay saldo pendiente positivo
        return sum + (saldoPendiente > 0 ? saldoPendiente : 0)
      }, 0)

      const porCobrar = porCobrarVentas + porCobrarOrdenes

      if (showLoading) console.log('💵 Finanzas:', { ingresosMes, porCobrar })

      setFinancialStats({
        ingresosMes,
        porCobrar,
      })

      if (showLoading) console.log('✅ Datos del dashboard cargados exitosamente')
    } catch (error) {
      console.error('❌ Error al cargar datos del dashboard:', error)
      if (showLoading) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del dashboard",
          variant: "destructive"
        })
      }
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()

    // Poll for updates every 15 seconds
    const intervalId = setInterval(() => {
      loadDashboardData()
    }, 15000)

    return () => clearInterval(intervalId)
  }, [])

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
                <div className="text-4xl font-bold text-slate-100 mb-2">{stats.totalActivas}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  {stats.totalActivas > 0 ? `${stats.totalActivas} órdenes activas` : 'Sin datos'}
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
                <div className="text-4xl font-bold text-slate-100 mb-2">{stats.enDiagnostico}</div>
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
                <div className="text-4xl font-bold text-slate-100 mb-2">{stats.enReparacion}</div>
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
                <div className="text-4xl font-bold text-slate-100 mb-2">{stats.listasEntrega}</div>
                <div className="text-xs text-slate-500 font-medium">Notificar clientes</div>
              </div>
            </Card>
          </div>

          {/* Fila 2: KPIs Financieros */}
          {user?.role !== "Técnico" && (
            <div className="grid gap-4 md:grid-cols-2 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 group cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl group-hover:from-emerald-500/20 transition-all duration-500" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Ingresos del mes</div>
                    <div className="p-2 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-slate-100 mb-2">${financialStats.ingresosMes.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    {financialStats.ingresosMes > 0 ? 'Del mes actual' : 'Sin ingresos'}
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
                  <div className="text-4xl font-bold text-slate-100 mb-2">${financialStats.porCobrar.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</div>
                  <div className="text-xs text-slate-500 font-medium">Pendiente de pago</div>
                </div>
              </Card>
            </div>
          )}

          {/* Unified Grid for Secondary Widgets */}
          <div className="grid gap-4 md:grid-cols-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {/* Acciones Rápidas - Solo para Recepción */}
            {user?.role === "Recepción" && (
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
                    onClick={() => setIsNewEquipmentOpen(true)}
                    className="h-20 flex-col gap-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 hover:text-purple-200"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span className="text-sm">Registrar equipo</span>
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
                  {technicianOrders.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-sm">
                      No tienes órdenes asignadas recientemente
                    </div>
                  ) : (
                    technicianOrders.map((order) => (
                      <div key={order.id} className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-start gap-3">
                        <Bell className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-indigo-300">Orden: {order.folio}</p>
                          <p className="text-xs text-indigo-400/80">{order.equipo.marca} {order.equipo.modelo} - {order.cliente.nombre}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )}

            {/* Alertas */}
            {user?.role !== "Técnico" && (
              <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-400" />
                  Alertas y Notificaciones
                </h3>
                <div className="space-y-3">
                  {/* Órdenes retrasadas */}
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-300">
                        {ordenes.filter(o => {
                          const diasTranscurridos = Math.floor((new Date().getTime() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                          return diasTranscurridos > 7 && !['Pagado y entregado', 'Cancelada', 'Entregada'].includes(o.estado)
                        }).length} órdenes retrasadas
                      </p>
                      <p className="text-xs text-red-400/80">
                        {ordenes.filter(o => {
                          const diasTranscurridos = Math.floor((new Date().getTime() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                          return diasTranscurridos > 7 && !['Pagado y entregado', 'Cancelada', 'Entregada'].includes(o.estado)
                        }).length > 0 ? 'Más de 7 días sin completar' : 'Sin alertas'}
                      </p>
                    </div>
                  </div>

                  {/* Cotizaciones pendientes */}
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
                    <Clock className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-300">
                        {ordenes.filter(o => o.estado === 'Esperando aprobación').length} cotizaciones sin respuesta
                      </p>
                      <p className="text-xs text-amber-400/80">
                        {ordenes.filter(o => o.estado === 'Esperando aprobación').length > 0 ? 'Pendientes de aprobación del cliente' : 'Sin pendientes'}
                      </p>
                    </div>
                  </div>

                  {/* Equipos listos para entrega */}
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-300">
                        {ordenes.filter(o => o.estado === 'Listo para entrega').length} equipos listos
                      </p>
                      <p className="text-xs text-green-400/80">
                        {ordenes.filter(o => o.estado === 'Listo para entrega').length > 0 ? 'Listos para notificar al cliente' : 'Sin notificaciones'}
                      </p>
                    </div>
                  </div>

                  {/* Solicitudes de Inventario Pendientes */}
                  <div
                    className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-start gap-3 cursor-pointer hover:bg-indigo-500/20 transition-colors"
                    onClick={() => setIsPendingRequestsOpen(true)}
                  >
                    <ClipboardList className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-indigo-300">
                        {stats.pendientesInventario || 0} solicitudes de inventario
                      </p>
                      <p className="text-xs text-indigo-400/80">
                        {stats.pendientesInventario > 0 ? 'Requieren aprobación' : 'Sin pendientes'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}



            {/* Actividad Reciente */}
            {user?.role !== "Recepción" && (
              <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  Actividad Reciente
                </h3>
                <div className="space-y-3">
                  {recentActivityList.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-sm">
                      No hay actividad reciente
                    </div>
                  ) : (
                    recentActivityList.map((activity) => {
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
                    })
                  )}
                </div>
              </Card>
            )}
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
                  <BarChart data={chartDataList}>
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

              {/* Equipos listos para entrega */}
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-300">
                    {ordenes.filter(o => o.estado === 'Listo para entrega').length} equipos listos
                  </p>
                  <p className="text-xs text-green-400/80">
                    {ordenes.filter(o => o.estado === 'Listo para entrega').length > 0 ? 'Listos para notificar al cliente' : 'Sin notificaciones'}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Modals */}
      < NewClientDialog
        open={isNewClientOpen}
        onOpenChange={setIsNewClientOpen}
        onSave={(client) => {
          setCreatedClientId(client.id)
          // Chain: Client -> Equipment
          setTimeout(() => setIsNewEquipmentOpen(true), 500)
        }
        }
      />

      < NewEquipmentDialog
        open={isNewEquipmentOpen}
        onOpenChange={(open) => {
          setIsNewEquipmentOpen(open)
          if (!open) setCreatedClientId(undefined) // Reset if closed without success
        }}
        initialClientId={createdClientId}
        onSuccess={(equipment) => {
          if (equipment) {
            setCreatedEquipmentId(equipment.id)
            // Chain: Equipment -> Order
            setTimeout(() => setIsNewOrderOpen(true), 500)
          }
        }}
      />

      < NewServiceOrderDialog
        open={isNewOrderOpen}
        onOpenChange={(open) => {
          setIsNewOrderOpen(open)
          if (!open) {
            setCreatedClientId(undefined)
            setCreatedEquipmentId(undefined)
          }
        }}
        initialClientId={createdClientId}
        initialEquipmentId={createdEquipmentId}
        onSave={(order) => {
          loadDashboardData()
          // Chain: Order -> Payment
          if (order.anticipoRequerido > 0) {
            setCreatedOrderId(order.id)
            setPaymentAmount(order.anticipoRequerido)
            setTimeout(() => setIsPaymentOpen(true), 500)
          }
        }}
      />

      < PaymentDialog
        open={isPaymentOpen}
        onOpenChange={(open) => {
          setIsPaymentOpen(open)
          if (!open) {
            setCreatedOrderId(undefined)
            setPaymentAmount(undefined)
          }
        }}
        initialOrderId={createdOrderId}
        initialAmount={paymentAmount}
        onSave={() => {
          loadDashboardData()
          toast({
            title: "Proceso completado",
            description: "Se ha registrado el cliente, equipo, orden y pago exitosamente.",
          })
        }}
      />

      < OrderDetailsDialog
        open={isOrderDetailsOpen}
        onOpenChange={setIsOrderDetailsOpen}
        order={selectedOrder}
        onStatusChange={() => loadDashboardData()}
      />

      <PendingRequestsDialog
        open={isPendingRequestsOpen}
        onOpenChange={setIsPendingRequestsOpen}
      />
    </>
  )
}

