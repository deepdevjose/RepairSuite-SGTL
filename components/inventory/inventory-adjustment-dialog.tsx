import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Loader2, ArrowUpCircle, ArrowDownCircle } from "lucide-react"

interface Product {
    id: string
    nombre: string
    sku: string
    stockActual: number
    categoria: string
}

interface InventoryAdjustmentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mode: 'Entrada' | 'Salida'
    products: Product[]
    onSuccess: () => void
}

export function InventoryAdjustmentDialog({
    open,
    onOpenChange,
    mode,
    products,
    onSuccess
}: InventoryAdjustmentDialogProps) {
    const { toast } = useToast()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [selectedProductId, setSelectedProductId] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [reason, setReason] = useState("")

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (open) {
            setSelectedProductId("")
            setQuantity(1)
            setReason("")
        }
    }, [open])

    const selectedProduct = products.find(p => p.id === selectedProductId)

    const handleSubmit = async () => {
        if (!selectedProductId) {
            toast({ title: "Error", description: "Selecciona un producto", variant: "destructive" })
            return
        }
        if (quantity <= 0) {
            toast({ title: "Error", description: "La cantidad debe ser mayor a 0", variant: "destructive" })
            return
        }
        if (!reason.trim()) {
            toast({ title: "Error", description: "Ingresa un motivo", variant: "destructive" })
            return
        }
        if (mode === 'Salida' && selectedProduct && selectedProduct.stockActual < quantity) {
            toast({ title: "Error", description: "Stock insuficiente", variant: "destructive" })
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/inventory/movements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productoId: selectedProductId,
                    tipo: mode,
                    cantidad: quantity,
                    motivo: reason,
                    usuarioId: user?.id
                })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Error al procesar el movimiento")
            }

            toast({
                title: "Movimiento registrado",
                description: `Se ha registrado la ${mode.toLowerCase()} de ${quantity} unidades exitosamente.`
            })

            onSuccess()
            onOpenChange(false)
        } catch (error: any) {
            console.error("Error submitting movement:", error)
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
            <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        {mode === 'Entrada' ? (
                            <ArrowUpCircle className="h-6 w-6 text-green-500" />
                        ) : (
                            <ArrowDownCircle className="h-6 w-6 text-red-500" />
                        )}
                        <DialogTitle>Registrar {mode} de Inventario</DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-400">
                        {mode === 'Entrada'
                            ? "Ingresa stock nuevo al inventario."
                            : "Registra una salida manual de stock."}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="product">Producto</Label>
                        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                <SelectValue placeholder="Seleccionar producto..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-slate-100 max-h-[300px]">
                                {products
                                    .filter(p => p.categoria !== 'Servicio') // Exclude services
                                    .map((product) => (
                                        <SelectItem key={product.id} value={product.id}>
                                            {product.nombre} ({product.sku}) - Stock: {product.stockActual}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="quantity">Cantidad</Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                            className="bg-slate-800 border-slate-700 text-slate-100"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="reason">Motivo</Label>
                        <Textarea
                            id="reason"
                            placeholder={mode === 'Entrada' ? "Ej. Compra de proveedor, Devolución..." : "Ej. Merma, Uso interno, Ajuste..."}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-slate-100 resize-none"
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
                        className={mode === 'Entrada' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirmar {mode}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
