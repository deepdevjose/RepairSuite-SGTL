"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye } from "lucide-react"

const mockProviders = [
  {
    id: 1,
    nombre: "TechParts México",
    telefono: "5512345678",
    correo: "ventas@techparts.mx",
    condiciones_pago: "30 días",
    num_ordenes: 24,
  },
  {
    id: 2,
    nombre: "Distribuidora HP",
    telefono: "5587654321",
    correo: "pedidos@hpdist.com",
    condiciones_pago: "15 días",
    num_ordenes: 18,
  },
  {
    id: 3,
    nombre: "Partes Express",
    telefono: "5523456789",
    correo: "contacto@partesexpress.mx",
    condiciones_pago: "Contado",
    num_ordenes: 12,
  },
]

export default function ProveedoresPage() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  if (!hasPermission("proveedores")) {
    return (
      <>
        <DashboardHeader title="Proveedores" />
        <AccessDenied />
      </>
    )
  }

  const filteredProviders = mockProviders.filter((provider) =>
    provider.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <DashboardHeader title="Proveedores" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card className="bg-slate-900 border-slate-800 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar proveedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                />
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-500">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo proveedor
              </Button>
            </div>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">Nombre</TableHead>
                  <TableHead className="text-slate-400">Teléfono</TableHead>
                  <TableHead className="text-slate-400">Correo</TableHead>
                  <TableHead className="text-slate-400">Condiciones de pago</TableHead>
                  <TableHead className="text-slate-400">Nº órdenes</TableHead>
                  <TableHead className="text-slate-400">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => (
                  <TableRow key={provider.id} className="border-slate-800 hover:bg-slate-800/50 text-slate-300">
                    <TableCell className="font-medium">{provider.nombre}</TableCell>
                    <TableCell>{provider.telefono}</TableCell>
                    <TableCell className="text-slate-400">{provider.correo}</TableCell>
                    <TableCell className="text-slate-400">{provider.condiciones_pago}</TableCell>
                    <TableCell className="text-slate-400">{provider.num_ordenes}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </>
  )
}
