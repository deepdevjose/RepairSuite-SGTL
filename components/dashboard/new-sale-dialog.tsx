"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2 } from "lucide-react"

interface NewSaleDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave?: (sale: any) => void
}

interface Cliente {
    id: string
    nombre: string
}

interface Producto {
    id: string
    sku: string
    nombre: string
    categoria: string
    tipo: string
    precioVenta: number
    stockActual: number
}

interface SaleItem {
    productoId: string
    cantidad: number
    precioUnitario: number
}

export function NewSaleDialog({ open, onOpenChange, onSave }: NewSaleDialogProps) {
    const { toast } = useToast()
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [productos, setProductos] = useState<Producto[]>([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        clienteId: "",
        metodoPago: "",
        notas: "",
    })

    const [items, setItems] = useState<SaleItem[]>([
        { productoId: "", cantidad: 1, precioUnitario: 0 }
    ])

    const [errors, setErrors] = useState<Record<string, string>>({})

    // Cargar clientes y productos cuando se abre el diálogo
    useEffect(() => {
        if (open) {
            fetchData()
        }
    }, [open])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [clientesRes, productosRes] = await Promise.all([
                fetch('/api/clientes'),
                fetch('/api/productos')
            ])

            if (!clientesRes.ok || !productosRes.ok) {
                throw new Error('Error al cargar datos')
            }

            const clientesData = await clientesRes.json()
            const productosData = await productosRes.json()

            setClientes(clientesData)
            setProductos(productosData)
        } catch (error) {
            console.error('Error al cargar datos:', error)
            toast({
                title: "Error",
                description: "No se pudieron cargar los datos necesarios",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!open) {
            setFormData({
                clienteId: "",
                metodoPago: "",
                notas: "",
            })
            setItems([{ productoId: "", cantidad: 1, precioUnitario: 0 }])
            setErrors({})
        }
    }, [open])

    const addItem = () => {
        setItems([...items, { productoId: "", cantidad: 1, precioUnitario: 0 }])
    }

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index))
        }
    }

    const updateItem = (index: number, field: keyof SaleItem, value: string | number) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        setItems(newItems)
    }

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0)
    }

    const calculateImpuestos = () => {
        return calculateSubtotal() * 0.16 // 16% IVA
    }

    const calculateTotal = () => {
        return calculateSubtotal() + calculateImpuestos()
    }

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.clienteId) newErrors.clienteId = "Debe seleccionar un cliente"
        if (!formData.metodoPago) newErrors.metodoPago = "Debe seleccionar un método de pago"
        if (items.some((item) => !item.productoId)) newErrors.items = "Todos los productos deben estar seleccionados"
        if (items.some((item) => item.cantidad <= 0)) newErrors.items = "Las cantidades deben ser mayores a 0"
        if (calculateTotal() === 0) newErrors.total = "El total debe ser mayor a 0"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) {
            toast({
                title: "Error de validación",
                description: "Por favor completa todos los campos requeridos",
                variant: "destructive",
            })
            return
        }

        setSubmitting(true)
        try {
            const response = await fetch('/api/ventas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clienteId: formData.clienteId,
                    metodoPago: formData.metodoPago,
                    notas: formData.notas || null,
                    items: items,
                    usuarioId: 'system', // TODO: obtener del contexto de sesión
                }),
            })

            if (!response.ok) {
                throw new Error('Error al registrar la venta')
            }

            const venta = await response.json()

            toast({
                title: "Venta registrada exitosamente",
                description: `Total: $${calculateTotal().toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
            })

            onSave?.(venta)
            onOpenChange(false)
        } catch (error) {
            console.error('Error al registrar venta:', error)
            toast({
                title: "Error",
                description: "No se pudo registrar la venta. Intenta nuevamente.",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Nueva Venta</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cliente" className="text-slate-200">
                                Cliente *
                            </Label>
                            <Select 
                                value={formData.clienteId} 
                                onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
                                disabled={loading}
                            >
                                <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100">
                                    <SelectValue placeholder={loading ? "Cargando..." : "Seleccionar cliente"} />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10">
                                    {clientes.length === 0 ? (
                                        <SelectItem value="none" disabled>
                                            No hay clientes disponibles
                                        </SelectItem>
                                    ) : (
                                        clientes.map((cliente) => (
                                            <SelectItem key={cliente.id} value={cliente.id}>
                                                {cliente.nombre}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.clienteId && <p className="text-xs text-red-400">{errors.clienteId}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="metodoPago" className="text-slate-200">
                                Método de Pago *
                            </Label>
                            <Select
                                value={formData.metodoPago}
                                onValueChange={(value) => setFormData({ ...formData, metodoPago: value })}
                            >
                                <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100">
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10">
                                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                                    <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.metodoPago && <p className="text-xs text-red-400">{errors.metodoPago}</p>}
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-slate-200">Productos *</Label>
                            <Button
                                type="button"
                                size="sm"
                                onClick={addItem}
                                className="h-8 bg-indigo-600 hover:bg-indigo-500 text-xs"
                                disabled={loading}
                            >
                                <Plus className="h-3 w-3 mr-1" />
                                Agregar
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {items.map((item, index) => {
                                const productoSeleccionado = productos.find(p => p.id === item.productoId)
                                return (
                                    <div key={index} className="grid grid-cols-12 gap-2 items-start">
                                        <div className="col-span-5">
                                            <Select
                                                value={item.productoId}
                                                onValueChange={(value) => {
                                                    const producto = productos.find(p => p.id === value)
                                                    if (producto) {
                                                        updateItem(index, "productoId", value)
                                                        updateItem(index, "precioUnitario", producto.precioVenta)
                                                    }
                                                }}
                                                disabled={loading}
                                            >
                                                <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100 h-9 text-xs">
                                                    <SelectValue placeholder={loading ? "Cargando..." : "Producto"} />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-white/10">
                                                    {productos.length === 0 ? (
                                                        <SelectItem value="none" disabled>
                                                            No hay productos disponibles
                                                        </SelectItem>
                                                    ) : (
                                                        productos.map((producto) => (
                                                            <SelectItem key={producto.id} value={producto.id}>
                                                                {producto.nombre} - ${producto.precioVenta.toLocaleString("es-MX")} (Stock: {producto.stockActual})
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="col-span-2">
                                            <Input
                                                type="number"
                                                min="1"
                                                max={productoSeleccionado?.stockActual || 999}
                                                value={item.cantidad}
                                                onChange={(e) => {
                                                    const cantidad = parseInt(e.target.value) || 1
                                                    const maxStock = productoSeleccionado?.stockActual || 999
                                                    updateItem(index, "cantidad", Math.min(cantidad, maxStock))
                                                }}
                                                className="bg-slate-800/40 border-slate-700 text-slate-100 h-9 text-xs"
                                                placeholder="Cant."
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={item.precioUnitario}
                                                onChange={(e) => updateItem(index, "precioUnitario", parseFloat(e.target.value) || 0)}
                                                className="bg-slate-800/40 border-slate-700 text-slate-100 h-9 text-xs"
                                                placeholder="Precio"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <div className="h-9 flex items-center px-3 bg-slate-800/20 rounded text-xs text-slate-300">
                                                ${(item.cantidad * item.precioUnitario).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                            </div>
                                        </div>

                                        <div className="col-span-1">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => removeItem(index)}
                                                disabled={items.length === 1}
                                                className="h-9 w-9 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        {errors.items && <p className="text-xs text-red-400">{errors.items}</p>}
                    </div>

                    {/* Notas */}
                    <div className="space-y-2">
                        <Label htmlFor="notas" className="text-slate-200">
                            Notas
                        </Label>
                        <Input
                            id="notas"
                            value={formData.notas}
                            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                            className="bg-slate-800/40 border-slate-700 text-slate-100"
                            placeholder="Opcional"
                        />
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t border-white/10 space-y-2">
                        <div className="flex justify-between items-center text-slate-400">
                            <span>Subtotal:</span>
                            <span>${calculateSubtotal().toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400">
                            <span>IVA (16%):</span>
                            <span>${calculateImpuestos().toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                            <span className="text-slate-200 font-semibold">Total:</span>
                            <span className="text-2xl font-bold text-emerald-400">
                                ${calculateTotal().toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)} 
                        className="text-slate-400 hover:text-slate-300"
                        disabled={submitting}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        className="bg-purple-600 hover:bg-purple-500"
                        disabled={submitting || loading}
                    >
                        {submitting ? "Registrando..." : "Registrar Venta"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
