"use client"

import type React from "react"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Eye, Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const mockEquipments = [
  {
    id: 1,
    cliente: "Juan Pérez García",
    marca: "HP",
    modelo: "Pavilion 15",
    color: "Negro",
    numero_serie: "HP123456789",
    fecha_registro: "2024-03-15",
    num_ordenes: 2,
  },
  {
    id: 2,
    cliente: "María González López",
    marca: "Apple",
    modelo: 'MacBook Pro 13"',
    color: "Gris espacial",
    numero_serie: "MBP987654321",
    fecha_registro: "2024-06-20",
    num_ordenes: 1,
  },
  {
    id: 3,
    cliente: "Pedro Ramírez Sánchez",
    marca: "Dell",
    modelo: "XPS 15",
    color: "Plateado",
    numero_serie: "DELL456789123",
    fecha_registro: "2024-08-10",
    num_ordenes: 3,
  },
]

export default function EquiposPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    cliente: "",
    marca: "",
    modelo: "",
    color: "",
    numero_serie: "",
    accesorios_recibidos: "",
    notas_generales: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!hasPermission("equipos")) {
    return (
      <>
        <DashboardHeader title="Equipos" />
        <AccessDenied />
      </>
    )
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cliente) newErrors.cliente = "El cliente es obligatorio"
    if (!formData.marca.trim()) newErrors.marca = "La marca es obligatoria"
    if (!formData.modelo.trim()) newErrors.modelo = "El modelo es obligatorio"
    if (!formData.numero_serie.trim()) newErrors.numero_serie = "El número de serie es obligatorio"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    toast({
      title: "Equipo registrado",
      description: "El equipo se ha registrado correctamente.",
    })
    setIsFormOpen(false)
    setFormData({
      cliente: "",
      marca: "",
      modelo: "",
      color: "",
      numero_serie: "",
      accesorios_recibidos: "",
      notas_generales: "",
    })
  }

  const filteredEquipments = mockEquipments.filter(
    (equipment) =>
      equipment.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.numero_serie.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <DashboardHeader title="Equipos" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header actions */}
          <Card className="bg-slate-900 border-slate-800 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar por cliente, marca, modelo o serie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                />
              </div>
              <Button onClick={() => setIsFormOpen(true)} className="bg-indigo-600 hover:bg-indigo-500">
                <Plus className="h-4 w-4 mr-2" />
                Registrar equipo
              </Button>
            </div>
          </Card>

          {/* Table */}
          <Card className="bg-slate-900 border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">Cliente</TableHead>
                  <TableHead className="text-slate-400">Marca</TableHead>
                  <TableHead className="text-slate-400">Modelo</TableHead>
                  <TableHead className="text-slate-400">Color</TableHead>
                  <TableHead className="text-slate-400">Número de serie</TableHead>
                  <TableHead className="text-slate-400">Fecha de registro</TableHead>
                  <TableHead className="text-slate-400">Nº de OS</TableHead>
                  <TableHead className="text-slate-400">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipments.length === 0 ? (
                  <TableRow className="border-slate-800">
                    <TableCell colSpan={8} className="text-center text-slate-400 py-8">
                      No se encontraron equipos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEquipments.map((equipment) => (
                    <TableRow key={equipment.id} className="border-slate-800 hover:bg-slate-800/50 text-slate-300">
                      <TableCell className="font-medium">{equipment.cliente}</TableCell>
                      <TableCell>{equipment.marca}</TableCell>
                      <TableCell>{equipment.modelo}</TableCell>
                      <TableCell className="text-slate-400">{equipment.color}</TableCell>
                      <TableCell className="font-mono text-sm">{equipment.numero_serie}</TableCell>
                      <TableCell className="text-slate-400">{equipment.fecha_registro}</TableCell>
                      <TableCell className="text-slate-400">{equipment.num_ordenes}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsFormOpen(true)}
                            className="text-slate-400 hover:text-slate-300"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Registrar equipo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cliente" className="text-slate-200">
                Cliente <span className="text-red-400">*</span>
              </Label>
              <Select value={formData.cliente} onValueChange={(value) => setFormData({ ...formData, cliente: value })}>
                <SelectTrigger
                  className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.cliente ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="1">Juan Pérez García</SelectItem>
                  <SelectItem value="2">María González López</SelectItem>
                  <SelectItem value="3">Pedro Ramírez Sánchez</SelectItem>
                </SelectContent>
              </Select>
              {errors.cliente && <p className="text-xs text-red-400">{errors.cliente}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="marca" className="text-slate-200">
                  Marca <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.marca ? "border-red-500" : ""}`}
                />
                {errors.marca && <p className="text-xs text-red-400">{errors.marca}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelo" className="text-slate-200">
                  Modelo <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="modelo"
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.modelo ? "border-red-500" : ""}`}
                />
                {errors.modelo && <p className="text-xs text-red-400">{errors.modelo}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="color" className="text-slate-200">
                  Color
                </Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-slate-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero_serie" className="text-slate-200">
                  Número de serie <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="numero_serie"
                  value={formData.numero_serie}
                  onChange={(e) => setFormData({ ...formData, numero_serie: e.target.value })}
                  className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.numero_serie ? "border-red-500" : ""}`}
                />
                {errors.numero_serie && <p className="text-xs text-red-400">{errors.numero_serie}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accesorios" className="text-slate-200">
                Accesorios recibidos
              </Label>
              <Textarea
                id="accesorios"
                value={formData.accesorios_recibidos}
                onChange={(e) => setFormData({ ...formData, accesorios_recibidos: e.target.value })}
                className="bg-slate-800 border-slate-700 text-slate-100 min-h-[80px]"
                placeholder="Cargador, mouse, estuche, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas" className="text-slate-200">
                Notas generales
              </Label>
              <Textarea
                id="notas"
                value={formData.notas_generales}
                onChange={(e) => setFormData({ ...formData, notas_generales: e.target.value })}
                className="bg-slate-800 border-slate-700 text-slate-100 min-h-[80px]"
              />
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
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500">
                Registrar equipo
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
