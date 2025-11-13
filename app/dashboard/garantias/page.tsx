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
import { Search, Eye, Plus } from "lucide-react"

const mockWarranties = [
  {
    id: "GAR-001",
    cliente: "Juan Pérez",
    equipo: "HP Pavilion 15",
    sku: "SSD-256GB",
    descripcion: "SSD 256GB",
    fecha_inicio: "2024-10-15",
    fecha_fin: "2025-01-13",
    estado: "Activo",
    os_origen: "RS-OS-1010",
  },
  {
    id: "GAR-002",
    cliente: "María González",
    equipo: 'MacBook Pro 13"',
    sku: "SERV-LIMPIEZA",
    descripcion: "Limpieza profunda",
    fecha_inicio: "2024-12-01",
    fecha_fin: "2024-12-08",
    estado: "Activo",
    os_origen: "RS-OS-1015",
  },
  {
    id: "GAR-003",
    cliente: "Pedro Ramírez",
    equipo: "Dell XPS 15",
    sku: "RAM-DDR4-8GB",
    descripcion: "Memoria RAM DDR4 8GB",
    fecha_inicio: "2024-08-01",
    fecha_fin: "2024-10-30",
    estado: "Inactivo",
    os_origen: "RS-OS-1005",
  },
]

export default function GarantiasPage() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  if (!hasPermission("garantias")) {
    return (
      <>
        <DashboardHeader title="Garantías" />
        <AccessDenied />
      </>
    )
  }

  const filteredWarranties = mockWarranties.filter(
    (warranty) =>
      warranty.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <DashboardHeader title="Garantías" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <Card className="bg-slate-900 border-slate-800 p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Buscar por ID, cliente o SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
              />
            </div>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-slate-900 border-slate-800 p-4">
              <div className="text-sm text-slate-400">Garantías activas</div>
              <div className="text-2xl font-bold text-green-400 mt-1">2</div>
            </Card>
            <Card className="bg-slate-900 border-slate-800 p-4">
              <div className="text-sm text-slate-400">Por vencer (30 días)</div>
              <div className="text-2xl font-bold text-yellow-400 mt-1">1</div>
            </Card>
            <Card className="bg-slate-900 border-slate-800 p-4">
              <div className="text-sm text-slate-400">Vencidas</div>
              <div className="text-2xl font-bold text-slate-400 mt-1">1</div>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-slate-900 border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">ID Garantía</TableHead>
                  <TableHead className="text-slate-400">Cliente</TableHead>
                  <TableHead className="text-slate-400">Equipo</TableHead>
                  <TableHead className="text-slate-400">SKU</TableHead>
                  <TableHead className="text-slate-400">Fecha inicio</TableHead>
                  <TableHead className="text-slate-400">Fecha fin</TableHead>
                  <TableHead className="text-slate-400">Estado</TableHead>
                  <TableHead className="text-slate-400">OS origen</TableHead>
                  <TableHead className="text-slate-400">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarranties.map((warranty) => (
                  <TableRow key={warranty.id} className="border-slate-800 hover:bg-slate-800/50 text-slate-300">
                    <TableCell className="font-mono text-sm">{warranty.id}</TableCell>
                    <TableCell>{warranty.cliente}</TableCell>
                    <TableCell>{warranty.equipo}</TableCell>
                    <TableCell className="font-mono text-sm">{warranty.sku}</TableCell>
                    <TableCell className="text-slate-400">{warranty.fecha_inicio}</TableCell>
                    <TableCell className="text-slate-400">{warranty.fecha_fin}</TableCell>
                    <TableCell>
                      <BadgeStatus status={warranty.estado} />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{warranty.os_origen}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {warranty.estado === "Activo" && (
                          <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300">
                            <Plus className="h-4 w-4 mr-1" />
                            OS
                          </Button>
                        )}
                      </div>
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
