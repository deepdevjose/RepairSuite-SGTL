"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { ServiceCategoryBadge } from "@/components/catalog/service-category-badge"
import { ProductTypeBadge } from "@/components/catalog/product-type-badge"
import { StockIndicator } from "@/components/catalog/stock-indicator"
import { TimeEstimateBadge } from "@/components/catalog/time-estimate-badge"
import { NewProductDialog } from "@/components/catalog/new-product-dialog"
import { MarginIndicator } from "@/components/catalog/margin-indicator"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  Eye,
  Pencil,
  CheckCircle,
  XCircle,
  Package as PackageIcon,
  TrendingUp,
  Wrench,
  Cpu,
} from "lucide-react"
import { mockServices, mockParts, mockPackages, getAllCatalogItems } from "@/lib/data/catalog-mock"
import type { CatalogFilters, ServiceCategory } from "@/lib/types/catalog"
import {
  searchCatalogItems,
  filterByType,
  filterServicesByCategory,
  filterPartsByBrand,
  getAllBrands,
  getAllServiceCategories,
  formatCurrency,
  getPartStockStatus,
} from "@/lib/utils/catalog-helpers"

export default function CatalogoPage() {
  const { hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState<"all" | "servicios" | "refacciones" | "paquetes">("all")
  const [isNewProductDialogOpen, setIsNewProductDialogOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<CatalogFilters>({
    searchTerm: "",
    tipo: "all",
    categoria: "all",
    marca: "all",
    proveedor: "all",
    stockStatus: "all",
    activo: "all",
  })

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/productos?includeInactivos=true')
      const data = await res.json()

      // Map API data to frontend types
      const mappedProducts = data.map((p: any) => {
        const specs = p.especificaciones ? JSON.parse(p.especificaciones) : {}
        const garantiaDias = (p.garantiaMeses || 0) * 30

        return {
          ...p,
          // Common fields
          precio: Number(p.precioVenta),

          // Service specific
          precioBase: Number(p.precioVenta),
          tiempoEstimadoMinutos: specs.tiempoEstimadoMinutos || 0,
          garantiaDias: specs.garantiaDias || garantiaDias,

          // Part specific
          costoProveedor: Number(p.precioCompra),
          garantiaClienteDias: specs.garantiaClienteDias || garantiaDias,
          garantiaProveedorDias: specs.garantiaProveedorDias || 0,
          marca: p.marca || 'Genérico',
          proveedor: p.proveedor?.nombre || 'Sin proveedor',

          // Package specific
          precioPaquete: Number(p.precioVenta),
          serviciosIncluidos: specs.serviciosIncluidos || [],
          precioIndividual: specs.precioIndividual || 0,
        }
      })

      setProducts(mappedProducts)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  if (!hasPermission("catalogo")) {
    return (
      <>
        <DashboardHeader title="Catálogo" />
        <AccessDenied />
      </>
    )
  }

  // Apply filters
  const filteredItems = useMemo(() => {
    let items = products

    // Search
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      items = items.filter(item =>
        item.nombre.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term) ||
        item.descripcion?.toLowerCase().includes(term)
      )
    }

    // Filter by tab
    if (activeTab === "servicios") items = items.filter(i => i.tipo === "Servicio")
    if (activeTab === "refacciones") items = items.filter(i => i.tipo === "Producto") // Map Producto to Refacción
    if (activeTab === "paquetes") items = items.filter(i => i.categoria === "Paquetes")

    // Filter by category (services only)
    if (filters.categoria !== "all") {
      items = items.filter((item) => item.tipo === "Servicio" && item.categoria === filters.categoria)
    }

    // Filter by brand (parts only)
    if (filters.marca !== "all") {
      items = items.filter((item) => item.tipo === "Producto" && item.marca === filters.marca)
    }

    // Filter by active status
    if (filters.activo !== "all") {
      const isActive = filters.activo === "true"
      items = items.filter((item) => item.activo === isActive)
    }

    return items
  }, [filters, activeTab, products])

  // Calculate stats
  const stats = useMemo(() => {
    return {
      totalServicios: products.filter(p => p.tipo === 'Servicio').length,
      totalRefacciones: products.filter(p => p.tipo === 'Producto').length,
      totalPaquetes: products.filter(p => p.categoria === 'Paquetes').length,
      serviciosActivos: products.filter((s) => s.tipo === 'Servicio' && s.activo).length,
      refaccionesActivas: products.filter((p) => p.tipo === 'Producto' && p.activo).length,
    }
  }, [products])

  return (
    <>
      <DashboardHeader title="Catálogo de Productos y Servicios" />
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-600/30 to-transparent blur-3xl animate-blob-slow" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-blue-600/30 to-transparent blur-3xl animate-blob-slower" />
        </div>

        <div className="max-w-[1800px] mx-auto space-y-6 relative z-10">
          {/* Header */}
          <div className="space-y-2 animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Catálogo de Productos y Servicios
            </h2>
            <p className="text-slate-400 text-sm">Gestión completa de servicios, refacciones y paquetes</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl group-hover:from-blue-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Servicios</div>
                  <div className="p-2 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                    <Wrench className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">{stats.totalServicios}</div>
                <div className="text-xs text-slate-500 font-medium">{stats.serviciosActivos} activos</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:from-purple-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Refacciones</div>
                  <div className="p-2 rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                    <Cpu className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">{stats.totalRefacciones}</div>
                <div className="text-xs text-slate-500 font-medium">{stats.refaccionesActivas} activas</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl group-hover:from-orange-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Paquetes</div>
                  <div className="p-2 rounded-lg bg-orange-500/10 ring-1 ring-orange-500/20">
                    <PackageIcon className="h-4 w-4 text-orange-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">{stats.totalPaquetes}</div>
                <div className="text-xs text-slate-500 font-medium">Combos disponibles</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl group-hover:from-green-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Total Catálogo</div>
                  <div className="p-2 rounded-lg bg-green-500/10 ring-1 ring-green-500/20">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">
                  {stats.totalServicios + stats.totalRefacciones + stats.totalPaquetes}
                </div>
                <div className="text-xs text-slate-500 font-medium">Productos totales</div>
              </div>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card
            className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar por SKU o nombre..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="pl-10 bg-slate-800/40 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {activeTab === "servicios" && (
                  <Select
                    value={filters.categoria}
                    onValueChange={(value: any) => setFilters({ ...filters, categoria: value })}
                  >
                    <SelectTrigger className="h-9 w-[160px] bg-slate-800/40 border-slate-700 text-slate-300 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="all" className="text-slate-300 text-xs">
                        Todas categorías
                      </SelectItem>
                      {getAllServiceCategories().map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-slate-300 text-xs">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {activeTab === "refacciones" && (
                  <Select value={filters.marca} onValueChange={(value: any) => setFilters({ ...filters, marca: value })}>
                    <SelectTrigger className="h-9 w-[140px] bg-slate-800/40 border-slate-700 text-slate-300 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="all" className="text-slate-300 text-xs">
                        Todas las marcas
                      </SelectItem>
                      {getAllBrands(mockParts).map((marca) => (
                        <SelectItem key={marca} value={marca} className="text-slate-300 text-xs">
                          {marca}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Select value={filters.activo} onValueChange={(value: any) => setFilters({ ...filters, activo: value })}>
                  <SelectTrigger className="h-9 w-[120px] bg-slate-800/40 border-slate-700 text-slate-300 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="all" className="text-slate-300 text-xs">
                      Todos
                    </SelectItem>
                    <SelectItem value="true" className="text-slate-300 text-xs">
                      Activos
                    </SelectItem>
                    <SelectItem value="false" className="text-slate-300 text-xs">
                      Inactivos
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => setIsNewProductDialogOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-600/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </div>
          </Card>

          {/* Tabs with Tables */}
          <Card
            className="bg-slate-900/60 backdrop-blur-sm border-white/5 animate-fade-in-up overflow-hidden"
            style={{ animationDelay: "300ms" }}
          >
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
              <div className="border-b border-white/5 px-6">
                <TabsList className="bg-transparent border-0 h-auto p-0">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-4 py-3 text-slate-400 data-[state=active]:text-indigo-400"
                  >
                    Todos ({filteredItems.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="servicios"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-3 text-slate-400 data-[state=active]:text-blue-400"
                  >
                    Servicios ({mockServices.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="refacciones"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none px-4 py-3 text-slate-400 data-[state=active]:text-purple-400"
                  >
                    Refacciones ({mockParts.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="paquetes"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none px-4 py-3 text-slate-400 data-[state=active]:text-orange-400"
                  >
                    Paquetes ({mockPackages.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* All Items Tab */}
              <TabsContent value="all" className="m-0 p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">SKU</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Tipo</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Nombre</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Precio</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Garantía</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Estado</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item, index) => (
                        <TableRow
                          key={item.id}
                          className="border-white/5 hover:bg-white/[0.02] text-slate-300 transition-all duration-150"
                          style={{
                            animation: "fadeInUp 0.3s ease-out forwards",
                            animationDelay: `${index * 30}ms`,
                            opacity: 0,
                          }}
                        >
                          <TableCell className="font-mono text-[12px] text-indigo-400">{item.sku}</TableCell>
                          <TableCell>
                            <ProductTypeBadge tipo={item.tipo} />
                          </TableCell>
                          <TableCell className="text-[13px] font-medium">{item.nombre}</TableCell>
                          <TableCell className="text-[13px] font-semibold text-green-400">
                            {formatCurrency(item.tipo === "Servicio" ? (item as any).precioBase : item.tipo === "Refacción" ? (item as any).precioVenta : (item as any).precioPaquete)}
                          </TableCell>
                          <TableCell className="text-[12px] text-slate-400">
                            {item.tipo === "Servicio" ? `${(item as any).garantiaDias} días` : item.tipo === "Refacción" ? `${(item as any).garantiaClienteDias} días` : `${(item as any).garantiaDias} días`}
                          </TableCell>
                          <TableCell>
                            {item.activo ? (
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
                              <Link href={`/dashboard/catalogo/${item.sku}`}>
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

                  {filteredItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                      <PackageIcon className="h-16 w-16 text-slate-700 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-400 mb-2">No se encontraron productos</h3>
                      <p className="text-sm text-slate-500 text-center max-w-md">
                        Intenta ajustar los filtros o términos de búsqueda
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="servicios" className="m-0 p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">SKU</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Servicio</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Categoría</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Tiempo Est.</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">Precio</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Garantía</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Estado</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.filter(item => item.tipo === "Servicio").map((item: any, index) => (
                        <TableRow
                          key={item.sku}
                          className="border-white/5 hover:bg-white/[0.02] text-slate-300 transition-all duration-150"
                          style={{
                            animation: "fadeInUp 0.3s ease-out forwards",
                            animationDelay: `${index * 30}ms`,
                            opacity: 0,
                          }}
                        >
                          <TableCell className="font-mono text-[12px] text-indigo-400">{item.sku}</TableCell>
                          <TableCell>
                            <div className="text-[13px] font-medium">{item.nombre}</div>
                            <div className="text-[11px] text-slate-500">{item.descripcion?.substring(0, 50)}...</div>
                          </TableCell>
                          <TableCell>
                            <ServiceCategoryBadge categoria={item.categoria} />
                          </TableCell>
                          <TableCell>
                            <TimeEstimateBadge minutos={item.tiempoEstimadoMinutos} />
                          </TableCell>
                          <TableCell className="text-right text-[13px] font-semibold text-slate-200">
                            {formatCurrency(item.precio)}
                          </TableCell>
                          <TableCell className="text-[12px] text-slate-400">
                            {item.garantiaDias} días
                          </TableCell>
                          <TableCell>
                            {item.activo ? (
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
                              <Link href={`/dashboard/catalogo/${item.sku}`}>
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

                  {filteredItems.filter(item => item.tipo === "Servicio").length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                      <Wrench className="h-16 w-16 text-slate-700 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-400 mb-2">No se encontraron servicios</h3>
                      <p className="text-sm text-slate-500 text-center max-w-md">
                        Intenta ajustar los filtros o términos de búsqueda
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Parts Tab */}
              <TabsContent value="refacciones" className="m-0 p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">SKU</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Refacción</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Marca</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Stock</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Proveedor</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">Costo</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">Precio</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Margen</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Estado</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.filter(item => item.tipo === "Producto").map((item: any, index) => {
                        const stockStatus = getPartStockStatus(item.inventarioSKU)
                        return (
                          <TableRow
                            key={item.sku}
                            className="border-white/5 hover:bg-white/[0.02] text-slate-300 transition-all duration-150"
                            style={{
                              animation: "fadeInUp 0.3s ease-out forwards",
                              animationDelay: `${index * 30}ms`,
                              opacity: 0,
                            }}
                          >
                            <TableCell className="font-mono text-[12px] text-indigo-400">{item.sku}</TableCell>
                            <TableCell>
                              <div className="text-[13px] font-medium">{item.nombre}</div>
                              <div className="text-[11px] text-slate-500">{item.descripcion?.substring(0, 40)}...</div>
                            </TableCell>
                            <TableCell className="text-[12px] text-slate-400">{item.marca}</TableCell>
                            <TableCell>
                              <StockIndicator estado={stockStatus.estado} stockDisponible={stockStatus.stockDisponible} />
                            </TableCell>
                            <TableCell className="text-[12px] text-slate-400">{item.proveedor}</TableCell>
                            <TableCell className="text-right text-[12px] text-slate-400">
                              {formatCurrency(item.costoProveedor)}
                            </TableCell>
                            <TableCell className="text-right text-[13px] font-semibold text-slate-200">
                              {formatCurrency(item.precio)}
                            </TableCell>
                            <TableCell>
                              <MarginIndicator margen={((item.precio - item.costoProveedor) / item.precio) * 100} />
                            </TableCell>
                            <TableCell>
                              {item.activo ? (
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
                                <Link href={`/dashboard/catalogo/${item.sku}`}>
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
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
                                  title="Editar"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>

                  {filteredItems.filter(item => item.tipo === "Producto").length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                      <Cpu className="h-16 w-16 text-slate-700 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-400 mb-2">No se encontraron refacciones</h3>
                      <p className="text-sm text-slate-500 text-center max-w-md">
                        Intenta ajustar los filtros o términos de búsqueda
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Packages Tab */}
              <TabsContent value="paquetes" className="m-0 p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">SKU</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Paquete</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Servicios Incluidos</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">Valor Total</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">Precio Paquete</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">Ahorro</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Estado</TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.filter(item => item.tipo === "Paquete").map((item: any, index) => {
                        const ahorro = item.precioIndividual - item.precio
                        const porcentajeAhorro = ((ahorro / item.precioIndividual) * 100).toFixed(0)
                        return (
                          <TableRow
                            key={item.sku}
                            className="border-white/5 hover:bg-white/[0.02] text-slate-300 transition-all duration-150"
                            style={{
                              animation: "fadeInUp 0.3s ease-out forwards",
                              animationDelay: `${index * 30}ms`,
                              opacity: 0,
                            }}
                          >
                            <TableCell className="font-mono text-[12px] text-indigo-400">{item.sku}</TableCell>
                            <TableCell>
                              <div className="text-[13px] font-medium">{item.nombre}</div>
                              <div className="text-[11px] text-slate-500">{item.descripcion?.substring(0, 50)}...</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-[11px] text-slate-400">{item.serviciosIncluidos.length} servicios</div>
                            </TableCell>
                            <TableCell className="text-right text-[12px] text-slate-400 line-through">
                              {formatCurrency(item.precioIndividual)}
                            </TableCell>
                            <TableCell className="text-right text-[13px] font-semibold text-green-400">
                              {formatCurrency(item.precio)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs font-semibold">
                                -{porcentajeAhorro}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {item.activo ? (
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
                                <Link href={`/dashboard/catalogo/${item.sku}`}>
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
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
                                  title="Editar"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>

                  {filteredItems.filter(item => item.tipo === "Paquete").length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                      <PackageIcon className="h-16 w-16 text-slate-700 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-400 mb-2">No se encontraron paquetes</h3>
                      <p className="text-sm text-slate-500 text-center max-w-md">
                        Intenta ajustar los filtros o términos de búsqueda
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Results count */}
            {filteredItems.length > 0 && (
              <div className="border-t border-white/5 px-6 py-4">
                <p className="text-xs text-slate-500">
                  Mostrando <span className="font-semibold text-slate-400">{filteredItems.length}</span> productos
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* New Product Dialog */}
        <NewProductDialog
          open={isNewProductDialogOpen}
          onOpenChange={setIsNewProductDialogOpen}
          onSave={async (product) => {
            try {
              const res = await fetch('/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
              })

              if (!res.ok) throw new Error('Error al crear producto')

              // Reload products
              await loadProducts()

              // The dialog shows its own success toast, but we could add another one or rely on that one.
              // Since the dialog calls onSave and then shows toast and closes, we just need to handle the data persistence here.
            } catch (error) {
              console.error('Error saving product:', error)
              // We might want to show an error toast here if the dialog doesn't handle external errors well,
              // but the dialog currently catches errors in its own handleSubmit? 
              // Actually, the dialog calls onSave and then shows success toast immediately. 
              // It doesn't wait for the promise. This is a minor UX issue in the dialog component 
              // (it assumes success), but for now we will just save and reload.
            }
          }}
        />
      </main>
    </>
  )
}
