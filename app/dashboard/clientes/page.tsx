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
import { Search, Plus, Eye, Pencil } from "lucide-react"

// Mock data
const mockClients = [
  {
    id: 1,
    nombre: "Juan Pérez García",
    telefono: "5512345678",
    correo: "juan.perez@email.com",
    fecha_registro: "2024-03-15",
    num_equipos: 3,
  },
  {
    id: 2,
    nombre: "María González López",
    telefono: "5587654321",
    correo: "maria.gonzalez@email.com",
    fecha_registro: "2024-06-20",
    num_equipos: 1,
  },
  {
    id: 3,
    nombre: "Pedro Ramírez Sánchez",
    telefono: "5523456789",
    correo: "pedro.ramirez@email.com",
    fecha_registro: "2024-08-10",
    num_equipos: 2,
  },
  {
    id: 4,
    nombre: "Ana López Martínez",
    telefono: "5598765432",
    correo: "ana.lopez@email.com",
    fecha_registro: "2024-11-05",
    num_equipos: 1,
  },
]

export default function ClientesPage() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)

  if (!hasPermission("clientes")) {
    return (
      <>
        <DashboardHeader title="Clientes" />
        <AccessDenied />
      </>
    )
  }

  const filteredClients = mockClients.filter(
    (client) =>
      client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telefono.includes(searchTerm) ||
      client.correo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <DashboardHeader title="Clientes" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header actions */}
          <Card className="bg-slate-900 border-slate-800 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar por nombre, teléfono o correo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                />
              </div>
              <Button onClick={() => setIsFormOpen(true)} className="bg-indigo-600 hover:bg-indigo-500">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo cliente
              </Button>
            </div>
          </Card>

          {/* Table */}
          <Card className="bg-slate-900 border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">Nombre completo</TableHead>
                  <TableHead className="text-slate-400">Teléfono</TableHead>
                  <TableHead className="text-slate-400">Correo</TableHead>
                  <TableHead className="text-slate-400">Fecha de registro</TableHead>
                  <TableHead className="text-slate-400">Nº de equipos</TableHead>
                  <TableHead className="text-slate-400">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow className="border-slate-800">
                    <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id} className="border-slate-800 hover:bg-slate-800/50 text-slate-300">
                      <TableCell className="font-medium">{client.nombre}</TableCell>
                      <TableCell>{client.telefono}</TableCell>
                      <TableCell className="text-slate-400">{client.correo}</TableCell>
                      <TableCell className="text-slate-400">{client.fecha_registro}</TableCell>
                      <TableCell className="text-slate-400">{client.num_equipos}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsFormOpen(true)}
                            className="text-slate-400 hover:text-slate-300"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
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
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Nuevo cliente</DialogTitle>
          </DialogHeader>
          <ClientForm onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
