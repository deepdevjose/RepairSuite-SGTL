"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { StockBadge } from "@/components/inventory/stock-badge"
import { ProductThumbnail } from "@/components/inventory/product-thumbnail"
import { MovementTypeBadge } from "@/components/inventory/movement-type-badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ArrowLeft,
    Package,
    Building2,
    DollarSign,
    MapPin,
    Calendar,
    Edit,
    Settings,
    ArrowLeftRight,
    ShoppingCart,
    Download,
    Lock,
    User,
    FileText,
} from "lucide-react"
import { getProductBySku, getMovementsBySku, getReservationsBySku } from "@/lib/data/inventory-mock"
import { getStockStatus, calculateAvailableStock, formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils/inventory-helpers"

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { hasPermission, user } = useAuth()
    const [activeTab, setActiveTab] = useState("info")

    const sku = params.sku as string
    const product = getProductBySku(sku)
    const movements = getMovementsBySku(sku)
    const reservations = getReservationsBySku(sku)

    if (!hasPermission("inventario")) {
        return (
            <>
                <DashboardHeader title="Detalle de Producto" />
                <AccessDenied />
            </>
        )
    }

    if (!product) {
        return (
            <>
                <DashboardHeader title="Detalle de Producto" />
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-12">
                            <div className="flex flex-col items-center justify-center text-center">
                                <Package className="h-16 w-16 text-slate-700 mb-4" />
                                <h2 className="text-2xl font-bold text-slate-300 mb-2">Producto no encontrado</h2>
                                <p className="text-slate-500 mb-6">El SKU "{sku}" no existe en el inventario</p>
                                <Button onClick={() => router.push("/dashboard/inventario")} className="bg-indigo-600 hover:bg-indigo-500">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Volver al inventario
                                </Button>
                            </div>
                        </Card>
                    </div>
                </main>
            </>
        )
    }

    const isReadOnly = user?.role === "Técnico"
    const status = getStockStatus(product.stockTotal, product.stockMinimo)
    const disponible = calculateAvailableStock(product.stockTotal, product.stockReservado)

    return (
        <>
            <DashboardHeader title="Detalle de Producto" />
            <main className="flex-1 overflow-y-auto p-8 relative">
                {/* Animated background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/30 to-transparent blur-3xl animate-blob-slow" />
                    <div className="absolute bottom-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-violet-600/30 to-transparent blur-3xl animate-blob-slower" />
                </div>

                <div className="max-w-7xl mx-auto space-y-6 relative z-10">
                    {/* Back Button */}
                    <div className="animate-fade-in-up">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/dashboard/inventario")}
                            className="text-slate-400 hover:text-slate-300 hover:bg-white/5"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver al inventario
                        </Button>
                    </div>

                    {/* Product Header */}
                    <Card
                        className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-8 animate-fade-in-up"
                        style={{ animationDelay: "100ms" }}
                    >
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                                <ProductThumbnail categoria={product.categoria} imagen={product.imagen} nombre={product.nombre} size="lg" />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                            <h1 className="text-3xl font-bold text-slate-100 mb-2">{product.nombre}</h1>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-mono text-xs">
                                                    {product.sku}
                                                </Badge>
                                                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
                                                    {product.categoria}
                                                </Badge>
                                                <StockBadge status={status} />
                                            </div>
                                        </div>
                                        {!isReadOnly && (
                                            <Button className="bg-indigo-600 hover:bg-indigo-500">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Editar
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Stock Total</div>
                                        <div className="text-2xl font-bold text-slate-100">{product.stockTotal}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Reservado</div>
                                        <div className="text-2xl font-bold text-purple-400">{product.stockReservado}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Disponible</div>
                                        <div className="text-2xl font-bold text-green-400">{disponible}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Stock Mínimo</div>
                                        <div className="text-2xl font-bold text-amber-400">{product.stockMinimo}</div>
                                    </div>
                                </div>

                                {product.marca && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-slate-500">Marca:</span>
                                        <span className="text-slate-300 font-medium">{product.marca}</span>
                                    </div>
                                )}

                                {product.compatibilidad && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-slate-500">Compatibilidad:</span>
                                        <span className="text-slate-300">{product.compatibilidad}</span>
                                    </div>
                                )}

                                {product.especificaciones && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-slate-500">Especificaciones:</span>
                                        <span className="text-slate-300">{product.especificaciones}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Stock by Branch & Pricing */}
                    <div className="grid gap-6 md:grid-cols-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                        {/* Stock by Branch */}
                        <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-indigo-400" />
                                Stock por Sucursal
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-indigo-400" />
                                        <span className="text-sm font-medium text-slate-300">Sede A</span>
                                    </div>
                                    <span className="text-lg font-bold text-slate-100">{product.stockPorSucursal.sedeA}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-400" />
                                        <span className="text-sm font-medium text-slate-300">Sede B</span>
                                    </div>
                                    <span className="text-lg font-bold text-slate-100">{product.stockPorSucursal.sedeB}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-purple-400" />
                                        <span className="text-sm font-medium text-slate-300">Sede C</span>
                                    </div>
                                    <span className="text-lg font-bold text-slate-100">{product.stockPorSucursal.sedeC}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Pricing & Location */}
                        <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-green-400" />
                                Precios y Ubicación
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-400">Precio de Venta</span>
                                    <span className="text-xl font-bold text-green-400">{formatCurrency(product.precioVenta)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-400">Costo Proveedor</span>
                                    <span className="text-lg font-semibold text-slate-300">{formatCurrency(product.costoProveedor)}</span>
                                </div>
                                <div className="h-px bg-slate-700/50" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-400">Margen</span>
                                    <span className="text-lg font-semibold text-indigo-400">
                                        {formatCurrency(product.precioVenta - product.costoProveedor)}
                                    </span>
                                </div>
                                <div className="h-px bg-slate-700/50" />
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm text-slate-400">Ubicación:</span>
                                    <span className="text-sm font-medium text-slate-300">{product.ubicacion}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm text-slate-400">Último movimiento:</span>
                                    <span className="text-sm font-medium text-slate-300">{formatRelativeTime(product.ultimoMovimiento)}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Actions */}
                    {!isReadOnly && (
                        <Card
                            className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6 animate-fade-in-up"
                            style={{ animationDelay: "300ms" }}
                        >
                            <div className="flex flex-wrap items-center gap-3">
                                <Button className="bg-indigo-600 hover:bg-indigo-500">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Ajustar Stock
                                </Button>
                                <Button className="bg-blue-600 hover:bg-blue-500">
                                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                                    Transferir
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-500">
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Generar Orden de Compra
                                </Button>
                                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-white/5">
                                    <Download className="h-4 w-4 mr-2" />
                                    Exportar Historial
                                </Button>
                            </div>
                        </Card>
                    )}

                    {/* Tabs: Movements & Reservations */}
                    <Card
                        className="bg-slate-900/60 backdrop-blur-sm border-white/5 animate-fade-in-up overflow-hidden"
                        style={{ animationDelay: "400ms" }}
                    >
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="border-b border-white/5 px-6">
                                <TabsList className="bg-transparent border-0 h-auto p-0">
                                    <TabsTrigger
                                        value="info"
                                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-4 py-3 text-slate-400 data-[state=active]:text-indigo-400"
                                    >
                                        Movimientos del Inventario
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="reservations"
                                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none px-4 py-3 text-slate-400 data-[state=active]:text-purple-400"
                                    >
                                        Reservas Activas ({reservations.length})
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="info" className="m-0 p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-white/5 hover:bg-transparent">
                                                <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                                    Fecha
                                                </TableHead>
                                                <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                                    Tipo
                                                </TableHead>
                                                <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-center">
                                                    Cantidad
                                                </TableHead>
                                                <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                                    Usuario
                                                </TableHead>
                                                <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                                    Sucursal
                                                </TableHead>
                                                <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                                    OS Relacionada
                                                </TableHead>
                                                <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                                    Notas
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {movements.map((mov, index) => (
                                                <TableRow
                                                    key={mov.id}
                                                    className="border-white/5 hover:bg-white/[0.02] text-slate-300 transition-all duration-150"
                                                    style={{
                                                        animation: "fadeInUp 0.3s ease-out forwards",
                                                        animationDelay: `${index * 30}ms`,
                                                        opacity: 0,
                                                    }}
                                                >
                                                    <TableCell className="text-[12px] text-slate-400">{formatDate(mov.fecha)}</TableCell>
                                                    <TableCell>
                                                        <MovementTypeBadge tipo={mov.tipo} />
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span
                                                            className={`text-[13px] font-semibold ${mov.cantidad > 0 ? "text-green-400" : "text-red-400"
                                                                }`}
                                                        >
                                                            {mov.cantidad > 0 ? "+" : ""}
                                                            {mov.cantidad}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-[13px] text-slate-300">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-3 w-3 text-slate-500" />
                                                            {mov.usuario}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-[13px] text-slate-400">{mov.sucursal}</TableCell>
                                                    <TableCell>
                                                        {mov.ordenServicioId ? (
                                                            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 font-mono text-[11px]">
                                                                {mov.ordenServicioId}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-[12px] text-slate-600">—</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-[12px] text-slate-500 max-w-xs truncate">
                                                        {mov.notas || "—"}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {movements.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <FileText className="h-12 w-12 text-slate-700 mb-3" />
                                            <p className="text-sm text-slate-500">No hay movimientos registrados para este producto</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="reservations" className="m-0 p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-white/5 hover:bg-transparent">
                                                <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                                    Folio OS
                                                </TableHead>
                                                <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                                    Cliente
                                                </TableHead>
                                                <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-center">
                                                    Cantidad
                                                </TableHead>
                                                <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                                    Sucursal
                                                </TableHead>
                                                <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                                    Fecha Reserva
                                                </TableHead>
                                                <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                                    Uso Estimado
                                                </TableHead>
                                                <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                                    Usuario
                                                </TableHead>
                                                {!isReadOnly && (
                                                    <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">
                                                        Acción
                                                    </TableHead>
                                                )}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reservations.map((res, index) => (
                                                <TableRow
                                                    key={res.id}
                                                    className="border-white/5 hover:bg-white/[0.02] text-slate-300 transition-all duration-150"
                                                    style={{
                                                        animation: "fadeInUp 0.3s ease-out forwards",
                                                        animationDelay: `${index * 30}ms`,
                                                        opacity: 0,
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 font-mono text-[11px]">
                                                            {res.folioOS}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-[13px] text-slate-300 font-medium">{res.cliente}</TableCell>
                                                    <TableCell className="text-center">
                                                        <span className="text-[13px] font-semibold text-purple-400">{res.cantidadReservada}</span>
                                                    </TableCell>
                                                    <TableCell className="text-[13px] text-slate-400">{res.sucursal}</TableCell>
                                                    <TableCell className="text-[12px] text-slate-400">{formatDate(res.fechaReserva)}</TableCell>
                                                    <TableCell className="text-[12px] text-slate-400">{formatDate(res.fechaEstimadaUso)}</TableCell>
                                                    <TableCell className="text-[13px] text-slate-400">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-3 w-3 text-slate-500" />
                                                            {res.usuario}
                                                        </div>
                                                    </TableCell>
                                                    {!isReadOnly && (
                                                        <TableCell className="text-right">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                            >
                                                                Liberar
                                                            </Button>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {reservations.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <Lock className="h-12 w-12 text-slate-700 mb-3" />
                                            <p className="text-sm text-slate-500">No hay reservas activas para este producto</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>
            </main>
        </>
    )
}
