import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus } from "lucide-react"

interface NewProductDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

const CATEGORIES = [
    "ComponentesHardware",
    "Pantallas",
    "Teclados",
    "Baterias",
    "Cargadores",
    "Memorias",
    "Discos",
    "Cables",
    "Accesorios",
    "Consumibles",
    "Servicios"
]

export function NewProductDialog({ open, onOpenChange, onSuccess }: NewProductDialogProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [suppliers, setSuppliers] = useState<any[]>([])

    const [formData, setFormData] = useState({
        sku: "",
        nombre: "",
        descripcion: "",
        categoria: "",
        marca: "",
        modelo: "",
        precioCompra: "",
        precioVenta: "",
        stockActual: "",
        stockMinimo: "5",
        garantiaMeses: "0",
        proveedorId: ""
    })

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const res = await fetch('/api/proveedores')
                if (res.ok) {
                    const data = await res.json()
                    setSuppliers(data)
                }
            } catch (error) {
                console.error('Error fetching suppliers:', error)
            }
        }
        if (open) {
            fetchSuppliers()
        }
    }, [open])

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        // Basic validation
        if (!formData.sku || !formData.nombre || !formData.categoria || !formData.precioVenta) {
            toast({
                title: "Error",
                description: "Por favor completa los campos obligatorios (*)",
                variant: "destructive"
            })
            return
        }

        // Validate provider for non-services and non-software
        if (formData.categoria !== 'Servicios' && formData.categoria !== 'Software' && !formData.proveedorId) {
            toast({
                title: "Error",
                description: "Debes seleccionar un proveedor para productos de hardware",
                variant: "destructive"
            })
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tipo: formData.categoria === 'Servicios' ? 'Servicio' : 'Producto',
                    precioCompra: parseFloat(formData.precioCompra) || 0,
                    precioVenta: parseFloat(formData.precioVenta),
                    stockActual: parseInt(formData.stockActual) || 0,
                    stockMinimo: parseInt(formData.stockMinimo) || 5,
                    garantiaMeses: parseInt(formData.garantiaMeses) || 0,
                    activo: true
                })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Error al crear producto")
            }

            toast({
                title: "Producto creado",
                description: "El producto se ha agregado al inventario exitosamente."
            })

            // Reset form
            setFormData({
                sku: "",
                nombre: "",
                descripcion: "",
                categoria: "",
                marca: "",
                modelo: "",
                precioCompra: "",
                precioVenta: "",
                stockActual: "",
                stockMinimo: "5",
                garantiaMeses: "0",
                proveedorId: ""
            })

            onSuccess()
            onOpenChange(false)
        } catch (error: any) {
            console.error("Error creating product:", error)
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800 text-slate-100 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Plus className="h-6 w-6 text-indigo-500" />
                        <DialogTitle>Nuevo Producto</DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-400">
                        Agrega un nuevo producto o servicio al inventario.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="sku">SKU *</Label>
                            <Input
                                id="sku"
                                value={formData.sku}
                                onChange={(e) => handleChange("sku", e.target.value)}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                                placeholder="Ej. RAM-DDR4-8GB"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="categoria">Categoría *</Label>
                            <Select
                                value={formData.categoria}
                                onValueChange={(val) => handleChange("categoria", val)}
                            >
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                    <SelectValue placeholder="Seleccionar..." />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {formData.categoria !== 'Servicios' && formData.categoria !== 'Software' && (
                        <div className="grid gap-2">
                            <Label htmlFor="proveedor">Proveedor *</Label>
                            <Select
                                value={formData.proveedorId}
                                onValueChange={(val) => handleChange("proveedorId", val)}
                            >
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                    <SelectValue placeholder="Seleccionar proveedor..." />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                                    {suppliers.map((sup) => (
                                        <SelectItem key={sup.id} value={sup.id}>{sup.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre del Producto *</Label>
                        <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => handleChange("nombre", e.target.value)}
                            className="bg-slate-800 border-slate-700 text-slate-100"
                            placeholder="Ej. Memoria RAM DDR4 8GB Kingston"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="marca">Marca</Label>
                            <Input
                                id="marca"
                                value={formData.marca}
                                onChange={(e) => handleChange("marca", e.target.value)}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="modelo">Modelo</Label>
                            <Input
                                id="modelo"
                                value={formData.modelo}
                                onChange={(e) => handleChange("modelo", e.target.value)}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="precioCompra">Precio Compra ($)</Label>
                            <Input
                                id="precioCompra"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.precioCompra}
                                onChange={(e) => handleChange("precioCompra", e.target.value)}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="precioVenta">Precio Venta ($) *</Label>
                            <Input
                                id="precioVenta"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.precioVenta}
                                onChange={(e) => handleChange("precioVenta", e.target.value)}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="stockActual">Stock Inicial</Label>
                            <Input
                                id="stockActual"
                                type="number"
                                min="0"
                                value={formData.stockActual}
                                onChange={(e) => handleChange("stockActual", e.target.value)}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                            <Input
                                id="stockMinimo"
                                type="number"
                                min="0"
                                value={formData.stockMinimo}
                                onChange={(e) => handleChange("stockMinimo", e.target.value)}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="garantiaMeses">Garantía (Meses)</Label>
                            <Input
                                id="garantiaMeses"
                                type="number"
                                min="0"
                                value={formData.garantiaMeses}
                                onChange={(e) => handleChange("garantiaMeses", e.target.value)}
                                className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="descripcion">Descripción / Notas</Label>
                        <Textarea
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => handleChange("descripcion", e.target.value)}
                            className="bg-slate-800 border-slate-700 text-slate-100 resize-none"
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Crear Producto
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
