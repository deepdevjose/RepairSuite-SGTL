"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"

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
    "Servicios",
    "Software"
]

export default function ProductDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [product, setProduct] = useState<any>(null)
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
        stockMinimo: "",
        garantiaMeses: "",
        proveedorId: "",
        activo: true
    })

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load suppliers
                const suppliersRes = await fetch('/api/proveedores')
                if (suppliersRes.ok) {
                    const suppliersData = await suppliersRes.json()
                    setSuppliers(suppliersData)
                }

                // Load product
                const res = await fetch(`/api/productos/${params.sku}`)
                if (!res.ok) throw new Error("Producto no encontrado")
                const data = await res.json()
                setProduct(data)

                // Parse specs if needed, but for now map basic fields
                setFormData({
                    sku: data.sku,
                    nombre: data.nombre,
                    descripcion: data.descripcion || "",
                    categoria: data.categoria,
                    marca: data.marca || "",
                    modelo: data.modelo || "",
                    precioCompra: data.precioCompra.toString(),
                    precioVenta: data.precioVenta.toString(),
                    stockActual: data.stockActual.toString(),
                    stockMinimo: data.stockMinimo.toString(),
                    garantiaMeses: data.garantiaMeses.toString(),
                    proveedorId: data.proveedorId || "",
                    activo: data.activo
                })
            } catch (error) {
                console.error("Error loading data:", error)
                toast({
                    title: "Error",
                    description: "No se pudo cargar la información",
                    variant: "destructive"
                })
                router.push("/dashboard/catalogo")
            } finally {
                setLoading(false)
            }
        }

        if (params.sku) {
            loadData()
        }
    }, [params.sku, router, toast])

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        // Validate provider for non-services and non-software
        if (formData.categoria !== 'Servicios' && formData.categoria !== 'Software' && !formData.proveedorId) {
            toast({
                title: "Error",
                description: "Debes seleccionar un proveedor para productos de hardware",
                variant: "destructive"
            })
            return
        }

        setSaving(true)
        try {
            const res = await fetch(`/api/productos/${params.sku}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tipo: formData.categoria === 'Servicios' ? 'Servicio' : 'Producto',
                    precioCompra: parseFloat(formData.precioCompra) || 0,
                    precioVenta: parseFloat(formData.precioVenta),
                    stockActual: parseInt(formData.stockActual) || 0,
                    stockMinimo: parseInt(formData.stockMinimo) || 5,
                    garantiaMeses: parseInt(formData.garantiaMeses) || 0,
                })
            })

            if (!res.ok) throw new Error("Error al actualizar producto")

            toast({
                title: "Producto actualizado",
                description: "Los cambios se han guardado exitosamente."
            })
            router.push("/dashboard/catalogo")
        } catch (error) {
            console.error("Error saving product:", error)
            toast({
                title: "Error",
                description: "No se pudieron guardar los cambios",
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    return (
        <>
            <DashboardHeader title="Detalles del Producto" />
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard/catalogo">
                            <Button variant="ghost" className="text-slate-400 hover:text-slate-100">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver al catálogo
                            </Button>
                        </Link>
                        <div className="flex gap-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    if (confirm("¿Estás seguro de desactivar este producto?")) {
                                        handleChange("activo", false)
                                        handleSave()
                                    }
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Desactivar
                            </Button>
                            <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Cambios
                            </Button>
                        </div>
                    </div>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-100">Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input
                                        id="sku"
                                        value={formData.sku}
                                        disabled
                                        className="bg-slate-800/50 border-slate-700 text-slate-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="categoria">Categoría</Label>
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
                                <div className="space-y-2">
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

                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre del Producto</Label>
                                <Input
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={(e) => handleChange("nombre", e.target.value)}
                                    className="bg-slate-800 border-slate-700 text-slate-100"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="marca">Marca</Label>
                                    <Input
                                        id="marca"
                                        value={formData.marca}
                                        onChange={(e) => handleChange("marca", e.target.value)}
                                        className="bg-slate-800 border-slate-700 text-slate-100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="modelo">Modelo</Label>
                                    <Input
                                        id="modelo"
                                        value={formData.modelo}
                                        onChange={(e) => handleChange("modelo", e.target.value)}
                                        className="bg-slate-800 border-slate-700 text-slate-100"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    value={formData.descripcion}
                                    onChange={(e) => handleChange("descripcion", e.target.value)}
                                    className="bg-slate-800 border-slate-700 text-slate-100 min-h-[100px]"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-100">Precios y Stock</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="precioCompra">Precio Compra ($)</Label>
                                    <Input
                                        id="precioCompra"
                                        type="number"
                                        value={formData.precioCompra}
                                        onChange={(e) => handleChange("precioCompra", e.target.value)}
                                        className="bg-slate-800 border-slate-700 text-slate-100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="precioVenta">Precio Venta ($)</Label>
                                    <Input
                                        id="precioVenta"
                                        type="number"
                                        value={formData.precioVenta}
                                        onChange={(e) => handleChange("precioVenta", e.target.value)}
                                        className="bg-slate-800 border-slate-700 text-slate-100"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="stockActual">Stock Actual</Label>
                                    <Input
                                        id="stockActual"
                                        type="number"
                                        value={formData.stockActual}
                                        onChange={(e) => handleChange("stockActual", e.target.value)}
                                        className="bg-slate-800 border-slate-700 text-slate-100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                                    <Input
                                        id="stockMinimo"
                                        type="number"
                                        value={formData.stockMinimo}
                                        onChange={(e) => handleChange("stockMinimo", e.target.value)}
                                        className="bg-slate-800 border-slate-700 text-slate-100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="garantiaMeses">Garantía (Meses)</Label>
                                    <Input
                                        id="garantiaMeses"
                                        type="number"
                                        value={formData.garantiaMeses}
                                        onChange={(e) => handleChange("garantiaMeses", e.target.value)}
                                        className="bg-slate-800 border-slate-700 text-slate-100"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    )
}
