"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Package, User, Wrench, Clock, DollarSign, Activity, AlertTriangle, Trash2, RefreshCw } from "lucide-react"
import { BadgeStatus } from "@/components/badge-status"
import { PaymentDialog } from "./payment-dialog"
import { DateTimePicker } from "@/components/ui/date-time-picker"

interface OrderDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    order: any | null
    onStatusChange?: (newStatus: string) => void
}

export function OrderDetailsDialog({ open, onOpenChange, order, onStatusChange }: OrderDetailsDialogProps) {
    const { toast } = useToast()
    const { user } = useAuth()
    const [selectedStatus, setSelectedStatus] = useState<string>("")
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)

    const [isTimeEstimationOpen, setIsTimeEstimationOpen] = useState(false)
    const [pendingStatus, setPendingStatus] = useState<string | null>(null)

    const [isDiagnosisCompletionOpen, setIsDiagnosisCompletionOpen] = useState(false)
    const [diagnosisData, setDiagnosisData] = useState({
        diagnostico: "",
        cotizacion: "",
        fechaEstimada: undefined as Date | undefined
    })

    // Delete state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [adminPassword, setAdminPassword] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)

    // Time Estimation State
    const [estimatedDate, setEstimatedDate] = useState<Date | undefined>(undefined)

    if (!order) return null

    const handleStatusChange = async (newStatus?: string) => {
        const statusToUpdate = newStatus || selectedStatus

        if (statusToUpdate === order.estado) {
            toast({
                title: "Sin cambios",
                description: "El estado seleccionado es el mismo que el actual",
                variant: "destructive",
            })
            return
        }

        // Intercept "Diagnóstico terminado" to show completion dialog
        if (statusToUpdate === "Diagnóstico terminado") {
            setPendingStatus(statusToUpdate)
            setIsDiagnosisCompletionOpen(true)
            return
        }

        // Check if we need to ask for estimated time
        // Only for technicians/admins when moving to "En diagnóstico" or "En reparación"
        // and if it's a specific service type that requires time estimation
        const isTechOrAdmin = user?.role === 'Técnico' || user?.role === 'Administrador'
        const requiresTime = ['En diagnóstico', 'En reparación'].includes(statusToUpdate)

        if (isTechOrAdmin && requiresTime && !order.fechaEstimada) {
            setPendingStatus(statusToUpdate)
            setIsTimeEstimationOpen(true)
            return
        }

        await updateOrderStatus(statusToUpdate)
    }

    const updateOrderStatus = async (status: string, additionalData?: any) => {
        try {
            const body: any = { estado: status, ...additionalData }

            const response = await fetch(`/api/ordenes/${order.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                throw new Error('Error al actualizar el estado')
            }

            onStatusChange?.(status)
            toast({
                title: "Estado actualizado",
                description: `El estado de la orden ${order.folio} ha sido cambiado a: ${status}`,
            })
            setIsTimeEstimationOpen(false)
            setIsDiagnosisCompletionOpen(false)
        } catch (error) {
            console.error('Error updating status:', error)
            toast({
                title: "Error",
                description: "No se pudo actualizar el estado de la orden",
                variant: "destructive",
            })
        }
    }

    const handleTimeSubmit = () => {
        if (!pendingStatus) return
        if (!estimatedDate) {
            toast({
                title: "Fecha requerida",
                description: "Por favor selecciona una fecha y hora estimada de entrega.",
                variant: "destructive",
            })
            return
        }

        updateOrderStatus(pendingStatus, { fechaEstimadaFin: estimatedDate.toISOString() })
    }

    const handleDiagnosisSubmit = () => {
        if (!pendingStatus) return
        if (!diagnosisData.diagnostico || !diagnosisData.cotizacion || !diagnosisData.fechaEstimada) {
            toast({
                title: "Campos requeridos",
                description: "Por favor completa todos los campos del diagnóstico.",
                variant: "destructive",
            })
            return
        }

        // Calculate hours difference for backward compatibility or just store the date
        const now = new Date()
        const diffInHours = Math.max(1, Math.ceil((diagnosisData.fechaEstimada.getTime() - now.getTime()) / (1000 * 60 * 60)))

        updateOrderStatus(pendingStatus, {
            diagnostico: diagnosisData.diagnostico,
            cotizacion: parseFloat(diagnosisData.cotizacion),
            tiempoEstimado: diffInHours, // Keep storing hours for legacy/other logic if needed
            fechaEstimadaFin: diagnosisData.fechaEstimada.toISOString()
        })
    }

    const handlePaymentSuccess = () => {
        setIsPaymentDialogOpen(false)
        handleStatusChange("Pagado y entregado")
    }

    const handleDelete = async () => {
        if (!adminPassword) {
            toast({
                title: "Contraseña requerida",
                description: "Por favor ingresa la contraseña de administrador",
                variant: "destructive",
            })
            return
        }

        setIsDeleting(true)
        try {
            const orderId = order.id

            if (!orderId) {
                throw new Error("ID de orden no encontrado")
            }

            const response = await fetch(`/api/ordenes/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: adminPassword }),
            })

            if (response.status === 401) {
                toast({
                    title: "Contraseña incorrecta",
                    description: "La contraseña de administrador no es válida",
                    variant: "destructive",
                })
                setIsDeleting(false)
                return
            }

            if (!response.ok) {
                throw new Error('Error al eliminar la orden')
            }

            toast({
                title: "Orden eliminada",
                description: "La orden de servicio ha sido eliminada permanentemente",
            })

            setIsDeleteDialogOpen(false)
            onOpenChange(false)
            if (onStatusChange) onStatusChange("Deleted")

        } catch (error) {
            console.error('Error deleting order:', error)
            toast({
                title: "Error",
                description: "No se pudo eliminar la orden",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
            setAdminPassword("")
        }
    }

    const estadosDisponibles = [
        "Esperando inicialización",
        "En diagnóstico",
        "Diagnóstico terminado",
        "Esperando aprobación",
        "Aprobada",
        "En reparación",
        "Reparación terminada",
        "Lista para entrega",
        "Pagado y entregado",
        "Cancelada",
    ]

    // Workflow Logic
    const getNextActions = () => {
        const actions = []
        const isTech = user?.role === 'Técnico'
        const isReception = user?.role === 'Recepción'
        const isAdmin = user?.role === 'Administrador'
        const isCatalogService = order.tipoServicio === 'servicio_especifico'

        // Technician Actions
        if (isTech || isAdmin) {
            if (order.estado === 'Esperando inicialización') {
                actions.push({
                    label: isCatalogService ? "Iniciar Servicio" : "Iniciar Diagnóstico",
                    status: "En diagnóstico",
                    variant: "default" as const
                })
            } else if (order.estado === 'En diagnóstico') {
                if (isCatalogService) {
                    actions.push({
                        label: "Terminar Servicio",
                        status: "Lista para entrega",
                        variant: "default" as const
                    })
                } else {
                    actions.push({
                        label: "Terminar Diagnóstico",
                        status: "Diagnóstico terminado",
                        variant: "default" as const
                    })
                }
            } else if (order.estado === 'Aprobada') {
                actions.push({
                    label: "Iniciar Reparación",
                    status: "En reparación",
                    variant: "default" as const
                })
            } else if (order.estado === 'En reparación') {
                actions.push({
                    label: "Terminar Reparación",
                    status: "Reparación terminada",
                    variant: "default" as const
                })
            } else if (order.estado === 'Reparación terminada') {
                actions.push({
                    label: "Validar y Enviar a Entrega",
                    status: "Lista para entrega",
                    variant: "default" as const
                })
            }
        }

        // Reception Actions
        if (isReception || isAdmin) {
            if (order.estado === 'Diagnóstico terminado') {
                actions.push({
                    label: "Aprobar (Cliente)",
                    status: "Aprobada",
                    variant: "default" as const
                })
                actions.push({
                    label: "Rechazar (Cliente)",
                    status: "Cancelada",
                    variant: "destructive" as const
                })
            } else if (order.estado === 'Lista para entrega') {
                actions.push({
                    label: "Entregar y Cobrar",
                    status: "Pagado y entregado",
                    variant: "success" as const
                })
            } else if (order.estado === 'Esperando aprobación') {
                actions.push({
                    label: "Aprobar (Cliente)",
                    status: "Aprobada",
                    variant: "default" as const
                })
                actions.push({
                    label: "Rechazar (Cliente)",
                    status: "Cancelada",
                    variant: "destructive" as const
                })
            }
        }

        return actions
    }

    const nextActions = getNextActions()

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                            <Package className="h-5 w-5 text-indigo-400" />
                            Detalles de Orden
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-2xl font-bold text-indigo-400 font-mono">{order.folio}</p>
                                <p className="text-sm text-slate-400 mt-1">Orden de Servicio {order.tipoServicio ? `(${order.tipoServicio})` : ''}</p>
                            </div>
                            <BadgeStatus status={order.estado} />
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Workflow Actions */}
                        {nextActions.length > 0 && (
                            <div className="space-y-3 bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20">
                                <h3 className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    Siguientes Acciones
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {nextActions.map((action, idx) => (
                                        <Button
                                            key={idx}
                                            onClick={() => {
                                                if (action.status === "Pagado y entregado") {
                                                    setIsPaymentDialogOpen(true)
                                                } else {
                                                    handleStatusChange(action.status)
                                                }
                                            }}
                                            variant={action.variant === 'success' ? 'default' : action.variant}
                                            className={action.variant === 'success' ? 'bg-emerald-600 hover:bg-emerald-500' : ''}
                                        >
                                            {action.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Manual State Change (Admin only or fallback) */}
                        {(user?.role === 'Administrador') && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4" />
                                    Cambio Manual de Estado (Admin)
                                </h3>
                                <div className="flex items-center gap-3 pl-6">
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger className="flex-1 bg-slate-800/40 border-slate-700 text-slate-100">
                                            <SelectValue placeholder="Seleccionar estado" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10">
                                            {estadosDisponibles.map((estado) => (
                                                <SelectItem
                                                    key={estado}
                                                    value={estado}
                                                    className="text-slate-300"
                                                >
                                                    {estado}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={() => handleStatusChange()}
                                        disabled={selectedStatus === order.estado}
                                        className="bg-slate-700 hover:bg-slate-600"
                                    >
                                        Actualizar
                                    </Button>
                                </div>
                            </div>
                        )}

                        <Separator className="bg-white/10" />

                        {/* Cliente */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Información del Cliente
                            </h3>
                            <div className="grid grid-cols-2 gap-4 pl-6">
                                <div>
                                    <p className="text-xs text-slate-500">Nombre</p>
                                    <p className="text-sm text-slate-200">{order.cliente}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Teléfono</p>
                                    <p className="text-sm text-slate-200">{order.clienteTelefono || 'No disponible'}</p>
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Equipo */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Equipo
                            </h3>
                            <div className="grid grid-cols-2 gap-4 pl-6">
                                <div>
                                    <p className="text-xs text-slate-500">Tipo</p>
                                    <p className="text-sm text-slate-200">{order.equipo}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Marca/Modelo</p>
                                    <p className="text-sm text-slate-200">{order.equipoMarca && order.equipoModelo ? `${order.equipoMarca} ${order.equipoModelo}` : order.equipo}</p>
                                </div>
                            </div>
                            <div className="pl-6">
                                <p className="text-xs text-slate-500">Problema Reportado</p>
                                <p className="text-sm text-slate-200">{order.problemaReportado || 'No especificado'}</p>
                            </div>
                        </div>

                        {order.diagnostico && (
                            <>
                                <Separator className="bg-white/10" />
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                        <Activity className="h-4 w-4" />
                                        Diagnóstico y Cotización
                                    </h3>
                                    <div className="pl-6 space-y-3">
                                        <div>
                                            <p className="text-xs text-slate-500">Diagnóstico Técnico</p>
                                            <p className="text-sm text-slate-200 whitespace-pre-wrap">{order.diagnostico}</p>
                                        </div>
                                        {order.cotizacion && (
                                            <div>
                                                <p className="text-xs text-slate-500">Cotización</p>
                                                <p className="text-lg font-semibold text-emerald-400">
                                                    ${Number(order.cotizacion).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        <Separator className="bg-white/10" />

                        {/* Asignación */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                <Wrench className="h-4 w-4" />
                                Asignación
                            </h3>
                            <div className="pl-6">
                                <div>
                                    <p className="text-xs text-slate-500">Técnico</p>
                                    <p className="text-sm text-slate-200">{order.tecnico}</p>
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Información Financiera */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Información Financiera
                            </h3>
                            <div className="grid grid-cols-3 gap-4 pl-6">
                                <div>
                                    <p className="text-xs text-slate-500">Importe Total</p>
                                    <p className="text-lg font-semibold text-emerald-400">
                                        ${(order.importe || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Anticipo</p>
                                    <p className="text-sm text-slate-200">${(order.anticipo || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Saldo</p>
                                    <p className="text-sm text-amber-400">
                                        ${(order.saldoPendiente || ((order.importe || 0) - (order.anticipo || 0))).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Tiempos */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Tiempos
                            </h3>
                            <div className="grid grid-cols-3 gap-4 pl-6">
                                <div>
                                    <p className="text-xs text-slate-500">Fecha Ingreso</p>
                                    <p className="text-sm text-slate-200">{order.fecha}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Tiempo Reparación</p>
                                    <p className="text-sm text-slate-200">{order.tiempoReparacion}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Fecha Estimada</p>
                                    <p className="text-sm text-slate-200">{order.fechaEstimada || 'No definida'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Delete Button (Admin & Recepción) */}
                        {(user?.role === 'Administrador' || user?.role === 'Recepción') && (
                            <>
                                <Separator className="bg-white/10" />
                                <div className="flex justify-end pt-2">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Eliminar Orden
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Diagnosis Completion Dialog */}
            <Dialog open={isDiagnosisCompletionOpen} onOpenChange={setIsDiagnosisCompletionOpen}>
                <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                            <Activity className="h-5 w-5 text-indigo-400" />
                            Completar Diagnóstico
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Por favor ingresa los detalles del diagnóstico, la cotización y la fecha estimada de entrega.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                                Diagnóstico Técnico
                            </label>
                            <textarea
                                value={diagnosisData.diagnostico}
                                onChange={(e) => setDiagnosisData({ ...diagnosisData, diagnostico: e.target.value })}
                                className="w-full h-24 bg-slate-800 border-slate-700 text-slate-100 rounded-md p-2 text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="Describe el problema encontrado y la solución propuesta..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">
                                    Costo de Reparación ($)
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={diagnosisData.cotizacion}
                                    onChange={(e) => setDiagnosisData({ ...diagnosisData, cotizacion: e.target.value })}
                                    className="bg-slate-800 border-slate-700 text-slate-100"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">
                                    Fecha Estimada de Entrega
                                </label>
                                <DateTimePicker
                                    date={diagnosisData.fechaEstimada}
                                    setDate={(date) => setDiagnosisData({ ...diagnosisData, fechaEstimada: date })}
                                    minDate={new Date()}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setIsDiagnosisCompletionOpen(false)}
                            className="text-slate-400 hover:text-slate-300"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleDiagnosisSubmit}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            Guardar Diagnóstico
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Time Estimation Dialog */}
            <Dialog open={isTimeEstimationOpen} onOpenChange={setIsTimeEstimationOpen}>
                <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-indigo-400" />
                            Fecha Estimada de Entrega
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Por favor indica la fecha y hora en que estimas completar este servicio.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <DateTimePicker
                            date={estimatedDate}
                            setDate={setEstimatedDate}
                            minDate={new Date()}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setIsTimeEstimationOpen(false)}
                            className="text-slate-400 hover:text-slate-300"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleTimeSubmit}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-red-400">
                            <AlertTriangle className="h-5 w-5" />
                            Confirmar Eliminación
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Esta acción no se puede deshacer. Se eliminará permanentemente la orden de servicio y todos los datos asociados.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                                Contraseña de Administrador
                            </label>
                            <Input
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                                placeholder="Ingresa tu contraseña"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsDeleteDialogOpen(false)
                                setAdminPassword("")
                            }}
                            className="text-slate-400 hover:text-slate-300"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={!adminPassword || isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Eliminando..." : "Eliminar Orden"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <PaymentDialog
                open={isPaymentDialogOpen}
                onOpenChange={setIsPaymentDialogOpen}
                initialOrderId={order.id}
                initialAmount={order.saldoPendiente || order.importe || 0}
                onSave={handlePaymentSuccess}
            />
        </>
    )
}
