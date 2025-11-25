"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Search, Package, AlertTriangle, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

interface InventoryRequestDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    ordenId: string
    ordenFolio: string
    onSubmit?: (request: any) => void
}

// Mock product data - in real app, fetch from catalog
const mockProducts = [
    { id: "prod-101", nombre: "Pantalla HP 15.6' HD", stock: 3, precio: 1200 },
    { id: "prod-102", nombre: "Kit bisagras HP Pavilion 15", stock: 5, precio: 250 },
    { id: "prod-103", nombre: "Cable flex pantalla", stock: 12, precio: 80 },
    { id: "prod-201", nombre: "Batería MacBook Pro 13' A1502", stock: 2, precio: 2800 },
    { id: "prod-202", nombre: "Teclado MacBook Pro", stock: 1, precio: 1500 },
    { id: "prod-301", nombre: "Placa madre Lenovo T480", stock: 0, precio: 3500 },
    { id: "prod-302", nombre: "RAM DDR4 8GB", stock: 8, precio: 450 },
    { id: "prod-303", nombre: "SSD 256GB", stock: 6, precio: 800 },
]

export function InventoryRequestDialog({
    open,
    onOpenChange,
    ordenId,
    ordenFolio,
    onSubmit,
}: InventoryRequestDialogProps) {
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null)
    const [cantidad, setCantidad] = useState("1")
    const [justificacion, setJustificacion] = useState("")

    const filteredProducts = mockProducts.filter((product) =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSubmit = () => {
        if (!selectedProduct) {
            toast({
                title: "Error",
                description: "Debes seleccionar un producto",
                variant: "destructive",
            })
            return
        }

        if (!cantidad || Number.parseInt(cantidad) <= 0) {
            toast({
                title: "Error",
                description: "La cantidad debe ser mayor a 0",
                variant: "destructive",
            })
            return
        }

        const request = {
            productoId: selectedProduct.id,
            productoNombre: selectedProduct.nombre,
            cantidad: Number.parseInt(cantidad),
            justificacion: justificacion || `Material necesario para OS ${ordenFolio}`,
        }

        console.log("[InventoryRequestDialog] Solicitud creada:", request)
        onSubmit?.(request)

        toast({
            title: "Solicitud enviada",
            description: "El administrador revisará tu solicitud de material",
        })

        // Reset form
        setSelectedProduct(null)
        setCantidad("1")
        setJustificacion("")
        setSearchTerm("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Package className="h-5 w-5 text-indigo-400" />
                        Solicitar Material de Inventario
                    </DialogTitle>
                    <p className="text-sm text-slate-400 mt-1">Orden: {ordenFolio}</p>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Product Search */}
                    <div className="space-y-2">
                        <Label className="text-slate-200">Buscar producto</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por nombre..."
                                className="pl-10 bg-slate-800/40 border-slate-700 text-slate-100"
                            />
                        </div>
                    </div>

                    {/* Product List */}
                    {searchTerm && (
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {filteredProducts.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-4">No se encontraron productos</p>
                            ) : (
                                filteredProducts.map((product) => (
                                    <Card
                                        key={product.id}
                                        className={`p-3 cursor-pointer transition-colors ${selectedProduct?.id === product.id
                                                ? "bg-indigo-500/20 border-indigo-500/50"
                                                : "bg-slate-800/40 border-slate-700 hover:bg-slate-800/60"
                                            }`}
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-200">{product.nombre}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">Precio: ${product.precio.toLocaleString()}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {product.stock > 0 ? (
                                                    <div className="flex items-center gap-1 text-xs text-green-400">
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                        <span>{product.stock} disponibles</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-xs text-red-400">
                                                        <AlertTriangle className="h-3.5 w-3.5" />
                                                        <span>Sin stock</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}

                    {/* Selected Product */}
                    {selectedProduct && (
                        <Card className="bg-indigo-500/10 border-indigo-500/30 p-4">
                            <h4 className="text-sm font-semibold text-slate-200 mb-2">Producto seleccionado</h4>
                            <div className="space-y-2">
                                <p className="text-sm text-slate-300">{selectedProduct.nombre}</p>
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span>Precio: ${selectedProduct.precio.toLocaleString()}</span>
                                    <span>Stock: {selectedProduct.stock}</span>
                                </div>
                                {selectedProduct.stock === 0 && (
                                    <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded p-2 mt-2">
                                        <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span>Este producto no tiene stock. La solicitud puede tardar más en aprobarse.</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label htmlFor="cantidad" className="text-slate-200">
                            Cantidad *
                        </Label>
                        <Input
                            id="cantidad"
                            type="number"
                            min="1"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            className="bg-slate-800/40 border-slate-700 text-slate-100"
                            disabled={!selectedProduct}
                        />
                    </div>

                    {/* Justification */}
                    <div className="space-y-2">
                        <Label htmlFor="justificacion" className="text-slate-200">
                            Justificación (opcional)
                        </Label>
                        <Textarea
                            id="justificacion"
                            value={justificacion}
                            onChange={(e) => setJustificacion(e.target.value)}
                            placeholder="Describe por qué necesitas este material..."
                            className="bg-slate-800/40 border-slate-700 text-slate-100 min-h-[80px]"
                            disabled={!selectedProduct}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="text-slate-400 hover:text-slate-300"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-indigo-600 hover:bg-indigo-500"
                        disabled={!selectedProduct}
                    >
                        Enviar solicitud
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
