"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { BadgeStatus } from "@/components/badge-status"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Eye, Shield, Filter } from "lucide-react"
import Link from "next/link"

// Mock data
const mockOrders = [
  {
    folio: "RS-OS-1024",
    cliente: "Juan Pérez",
    equipo: "HP Pavilion 15",
    estado: "En proceso",
    tecnico: "Carlos Gómez",
    sucursal: "Sede A",
    fecha: "2025-01-10",
    es_garantia: false,
  },
  {
    folio: "RS-OS-1023",
    cliente: "María González",
    equipo: 'MacBook Pro 13"',
    estado: "Listo para entrega",
    tecnico: "Ana Martínez",
    sucursal: "Sede A",
    fecha: "2025-01-09",
    es_garantia: false,
  },
  {
    folio: "RS-OS-1022",
    cliente: "Pedro Ramírez",
    equipo: "Dell XPS 15",
    estado: "En diagnóstico",
    tecnico: "Luis Torres",
    sucursal: "Sede B",
    fecha: "2025-01-09",
    es_garantia: true,
  },
  {
    folio: "RS-OS-1021",
    cliente: "Ana López",
    equipo: "Lenovo ThinkPad",
    estado: "En espera de aprobación",
    tecnico: "Carlos Gómez",
    sucursal: "Sede A",
    fecha: "2025-01-08",
    es_garantia: false,
  },
  {
    folio: "RS-OS-1020",
    cliente: "Roberto Fernández",
    equipo: "ASUS ROG",
    estado: "Completada y pagada",
    tecnico: "Ana Martínez",
    sucursal: "Sede B",
    fecha: "2025-01-05",
    es_garantia: false,
  },
]

export default function OrdenesPage() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

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
      order.equipo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.estado === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <>
      <DashboardHeader title="Órdenes de Servicio" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filters */}
          <Card className="bg-slate-900 border-slate-800 p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar por folio, cliente o equipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                />
              </div>

              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px] bg-slate-800 border-slate-700 text-slate-100">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="En diagnóstico">En diagnóstico</SelectItem>
                    <SelectItem value="En espera de aprobación">En espera de aprobación</SelectItem>
                    <SelectItem value="En proceso">En proceso</SelectItem>
                    <SelectItem value="Listo para entrega">Listo para entrega</SelectItem>
                    <SelectItem value="Completada y pagada">Completada y pagada</SelectItem>
                    <SelectItem value="Rechazada">Rechazada</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>

                <Link href="/dashboard/ordenes/nueva">
                  <Button className="bg-indigo-600 hover:bg-indigo-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva OS
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-slate-900 border-slate-800 p-4">
              <div className="text-sm text-slate-400">Total activas</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">59</div>
            </Card>
            <Card className="bg-slate-900 border-slate-800 p-4">
              <div className="text-sm text-slate-400">En diagnóstico</div>
              <div className="text-2xl font-bold text-blue-400 mt-1">12</div>
            </Card>
            <Card className="bg-slate-900 border-slate-800 p-4">
              <div className="text-sm text-slate-400">En proceso</div>
              <div className="text-2xl font-bold text-purple-400 mt-1">24</div>
            </Card>
            <Card className="bg-slate-900 border-slate-800 p-4">
              <div className="text-sm text-slate-400">Listas</div>
              <div className="text-2xl font-bold text-green-400 mt-1">15</div>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-slate-900 border-slate-800">
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
                {filteredOrders.length === 0 ? (
                  <TableRow className="border-slate-800">
                    <TableCell colSpan={8} className="text-center text-slate-400 py-8">
                      No se encontraron órdenes de servicio
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.folio} className="border-slate-800 hover:bg-slate-800/50 text-slate-300">
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          {order.folio}
                          {order.es_garantia && <Shield className="h-4 w-4 text-emerald-400" title="OS por garantía" />}
                        </div>
                      </TableCell>
                      <TableCell>{order.cliente}</TableCell>
                      <TableCell>{order.equipo}</TableCell>
                      <TableCell>
                        <BadgeStatus status={order.estado} />
                      </TableCell>
                      <TableCell className="text-slate-400">{order.tecnico}</TableCell>
                      <TableCell className="text-slate-400">{order.sucursal}</TableCell>
                      <TableCell className="text-slate-400">{order.fecha}</TableCell>
                      <TableCell>
                        <Link href={`/dashboard/ordenes/${order.folio}`}>
                          <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </>
  )
}
