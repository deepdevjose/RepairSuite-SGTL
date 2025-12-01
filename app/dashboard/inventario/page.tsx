"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { ProductThumbnail } from "@/components/inventory/product-thumbnail"
import { ProductDetailsDialog } from "@/components/inventory/product-details-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Minus,
  ArrowLeftRight,
  Settings,
  Eye,
  AlertTriangle,
  TrendingUp,
  Lock,
  Package,
  Ticket,
  FileText,
  Disc,
  Filter,
  Box,
  ShoppingCart,
  History,
  Bell,
  Pencil
} from "lucide-react"
import { RequestMaterialDialog } from "@/components/inventory/request-material-dialog"
import { WithdrawalTicketDialog } from "@/components/inventory/withdrawal-ticket-dialog"
import { TicketHistoryDialog } from "@/components/inventory/ticket-history-dialog"
import { PendingRequestsDialog } from "@/components/inventory/pending-requests-dialog"
import { InventoryAdjustmentDialog } from "@/components/inventory/inventory-adjustment-dialog"
import { NewProductDialog } from "@/components/inventory/new-product-dialog"
import { AdminValidationBar } from "@/components/inventory/admin-validation-bar"
import { InventoryCart } from "@/components/inventory/inventory-cart"
import { useToast } from "@/hooks/use-toast"
import type { InventoryFilters, ProductCategory } from "@/lib/types/inventory"
import { getStockStatus } from "@/lib/utils/inventory-helpers"

interface Producto {
  id: string
  sku: string
  nombre: string
  descripcion?: string
  categoria: ProductCategory
  tipo: string
  marca?: string
  modelo?: string
  compatibilidad?: string
  especificaciones?: string
  ubicacion: string
  precioCompra: number
  precioVenta: number
  stockActual: number
  stockTotal: number
  stockReservado: number
  stockMinimo: number
  garantiaMeses: number
  proveedorId?: string
  activo: boolean
  createdAt: string
  updatedAt: string
  ultimoMovimiento: string
  costoProveedor: number
  imagen?: string
  proveedor?: {
    id: string
    nombre: string
    telefono?: string
    email?: string
  }
}

export default function InventarioPage() {
  const { hasPermission, user } = useAuth()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<InventoryFilters>({
    searchTerm: "",
    estado: "all",
    categoria: "all",
  })
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const { toast } = useToast()

  // Inventory Workflow State
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isPendingRequestsOpen, setIsPendingRequestsOpen] = useState(false)
  const [currentTicket, setCurrentTicket] = useState(null)

  // Adjustment State
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false)
  const [adjustmentMode, setAdjustmentMode] = useState<'Entrada' | 'Salida'>('Entrada')

  // New Product State
  const [isNewProductOpen, setIsNewProductOpen] = useState(false)

  // Cart State
  const [cart, setCart] = useState<{ product: Producto, quantity: number }[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/productos')
      const data = await response.json()

      // Map API response to match InventoryItem interface
      const mappedProducts = data.map((p: any) => ({
        ...p,
        stockTotal: p.stockActual,
        ultimoMovimiento: p.updatedAt,
        costoProveedor: p.precioCompra,
        ubicacion: p.ubicacion || "Sin ubicación",
      }))

      setProductos(mappedProducts)
    } catch (error) {
      console.error('Error al cargar productos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cart Handlers
  const handleAddToCart = (product: Producto) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        // Check stock limit
        const available = product.stockActual - product.stockReservado
        if (existing.quantity >= available) {
          toast({
            title: "Stock límite alcanzado",
            description: `No puedes agregar más unidades de ${product.nombre}`,
            variant: "destructive"
          })
          return prev
        }
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    setIsCartOpen(true)
    toast({
      title: "Agregado al carrito",
      description: `${product.nombre} agregado para retiro.`,
    })
  }

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = item.quantity + delta
        // Validate limits
        if (newQuantity < 1) return item
        const available = item.product.stockActual - item.product.stockReservado
        if (newQuantity > available) {
          toast({
            title: "Stock insuficiente",
            description: `Solo hay ${available} unidades disponibles.`,
            variant: "destructive"
          })
          return item
        }
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const handleClearCart = () => {
    setCart([])
  }

  const handleCheckout = async () => {
    if (!user || cart.length === 0) return

    setIsCheckoutLoading(true)
    try {
      const payload = {
        usuarioId: user.id,
        items: cart.map(item => ({
          productoId: item.product.id,
          cantidad: item.quantity
        }))
      }

      const response = await fetch('/api/inventory/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setCurrentTicket(data)
      setIsTicketDialogOpen(true)
      setCart([])
      setIsCartOpen(false)

      // Refresh products
      fetchProductos()

      toast({
        title: "Ticket Generado",
        description: "Se ha generado el ticket de retiro exitosamente.",
      })

    } catch (error: any) {
      toast({
        title: "Error al generar retiro",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  if (!hasPermission("inventario")) {
    return (
      <>
        <DashboardHeader title={user?.role === "Técnico" ? "Catálogo" : "Inventario"} />
        <AccessDenied />
      </>
    )
  }

  const isReadOnly = user?.role === "Técnico"

  // Apply all filters
  const filteredProducts = useMemo(() => {
    let products = [...productos]

    // Search by SKU, nombre, marca
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      products = products.filter(p =>
        p.sku.toLowerCase().includes(term) ||
        p.nombre.toLowerCase().includes(term) ||
        p.marca?.toLowerCase().includes(term)
      )
    }

    // Filter by status
    if (filters.estado !== "all") {
      products = products.filter(p => {
        const status = getStockStatus(p.stockActual - p.stockReservado, p.stockMinimo)
        return status === filters.estado
      })
    }

    // Filter by category
    if (filters.categoria !== "all") {
      products = products.filter(p => p.categoria === filters.categoria)
    }

    return products
  }, [productos, filters])

  // Calculate stats
  const stats = useMemo(() => {
    const lowStock = productos.filter(p => {
      if (p.categoria === 'Servicio') return false
      const availableStock = p.stockActual - p.stockReservado
      const status = getStockStatus(availableStock, p.stockMinimo)
      return status === "Bajo"
    })

    const criticalStock = productos.filter(p => {
      if (p.categoria === 'Servicio') return false
      const availableStock = p.stockActual - p.stockReservado
      const status = getStockStatus(availableStock, p.stockMinimo)
      return status === "Crítico"
    })

    const okStock = productos.filter(p => {
      if (p.categoria === 'Servicio') return false
      const availableStock = p.stockActual - p.stockReservado
      const status = getStockStatus(availableStock, p.stockMinimo)
      return status === "OK"
    })

    const totalReserved = productos.filter(p => p.categoria !== 'Servicio').reduce((sum, p) => sum + p.stockReservado, 0)

    const mostUsed = [...productos]
      .filter(p => p.stockReservado > 0)
      .sort((a, b) => b.stockReservado - a.stockReservado)
      .slice(0, 3)

    return {
      lowStock,
      criticalStock,
      okStock,
      totalReserved,
      mostUsed,
    }
  }, [productos])

  return (
    <>
      <DashboardHeader title={user?.role === "Técnico" ? "Catálogo" : "Inventario"} />
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Animated background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/30 to-transparent blur-3xl animate-blob-slow" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-violet-600/30 to-transparent blur-3xl animate-blob-slower" />
          <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-purple-600/20 to-transparent blur-3xl animate-blob-slowest" />
        </div>

        <div className="max-w-[1600px] mx-auto space-y-8 relative z-10">
          {/* Header Section */}
          {user?.role === 'Administrador' && <AdminValidationBar />}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                {user?.role === "Técnico" ? "Catálogo de Productos" : "Gestión de Inventario"}
              </h2>
              <p className="text-slate-400 text-sm">Control completo de stock, movimientos y reservas</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-indigo-600 hover:bg-indigo-700"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Carrito
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-slate-950">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* KPIs Section */}
          <section className="space-y-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1">Estado del Inventario</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Critical Stock Alert */}
              <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/10 group cursor-pointer h-32">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-2xl group-hover:from-red-500/20 transition-all duration-500" />
                <div className="relative h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Stock Crítico</div>
                    <div className="p-2 rounded-lg bg-red-500/10 ring-1 ring-red-500/20">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-100">{stats.criticalStock.length}</div>
                    <div className="text-xs text-red-400 flex items-center gap-1 font-medium mt-1">
                      <AlertTriangle className="h-3 w-3" />
                      Requiere compra urgente
                    </div>
                  </div>
                </div>
              </Card>

              {/* Low Stock Alert */}
              <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/10 group cursor-pointer h-32">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-2xl group-hover:from-yellow-500/20 transition-all duration-500" />
                <div className="relative h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Stock Bajo</div>
                    <div className="p-2 rounded-lg bg-yellow-500/10 ring-1 ring-yellow-500/20">
                      <Package className="h-4 w-4 text-yellow-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-100">{stats.lowStock.length}</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Próximos a agotar</div>
                  </div>
                </div>
              </Card>

              {/* Reserved Stock */}
              <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 group cursor-pointer h-32">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:from-purple-500/20 transition-all duration-500" />
                <div className="relative h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Stock Reservado</div>
                    <div className="p-2 rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                      <Lock className="h-4 w-4 text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-100">{stats.totalReserved}</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Unidades en OS activas</div>
                  </div>
                </div>
              </Card>

              {/* Most Used */}
              <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10 group cursor-pointer h-32">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl group-hover:from-indigo-500/20 transition-all duration-500" />
                <div className="relative h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Más Utilizados</div>
                    <div className="p-2 rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20">
                      <TrendingUp className="h-4 w-4 text-indigo-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-100">{stats.mostUsed.length}</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Productos top este mes</div>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Search & Filters Section */}
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="flex flex-col gap-4">
              {/* Search Bar - Full Width */}
              <div className="relative w-full">
                <label className="text-xs text-slate-400 font-medium mb-1.5 block ml-1">Buscar productos</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar por SKU, nombre, marca..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                    className="pl-10 h-11 bg-slate-900/60 border-slate-700/60 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 w-full rounded-xl transition-all"
                  />
                </div>
              </div>

              {/* Filters & Actions Container */}
              <div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center justify-between bg-slate-900/40 p-4 rounded-xl border border-white/5">
                {/* Filters Group */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                    <Filter className="h-4 w-4" />
                    <span>Filtros:</span>
                  </div>

                  <Select value={filters.estado} onValueChange={(value: any) => setFilters({ ...filters, estado: value })}>
                    <SelectTrigger className="h-9 w-[140px] bg-slate-800/60 border-slate-700 text-slate-300 text-xs">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="all" className="text-slate-300 text-xs">Todos los estados</SelectItem>
                      <SelectItem value="OK" className="text-slate-300 text-xs">Stock OK</SelectItem>
                      <SelectItem value="Bajo" className="text-slate-300 text-xs">Stock Bajo</SelectItem>
                      <SelectItem value="Crítico" className="text-slate-300 text-xs">Stock Crítico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions Group */}
                <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                  {!isReadOnly && (
                    <>
                      <Button
                        size="sm"
                        className="h-9 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-lg shadow-indigo-600/20"
                        onClick={() => setIsNewProductOpen(true)}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Nuevo Producto
                      </Button>
                      <Button
                        size="sm"
                        className="h-9 bg-green-600/90 hover:bg-green-500 text-white text-xs font-medium shadow-lg shadow-green-600/20"
                        onClick={() => {
                          setAdjustmentMode('Entrada')
                          setIsAdjustmentOpen(true)
                        }}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Entrada
                      </Button>
                      <Button
                        size="sm"
                        className="h-9 bg-red-600/90 hover:bg-red-500 text-white text-xs font-medium shadow-lg shadow-red-600/20"
                        onClick={() => {
                          setAdjustmentMode('Salida')
                          setIsAdjustmentOpen(true)
                        }}
                      >
                        <Minus className="h-3.5 w-3.5 mr-1.5" />
                        Salida
                      </Button>
                    </>
                  )}

                  {isReadOnly && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium"
                        onClick={() => setIsHistoryOpen(true)}
                      >
                        <History className="h-3.5 w-3.5 mr-1.5" />
                        Historial
                      </Button>

                      <Button
                        size="sm"
                        className="h-9 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-lg shadow-indigo-600/20"
                        onClick={() => setIsRequestDialogOpen(true)}
                      >
                        <Box className="h-3.5 w-3.5 mr-1.5" />
                        Solicitar
                      </Button>
                    </>
                  )}

                  {!isReadOnly && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-xs font-medium"
                      onClick={() => setIsPendingRequestsOpen(true)}
                    >
                      <Bell className="h-3.5 w-3.5 mr-1.5" />
                      Solicitudes
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Layout */}
          <div className="h-[calc(100vh-450px)] min-h-[500px] animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Tabs defaultValue="refacciones" className="h-full flex flex-col">
              <TabsList className="bg-slate-900/60 border border-white/5 p-1 w-fit mb-4">
                <TabsTrigger value="refacciones" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 text-xs px-4 py-2">
                  <Package className="h-3.5 w-3.5 mr-2" />
                  Refacciones
                </TabsTrigger>
                <TabsTrigger value="servicios" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 text-xs px-4 py-2">
                  <Settings className="h-3.5 w-3.5 mr-2" />
                  Servicios
                </TabsTrigger>
                <TabsTrigger value="software" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400 text-xs px-4 py-2">
                  <Disc className="h-3.5 w-3.5 mr-2" />
                  Software
                </TabsTrigger>
              </TabsList>

              <TabsContent value="refacciones" className="flex-1 h-full mt-0">
                <InventoryTable
                  title="Refacciones (Hardware)"
                  products={filteredProducts.filter(p => p.categoria !== 'Servicio' && p.categoria !== 'Software')}
                  loading={loading}
                  isReadOnly={isReadOnly}
                  onAddToCart={handleAddToCart}
                  onViewDetails={(p) => {
                    setSelectedProduct(p)
                    setIsDetailsOpen(true)
                  }}
                  className="h-full"
                />
              </TabsContent>

              <TabsContent value="servicios" className="flex-1 h-full mt-0">
                <InventoryTable
                  title="Servicios"
                  products={filteredProducts.filter(p => p.categoria === 'Servicio')}
                  loading={loading}
                  isReadOnly={isReadOnly}
                  onAddToCart={() => { }} // No-op for services
                  onViewDetails={(p) => {
                    setSelectedProduct(p)
                    setIsDetailsOpen(true)
                  }}
                  className="h-full"
                />
              </TabsContent>

              <TabsContent value="software" className="flex-1 h-full mt-0">
                <InventoryTable
                  title="Software"
                  products={filteredProducts.filter(p => p.categoria === 'Software')}
                  loading={loading}
                  isReadOnly={isReadOnly}
                  onAddToCart={handleAddToCart}
                  onViewDetails={(p) => {
                    setSelectedProduct(p)
                    setIsDetailsOpen(true)
                  }}
                  className="h-full"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Product Details Modal */}
      <ProductDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        product={selectedProduct}
      />

      <RequestMaterialDialog
        open={isRequestDialogOpen}
        onOpenChange={setIsRequestDialogOpen}
      />

      <PendingRequestsDialog
        open={isPendingRequestsOpen}
        onOpenChange={setIsPendingRequestsOpen}
      />

      <InventoryAdjustmentDialog
        open={isAdjustmentOpen}
        onOpenChange={setIsAdjustmentOpen}
        mode={adjustmentMode}
        products={productos}
        onSuccess={fetchProductos}
      />

      <NewProductDialog
        open={isNewProductOpen}
        onOpenChange={setIsNewProductOpen}
        onSuccess={fetchProductos}
      />

      <WithdrawalTicketDialog
        open={isTicketDialogOpen}
        onOpenChange={setIsTicketDialogOpen}
        ticket={currentTicket}
      />

      <TicketHistoryDialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        usuarioId={user?.id}
        onSelectTicket={(ticket) => {
          setCurrentTicket(ticket)
          setIsTicketDialogOpen(true)
        }}
      />

      <InventoryCart
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
        loading={isCheckoutLoading}
      />
    </>
  )
}

interface InventoryTableProps {
  title: string
  products: Producto[]
  loading: boolean
  isReadOnly: boolean
  onAddToCart: (product: Producto) => void
  onViewDetails: (product: Producto) => void
  className?: string
}

function InventoryTable({
  title,
  products,
  loading,
  isReadOnly,
  onAddToCart,
  onViewDetails,
  className
}: InventoryTableProps) {
  return (
    <Card className={`bg-slate-900/60 backdrop-blur-sm border-white/5 flex flex-col overflow-hidden shadow-xl ${className}`}>
      <div className="overflow-auto flex-1 relative">
        <Table>
          <TableHeader className="sticky top-0 bg-slate-900/95 backdrop-blur-md z-10 shadow-sm">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-slate-400 text-[11px] font-bold uppercase tracking-wider w-[35%] py-4">Producto</TableHead>
              <TableHead className="text-slate-400 text-[11px] font-bold uppercase tracking-wider w-[15%]">Marca</TableHead>
              <TableHead className="text-slate-400 text-[11px] font-bold uppercase tracking-wider w-[15%]">SKU</TableHead>
              <TableHead className="text-slate-400 text-[11px] font-bold uppercase tracking-wider text-right w-[10%]">Precio</TableHead>
              <TableHead className="text-slate-400 text-[11px] font-bold uppercase tracking-wider text-center w-[10%]">Total</TableHead>
              <TableHead className="text-slate-400 text-[11px] font-bold uppercase tracking-wider text-center w-[10%]">Disp.</TableHead>
              <TableHead className="text-slate-400 text-[11px] font-bold uppercase tracking-wider text-right w-[5%]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-400 py-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    <span className="text-xs">Cargando inventario...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-400 py-12">
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <Package className="h-10 w-10" />
                    <span className="text-sm">No se encontraron productos</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const disponible = product.stockActual - product.stockReservado
                const isService = product.categoria === 'Servicio'

                return (
                  <TableRow key={product.id} className="border-white/5 hover:bg-white/[0.02] text-slate-300 group transition-colors">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <ProductThumbnail categoria={product.categoria} nombre={product.nombre} />
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">
                            {product.nombre}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      {product.marca ? (
                        <Badge variant="outline" className="bg-slate-800/50 text-slate-400 border-slate-700/50 text-[10px] font-normal px-2 py-0.5">
                          {product.marca}
                        </Badge>
                      ) : (
                        <span className="text-slate-600 text-[11px]">-</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 font-mono text-[11px] text-slate-500">{product.sku}</TableCell>
                    <TableCell className="py-3 text-right text-[13px] font-semibold text-slate-200">
                      {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(product.precioVenta)}
                    </TableCell>
                    <TableCell className="py-3 text-center text-[13px] font-medium text-slate-400">
                      {isService ? "-" : product.stockActual}
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <span className={`text-[13px] font-bold ${!isService && disponible > 0 ? 'text-emerald-500' : 'text-slate-600'}`}>
                        {isService ? "-" : disponible}
                      </span>
                    </TableCell>

                    <TableCell className="py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-full"
                          onClick={() => onViewDetails(product)}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!isReadOnly && (
                          <Link href={`/dashboard/catalogo/${product.sku}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-full"
                              title="Editar producto"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        {!isService && product.stockActual > product.stockReservado && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-full"
                            onClick={() => onAddToCart(product)}
                            title="Agregar al carrito"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
