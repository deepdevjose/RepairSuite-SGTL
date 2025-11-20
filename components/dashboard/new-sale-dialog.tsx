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

interface SaleItem {
    producto: string
    cantidad: number
    precio: number
}

export function NewSaleDialog({ open, onOpenChange, onSave }: NewSaleDialogProps) {
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        cliente: "",
        metodoPago: "",
    })

    const [items, setItems] = useState<SaleItem[]>([{ producto: "", cantidad: 1, precio: 0 }])
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (!open) {
            setFormData({
                cliente: "",
                metodoPago: "",
            })
            setItems([{ producto: "", cantidad: 1, precio: 0 }])
            setErrors({})
        }
    }, [open])

    const addItem = () => {
        setItems([...items, { producto: "", cantidad: 1, precio: 0 }])
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

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + item.cantidad * item.precio, 0)
    }

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.cliente) newErrors.cliente = "Debe seleccionar un cliente"
        if (!formData.metodoPago) newErrors.metodoPago = "Debe seleccionar un método de pago"
        if (items.some((item) => !item.producto)) newErrors.items = "Todos los productos deben estar seleccionados"
        if (calculateTotal() === 0) newErrors.total = "El total debe ser mayor a 0"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (!validate()) {
            toast({
                title: "Error de validación",
                description: "Por favor completa todos los campos requeridos",
                variant: "destructive",
            })
            return
        }

        const sale = {
            ...formData,
            items,
            total: calculateTotal(),
            folio: `VTA-${Math.floor(Math.random() * 9000) + 1000}`,
            fecha: new Date().toISOString().split("T")[0],
        }

        console.log("Nueva venta creada:", sale)
        onSave?.(sale)

        toast({
            title: "Venta registrada exitosamente",
            description: `Total: $${calculateTotal().toLocaleString("es-MX")}`,
        })

        onOpenChange(false)
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
                            <Select value={formData.cliente} onValueChange={(value) => setFormData({ ...formData, cliente: value })}>
                                <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100">
                                    <SelectValue placeholder="Seleccionar cliente" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10">
                                    <SelectItem value="Juan Pérez">Juan Pérez</SelectItem>
                                    <SelectItem value="María González">María González</SelectItem>
                                    <SelectItem value="Pedro Ramírez">Pedro Ramírez</SelectItem>
                                    <SelectItem value="Ana López">Ana López</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.cliente && <p className="text-xs text-red-400">{errors.cliente}</p>}
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
                            >
                                <Plus className="h-3 w-3 mr-1" />
                                Agregar
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-start">
                                    <div className="col-span-5">
                                        <Select
                                            value={item.producto}
                                            onValueChange={(value) => {
                                                updateItem(index, "producto", value)
                                                // Auto-fill price based on product
                                                const prices: Record<string, number> = {
                                                    "Pantalla LCD 15.6": 1200,
                                                    "Teclado Laptop": 450,
                                                    "Batería Laptop": 800,
                                                    "Disco SSD 256GB": 950,
                                                    "Memoria RAM 8GB": 650,
                                                }
                                                updateItem(index, "precio", prices[value] || 0)
                                            }}
                                        >
                                            <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100 h-9 text-xs">
                                                <SelectValue placeholder="Producto" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10">
                                                <SelectItem value="Pantalla LCD 15.6">Pantalla LCD 15.6"</SelectItem>
                                                <SelectItem value="Teclado Laptop">Teclado Laptop</SelectItem>
                                                <SelectItem value="Batería Laptop">Batería Laptop</SelectItem>
                                                <SelectItem value="Disco SSD 256GB">Disco SSD 256GB</SelectItem>
                                                <SelectItem value="Memoria RAM 8GB">Memoria RAM 8GB</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.cantidad}
                                            onChange={(e) => updateItem(index, "cantidad", parseInt(e.target.value) || 1)}
                                            className="bg-slate-800/40 border-slate-700 text-slate-100 h-9 text-xs"
                                            placeholder="Cant."
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={item.precio}
                                            onChange={(e) => updateItem(index, "precio", parseFloat(e.target.value) || 0)}
                                            className="bg-slate-800/40 border-slate-700 text-slate-100 h-9 text-xs"
                                            placeholder="Precio"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <div className="h-9 flex items-center px-3 bg-slate-800/20 rounded text-xs text-slate-300">
                                            ${(item.cantidad * item.precio).toLocaleString("es-MX")}
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
                            ))}
                        </div>
                        {errors.items && <p className="text-xs text-red-400">{errors.items}</p>}
                    </div>

                    {/* Total */}
                    <div className="flex justify-end items-center gap-4 pt-4 border-t border-white/10">
                        <span className="text-slate-400">Total:</span>
                        <span className="text-2xl font-bold text-emerald-400">${calculateTotal().toLocaleString("es-MX")}</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-300">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-500">
                        Registrar Venta
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
