"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { OrderStateBadge } from "@/components/ordenes/order-state-badge"
import { OrderDetailsDialog } from "@/components/dashboard/order-details-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Wrench, Clock, Loader2, Eye } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import type { ServiceOrderState } from "@/lib/types/service-order"

type OrdenDB = {
    id: string
    folio: string
    estado: ServiceOrderState
    prioridad: string
    problemaReportado: string
    tipoServicio?: string
    createdAt: string
    cliente: { id: string; nombre: string; telefono: string }
    equipo: { id: string; tipo: string; marca: string; modelo: string }
    tecnico: { id: string; nombre: string } | null
    montoTotal?: number
    anticipo?: number
    saldoPendiente?: number
    tiempoReparacion?: string
    fechaCompletado?: string
    fechaEstimadaFin?: string
    diagnostico?: string
    cotizacion?: number
}

export default function MisOrdenesPage() {
    const { user } = useAuth()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [marcaFilter, setMarcaFilter] = useState("all")
    const [selectedOrder, setSelectedOrder] = useState<OrdenDB | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [ordenes, setOrdenes] = useState<OrdenDB[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        if (user) {
            loadOrdenes()
        }
    }, [user])

    const loadOrdenes = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/ordenes', { cache: 'no-store' })
            if (res.ok) {
                const data = await res.json()
                // Filter for current technician
                const myOrders = data.filter((o: OrdenDB) => o.tecnico?.id === user?.id)
                setOrdenes(myOrders)
            }
        } catch (error) {
            console.error('Error al cargar órdenes:', error)
            toast({
                title: "Error",
                description: "No se pudieron cargar las órdenes",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const filteredOrders = ordenes.filter((order) => {
        const matchesSearch =
            order.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.equipo.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.problemaReportado.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || order.estado === statusFilter
        const matchesMarca = marcaFilter === "all" || order.equipo.marca === marcaFilter

        return matchesSearch && matchesStatus && matchesMarca
    })

    if (!user) return null

    if (loading) {
        return (
            <>
                <DashboardHeader title="Mis Órdenes" />
                <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-400">Cargando tus órdenes...</p>
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <DashboardHeader title="Mis Órdenes" />
            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    <Card className="bg-slate-900/50 border-slate-800 p-6 backdrop-blur-sm">
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                <Input
                                    placeholder="Buscar por folio, cliente, equipo o diagnóstico..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-11 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 h-11"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100">
                                        <Filter className="h-4 w-4 mr-2 text-slate-400" />
                                        <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        <SelectItem value="all">Todos los estados</SelectItem>
                                        <SelectItem value="En diagnóstico">En diagnóstico</SelectItem>
                                        <SelectItem value="En reparación">En reparación</SelectItem>
                                        <SelectItem value="Reparación terminada">Reparación terminada</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={marcaFilter} onValueChange={setMarcaFilter}>
                                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100">
                                        <Wrench className="h-4 w-4 mr-2 text-slate-400" />
                                        <SelectValue placeholder="Marca" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        <SelectItem value="all">Todas las marcas</SelectItem>
                                        <SelectItem value="HP">HP</SelectItem>
                                        <SelectItem value="Apple">Apple</SelectItem>
                                        <SelectItem value="Dell">Dell</SelectItem>
                                        <SelectItem value="Lenovo">Lenovo</SelectItem>
                                        <SelectItem value="ASUS">ASUS</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-800 hover:bg-slate-800/50">
                                        <TableHead className="text-slate-400 font-semibold">Folio</TableHead>
                                        <TableHead className="text-slate-400 font-semibold">Cliente</TableHead>
                                        <TableHead className="text-slate-400 font-semibold">Equipo</TableHead>
                                        <TableHead className="text-slate-400 font-semibold">Estado</TableHead>
                                        <TableHead className="text-slate-400 font-semibold">Diagnóstico</TableHead>
                                        <TableHead className="text-slate-400 font-semibold text-right">Total estimado</TableHead>
                                        <TableHead className="text-slate-400 font-semibold">Fecha Ingreso</TableHead>
                                        <TableHead className="text-slate-400 font-semibold text-center">Acción</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.length === 0 ? (
                                        <TableRow className="border-slate-800">
                                            <TableCell colSpan={8} className="text-center text-slate-400 py-12">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Filter className="h-12 w-12 text-slate-600" />
                                                    <p className="text-lg">No tienes órdenes asignadas</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <TableRow key={order.folio} className="border-slate-800 hover:bg-slate-800/30 text-slate-300 transition-colors">
                                                <TableCell className="font-mono text-sm font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {order.folio}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{order.cliente.nombre}</TableCell>
                                                <TableCell>
                                                    <div className="space-y-0.5">
                                                        <div className="font-medium text-slate-200">{order.equipo.marca} {order.equipo.modelo}</div>
                                                        <div className="text-xs text-slate-500">{order.equipo.tipo}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <OrderStateBadge estado={order.estado} />
                                                </TableCell>
                                                <TableCell className="max-w-[250px]">
                                                    <div className="text-sm text-slate-400 truncate" title={order.problemaReportado}>
                                                        {order.problemaReportado}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    <span className="text-slate-500">
                                                        {order.montoTotal ? `$${order.montoTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` : 'Pendiente'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-slate-500 text-sm">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {new Date(order.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        size="sm"
                                                        className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-600/30"
                                                        onClick={() => {
                                                            setSelectedOrder(order)
                                                            setIsDetailsOpen(true)
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1.5" />
                                                        Ver OS
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </main>

            <OrderDetailsDialog
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                order={selectedOrder ? {
                    id: selectedOrder.id,
                    folio: selectedOrder.folio,
                    cliente: selectedOrder.cliente.nombre,
                    clienteTelefono: selectedOrder.cliente.telefono,
                    equipo: `${selectedOrder.equipo.tipo}`,
                    equipoMarca: selectedOrder.equipo.marca,
                    equipoModelo: selectedOrder.equipo.modelo,
                    problemaReportado: selectedOrder.problemaReportado,
                    estado: selectedOrder.estado,
                    tipoServicio: selectedOrder.tipoServicio,
                    tecnico: selectedOrder.tecnico?.nombre || 'Sin asignar',
                    fecha: new Date(selectedOrder.createdAt).toLocaleDateString('es-MX'),
                    importe: selectedOrder.montoTotal,
                    anticipo: selectedOrder.anticipo,
                    saldoPendiente: selectedOrder.saldoPendiente,
                    tiempoReparacion: selectedOrder.tiempoReparacion || 'No definido',
                    fechaEstimada: selectedOrder.fechaEstimadaFin ? new Date(selectedOrder.fechaEstimadaFin).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }) : undefined,
                    diagnostico: selectedOrder.diagnostico || undefined,
                    cotizacion: selectedOrder.cotizacion ? Number(selectedOrder.cotizacion) : undefined,
                } : null}
                onStatusChange={async (newStatus) => {
                    if (!selectedOrder) return
                    await loadOrdenes()
                    setIsDetailsOpen(false)
                    setSelectedOrder(null)
                }}
            />
        </>
    )
}
