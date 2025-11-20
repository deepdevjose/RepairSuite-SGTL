"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { StockBadge } from "@/components/inventory/stock-badge"
import { ProductThumbnail } from "@/components/inventory/product-thumbnail"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  Minus,
  ArrowLeftRight,
  Settings,
  History,
  ShoppingCart,
  Eye,
  AlertTriangle,
  TrendingUp,
  Lock,
  Package,
} from "lucide-react"
import { mockInventoryItems, getAllCategories } from "@/lib/data/inventory-mock"
import type { InventoryFilters, ProductCategory } from "@/lib/types/inventory"
import {
  getStockStatus,
  calculateAvailableStock,
  searchProducts,
  filterByStockStatus,
  filterByBranch,
  getProductsByCategory,
  getLowStockProducts,
  getCriticalStockProducts,
  formatRelativeTime,
} from "@/lib/utils/inventory-helpers"

export default function InventarioPage() {
  const { hasPermission, user } = useAuth()
  const [filters, setFilters] = useState<InventoryFilters>({
    searchTerm: "",
    sucursal: "all",
    estado: "all",
    categoria: "all",
  })

  if (!hasPermission("inventario")) {
    return (
      <>
        <DashboardHeader title="Inventario" />
        <AccessDenied />
      </>
    )
  }

  const isReadOnly = user?.role === "Técnico"

  // Apply all filters
  const filteredProducts = useMemo(() => {
    let products = [...mockInventoryItems]

    // Search
    products = searchProducts(products, filters.searchTerm)

    // Filter by branch
    products = filterByBranch(products, filters.sucursal)

    // Filter by status
    products = filterByStockStatus(products, filters.estado)

    // Filter by category
    products = getProductsByCategory(products, filters.categoria)

    return products
  }, [filters])

  // Calculate stats
  const stats = useMemo(() => {
    const lowStock = getLowStockProducts(mockInventoryItems)
    const criticalStock = getCriticalStockProducts(mockInventoryItems)
    const okStock = mockInventoryItems.filter((p) => {
      const status = getStockStatus(p.stockTotal, p.stockMinimo)
      return status === "OK"
    })
    const totalReserved = mockInventoryItems.reduce((sum, p) => sum + p.stockReservado, 0)
    const mostUsed = [...mockInventoryItems]
      .sort((a, b) => b.stockReservado - a.stockReservado)
      .slice(0, 3)

    return {
      lowStock,
      criticalStock,
      okStock,
      totalReserved,
      mostUsed,
    }
  }, [])

  return (
    <>
      <DashboardHeader title="Inventario" />
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Animated background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/30 to-transparent blur-3xl animate-blob-slow" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-violet-600/30 to-transparent blur-3xl animate-blob-slower" />
          <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-purple-600/20 to-transparent blur-3xl animate-blob-slowest" />
        </div>

        <div className="max-w-[1600px] mx-auto space-y-6 relative z-10">
          {/* Header Section */}
          <div className="space-y-2 animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Gestión de Inventario
            </h2>
            <p className="text-slate-400 text-sm">Control completo de stock, movimientos y reservas</p>
          </div>

          {/* Intelligent Alerts Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            {/* Critical Stock Alert */}
            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-2xl group-hover:from-red-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Stock Crítico</div>
                  <div className="p-2 rounded-lg bg-red-500/10 ring-1 ring-red-500/20">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-2">{stats.criticalStock.length}</div>
                <div className="text-xs text-red-400 flex items-center gap-1 font-medium">
                  <AlertTriangle className="h-3 w-3" />
                  Requiere compra urgente
                </div>
              </div>
            </Card>

            {/* Low Stock Alert */}
            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-2xl group-hover:from-yellow-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Stock Bajo</div>
                  <div className="p-2 rounded-lg bg-yellow-500/10 ring-1 ring-yellow-500/20">
                    <Package className="h-4 w-4 text-yellow-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-2">{stats.lowStock.length}</div>
                <div className="text-xs text-slate-500 font-medium">Próximos a agotar</div>
              </div>
            </Card>

            {/* Reserved Stock */}
            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:from-purple-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Stock Reservado</div>
                  <div className="p-2 rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                    <Lock className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-2">{stats.totalReserved}</div>
                <div className="text-xs text-slate-500 font-medium">Unidades en OS activas</div>
              </div>
            </Card>

            {/* Most Used */}
            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl group-hover:from-indigo-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Más Utilizados</div>
                  <div className="p-2 rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20">
                    <TrendingUp className="h-4 w-4 text-indigo-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-2">{stats.mostUsed.length}</div>
                <div className="text-xs text-slate-500 font-medium">Productos top este mes</div>
              </div>
            </Card>
          </div>

          {/* Filters and Actions */}
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
                <Select value={filters.sucursal} onValueChange={(value: any) => setFilters({ ...filters, sucursal: value })}>
                  <SelectTrigger className="h-9 w-[140px] bg-slate-800/40 border-slate-700 text-slate-300 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="all" className="text-slate-300 text-xs">
                      Todas las sedes
                    </SelectItem>
                    <SelectItem value="sedeA" className="text-slate-300 text-xs">
                      Sede A
                    </SelectItem>
                    <SelectItem value="sedeB" className="text-slate-300 text-xs">
                      Sede B
                    </SelectItem>
                    <SelectItem value="sedeC" className="text-slate-300 text-xs">
                      Sede C
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.estado} onValueChange={(value: any) => setFilters({ ...filters, estado: value })}>
                  <SelectTrigger className="h-9 w-[120px] bg-slate-800/40 border-slate-700 text-slate-300 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="all" className="text-slate-300 text-xs">
                      Todos
                    </SelectItem>
                    <SelectItem value="OK" className="text-slate-300 text-xs">
                      OK
                    </SelectItem>
                    <SelectItem value="Bajo" className="text-slate-300 text-xs">
                      Bajo
                    </SelectItem>
                    <SelectItem value="Crítico" className="text-slate-300 text-xs">
                      Crítico
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.categoria}
                  onValueChange={(value: any) => setFilters({ ...filters, categoria: value })}
                >
                  <SelectTrigger className="h-9 w-[140px] bg-slate-800/40 border-slate-700 text-slate-300 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="all" className="text-slate-300 text-xs">
                      Todas categorías
                    </SelectItem>
                    {getAllCategories().map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-slate-300 text-xs">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              {!isReadOnly && (
                <div className="flex gap-2">
                  <Button className="h-9 bg-green-600 hover:bg-green-500 text-white text-xs font-medium shadow-lg shadow-green-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-600/30">
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Entrada
                  </Button>
                  <Button className="h-9 bg-red-600 hover:bg-red-500 text-white text-xs font-medium shadow-lg shadow-red-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-red-600/30">
                    <Minus className="h-3.5 w-3.5 mr-1.5" />
                    Salida
                  </Button>
                  <Button className="h-9 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-lg shadow-blue-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/30">
                    <ArrowLeftRight className="h-3.5 w-3.5 mr-1.5" />
                    Transferir
                  </Button>
                </div>
              )}

              {isReadOnly && (
                <div className="px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-400 font-medium">
                  Modo solo lectura
                </div>
              )}
            </div>
          </Card>

          {/* Inventory Table */}
          <Card
            className="bg-slate-900/60 backdrop-blur-sm border-white/5 animate-fade-in-up overflow-hidden"
            style={{ animationDelay: "300ms" }}
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Producto
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">SKU</TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-center">
                      Total
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-center">
                      Sede A
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-center">
                      Sede B
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-center">
                      Sede C
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-center">
                      Reservado
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-center">
                      Disponible
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Estado
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      Último Mov.
                    </TableHead>
                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product, index) => {
                    const status = getStockStatus(product.stockTotal, product.stockMinimo)
                    const disponible = calculateAvailableStock(product.stockTotal, product.stockReservado)

                    return (
                      <TableRow
                        key={product.id}
                        className="border-white/5 hover:bg-white/[0.02] text-slate-300 transition-all duration-150 group"
                        style={{
                          animation: "fadeInUp 0.3s ease-out forwards",
                          animationDelay: `${400 + index * 30}ms`,
                          opacity: 0,
                        }}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <ProductThumbnail categoria={product.categoria} imagen={product.imagen} nombre={product.nombre} />
                            <div>
                              <div className="text-[13px] font-medium text-slate-200">{product.nombre}</div>
                              <div className="text-[11px] text-slate-500">{product.categoria}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-[12px] text-indigo-400">{product.sku}</TableCell>
                        <TableCell className="text-center">
                          <span className="text-[13px] font-semibold text-slate-200">{product.stockTotal}</span>
                        </TableCell>
                        <TableCell className="text-center text-[13px] text-slate-400 tabular-nums">
                          {product.stockPorSucursal.sedeA}
                        </TableCell>
                        <TableCell className="text-center text-[13px] text-slate-400 tabular-nums">
                          {product.stockPorSucursal.sedeB}
                        </TableCell>
                        <TableCell className="text-center text-[13px] text-slate-400 tabular-nums">
                          {product.stockPorSucursal.sedeC}
                        </TableCell>
                        <TableCell className="text-center">
                          {product.stockReservado > 0 ? (
                            <span className="text-[13px] font-medium text-purple-400">{product.stockReservado}</span>
                          ) : (
                            <span className="text-[13px] text-slate-600">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-[13px] font-semibold text-green-400">{disponible}</span>
                        </TableCell>
                        <TableCell>
                          <StockBadge status={status} />
                        </TableCell>
                        <TableCell className="text-[12px] text-slate-500">{formatRelativeTime(product.ultimoMovimiento)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            {!isReadOnly && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                                  title="Ajuste rápido"
                                >
                                  <Settings className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                                  title="Transferir"
                                >
                                  <ArrowLeftRight className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
                                  title="Generar orden de compra"
                                >
                                  <ShoppingCart className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-slate-400 hover:text-slate-300 hover:bg-white/5"
                              title="Ver historial"
                            >
                              <History className="h-3.5 w-3.5" />
                            </Button>
                            <Link href={`/dashboard/inventario/${product.sku}`}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                                title="Ver detalles"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <Package className="h-16 w-16 text-slate-700 mb-4" />
                <h3 className="text-lg font-semibold text-slate-400 mb-2">No se encontraron productos</h3>
                <p className="text-sm text-slate-500 text-center max-w-md">
                  Intenta ajustar los filtros o términos de búsqueda para encontrar lo que buscas
                </p>
              </div>
            )}

            {/* Results count */}
            {filteredProducts.length > 0 && (
              <div className="border-t border-white/5 px-6 py-4">
                <p className="text-xs text-slate-500">
                  Mostrando <span className="font-semibold text-slate-400">{filteredProducts.length}</span> de{" "}
                  <span className="font-semibold text-slate-400">{mockInventoryItems.length}</span> productos
                </p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </>
  )
}
