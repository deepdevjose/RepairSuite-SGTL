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
import { Search, Plus, Pencil } from "lucide-react"

const mockStaff = [
  {
    id: 1,
    nombre: "Carlos Gómez",
    rol: "Técnico",
    sucursal: "Sede A",
    correo: "carlos@jlaboratories.com",
    telefono: "5512345678",
    activo: true,
  },
  {
    id: 2,
    nombre: "Ana Martínez",
    rol: "Técnico",
    sucursal: "Sede B",
    correo: "ana@jlaboratories.com",
    telefono: "5587654321",
    activo: true,
  },
  {
    id: 3,
    nombre: "Luis Torres",
    rol: "Recepción",
    sucursal: "Sede A",
    correo: "luis@jlaboratories.com",
    telefono: "5523456789",
    activo: true,
  },
]

export default function PersonalPage() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  if (!hasPermission("personal")) {
    return (
      <>
        <DashboardHeader title="Personal" />
        <AccessDenied />
      </>
    )
  }

  const filteredStaff = mockStaff.filter((staff) => staff.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <>
      <DashboardHeader title="Personal" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card className="bg-slate-900 border-slate-800 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar personal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                />
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-500">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo personal
              </Button>
            </div>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">Nombre</TableHead>
                  <TableHead className="text-slate-400">Rol</TableHead>
                  <TableHead className="text-slate-400">Sucursal</TableHead>
                  <TableHead className="text-slate-400">Correo</TableHead>
                  <TableHead className="text-slate-400">Teléfono</TableHead>
                  <TableHead className="text-slate-400">Estado</TableHead>
                  <TableHead className="text-slate-400">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id} className="border-slate-800 hover:bg-slate-800/50 text-slate-300">
                    <TableCell className="font-medium">{staff.nombre}</TableCell>
                    <TableCell>{staff.rol}</TableCell>
                    <TableCell className="text-slate-400">{staff.sucursal}</TableCell>
                    <TableCell className="text-slate-400">{staff.correo}</TableCell>
                    <TableCell>{staff.telefono}</TableCell>
                    <TableCell>
                      <BadgeStatus status={staff.activo ? "Activo" : "Inactivo"} />
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-slate-300">
                        <Pencil className="h-4 w-4" />
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
