"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { PaymentMethodBadge } from "@/components/sales/payment-method-badge"
import { PaymentStatusBadge } from "@/components/sales/payment-status-badge"
import { PaymentDialog } from "@/components/sales/payment-dialog"
import { PaymentDetailsDialog, PaymentDetailItem } from "@/components/sales/payment-details-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, DollarSign, TrendingUp, Clock, AlertCircle } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/sales-helpers"
import { PaymentMethod, PaymentStatus, SaleDetail } from "@/lib/types/sales"

interface Venta {
  id: string
  folio: string
  cliente: {
    nombre1: string
    apellidoPaterno: string
    telefono: string
    email: string | null
  }
  ordenServicio: {
    folio: string
    equipo: {
      marca: string
      modelo: string
    }
  } | null
  subtotal: number
  descuento: number
  impuestos: number
  total: number
  montoPagado: number
  saldoPendiente: number
  metodoPago: PaymentMethod
  estadoPago: PaymentStatus
  fechaVencimiento: string | null
  createdAt: string
  items: Array<{
    cantidad: number
    precioUnitario: number
    costoUnitario: number
    tipo: string
    producto: {
      nombre: string
    }
  }>
  pagos: Array<{
    monto: number
    metodoPago: PaymentMethod
    createdAt: string
    usuario: {
      nombre: string
    }
  }>
}

interface OrdenConPagos {
  id: string
  folio: string
  cliente: {
    nombre1: string
    apellidoPaterno: string
  }
  equipo: {
    marca: string
    modelo: string
  }
  montoTotal: number | null
  saldoPendiente: number | null
  createdAt: string
  pagos: Array<{
    id: string
    monto: number
    metodoPago: string
    fechaPago: string
  }>
}

type TransaccionUnificada = {
  id: string
  folio: string
  tipo: 'venta' | 'orden'
  cliente: string
  descripcion: string
  total: number
  montoPagado: number
  saldoPendiente: number
  estadoPago: string
  createdAt: string
  ultimoPago?: {
    fecha: string
    metodo: string
  }
}

export default function VentasPage() {
  const { hasPermission, user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("all")
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<Venta | null>(null)
  const [selectedTransactionDetails, setSelectedTransactionDetails] = useState<PaymentDetailItem | null>(null)
  const [ventas, setVentas] = useState<Venta[]>([])
  const [ordenes, setOrdenes] = useState<OrdenConPagos[]>([])
  const [transacciones, setTransacciones] = useState<TransaccionUnificada[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Cargar ventas
      const resVentas = await fetch('/api/ventas')
      const dataVentas = await resVentas.json()
      setVentas(dataVentas)

      // Cargar órdenes con pagos
      const resOrdenes = await fetch('/api/ordenes')
      const dataOrdenes = await resOrdenes.json()

      // Filtrar solo órdenes que tienen pagos
      const ordenesConPagos = dataOrdenes.filter((o: any) =>
        o.pagos && o.pagos.length > 0
      )
      setOrdenes(ordenesConPagos)

      // Unificar transacciones
      const transaccionesUnificadas: TransaccionUnificada[] = [
        // Ventas
        ...dataVentas.map((v: Venta) => ({
          id: v.id,
          folio: v.folio,
          tipo: 'venta' as const,
          cliente: `${v.cliente.nombre1} ${v.cliente.apellidoPaterno}`,
          descripcion: v.ordenServicio
            ? `${v.ordenServicio.equipo.marca} ${v.ordenServicio.equipo.modelo}`
            : 'Venta directa',
          total: Number(v.total),
          montoPagado: Number(v.montoPagado),
          saldoPendiente: Number(v.saldoPendiente),
          estadoPago: v.estadoPago,
          createdAt: v.createdAt,
          ultimoPago: v.pagos && v.pagos.length > 0 ? {
            fecha: v.pagos[0].createdAt,
            metodo: v.pagos[0].metodoPago
          } : undefined
        })),
        // Órdenes de servicio con pagos
        ...ordenesConPagos.map((o: any) => {
          const totalPagado = o.pagos.reduce((sum: number, p: any) => sum + Number(p.monto), 0)
          const montoTotal = o.montoTotal ? Number(o.montoTotal) : totalPagado
          const saldoPendiente = o.saldoPendiente !== null ? Number(o.saldoPendiente) : (montoTotal - totalPagado)
          const estadoPago = saldoPendiente <= 0 ? 'Pagado' : totalPagado > 0 ? 'Parcial' : 'Pendiente'

          return {
            id: o.id,
            folio: o.folio,
            tipo: 'orden' as const,
            cliente: `${o.cliente.nombre1} ${o.cliente.apellidoPaterno}`,
            descripcion: `${o.equipo.marca} ${o.equipo.modelo}`,
            total: montoTotal,
            montoPagado: totalPagado,
            saldoPendiente: saldoPendiente,
            estadoPago: estadoPago,
            createdAt: o.createdAt,
            ultimoPago: o.pagos && o.pagos.length > 0 ? {
              fecha: o.pagos[0].fechaPago,
              metodo: o.pagos[0].metodoPago
            } : undefined
          }
        })
      ]

      // Ordenar por fecha descendente
      transaccionesUnificadas.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      setTransacciones(transaccionesUnificadas)
    } catch (error) {
      console.error('Error al obtener datos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!hasPermission("ventas")) {
    return (
      <>
        <DashboardHeader title="Ventas y Pagos" />
        <AccessDenied />
      </>
    )
  }

  const canRegisterPayment = user?.role === "Administrador" || user?.role === "Recepción"
  const canViewUtility = user?.role === "Administrador"

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transacciones.filter((trans) => {
      const matchesSearch =
        trans.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trans.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trans.descripcion.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEstado = estadoFilter === "all" || trans.estadoPago === estadoFilter

      return matchesSearch && matchesEstado
    })
  }, [transacciones, searchTerm, estadoFilter])

  // Calculate stats
  const stats = useMemo(() => {
    const cobrado = transacciones.reduce((sum, trans) => sum + trans.montoPagado, 0)
    const porCobrar = transacciones.reduce((sum, trans) => sum + trans.saldoPendiente, 0)
    const totalTransacciones = transacciones.reduce((sum, trans) => sum + trans.total, 0)

    // Calcular utilidad (solo de ventas con items)
    const utilidad = ventas.reduce((sum, sale) => {
      const utilidadVenta = sale.items.reduce((itemSum, item) => {
        const utilidadItem = (Number(item.precioUnitario) - Number(item.costoUnitario)) * item.cantidad
        return itemSum + utilidadItem
      }, 0)
      return sum + utilidadVenta
    }, 0)

    const hoy = new Date().toISOString().split("T")[0]

    // Contar pagos de hoy (ventas + órdenes)
    const pagosVentasHoy = ventas.reduce((count, sale) => {
      const pagosDeHoy = sale.pagos.filter(p => p.createdAt.split('T')[0] === hoy).length
      return count + pagosDeHoy
    }, 0)

    const pagosOrdenesHoy = ordenes.reduce((count, orden) => {
      const pagosDeHoy = orden.pagos.filter(p => p.fechaPago.split('T')[0] === hoy).length
      return count + pagosDeHoy
    }, 0)

    const pagosHoy = pagosVentasHoy + pagosOrdenesHoy

    const vencidas = ventas.filter((sale) =>
      Number(sale.saldoPendiente) > 0 &&
      sale.fechaVencimiento &&
      sale.fechaVencimiento < hoy
    ).length

    return {
      cobrado,
      porCobrar,
      totalVentas: totalTransacciones,
      utilidad,
      pagosHoy,
      vencidas,
    }
  }, [transacciones, ventas, ordenes])

  const handleOpenPaymentDialog = (sale: Venta) => {
    setSelectedSale(sale)
    setIsPaymentDialogOpen(true)
  }

  const handleViewDetails = (trans: TransaccionUnificada) => {
    let details: PaymentDetailItem | null = null

    if (trans.tipo === 'venta') {
      const venta = ventas.find(v => v.id === trans.id)
      if (venta) {
        details = {
          id: venta.id,
          folio: venta.folio,
          tipo: 'venta',
          cliente: `${venta.cliente.nombre1} ${venta.cliente.apellidoPaterno}`,
          descripcion: trans.descripcion,
          total: Number(venta.total),
          montoPagado: Number(venta.montoPagado),
          saldoPendiente: Number(venta.saldoPendiente),
          estadoPago: venta.estadoPago,
          fecha: venta.createdAt,
          pagos: venta.pagos.map(p => ({
            fecha: p.createdAt,
            monto: Number(p.monto),
            metodo: p.metodoPago,
            registradoPor: p.usuario?.nombre
          })),
          items: venta.items.map(item => ({
            cantidad: item.cantidad,
            descripcion: item.producto.nombre,
            precio: Number(item.precioUnitario),
            total: Number(item.precioUnitario) * item.cantidad
          }))
        }
      }
    } else {
      const orden = ordenes.find(o => o.id === trans.id)
      if (orden) {
        details = {
          id: orden.id,
          folio: orden.folio,
          tipo: 'orden',
          cliente: `${orden.cliente.nombre1} ${orden.cliente.apellidoPaterno}`,
          descripcion: trans.descripcion,
          total: trans.total,
          montoPagado: trans.montoPagado,
          saldoPendiente: trans.saldoPendiente,
          estadoPago: trans.estadoPago,
          fecha: orden.createdAt,
          pagos: orden.pagos.map(p => ({
            fecha: p.fechaPago,
            monto: Number(p.monto),
            metodo: p.metodoPago
          }))
        }
      }
    }

    if (details) {
      setSelectedTransactionDetails(details)
      setIsDetailsDialogOpen(true)
    }
  }

  // Helper to map Venta to SaleDetail for PaymentDialog
  const getSaleDetail = (sale: Venta | null): SaleDetail | null => {
    if (!sale) return null
    return {
      id: sale.id,
      ordenServicioId: sale.ordenServicio?.folio || '',
      folioOS: sale.folio, // Using sale folio as main folio
      cliente: `${sale.cliente.nombre1} ${sale.cliente.apellidoPaterno}`,
      clienteEmail: sale.cliente.email || undefined,
      clienteTelefono: sale.cliente.telefono,
      equipo: sale.ordenServicio ? `${sale.ordenServicio.equipo.marca} ${sale.ordenServicio.equipo.modelo}` : 'Venta directa',
      fechaCreacion: sale.createdAt,
      conceptos: sale.items.map(i => ({
        tipo: i.tipo as "Servicio" | "Refacción",
        catalogoSKU: '',
        nombre: i.producto.nombre,
        cantidad: i.cantidad,
        precioUnitario: i.precioUnitario,
        costoUnitario: i.costoUnitario,
        subtotal: i.cantidad * i.precioUnitario
      })),
      subtotal: sale.subtotal,
      descuento: sale.descuento,
      total: sale.total,
      pagado: sale.montoPagado,
      saldo: sale.saldoPendiente,
      estado: sale.estadoPago,
      pagos: sale.pagos.map(p => ({
        id: '',
        ordenServicioId: '',
        folioOS: sale.folio,
        monto: p.monto,
        metodoPago: p.metodoPago,
        fecha: p.createdAt,
        usuarioRegistro: p.usuario.nombre,
        nombreUsuario: p.usuario.nombre
      }))
    }
  }

  return (
    <>
      <DashboardHeader title="Ventas y Pagos" />
      <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl group-hover:from-green-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Cobrado</div>
                  <div className="p-2 rounded-lg bg-green-500/10 ring-1 ring-green-500/20">
                    <DollarSign className="h-4 w-4 text-green-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">{formatCurrency(stats.cobrado)}</div>
                <div className="text-xs text-slate-500 font-medium">Total pagado</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-2xl group-hover:from-yellow-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Por Cobrar</div>
                  <div className="p-2 rounded-lg bg-yellow-500/10 ring-1 ring-yellow-500/20">
                    <Clock className="h-4 w-4 text-yellow-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">{formatCurrency(stats.porCobrar)}</div>
                <div className="text-xs text-slate-500 font-medium">Saldo pendiente</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl group-hover:from-indigo-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Total Ventas</div>
                  <div className="p-2 rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20">
                    <TrendingUp className="h-4 w-4 text-indigo-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">{formatCurrency(stats.totalVentas)}</div>
                <div className="text-xs text-slate-500 font-medium">{transacciones.length} transacciones</div>
              </div>
            </Card>

            {canViewUtility && (
              <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 group cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:from-purple-500/20 transition-all duration-500" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Utilidad</div>
                    <div className="p-2 rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-100 mb-1">{formatCurrency(stats.utilidad)}</div>
                  <div className="text-xs text-slate-500 font-medium">Ganancia neta</div>
                </div>
              </Card>
            )}

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl group-hover:from-blue-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Pagos Hoy</div>
                  <div className="p-2 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                    <DollarSign className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">{stats.pagosHoy}</div>
                <div className="text-xs text-slate-500 font-medium">Registrados</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-2xl group-hover:from-red-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Vencidas</div>
                  <div className="p-2 rounded-lg bg-red-500/10 ring-1 ring-red-500/20">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">{stats.vencidas}</div>
                <div className="text-xs text-slate-500 font-medium">Requieren atención</div>
              </div>
            </Card>
          </div>

          {/* Filters and Table */}
          <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5">
            <div className="p-6 border-b border-white/5">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Buscar por folio, cliente o equipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/40 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                    <SelectTrigger className="h-9 w-[140px] bg-slate-800/40 border-slate-700 text-slate-300 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="all" className="text-slate-300 text-xs">
                        Todos los estados
                      </SelectItem>
                      <SelectItem value="Pagado" className="text-slate-300 text-xs">
                        Pagado
                      </SelectItem>
                      <SelectItem value="Parcial" className="text-slate-300 text-xs">
                        Parcial
                      </SelectItem>
                      <SelectItem value="Pendiente" className="text-slate-300 text-xs">
                        Pendiente
                      </SelectItem>
                      <SelectItem value="Vencido" className="text-slate-300 text-xs">
                        Vencido
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
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
                      Fecha
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">
                      Total
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">
                      Pagado
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">
                      Saldo
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Estado
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Último Pago
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-slate-400 py-8">
                        Cargando transacciones...
                      </TableCell>
                    </TableRow>
                  ) : filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-slate-400 py-8">
                        No se encontraron transacciones
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((trans, index) => (
                      <TableRow
                        key={trans.id}
                        className="border-white/5 hover:bg-white/[0.02] text-slate-300 transition-all duration-150"
                        style={{
                          animation: "fadeInUp 0.3s ease-out forwards",
                          animationDelay: `${index * 30}ms`,
                          opacity: 0,
                        }}
                      >
                        <TableCell className="font-mono text-[12px] text-indigo-400">
                          {trans.folio}
                          <span className="ml-2 text-[10px] text-slate-500">
                            ({trans.tipo === 'venta' ? 'Venta' : 'OS'})
                          </span>
                        </TableCell>
                        <TableCell className="text-[13px]">
                          {trans.cliente}
                        </TableCell>
                        <TableCell className="text-[12px] text-slate-400">
                          {trans.descripcion}
                        </TableCell>
                        <TableCell className="text-[12px] text-slate-400">{formatDate(trans.createdAt)}</TableCell>
                        <TableCell className="text-right text-[13px] font-semibold text-slate-200">
                          {formatCurrency(trans.total)}
                        </TableCell>
                        <TableCell className="text-right text-[13px] font-semibold text-green-400">
                          {formatCurrency(trans.montoPagado)}
                        </TableCell>
                        <TableCell className="text-right text-[13px] font-semibold text-yellow-400">
                          {formatCurrency(trans.saldoPendiente)}
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge estado={trans.estadoPago as PaymentStatus} />
                        </TableCell>
                        <TableCell>
                          {trans.ultimoPago ? (
                            <div className="text-[11px]">
                              <div className="text-slate-400">{formatDate(trans.ultimoPago.fecha)}</div>
                              <PaymentMethodBadge metodo={trans.ultimoPago.metodo as PaymentMethod} />
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-600">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                              title="Ver detalles"
                              onClick={() => handleViewDetails(trans)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Results count */}
            {filteredTransactions.length > 0 && (
              <div className="border-t border-white/5 px-6 py-4">
                <p className="text-xs text-slate-500">
                  Mostrando <span className="font-semibold text-slate-400">{filteredTransactions.length}</span> transacciones
                  <span className="ml-2 text-slate-600">
                    ({ventas.length} ventas + {ordenes.length} órdenes con pagos)
                  </span>
                </p>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Payment Dialog */}
      <PaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        sale={getSaleDetail(selectedSale)}
        onPaymentRegistered={() => {
          fetchData() // Refrescar lista de transacciones
          setIsPaymentDialogOpen(false)
        }}
      />

      {/* Payment Details Dialog */}
      <PaymentDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        data={selectedTransactionDetails}
      />
    </>
  )
}
