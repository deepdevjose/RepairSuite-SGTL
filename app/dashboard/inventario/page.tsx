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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Minus, ArrowLeftRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const mockInventory = [
  {
    id: 1,
    sku: "RAM-DDR4-8GB",
    descripcion: "Memoria RAM DDR4 8GB",
    stock_actual: 5,
    stock_minimo: 3,
    ubicacion: "Estante A-1",
    sucursal: "Sede A",
  },
  {
    id: 2,
    sku: "HDD-1TB",
    descripcion: "Disco duro 1TB",
    stock_actual: 2,
    stock_minimo: 2,
    ubicacion: "Estante A-2",
    sucursal: "Sede A",
  },
  {
    id: 3,
    sku: "SSD-256GB",
    descripcion: "SSD 256GB",
    stock_actual: 0,
    stock_minimo: 3,
    ubicacion: "Estante A-3",
    sucursal: "Sede A",
  },
  {
    id: 4,
    sku: "BATT-HP",
    descripcion: "Batería HP genérica",
    stock_actual: 8,
    stock_minimo: 5,
    ubicacion: "Estante B-1",
    sucursal: "Sede B",
  },
]

export default function InventarioPage() {
  const { hasPermission, user } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogType, setDialogType] = useState<"entrada" | "salida" | "transferencia" | null>(null)
  const [movementData, setMovementData] = useState({
    sku: "",
    cantidad: "",
    notas: "",
    destino: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!hasPermission("inventario")) {
    return (
      <>
        <DashboardHeader title="Inventario" />
        <AccessDenied />
      </>
    )
  }

  const isReadOnly = user?.role === "Técnico"

  const getStockStatus = (actual: number, minimo: number) => {
    if (actual === 0) return "Crítico"
    if (actual <= minimo) return "Bajo"
    return "OK"
  }

  const validateMovement = () => {
    const newErrors: Record<string, string> = {}

    if (!movementData.sku) newErrors.sku = "Debe seleccionar un producto"
    if (!movementData.cantidad || Number(movementData.cantidad) <= 0) {
      newErrors.cantidad = "La cantidad debe ser mayor a 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitMovement = () => {
    if (!validateMovement()) return

    toast({
      title: "Movimiento registrado",
      description: `Se ha registrado la ${dialogType} correctamente.`,
    })

    setDialogType(null)
    setMovementData({ sku: "", cantidad: "", notas: "", destino: "" })
  }

  const filteredInventory = mockInventory.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <DashboardHeader title="Inventario" />
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

              {!isReadOnly && (
                <div className="flex gap-2">
                  <Button onClick={() => setDialogType("entrada")} className="bg-green-600 hover:bg-green-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Entrada
                  </Button>
                  <Button onClick={() => setDialogType("salida")} className="bg-red-600 hover:bg-red-500">
                    <Minus className="h-4 w-4 mr-2" />
                    Salida
                  </Button>
                  <Button onClick={() => setDialogType("transferencia")} className="bg-blue-600 hover:bg-blue-500">
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Transferir
                  </Button>
                </div>
              )}

              {isReadOnly && (
                <div className="px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-400">
                  Modo solo lectura
                </div>
              )}
            </div>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-slate-900 border-slate-800 p-4">
              <div className="text-sm text-slate-400">Estado OK</div>
              <div className="text-2xl font-bold text-green-400 mt-1">2</div>
            </Card>
            <Card className="bg-slate-900 border-slate-800 p-4">
              <div className="text-sm text-slate-400">Stock Bajo</div>
              <div className="text-2xl font-bold text-yellow-400 mt-1">1</div>
            </Card>
            <Card className="bg-slate-900 border-slate-800 p-4">
              <div className="text-sm text-slate-400">Stock Crítico</div>
              <div className="text-2xl font-bold text-red-400 mt-1">1</div>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-slate-900 border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">SKU</TableHead>
                  <TableHead className="text-slate-400">Descripción</TableHead>
                  <TableHead className="text-slate-400">Stock actual</TableHead>
                  <TableHead className="text-slate-400">Stock mínimo</TableHead>
                  <TableHead className="text-slate-400">Estado</TableHead>
                  <TableHead className="text-slate-400">Ubicación</TableHead>
                  <TableHead className="text-slate-400">Sucursal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/50 text-slate-300">
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell>{item.descripcion}</TableCell>
                    <TableCell className="font-semibold">{item.stock_actual}</TableCell>
                    <TableCell className="text-slate-400">{item.stock_minimo}</TableCell>
                    <TableCell>
                      <BadgeStatus status={getStockStatus(item.stock_actual, item.stock_minimo)} />
                    </TableCell>
                    <TableCell className="text-slate-400">{item.ubicacion}</TableCell>
                    <TableCell className="text-slate-400">{item.sucursal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>

      {/* Movement Dialog */}
      <Dialog open={dialogType !== null} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-100">
              {dialogType === "entrada" && "Registrar entrada"}
              {dialogType === "salida" && "Registrar salida"}
              {dialogType === "transferencia" && "Transferir inventario"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-slate-200">
                Producto <span className="text-red-400">*</span>
              </Label>
              <Select
                value={movementData.sku}
                onValueChange={(value) => setMovementData({ ...movementData, sku: value })}
              >
                <SelectTrigger
                  className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.sku ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {mockInventory.map((item) => (
                    <SelectItem key={item.id} value={item.sku}>
                      {item.sku} - {item.descripcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sku && <p className="text-xs text-red-400">{errors.sku}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cantidad" className="text-slate-200">
                Cantidad <span className="text-red-400">*</span>
              </Label>
              <Input
                id="cantidad"
                type="number"
                value={movementData.cantidad}
                onChange={(e) => setMovementData({ ...movementData, cantidad: e.target.value })}
                className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.cantidad ? "border-red-500" : ""}`}
              />
              {errors.cantidad && <p className="text-xs text-red-400">{errors.cantidad}</p>}
            </div>

            {dialogType === "transferencia" && (
              <div className="space-y-2">
                <Label htmlFor="destino" className="text-slate-200">
                  Sucursal destino <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={movementData.destino}
                  onValueChange={(value) => setMovementData({ ...movementData, destino: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectValue placeholder="Seleccionar sucursal" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="Sede A">Sede A</SelectItem>
                    <SelectItem value="Sede B">Sede B</SelectItem>
                    <SelectItem value="Sede C">Sede C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notas" className="text-slate-200">
                Notas
              </Label>
              <Input
                id="notas"
                value={movementData.notas}
                onChange={(e) => setMovementData({ ...movementData, notas: e.target.value })}
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogType(null)}
                className="border-slate-700 text-slate-300"
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmitMovement} className="bg-indigo-600 hover:bg-indigo-500">
                Registrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
