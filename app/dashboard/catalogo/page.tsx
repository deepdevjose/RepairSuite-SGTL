"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { BadgeStatus } from "@/components/badge-status"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockCatalog = [
  {
    id: 1,
    sku: "SERV-DIAG",
    tipo: "Servicio",
    descripcion: "Diagnóstico general",
    precio_base: 200,
    garantia_dias: 0,
    activo: true,
  },
  {
    id: 2,
    sku: "SERV-LIMPIEZA",
    tipo: "Servicio",
    descripcion: "Limpieza profunda",
    precio_base: 350,
    garantia_dias: 7,
    activo: true,
  },
  {
    id: 3,
    sku: "RAM-DDR4-8GB",
    tipo: "Refacción",
    descripcion: "Memoria RAM DDR4 8GB",
    precio_base: 800,
    garantia_dias: 90,
    activo: true,
  },
  {
    id: 4,
    sku: "SSD-256GB",
    tipo: "Refacción",
    descripcion: "SSD 256GB",
    precio_base: 1200,
    garantia_dias: 180,
    activo: true,
  },
]

export default function CatalogoPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    sku: "",
    tipo: "Servicio",
    descripcion: "",
    precio_base: "",
    garantia_dias: "",
    activo: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!hasPermission("catalogo")) {
    return (
      <>
        <DashboardHeader title="Catálogo" />
        <AccessDenied />
      </>
    )
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.sku.trim()) newErrors.sku = "El SKU es obligatorio"
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria"
    if (!formData.precio_base || Number(formData.precio_base) <= 0) {
      newErrors.precio_base = "El precio debe ser mayor a 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    toast({
      title: "Producto guardado",
      description: "El producto se ha guardado correctamente en el catálogo.",
    })
    setIsFormOpen(false)
  }

  const filteredCatalog = mockCatalog.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <DashboardHeader title="Catálogo" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <Card className="bg-slate-900 border-slate-800 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar por SKU o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                />
              </div>
              <Button onClick={() => setIsFormOpen(true)} className="bg-indigo-600 hover:bg-indigo-500">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo producto
              </Button>
            </div>
          </Card>

          {/* Table */}
          <Card className="bg-slate-900 border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">SKU</TableHead>
                  <TableHead className="text-slate-400">Tipo</TableHead>
                  <TableHead className="text-slate-400">Descripción</TableHead>
                  <TableHead className="text-slate-400">Precio base</TableHead>
                  <TableHead className="text-slate-400">Garantía (días)</TableHead>
                  <TableHead className="text-slate-400">Estado</TableHead>
                  <TableHead className="text-slate-400">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCatalog.map((item) => (
                  <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/50 text-slate-300">
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          item.tipo === "Servicio" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                        }`}
                      >
                        {item.tipo}
                      </span>
                    </TableCell>
                    <TableCell>{item.descripcion}</TableCell>
                    <TableCell className="font-semibold">${item.precio_base}</TableCell>
                    <TableCell className="text-slate-400">{item.garantia_dias}</TableCell>
                    <TableCell>
                      <BadgeStatus status={item.activo ? "Activo" : "Inactivo"} />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsFormOpen(true)}
                        className="text-slate-400 hover:text-slate-300"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Nuevo producto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sku" className="text-slate-200">
                  SKU <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.sku ? "border-red-500" : ""}`}
                  placeholder="SERV-001"
                />
                {errors.sku && <p className="text-xs text-red-400">{errors.sku}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-slate-200">
                  Tipo <span className="text-red-400">*</span>
                </Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="Servicio">Servicio</SelectItem>
                    <SelectItem value="Refacción">Refacción</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-slate-200">
                Descripción <span className="text-red-400">*</span>
              </Label>
              <Input
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.descripcion ? "border-red-500" : ""}`}
              />
              {errors.descripcion && <p className="text-xs text-red-400">{errors.descripcion}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="precio_base" className="text-slate-200">
                  Precio base <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="precio_base"
                  type="number"
                  value={formData.precio_base}
                  onChange={(e) => setFormData({ ...formData, precio_base: e.target.value })}
                  className={`bg-slate-800 border-slate-700 text-slate-100 ${
                    errors.precio_base ? "border-red-500" : ""
                  }`}
                  placeholder="0.00"
                />
                {errors.precio_base && <p className="text-xs text-red-400">{errors.precio_base}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="garantia_dias" className="text-slate-200">
                  Garantía (días)
                </Label>
                <Input
                  id="garantia_dias"
                  type="number"
                  value={formData.garantia_dias}
                  onChange={(e) => setFormData({ ...formData, garantia_dias: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-slate-100"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="activo"
                checked={formData.activo}
                onCheckedChange={(checked) => setFormData({ ...formData, activo: !!checked })}
              />
              <Label htmlFor="activo" className="text-slate-200 cursor-pointer">
                Producto activo
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="border-slate-700 text-slate-300"
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-500">
                Guardar producto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
