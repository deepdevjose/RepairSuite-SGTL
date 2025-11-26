"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { OrderStateBadge } from "@/components/ordenes/order-state-badge"
import { OrderDetailsDialog } from "@/components/ordenes/order-details-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, Wrench, Package, CheckCircle, AlertCircle } from "lucide-react"
import { mockServiceOrders } from "@/lib/data/service-orders-mock"
import type { ServiceOrder } from "@/lib/types/service-order"

export default function MisOrdenesPage() {
    const { hasPermission } = useAuth()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    // In a real app, get current technician from auth context
    const currentTechnicianName = "Carlos Gómez"

    if (!hasPermission("ordenes")) {
        return (
            <>
                <DashboardHeader title="Mis Órdenes de Servicio" />
                <AccessDenied />
            </>
        )
    }

    // Filter orders assigned to current technician
    const myOrders = mockServiceOrders.filter(
        (order) => order.tecnicoAsignadoNombre === currentTechnicianName
    )

    // Categorize orders by state
    const pendingDiagnosis = myOrders.filter((o) => o.estado === "Esperando diagnóstico")
    const inDiagnosis = myOrders.filter((o) => o.estado === "En diagnóstico")
    const diagnosisComplete = myOrders.filter((o) => o.estado === "Diagnóstico terminado")
    const inRepair = myOrders.filter((o) => o.estado === "En reparación")
    const completed = myOrders.filter(
        (o) =>
            o.estado === "Reparación terminada" ||
            o.estado === "Lista para entrega" ||
            o.estado === "Pagado y entregado"
    )

    const filteredOrders = (orders: ServiceOrder[]) => {
        if (!searchTerm) return orders
        return orders.filter(
            (order) =>
                order.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.equipoTipo.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    const OrderCard = ({ order }: { order: ServiceOrder }) => (
        <Card
            className="bg-slate-800/50 border-slate-700 p-5 hover:bg-slate-800/70 transition-all cursor-pointer"
            onClick={() => {
                setSelectedOrder(order)
                setIsDetailsOpen(true)
            }}
        >
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="font-mono font-semibold text-slate-100">{order.folio}</div>
                        <div className="text-sm text-slate-400">{order.clienteNombre}</div>
                    </div>
                    <OrderStateBadge estado={order.estado} />
                </div>

                {/* Equipment */}
                <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-300">
                        {order.equipoTipo} - {order.equipoMarca} {order.equipoModelo}
                    </span>
                </div>

                {/* Problem */}
                <div className="text-sm text-slate-400 line-clamp-2">
                    {order.diagnostico?.problema || order.problemaReportado}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {new Date(order.ultimaActualizacion).toLocaleString("es-MX", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                    {order.diagnostico && (
                        <div className="text-sm font-medium text-emerald-400">
                            ${(order.costoDiagnostico + order.costoReparacion).toLocaleString()}
                        </div>
                    )}
                </div>

                {/* Pending materials indicator */}
                {order.estado === "Diagnóstico terminado" && (
                    <div className="flex items-center gap-2 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded text-xs text-indigo-400">
                        <AlertCircle className="h-3 w-3" />
                        Completar detalles y cotización
                    </div>
                )}
            </div>
        </Card>
    )

    return (
        <>
            <DashboardHeader title="Mis Órdenes de Servicio" />
            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    {/* Stats */}
                    <div className="grid gap-4 md:grid-cols-5">
                        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 p-5">
                            <div className="text-sm text-blue-300 font-medium">Esperando diagnóstico</div>
                            <div className="text-3xl font-bold text-blue-400 mt-1">{pendingDiagnosis.length}</div>
                        </Card>
                        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 p-5">
                            <div className="text-sm text-purple-300 font-medium">En diagnóstico</div>
                            <div className="text-3xl font-bold text-purple-400 mt-1">{inDiagnosis.length}</div>
                        </Card>
                        <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 p-5">
                            <div className="text-sm text-indigo-300 font-medium">Diagnóstico completo</div>
                            <div className="text-3xl font-bold text-indigo-400 mt-1">{diagnosisComplete.length}</div>
                        </Card>
                        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20 p-5">
                            <div className="text-sm text-orange-300 font-medium">En reparación</div>
                            <div className="text-3xl font-bold text-orange-400 mt-1">{inRepair.length}</div>
                        </Card>
                        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 p-5">
                            <div className="text-sm text-green-300 font-medium">Completadas</div>
                            <div className="text-3xl font-bold text-green-400 mt-1">{completed.length}</div>
                        </Card>
                    </div>

                    {/* Search */}
                    <Card className="bg-slate-900/50 border-slate-800 p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                            <Input
                                placeholder="Buscar por folio, cliente o equipo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
                            />
                        </div>
                    </Card>

                    {/* Tabs */}
                    <Tabs defaultValue="pending" className="space-y-4">
                        <TabsList className="bg-slate-900/50 border border-slate-800">
                            <TabsTrigger value="pending" className="data-[state=active]:bg-slate-800">
                                <Clock className="h-4 w-4 mr-2" />
                                Por diagnosticar ({pendingDiagnosis.length})
                            </TabsTrigger>
                            <TabsTrigger value="diagnosis" className="data-[state=active]:bg-slate-800">
                                <Wrench className="h-4 w-4 mr-2" />
                                En diagnóstico ({inDiagnosis.length})
                            </TabsTrigger>
                            <TabsTrigger value="complete" className="data-[state=active]:bg-slate-800">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Diagnóstico completo ({diagnosisComplete.length})
                            </TabsTrigger>
                            <TabsTrigger value="repair" className="data-[state=active]:bg-slate-800">
                                <Wrench className="h-4 w-4 mr-2" />
                                En reparación ({inRepair.length})
                            </TabsTrigger>
                            <TabsTrigger value="completed" className="data-[state=active]:bg-slate-800">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Completadas ({completed.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending" className="space-y-4">
                            {filteredOrders(pendingDiagnosis).length === 0 ? (
                                <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
                                    <Clock className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-400">No hay órdenes esperando diagnóstico</p>
                                </Card>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredOrders(pendingDiagnosis).map((order) => (
                                        <OrderCard key={order.id} order={order} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="diagnosis" className="space-y-4">
                            {filteredOrders(inDiagnosis).length === 0 ? (
                                <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
                                    <Wrench className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-400">No hay órdenes en diagnóstico</p>
                                </Card>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredOrders(inDiagnosis).map((order) => (
                                        <OrderCard key={order.id} order={order} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="complete" className="space-y-4">
                            {filteredOrders(diagnosisComplete).length === 0 ? (
                                <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
                                    <CheckCircle className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-400">No hay órdenes con diagnóstico completo</p>
                                </Card>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredOrders(diagnosisComplete).map((order) => (
                                        <OrderCard key={order.id} order={order} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="repair" className="space-y-4">
                            {filteredOrders(inRepair).length === 0 ? (
                                <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
                                    <Wrench className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-400">No hay órdenes en reparación</p>
                                </Card>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredOrders(inRepair).map((order) => (
                                        <OrderCard key={order.id} order={order} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="completed" className="space-y-4">
                            {filteredOrders(completed).length === 0 ? (
                                <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
                                    <CheckCircle className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-400">No hay órdenes completadas</p>
                                </Card>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredOrders(completed).map((order) => (
                                        <OrderCard key={order.id} order={order} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {/* Order Details Dialog */}
            <OrderDetailsDialog
                order={selectedOrder}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                userRole="Técnico"
            />
        </>
    )
}
