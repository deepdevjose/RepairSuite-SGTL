"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ClientForm } from "@/components/client-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Plus, Users, UserPlus, Repeat, ClipboardList, Package, Eye } from 'lucide-react'

const mockClients = [
  {
    id: 1,
    nombre: "Juan Pérez García",
    telefono: "5512345678",
    correo: "juan.perez@email.com",
    fecha_registro: "2024-03-15",
    num_equipos: 3,
    ultimo_servicio: "2024-12-10",
    ordenes_activas: 1,
    es_recurrente: true,
    equipos: [
      { id: 101, marca: "Dell", modelo: "Latitude 5420", serie: "DL2024X001" },
      { id: 102, marca: "HP", modelo: "ProBook 450", serie: "HP2024X002" },
      { id: 103, marca: "Lenovo", modelo: "ThinkPad X1", serie: "LN2024X003" },
    ],
  },
  {
    id: 2,
    nombre: "María González López",
    telefono: "5587654321",
    correo: "maria.gonzalez@email.com",
    fecha_registro: "2024-06-20",
    num_equipos: 1,
    ultimo_servicio: "2024-11-28",
    ordenes_activas: 0,
    es_recurrente: false,
    equipos: [{ id: 201, marca: "Asus", modelo: "VivoBook 15", serie: "AS2024X004" }],
  },
  {
    id: 3,
    nombre: "Pedro Ramírez Sánchez",
    telefono: "5523456789",
    correo: "pedro.ramirez@email.com",
    fecha_registro: "2024-08-10",
    num_equipos: 2,
    ultimo_servicio: "2024-12-05",
    ordenes_activas: 2,
    es_recurrente: true,
    equipos: [
      { id: 301, marca: "Acer", modelo: "Aspire 5", serie: "AC2024X005" },
      { id: 302, marca: "MSI", modelo: "Modern 14", serie: "MS2024X006" },
    ],
  },
  {
    id: 4,
    nombre: "Ana López Martínez",
    telefono: "5598765432",
    correo: "ana.lopez@email.com",
    fecha_registro: "2024-11-05",
    num_equipos: 1,
    ultimo_servicio: "2024-12-15",
    ordenes_activas: 1,
    es_recurrente: false,
    equipos: [{ id: 401, marca: "Apple", modelo: "MacBook Air M2", serie: "AP2024X007" }],
  },
  {
    id: 5,
    nombre: "Carlos Hernández Torres",
    telefono: "5534567890",
    correo: "carlos.hernandez@email.com",
    fecha_registro: "2024-12-01",
    num_equipos: 4,
    ultimo_servicio: null,
    ordenes_activas: 0,
    es_recurrente: false,
    equipos: [
      { id: 501, marca: "Dell", modelo: "XPS 13", serie: "DL2024X008" },
      { id: 502, marca: "HP", modelo: "Pavilion", serie: "HP2024X009" },
      { id: 503, marca: "Lenovo", modelo: "IdeaPad 3", serie: "LN2024X010" },
      { id: 504, marca: "Samsung", modelo: "Galaxy Book", serie: "SM2024X011" },
    ],
  },
  {
    id: 6,
    nombre: "Laura Martínez Ruiz",
    telefono: "5545678901",
    correo: "laura.martinez@email.com",
    fecha_registro: "2024-01-20",
    num_equipos: 2,
    ultimo_servicio: "2024-06-15",
    ordenes_activas: 0,
    es_recurrente: false,
    equipos: [
      { id: 601, marca: "Asus", modelo: "ROG Strix", serie: "AS2024X012" },
      { id: 602, marca: "Acer", modelo: "Nitro 5", serie: "AC2024X013" },
    ],
  },
]

type FilterType = "all" | "new" | "active-orders" | "inactive" | "multi-equipment" | "recurring"

export default function ClientesPage() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null)

  if (!hasPermission("clientes")) {
    return (
      <>
        <DashboardHeader title="Clientes" />
        <AccessDenied />
      </>
    )
  }

  const filteredClients = mockClients.filter((client) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      searchTerm === "" ||
      client.nombre.toLowerCase().includes(searchLower) ||
      client.telefono.includes(searchTerm) ||
      client.correo.toLowerCase().includes(searchLower) ||
      client.equipos.some(
        (equipo) =>
          equipo.marca.toLowerCase().includes(searchLower) ||
          equipo.modelo.toLowerCase().includes(searchLower) ||
          equipo.serie.toLowerCase().includes(searchLower),
      )

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const registroDate = new Date(client.fecha_registro)

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "new" && registroDate >= thirtyDaysAgo) ||
      (activeFilter === "active-orders" && client.ordenes_activas > 0) ||
      (activeFilter === "inactive" && client.ultimo_servicio && new Date(client.ultimo_servicio) < thirtyDaysAgo) ||
      (activeFilter === "multi-equipment" && client.num_equipos > 1) ||
      (activeFilter === "recurring" && client.es_recurrente)

    return matchesSearch && matchesFilter
  })

  const totalClientes = mockClients.length
  const nuevosDelMes = mockClients.filter((c) => {
    const registroDate = new Date(c.fecha_registro)
    const now = new Date()
    return registroDate.getMonth() === now.getMonth() && registroDate.getFullYear() === now.getFullYear()
  }).length
  const clientesRecurrentes = mockClients.filter((c) => c.es_recurrente).length
  const clientesConOrdenesActivas = mockClients.filter((c) => c.ordenes_activas > 0).length

  return (
    <>
      <DashboardHeader title="Clientes" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-900/50 border-slate-800/50 p-4 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <Users className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Total de clientes</p>
                  <p className="text-2xl font-bold text-slate-100">{totalClientes}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-900/50 border-slate-800/50 p-4 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <UserPlus className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Nuevos del mes</p>
                  <p className="text-2xl font-bold text-slate-100">{nuevosDelMes}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-900/50 border-slate-800/50 p-4 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Repeat className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Clientes recurrentes</p>
                  <p className="text-2xl font-bold text-slate-100">{clientesRecurrentes}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-900/50 border-slate-800/50 p-4 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <ClipboardList className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Con órdenes activas</p>
                  <p className="text-2xl font-bold text-slate-100">{clientesConOrdenesActivas}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar por nombre, teléfono, correo, equipo o serie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:shadow-indigo-500/30 hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo cliente
              </Button>
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={activeFilter === "all" ? "default" : "outline"}
              onClick={() => setActiveFilter("all")}
              className={
                activeFilter === "all"
                  ? "bg-violet-600 hover:bg-violet-500 border-0"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              }
            >
              Todos ({mockClients.length})
            </Button>
            <Button
              size="sm"
              variant={activeFilter === "new" ? "default" : "outline"}
              onClick={() => setActiveFilter("new")}
              className={
                activeFilter === "new"
                  ? "bg-violet-600 hover:bg-violet-500 border-0"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              }
            >
              Nuevos (30 días)
            </Button>
            <Button
              size="sm"
              variant={activeFilter === "active-orders" ? "default" : "outline"}
              onClick={() => setActiveFilter("active-orders")}
              className={
                activeFilter === "active-orders"
                  ? "bg-violet-600 hover:bg-violet-500 border-0"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              }
            >
              Con órdenes activas
            </Button>
            <Button
              size="sm"
              variant={activeFilter === "inactive" ? "default" : "outline"}
              onClick={() => setActiveFilter("inactive")}
              className={
                activeFilter === "inactive"
                  ? "bg-violet-600 hover:bg-violet-500 border-0"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              }
            >
              Inactivos
            </Button>
            <Button
              size="sm"
              variant={activeFilter === "multi-equipment" ? "default" : "outline"}
              onClick={() => setActiveFilter("multi-equipment")}
              className={
                activeFilter === "multi-equipment"
                  ? "bg-violet-600 hover:bg-violet-500 border-0"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              }
            >
              Múltiples equipos
            </Button>
            <Button
              size="sm"
              variant={activeFilter === "recurring" ? "default" : "outline"}
              onClick={() => setActiveFilter("recurring")}
              className={
                activeFilter === "recurring"
                  ? "bg-violet-600 hover:bg-violet-500 border-0"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              }
            >
              Recurrentes
            </Button>
          </div>

          <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800/50 hover:bg-slate-800/30">
                  <TableHead className="text-slate-400 font-semibold">Nombre completo</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Teléfono</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Correo</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Fecha de registro</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Nº de equipos</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow className="border-slate-800/50">
                    <TableCell colSpan={6} className="text-center text-slate-400 py-12">
                      <Users className="h-12 w-12 mx-auto mb-3 text-slate-600" />
                      <p className="text-sm font-medium">No se encontraron clientes</p>
                      <p className="text-xs text-slate-500 mt-1">Intenta ajustar los filtros de búsqueda</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client, index) => (
                    <TableRow
                      key={client.id}
                      className={`border-slate-800/30 hover:bg-slate-800/40 transition-all duration-200 text-slate-300 ${
                        index % 2 === 0 ? "bg-slate-900/20" : "bg-slate-900/40"
                      }`}
                    >
                      <TableCell className="font-medium text-slate-200">
                        <div className="flex items-center gap-2">
                          {client.nombre}
                          {client.es_recurrente && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              <Repeat className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">{client.telefono}</TableCell>
                      <TableCell className="text-slate-400">{client.correo}</TableCell>
                      <TableCell className="text-slate-400">{client.fecha_registro}</TableCell>
                      <TableCell>
                        <Popover open={openPopoverId === client.id} onOpenChange={(open) => setOpenPopoverId(open ? client.id : null)}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 gap-1.5 transition-all"
                            >
                              <Package className="h-3.5 w-3.5" />
                              {client.num_equipos}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="bg-slate-900 border-slate-700/50 text-slate-100 w-[420px] p-0 shadow-xl shadow-black/50">
                            <div className="p-4 border-b border-slate-800/50">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-base text-slate-100">Equipos del cliente</h4>
                                <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                                  {client.equipos.length} {client.equipos.length === 1 ? 'equipo' : 'equipos'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">{client.nombre}</p>
                            </div>
                            
                            <div className="max-h-[320px] overflow-y-auto p-3 space-y-2">
                              {client.equipos.map((equipo) => (
                                <div
                                  key={equipo.id}
                                  className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:border-violet-500/40 hover:bg-slate-800/60 transition-all group"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                      <p className="text-sm font-semibold text-slate-100 mb-0.5">
                                        {equipo.marca} {equipo.modelo}
                                      </p>
                                      <div className="space-y-0.5">
                                        <p className="text-xs text-slate-400">
                                          <span className="text-slate-500">Marca:</span> {equipo.marca}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                          <span className="text-slate-500">Modelo:</span> {equipo.modelo}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                          <span className="text-slate-500">Serie:</span> {equipo.serie}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono bg-slate-900/50 px-2 py-1 rounded">
                                      #{equipo.id}
                                    </span>
                                  </div>
                                  
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="w-full text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all mt-2"
                                    onClick={() => {
                                      console.log('[v0] Ver equipo:', equipo.id)
                                    }}
                                  >
                                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                                    Ver equipo
                                  </Button>
                                </div>
                              ))}
                            </div>

                            <div className="p-3 border-t border-slate-800/50 bg-slate-900/50">
                              <Button
                                size="sm"
                                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all"
                                onClick={() => {
                                  console.log('[v0] Agregar nuevo equipo para cliente:', client.id)
                                  setOpenPopoverId(null)
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar nuevo equipo
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all"
                        >
                          Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-100 text-xl">Nuevo cliente</DialogTitle>
          </DialogHeader>
          <ClientForm onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
