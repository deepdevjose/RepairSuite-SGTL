"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { PaymentTermsBadge } from "@/components/suppliers/payment-terms-badge"
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
import { mockSuppliers } from "@/lib/data/catalog-mock"
import { formatDate } from "@/lib/utils/supplier-helpers"

export default function ProveedoresPage() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)

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
    if (!searchTerm.trim()) return mockSuppliers

    const term = searchTerm.toLowerCase()
    return mockSuppliers.filter(
      (supplier) =>
        supplier.nombreComercial.toLowerCase().includes(term) ||
        (supplier.rfc && supplier.rfc.toLowerCase().includes(term)) ||
        supplier.email.toLowerCase().includes(term)
    )
  }, [searchTerm])

  // Calculate stats
  const stats = useMemo(() => {
    const activos = mockSuppliers.filter((s) => s.activo).length
    const totalProductos = mockSuppliers.reduce((sum, s) => sum + (s.productosAsociados?.length || 0), 0)

    return {
      total: mockSuppliers.length,
      activos,
      inactivos: mockSuppliers.length - activos,
      totalProductos,
    }
  }, [])

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

              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-600/30">
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
                      Nombre Comercial
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">RFC</TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Contacto
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Condiciones
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-center">
                      Productos
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Última Compra
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
                  {filteredSuppliers.map((supplier, index) => (
                    <TableRow
                      key={supplier.id}
                      className="border-white/5 hover:bg-white/[0.02] text-slate-300 transition-all duration-150"
                      style={{
                        animation: "fadeInUp 0.3s ease-out forwards",
                        animationDelay: `${400 + index * 30}ms`,
                        opacity: 0,
                      }}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center ring-1 ring-emerald-500/30">
                            <Building2 className="h-4 w-4 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-[13px] font-medium text-slate-200">{supplier.nombreComercial}</div>
                            <div className="text-[11px] text-slate-500">{supplier.contactoPrincipal}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-[12px] text-indigo-400">{supplier.rfc || "—"}</TableCell>
                      <TableCell>
                        <div className="text-[12px]">
                          <div className="text-slate-400">{supplier.telefono}</div>
                          <div className="text-slate-500">{supplier.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <PaymentTermsBadge condiciones={supplier.condicionesPago} />
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-[13px] font-semibold text-blue-400">{supplier.productosAsociados?.length || 0}</span>
                      </TableCell>
                      <TableCell className="text-[12px] text-slate-400">
                        {supplier.fechaCreacion ? formatDate(supplier.fechaCreacion) : "—"}
                      </TableCell>
                      <TableCell>
                        {supplier.activo ? (
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Activo
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactivo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/dashboard/proveedores/${supplier.id}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                              title="Ver detalles"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedSupplier(supplier)
                              setIsFormOpen(true)
                            }}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
                            title="Editar"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredSuppliers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <Building2 className="h-16 w-16 text-slate-700 mb-4" />
                <h3 className="text-lg font-semibold text-slate-400 mb-2">No se encontraron proveedores</h3>
                <p className="text-sm text-slate-500 text-center max-w-md">
                  Intenta ajustar los términos de búsqueda
                </p>
              </div>
            )}

            {/* Results count */}
            {filteredSuppliers.length > 0 && (
              <div className="border-t border-white/5 px-6 py-4">
                <p className="text-xs text-slate-500">
                  Mostrando <span className="font-semibold text-slate-400">{filteredSuppliers.length}</span> de{" "}
                  <span className="font-semibold text-slate-400">{mockSuppliers.length}</span> proveedores
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
        supplier={selectedSupplier}
        onSave={(data) => {
          console.log("Proveedor guardado:", data)
          // Aquí se implementaría la lógica de guardado
          setSelectedSupplier(null)
        }}
      />
    </>
  )
}
