"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { SupplierFormDialog } from "@/components/suppliers/supplier-form-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Building2,
  Package,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface Proveedor {
  id: string
  nombre: string
  contacto: string | null
  telefono: string
  email: string | null
  direccion: string | null
  notas: string | null
  activo: boolean
  createdAt: string
  updatedAt: string
}

export default function ProveedoresPage() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Proveedor | null>(null)
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProveedores()
  }, [])

  const fetchProveedores = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/proveedores')
      if (response.ok) {
        const data = await response.json()
        setProveedores(data)
      }
    } catch (error) {
      console.error('Error al obtener proveedores:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!hasPermission("proveedores")) {
    return (
      <>
        <DashboardHeader title="Proveedores" />
        <AccessDenied />
      </>
    )
  }

  // Filter suppliers
  const filteredSuppliers = useMemo(() => {
    if (!searchTerm.trim()) return proveedores

    const term = searchTerm.toLowerCase()
    return proveedores.filter(
      (supplier) =>
        supplier.nombre.toLowerCase().includes(term) ||
        (supplier.email && supplier.email.toLowerCase().includes(term)) ||
        (supplier.contacto && supplier.contacto.toLowerCase().includes(term))
    )
  }, [searchTerm, proveedores])

  // Calculate stats
  const stats = useMemo(() => {
    const activos = proveedores.filter((s) => s.activo).length

    return {
      total: proveedores.length,
      activos,
      inactivos: proveedores.length - activos,
      totalProductos: 0, // TODO: agregar conteo de productos cuando se implemente
    }
  }, [proveedores])

  return (
    <>
      <DashboardHeader title="Proveedores" />
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-600/30 to-transparent blur-3xl animate-blob-slow" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-teal-600/30 to-transparent blur-3xl animate-blob-slower" />
        </div>

        <div className="max-w-[1600px] mx-auto space-y-6 relative z-10">
          {/* Header */}
          <div className="space-y-2 animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Gestión de Proveedores
            </h2>
            <p className="text-slate-400 text-sm">Control completo de proveedores y órdenes de compra</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl group-hover:from-emerald-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Total Proveedores</div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
                    <Building2 className="h-4 w-4 text-emerald-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">{stats.total}</div>
                <div className="text-xs text-slate-500 font-medium">{stats.activos} activos</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl group-hover:from-blue-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Productos</div>
                  <div className="p-2 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                    <Package className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">{stats.totalProductos}</div>
                <div className="text-xs text-slate-500 font-medium">Refacciones asociadas</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:from-purple-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Órdenes Pendientes</div>
                  <div className="p-2 rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                    <ShoppingCart className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">0</div>
                <div className="text-xs text-slate-500 font-medium">Por recibir</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl group-hover:from-green-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Órdenes Este Mes</div>
                  <div className="p-2 rounded-lg bg-green-500/10 ring-1 ring-green-500/20">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">0</div>
                <div className="text-xs text-slate-500 font-medium">Recibidas</div>
              </div>
            </Card>
          </div>

          {/* Search and Actions */}
          <Card
            className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar por nombre, RFC o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/40 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <Button
                onClick={() => {
                  setSelectedSupplier(null)
                  setIsFormOpen(true)
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-600/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proveedor
              </Button>
            </div>
          </Card>

          {/* Suppliers Table */}
          <Card
            className="bg-slate-900/60 backdrop-blur-sm border-white/5 animate-fade-in-up overflow-hidden"
            style={{ animationDelay: "300ms" }}
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Nombre
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Contacto
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Teléfono
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Email
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Estado
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-slate-400 py-12">
                        Cargando proveedores...
                      </TableCell>
                    </TableRow>
                  ) : filteredSuppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-slate-400 py-12">
                        <Building2 className="h-12 w-12 mx-auto mb-3 text-slate-600" />
                        <p className="text-sm font-medium">No se encontraron proveedores</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {proveedores.length === 0 ? "Agrega tu primer proveedor" : "Intenta ajustar la búsqueda"}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSuppliers.map((supplier, index) => (
                      <TableRow
                        key={supplier.id}
                        className="border-white/5 hover:bg-white/[0.02] text-slate-300 transition-all duration-150"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center ring-1 ring-emerald-500/30">
                              <Building2 className="h-4 w-4 text-emerald-400" />
                            </div>
                            <div className="text-[13px] font-medium text-slate-200">{supplier.nombre}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[12px] text-slate-400">{supplier.contacto || "—"}</TableCell>
                        <TableCell className="text-[12px] text-slate-400">{supplier.telefono}</TableCell>
                        <TableCell className="text-[12px] text-slate-400">{supplier.email || "—"}</TableCell>
                        <TableCell>
                          {supplier.activo ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Activo
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactivo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Ver
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-slate-400 hover:text-slate-300 hover:bg-slate-500/10"
                              onClick={() => {
                                setSelectedSupplier(supplier)
                                setIsFormOpen(true)
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5 mr-1" />
                              Editar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Results count */}
            {filteredSuppliers.length > 0 && (
              <div className="border-t border-white/5 px-6 py-4">
                <p className="text-xs text-slate-500">
                  Mostrando <span className="font-semibold text-slate-400">{filteredSuppliers.length}</span> de{" "}
                  <span className="font-semibold text-slate-400">{proveedores.length}</span> proveedores
                </p>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Supplier Form Dialog */}
      <SupplierFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        supplier={selectedSupplier as any}
        onSave={async (data) => {
          try {
            const method = selectedSupplier ? 'PUT' : 'POST'
            const body = selectedSupplier ? { ...data, id: selectedSupplier.id } : data

            const res = await fetch('/api/proveedores', {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            })

            if (!res.ok) throw new Error('Error al guardar proveedor')

            await fetchProveedores()
            setIsFormOpen(false)
            setSelectedSupplier(null)
          } catch (error) {
            console.error('Error saving supplier:', error)
          }
        }}
      />
    </>
  )
}
