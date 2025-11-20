"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { PaymentMethodBadge } from "@/components/sales/payment-method-badge"
import { PaymentStatusBadge } from "@/components/sales/payment-status-badge"
import { PaymentDialog } from "@/components/sales/payment-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, DollarSign, TrendingUp, Clock, AlertCircle } from "lucide-react"
import { mockSales } from "@/lib/data/sales-mock"
import { formatCurrency, formatDate } from "@/lib/utils/sales-helpers"
import type { SaleDetail } from "@/lib/types/sales"

export default function VentasPage() {
  const { hasPermission, user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [sucursalFilter, setSucursalFilter] = useState("all")
  const [estadoFilter, setEstadoFilter] = useState("all")
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<SaleDetail | null>(null)

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

  // Filter sales
  const filteredSales = useMemo(() => {
    return mockSales.filter((sale) => {
      const matchesSearch =
        sale.folioOS.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.equipo.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSucursal = sucursalFilter === "all" || sale.sucursal === sucursalFilter
      const matchesEstado = estadoFilter === "all" || sale.estado === estadoFilter

      return matchesSearch && matchesSucursal && matchesEstado
    })
  }, [searchTerm, sucursalFilter, estadoFilter])

  // Calculate stats
  const stats = useMemo(() => {
    const cobrado = mockSales.reduce((sum, sale) => sum + sale.pagado, 0)
    const porCobrar = mockSales.reduce((sum, sale) => sum + sale.saldo, 0)
    const totalVentas = mockSales.reduce((sum, sale) => sum + sale.total, 0)
    const utilidad = mockSales.reduce((sum, sale) => sum + (sale.utilidad || 0), 0)

    const hoy = new Date().toISOString().split("T")[0]
    const pagosHoy = mockSales.filter((sale) => sale.ultimoPago?.fecha === hoy).length

    const vencidas = mockSales.filter((sale) => sale.saldo > 0 && sale.fechaVencimiento && sale.fechaVencimiento < hoy)
      .length

    return {
      cobrado,
      porCobrar,
      totalVentas,
      utilidad,
      pagosHoy,
      vencidas,
    }
  }, [])

  const handleOpenPaymentDialog = (sale: SaleDetail) => {
    setSelectedSale(sale)
    setIsPaymentDialogOpen(true)
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
                <div className="text-xs text-slate-500 font-medium">{mockSales.length} órdenes</div>
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
                  <Select value={sucursalFilter} onValueChange={setSucursalFilter}>
                    <SelectTrigger className="h-9 w-[140px] bg-slate-800/40 border-slate-700 text-slate-300 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="all" className="text-slate-300 text-xs">
                        Todas las sucursales
                      </SelectItem>
                      <SelectItem value="Sede A" className="text-slate-300 text-xs">
                        Sede A
                      </SelectItem>
                      <SelectItem value="Sede B" className="text-slate-300 text-xs">
                        Sede B
                      </SelectItem>
                      <SelectItem value="Sede C" className="text-slate-300 text-xs">
                        Sede C
                      </SelectItem>
                    </SelectContent>
                  </Select>

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
                      Folio OS
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Cliente
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Equipo
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Sucursal
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
                  {filteredSales.map((sale, index) => (
                    <TableRow
                      key={sale.id}
                      className="border-white/5 hover:bg-white/[0.02] text-slate-300 transition-all duration-150"
                      style={{
                        animation: "fadeInUp 0.3s ease-out forwards",
                        animationDelay: `${index * 30}ms`,
                        opacity: 0,
                      }}
                    >
                      <TableCell className="font-mono text-[12px] text-indigo-400">{sale.folioOS}</TableCell>
                      <TableCell className="text-[13px]">{sale.cliente}</TableCell>
                      <TableCell className="text-[12px] text-slate-400">{sale.equipo}</TableCell>
                      <TableCell className="text-[12px] text-slate-400">{sale.sucursal}</TableCell>
                      <TableCell className="text-[12px] text-slate-400">{formatDate(sale.fechaCreacion)}</TableCell>
                      <TableCell className="text-right text-[13px] font-semibold text-slate-200">
                        {formatCurrency(sale.total)}
                      </TableCell>
                      <TableCell className="text-right text-[13px] font-semibold text-green-400">
                        {formatCurrency(sale.pagado)}
                      </TableCell>
                      <TableCell className="text-right text-[13px] font-semibold text-yellow-400">
                        {formatCurrency(sale.saldo)}
                      </TableCell>
                      <TableCell>
                        <PaymentStatusBadge estado={sale.estado} />
                      </TableCell>
                      <TableCell>
                        {sale.ultimoPago ? (
                          <div className="text-[11px]">
                            <div className="text-slate-400">{formatDate(sale.ultimoPago.fecha)}</div>
                            <PaymentMethodBadge metodo={sale.ultimoPago.metodo} />
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-600">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/dashboard/ventas/${sale.folioOS}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                              title="Ver detalles"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          {canRegisterPayment && sale.saldo > 0 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenPaymentDialog(sale)}
                              className="h-7 px-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 text-xs"
                              title="Registrar pago"
                            >
                              <DollarSign className="h-3.5 w-3.5 mr-1" />
                              Pagar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Results count */}
            {filteredSales.length > 0 && (
              <div className="border-t border-white/5 px-6 py-4">
                <p className="text-xs text-slate-500">
                  Mostrando <span className="font-semibold text-slate-400">{filteredSales.length}</span> ventas
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
        sale={selectedSale}
        onPaymentRegistered={() => {
          // Aquí se actualizaría la lista de ventas
          console.log("Pago registrado exitosamente")
        }}
      />
    </>
  )
}
