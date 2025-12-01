"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ClientForm } from "@/components/client-form"
import { ClientDetailsDialog } from "@/components/clients/client-details-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Plus, Users, UserPlus, Repeat, ClipboardList, Package, Eye, Trash2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type FilterType = "all" | "new" | "active-orders" | "inactive" | "multi-equipment" | "recurring"

interface Cliente {
  id: string
  nombre1: string
  nombre2: string | null
  apellidoPaterno: string
  apellidoMaterno: string | null
  telefono: string
  email: string | null
  calle: string | null
  numero: string | null
  colonia: string | null
  municipio: string | null
  estado: string | null
  pais: string
  sexo: string | null
  edad: number | null
  rfc: string | null
  tipoCliente: string | null
  notas: string | null
  activo: boolean
  createdAt: string
  updatedAt: string
}

export default function ClientesPage() {
  const { hasPermission } = useAuth()
  const searchParams = useSearchParams()
  const searchId = searchParams.get('id')

  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null)
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClientes()
  }, [])

  useEffect(() => {
    if (searchId && clientes.length > 0) {
      const client = clientes.find(c => c.id === searchId)
      if (client) {
        setSelectedClient(client)
        setIsDetailsOpen(true)
      }
    }
  }, [searchId, clientes])

  const fetchClientes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/clientes')
      if (response.ok) {
        const data = await response.json()
        setClientes(data)
      }
    } catch (error) {
      console.error('Error al obtener clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!hasPermission("clientes")) {
    return (
      <>
        <DashboardHeader title="Clientes" />
        <AccessDenied />
      </>
    )
  }

  const filteredClients = clientes.filter((client) => {
    const searchLower = searchTerm.toLowerCase()
    const nombreCompleto = `${client.nombre1} ${client.nombre2 || ''} ${client.apellidoPaterno} ${client.apellidoMaterno || ''}`.toLowerCase()

    const matchesSearch =
      searchTerm === "" ||
      nombreCompleto.includes(searchLower) ||
      client.telefono.includes(searchTerm) ||
      (client.email && client.email.toLowerCase().includes(searchLower)) ||
      (client.rfc && client.rfc.toLowerCase().includes(searchLower))

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const registroDate = new Date(client.createdAt)

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "new" && registroDate >= thirtyDaysAgo)

    return matchesSearch && matchesFilter
  })

  const totalClientes = clientes.length
  const nuevosDelMes = clientes.filter((c) => {
    const registroDate = new Date(c.createdAt)
    const now = new Date()
    return registroDate.getMonth() === now.getMonth() && registroDate.getFullYear() === now.getFullYear()
  }).length

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
                  <p className="text-xs text-slate-400 font-medium">Clientes activos</p>
                  <p className="text-2xl font-bold text-slate-100">{clientes.filter(c => c.activo).length}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-900/50 border-slate-800/50 p-4 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <ClipboardList className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Registrados</p>
                  <p className="text-2xl font-bold text-slate-100">{totalClientes}</p>
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
              Todos ({clientes.length})
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
          </div>

          <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800/50 hover:bg-slate-800/30">
                  <TableHead className="text-slate-400 font-semibold">Nombre completo</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Teléfono</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Correo</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Fecha de registro</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="border-slate-800/50">
                    <TableCell colSpan={5} className="text-center text-slate-400 py-12">
                      <p className="text-sm font-medium">Cargando clientes...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredClients.length === 0 ? (
                  <TableRow className="border-slate-800/50">
                    <TableCell colSpan={5} className="text-center text-slate-400 py-12">
                      <Users className="h-12 w-12 mx-auto mb-3 text-slate-600" />
                      <p className="text-sm font-medium">No se encontraron clientes</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {clientes.length === 0 ? "Agrega tu primer cliente" : "Intenta ajustar los filtros de búsqueda"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client, index) => (
                    <TableRow
                      key={client.id}
                      className={`border-slate-800/30 hover:bg-slate-800/40 transition-all duration-200 text-slate-300 ${index % 2 === 0 ? "bg-slate-900/20" : "bg-slate-900/40"
                        }`}
                    >
                      <TableCell className="font-medium text-slate-200">
                        {`${client.nombre1}${client.nombre2 ? ' ' + client.nombre2 : ''} ${client.apellidoPaterno}${client.apellidoMaterno ? ' ' + client.apellidoMaterno : ''}`}
                      </TableCell>
                      <TableCell className="text-slate-300">{client.telefono}</TableCell>
                      <TableCell className="text-slate-400">{client.email || "—"}</TableCell>
                      <TableCell className="text-slate-400">
                        {new Date(client.createdAt).toLocaleDateString('es-MX')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all"
                            onClick={() => {
                              setSelectedClient(client)
                              setIsDetailsOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Detalles
                          </Button>
                          {hasPermission("configuracion") && ( // Check for Admin permission (configuracion is admin only)
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-slate-400">
                                    Esta acción desactivará al cliente. No se perderán sus datos históricos pero ya no aparecerá en las listas activas.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700">Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={async () => {
                                      try {
                                        const res = await fetch(`/api/clientes/${client.id}`, {
                                          method: 'DELETE'
                                        })
                                        if (res.ok) {
                                          fetchClientes()
                                          // Optional: Show toast
                                        }
                                      } catch (error) {
                                        console.error("Error deleting client", error)
                                      }
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white border-0"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
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
          <ClientForm
            onClose={() => setIsFormOpen(false)}
            onSuccess={() => {
              fetchClientes()
              setIsFormOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Client Details Dialog */}
      <ClientDetailsDialog
        client={selectedClient}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onClientUpdated={(updatedClient) => {
          fetchClientes()
          if (updatedClient) {
            setSelectedClient(updatedClient)
          }
        }}
      />
    </>
  )
}
