"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { BadgeStatus } from "@/components/badge-status"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Plus, Loader2, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Warranty {
  id: string
  cliente: string
  equipo: string
  sku: string
  descripcion: string
  fecha_inicio: string
  fecha_fin: string
  estado: string
  os_origen: string
  categoria: string
}

export default function GarantiasPage() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [warranties, setWarranties] = useState<Warranty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWarranties()
  }, [])

  const fetchWarranties = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/warranties')
      if (res.ok) {
        const data = await res.json()
        setWarranties(data)
      }
    } catch (error) {
      console.error("Error loading warranties:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!hasPermission("garantias")) {
    return (
      <>
        <DashboardHeader title="Garantías" />
        <AccessDenied />
      </>
    )
  }

  const filteredWarranties = warranties.filter(
    (warranty) =>
      warranty.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    active: warranties.filter(w => w.estado === 'Activo').length,
    expired: warranties.filter(w => w.estado === 'Vencida').length,
    total: warranties.length
  }

  return (
    <>
      <DashboardHeader title="Garantías" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Buscar por ID, técnico o SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900/60 border-slate-700 text-slate-100 placeholder:text-slate-500"
              />
            </div>
            <Button onClick={fetchWarranties} variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Actualizar
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-slate-900/60 border-slate-800 p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-slate-400">Garantías Activas</div>
                <div className="text-2xl font-bold text-green-400">{stats.active}</div>
              </div>
            </Card>
            <Card className="bg-slate-900/60 border-slate-800 p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-500/10">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <div className="text-sm text-slate-400">Vencidas</div>
                <div className="text-2xl font-bold text-red-400">{stats.expired}</div>
              </div>
            </Card>
            <Card className="bg-slate-900/60 border-slate-800 p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-indigo-500/10">
                <AlertTriangle className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <div className="text-sm text-slate-400">Total Registros</div>
                <div className="text-2xl font-bold text-indigo-400">{stats.total}</div>
              </div>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-slate-900/60 border-slate-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-900/80">
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400 font-bold">ID Referencia</TableHead>
                  <TableHead className="text-slate-400 font-bold">Solicitante</TableHead>
                  <TableHead className="text-slate-400 font-bold">Producto</TableHead>
                  <TableHead className="text-slate-400 font-bold">SKU</TableHead>
                  <TableHead className="text-slate-400 font-bold">Inicio</TableHead>
                  <TableHead className="text-slate-400 font-bold">Vencimiento</TableHead>
                  <TableHead className="text-slate-400 font-bold">Estado</TableHead>
                  <TableHead className="text-slate-400 font-bold">Ticket Origen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                        <p>Cargando garantías...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredWarranties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                      No se encontraron garantías registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWarranties.map((warranty) => (
                    <TableRow key={warranty.id} className="border-slate-800 hover:bg-slate-800/50 text-slate-300">
                      <TableCell className="font-mono text-xs text-slate-500">{warranty.id}</TableCell>
                      <TableCell className="font-medium">{warranty.cliente}</TableCell>
                      <TableCell>{warranty.descripcion}</TableCell>
                      <TableCell className="font-mono text-xs">{warranty.sku}</TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {format(new Date(warranty.fecha_inicio), "dd/MM/yyyy", { locale: es })}
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {format(new Date(warranty.fecha_fin), "dd/MM/yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        <BadgeStatus status={warranty.estado} />
                      </TableCell>
                      <TableCell className="font-mono text-sm text-indigo-400">{warranty.os_origen}</TableCell>
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
