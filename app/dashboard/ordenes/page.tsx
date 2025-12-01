"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { OrderStateBadge } from "@/components/ordenes/order-state-badge"
import { OrderDetailsDialog } from "@/components/dashboard/order-details-dialog"
import { NewServiceOrderDialog } from "@/components/dashboard/new-service-order-dialog"
import { PaymentDialog } from "@/components/dashboard/payment-dialog"
import { NewClientDialog } from "@/components/dashboard/new-client-dialog"
import { NewEquipmentDialog } from "@/components/dashboard/new-equipment-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Eye, Shield, Filter, User, Building2, Clock, Loader2 } from 'lucide-react'
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { ServiceOrderState } from "@/lib/types/service-order"
import { useSearchParams } from 'next/navigation'

type OrdenDB = {
  id: string
  folio: string
  estado: ServiceOrderState
  prioridad: string
  problemaReportado: string
  tipoServicio?: string // Added
  createdAt: string
  cliente: { id: string; nombre: string; telefono: string }
  equipo: { id: string; tipo: string; marca: string; modelo: string }
  tecnico: { id: string; nombre: string } | null
  montoTotal?: number
  anticipo?: number
  saldoPendiente?: number
  tiempoReparacion?: string
  fechaCompletado?: string
  fechaEstimadaFin?: string // Added
  diagnostico?: string
  cotizacion?: number
}

export default function OrdenesPage() {
  const { hasPermission, user } = useAuth()
  const searchParams = useSearchParams()
  const searchId = searchParams.get('id')

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tecnicoFilter, setTecnicoFilter] = useState("all")

  const [selectedOrder, setSelectedOrder] = useState<OrdenDB | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [ordenes, setOrdenes] = useState<OrdenDB[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Dialog states
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isNewClientOpen, setIsNewClientOpen] = useState(false)
  const [isNewEquipmentOpen, setIsNewEquipmentOpen] = useState(false)

  // Chaining states
  const [createdClientId, setCreatedClientId] = useState<string | undefined>(undefined)
  const [createdEquipmentId, setCreatedEquipmentId] = useState<string | undefined>(undefined)
  const [createdOrderId, setCreatedOrderId] = useState<string | undefined>(undefined)
  const [paymentAmount, setPaymentAmount] = useState<number | undefined>(undefined)

  useEffect(() => {
    loadOrdenes()

    // Poll for updates every 10 seconds
    const intervalId = setInterval(() => {
      loadOrdenes(false)
    }, 10000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (searchId && ordenes.length > 0) {
      const order = ordenes.find(o => o.id === searchId)
      if (order) {
        setSelectedOrder(order)
        setIsDetailsOpen(true)
      }
    }
  }, [searchId, ordenes])

  const loadOrdenes = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const res = await fetch('/api/ordenes', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setOrdenes(data)
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error)
      if (showLoading) {
        toast({
          title: "Error",
          description: "No se pudieron cargar las órdenes",
          variant: "destructive"
        })
      }
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  const filteredOrders = ordenes.filter((order) => {
    const matchesSearch =
      order.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.equipo.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.problemaReportado.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.estado === statusFilter
    const matchesTecnico = tecnicoFilter === "all" || order.tecnico?.nombre === tecnicoFilter
    return matchesSearch && matchesStatus && matchesTecnico
  })

  // Calcular estadísticas
  const totalActivas = ordenes.filter(o =>
    !['Pagado y entregado', 'Cancelada'].includes(o.estado)
  ).length

  const enDiagnostico = ordenes.filter(o =>
    ['Esperando diagnóstico', 'En diagnóstico', 'Diagnóstico terminado', 'Esperando aprobación', 'En espera de aprobación'].includes(o.estado)
  ).length

  const enReparacion = ordenes.filter(o =>
    ['En reparación', 'En proceso', 'Reparación terminada'].includes(o.estado)
  ).length

  const listasEntrega = ordenes.filter(o =>
    ['Lista para entrega', 'Listo para entrega'].includes(o.estado)
  ).length

  if (!hasPermission("ordenes")) {
    return (
      <>
        <DashboardHeader title="Órdenes de Servicio" />
        <AccessDenied />
      </>
    )
  }

  if (loading) {
    return (
      <>
        <DashboardHeader title="Órdenes de Servicio" />
        <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Cargando órdenes...</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <DashboardHeader title="Órdenes de Servicio" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Filters Card */}
          <Card className="bg-slate-900/50 border-slate-800 p-6 backdrop-blur-sm">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  placeholder="Buscar por folio, cliente, equipo o diagnóstico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 h-11"
                />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100">
                    <Filter className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="En diagnóstico">En diagnóstico</SelectItem>
                    <SelectItem value="Pendiente aprobación">Pendiente aprobación</SelectItem>
                    <SelectItem value="En reparación">En reparación</SelectItem>
                    <SelectItem value="Listo para entrega">Listo para entrega</SelectItem>
                    <SelectItem value="Entregada">Entregada</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={tecnicoFilter} onValueChange={setTecnicoFilter}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100">
                    <User className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Técnico" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">Todos los técnicos</SelectItem>
                    <SelectItem value="Carlos Gómez">Carlos Gómez</SelectItem>
                    <SelectItem value="Ana Martínez">Ana Martínez</SelectItem>
                    <SelectItem value="Luis Torres">Luis Torres</SelectItem>
                  </SelectContent>
                </Select>



                {user?.role !== "Técnico" && (
                  <div className="w-full">
                    <Button
                      onClick={() => setIsNewOrderOpen(true)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 h-10"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva OS
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-slate-900/50 border-slate-800 p-5 backdrop-blur-sm hover:bg-slate-900/70 transition-colors">
              <div className="text-sm text-slate-400 font-medium">Total activas</div>
              <div className="text-3xl font-bold text-slate-100 mt-1">{totalActivas}</div>
              <div className="text-xs text-slate-500 mt-1">Órdenes en proceso</div>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 p-5 backdrop-blur-sm hover:bg-slate-900/70 transition-colors">
              <div className="text-sm text-slate-400 font-medium">En diagnóstico</div>
              <div className="text-3xl font-bold text-blue-400 mt-1">{enDiagnostico}</div>
              <div className="text-xs text-slate-500 mt-1">Esperando revisión técnica</div>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 p-5 backdrop-blur-sm hover:bg-slate-900/70 transition-colors">
              <div className="text-sm text-slate-400 font-medium">En reparación</div>
              <div className="text-3xl font-bold text-purple-400 mt-1">{enReparacion}</div>
              <div className="text-xs text-slate-500 mt-1">Reparaciones en curso</div>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 p-5 backdrop-blur-sm hover:bg-slate-900/70 transition-colors">
              <div className="text-sm text-slate-400 font-medium">Listas para entrega</div>
              <div className="text-3xl font-bold text-green-400 mt-1">{listasEntrega}</div>
              <div className="text-xs text-slate-500 mt-1">Esperando al cliente</div>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableHead className="text-slate-400 font-semibold">Folio</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Cliente</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Equipo</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Estado</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Técnico</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Diagnóstico</TableHead>
                    <TableHead className="text-slate-400 font-semibold text-right">Total estimado</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Última actualización</TableHead>
                    <TableHead className="text-slate-400 font-semibold text-center">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow className="border-slate-800">
                      <TableCell colSpan={9} className="text-center text-slate-400 py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Filter className="h-12 w-12 text-slate-600" />
                          <p className="text-lg">No se encontraron órdenes de servicio</p>
                          <p className="text-sm text-slate-500">Intenta ajustar los filtros de búsqueda</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.folio} className="border-slate-800 hover:bg-slate-800/30 text-slate-300 transition-colors">
                        <TableCell className="font-mono text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {order.folio}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{order.cliente.nombre}</TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="font-medium text-slate-200">{order.equipo.marca} {order.equipo.modelo}</div>
                            <div className="text-xs text-slate-500">{order.equipo.tipo}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <OrderStateBadge estado={order.estado} />
                        </TableCell>
                        <TableCell className="text-slate-400">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-slate-500" />
                            {order.tecnico?.nombre || "No asignado"}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <div className="text-sm text-slate-400 truncate" title={order.problemaReportado}>
                            {order.problemaReportado}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <span className="text-slate-500">
                            {order.montoTotal ? `$${order.montoTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` : 'Pendiente'}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(order.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-600/30"
                            onClick={() => {
                              setSelectedOrder(order)
                              setIsDetailsOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1.5" />
                            Ver OS
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </main>

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        order={selectedOrder ? {
          id: selectedOrder.id,
          folio: selectedOrder.folio,
          cliente: selectedOrder.cliente.nombre,
          clienteTelefono: selectedOrder.cliente.telefono,
          equipo: `${selectedOrder.equipo.tipo}`,
          equipoMarca: selectedOrder.equipo.marca,
          equipoModelo: selectedOrder.equipo.modelo,
          problemaReportado: selectedOrder.problemaReportado,
          estado: selectedOrder.estado,
          tipoServicio: selectedOrder.tipoServicio, // Added
          tecnico: selectedOrder.tecnico?.nombre || 'Sin asignar',
          fecha: new Date(selectedOrder.createdAt).toLocaleDateString('es-MX'),
          importe: selectedOrder.montoTotal,
          anticipo: selectedOrder.anticipo,
          saldoPendiente: selectedOrder.saldoPendiente,
          tiempoReparacion: selectedOrder.tiempoReparacion || 'No definido',
          fechaEstimada: selectedOrder.fechaEstimadaFin ? new Date(selectedOrder.fechaEstimadaFin).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }) : undefined,
          diagnostico: selectedOrder.diagnostico || undefined,
          cotizacion: selectedOrder.cotizacion ? Number(selectedOrder.cotizacion) : undefined,
        } : null}
        onStatusChange={async (newStatus) => {
          if (!selectedOrder) return
          await loadOrdenes()
          setIsDetailsOpen(false)
          setSelectedOrder(null)
        }}
      />

      {/* Modals for Creation Flow */}
      <NewClientDialog
        open={isNewClientOpen}
        onOpenChange={setIsNewClientOpen}
        onSave={(client) => {
          setCreatedClientId(client.id)
          // Chain: Client -> Equipment
          setTimeout(() => setIsNewEquipmentOpen(true), 500)
        }}
      />

      <NewEquipmentDialog
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

      <NewServiceOrderDialog
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
          loadOrdenes()
          // Chain: Order -> Payment
          if (order.anticipoRequerido > 0) {
            setCreatedOrderId(order.id)
            setPaymentAmount(order.anticipoRequerido)
            setTimeout(() => setIsPaymentOpen(true), 500)
          }
        }}
      />

      <PaymentDialog
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
          loadOrdenes()
          toast({
            title: "Proceso completado",
            description: "Se ha registrado el cliente, equipo, orden y pago exitosamente.",
          })
        }}
      />
    </>
  )
}
