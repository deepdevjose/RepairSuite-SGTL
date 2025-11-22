"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { BadgeStatus } from "@/components/badge-status"
import { OrderDetailsDialog } from "@/components/ordenes/order-details-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Eye, Shield, Filter, User, Wrench, Building2, Clock } from 'lucide-react'
import Link from "next/link"

// Mock data con diagnóstico y total estimado
const mockOrders = [
  {
    folio: "RS-OS-1024",
    cliente: "Juan Pérez",
    equipo: "HP Pavilion 15",
    marca: "HP",
    estado: "En reparación",
    tecnico: "Carlos Gómez",
    sucursal: "Sede A",
    diagnostico: "Pantalla rota, bisagras dañadas",
    total_estimado: 2500,
    ultima_actualizacion: "2025-01-15 14:30",
    es_garantia: false,
  },
  {
    folio: "RS-OS-1023",
    cliente: "María González",
    equipo: 'MacBook Pro 13"',
    marca: "Apple",
    estado: "Listo para entrega",
    tecnico: "Ana Martínez",
    sucursal: "Sede A",
    diagnostico: "Cambio de batería completado",
    total_estimado: 3800,
    ultima_actualizacion: "2025-01-15 10:15",
    es_garantia: false,
  },
  {
    folio: "RS-OS-1022",
    cliente: "Pedro Ramírez",
    equipo: "Dell XPS 15",
    marca: "Dell",
    estado: "En diagnóstico",
    tecnico: "Luis Torres",
    sucursal: "Sede B",
    diagnostico: "Revisando componentes internos",
    total_estimado: 0,
    ultima_actualizacion: "2025-01-15 09:00",
    es_garantia: true,
  },
  {
    folio: "RS-OS-1021",
    cliente: "Ana López",
    equipo: "Lenovo ThinkPad",
    marca: "Lenovo",
    estado: "Pendiente aprobación",
    tecnico: "Carlos Gómez",
    sucursal: "Sede A",
    diagnostico: "Requiere cambio de placa madre y RAM",
    total_estimado: 5200,
    ultima_actualizacion: "2025-01-14 16:45",
    es_garantia: false,
  },
  {
    folio: "RS-OS-1020",
    cliente: "Roberto Fernández",
    equipo: "ASUS ROG",
    marca: "ASUS",
    estado: "Entregada",
    tecnico: "Ana Martínez",
    sucursal: "Sede B",
    diagnostico: "Limpieza profunda y repaste térmico",
    total_estimado: 850,
    ultima_actualizacion: "2025-01-13 18:00",
    es_garantia: false,
  },
]

export default function OrdenesPage() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tecnicoFilter, setTecnicoFilter] = useState("all")
  const [sucursalFilter, setSucursalFilter] = useState("all")
  const [marcaFilter, setMarcaFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  if (!hasPermission("ordenes")) {
    return (
      <>
        <DashboardHeader title="Órdenes de Servicio" />
        <AccessDenied />
      </>
    )
  }

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.diagnostico.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.estado === statusFilter
    const matchesTecnico = tecnicoFilter === "all" || order.tecnico === tecnicoFilter
    const matchesSucursal = sucursalFilter === "all" || order.sucursal === sucursalFilter
    const matchesMarca = marcaFilter === "all" || order.marca === marcaFilter

    return matchesSearch && matchesStatus && matchesTecnico && matchesSucursal && matchesMarca
  })

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
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
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

                <Select value={sucursalFilter} onValueChange={setSucursalFilter}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100">
                    <Building2 className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Sucursal" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">Todas las sucursales</SelectItem>
                    <SelectItem value="Sede A">Sede A</SelectItem>
                    <SelectItem value="Sede B">Sede B</SelectItem>
                    <SelectItem value="Sede C">Sede C</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={marcaFilter} onValueChange={setMarcaFilter}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100">
                    <Wrench className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Marca" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">Todas las marcas</SelectItem>
                    <SelectItem value="HP">HP</SelectItem>
                    <SelectItem value="Apple">Apple</SelectItem>
                    <SelectItem value="Dell">Dell</SelectItem>
                    <SelectItem value="Lenovo">Lenovo</SelectItem>
                    <SelectItem value="ASUS">ASUS</SelectItem>
                  </SelectContent>
                </Select>

                <Link href="/dashboard/ordenes/nueva" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 h-10">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva OS
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-slate-900/50 border-slate-800 p-5 backdrop-blur-sm hover:bg-slate-900/70 transition-colors">
              <div className="text-sm text-slate-400 font-medium">Total activas</div>
              <div className="text-3xl font-bold text-slate-100 mt-1">59</div>
              <div className="text-xs text-slate-500 mt-1">Órdenes en proceso</div>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 p-5 backdrop-blur-sm hover:bg-slate-900/70 transition-colors">
              <div className="text-sm text-slate-400 font-medium">En diagnóstico</div>
              <div className="text-3xl font-bold text-blue-400 mt-1">12</div>
              <div className="text-xs text-slate-500 mt-1">Esperando revisión técnica</div>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 p-5 backdrop-blur-sm hover:bg-slate-900/70 transition-colors">
              <div className="text-sm text-slate-400 font-medium">En reparación</div>
              <div className="text-3xl font-bold text-purple-400 mt-1">24</div>
              <div className="text-xs text-slate-500 mt-1">Reparaciones en curso</div>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 p-5 backdrop-blur-sm hover:bg-slate-900/70 transition-colors">
              <div className="text-sm text-slate-400 font-medium">Listas para entrega</div>
              <div className="text-3xl font-bold text-green-400 mt-1">15</div>
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
                            {order.es_garantia && (
                              <span title="OS por garantía">
                                <Shield className="h-4 w-4 text-emerald-400" />
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{order.cliente}</TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="font-medium text-slate-200">{order.equipo}</div>
                            <div className="text-xs text-slate-500">{order.marca}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <BadgeStatus status={order.estado} />
                        </TableCell>
                        <TableCell className="text-slate-400">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-slate-500" />
                            {order.tecnico}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <div className="text-sm text-slate-400 truncate" title={order.diagnostico}>
                            {order.diagnostico}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {order.total_estimado > 0 ? (
                            <span className="text-emerald-400">${order.total_estimado.toLocaleString()}</span>
                          ) : (
                            <span className="text-slate-500">Pendiente</span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {order.ultima_actualizacion}
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
        order={selectedOrder}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </>
  )
}
