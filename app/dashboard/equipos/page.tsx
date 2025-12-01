"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Search, Plus, Trash2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { NewEquipmentDialog } from "@/components/dashboard/new-equipment-dialog"
import { useSearchParams } from 'next/navigation'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type Equipo = {
  id: string
  clienteId: string
  tipo: string
  marca: string
  modelo: string
  numeroSerie: string | null
  color: string | null
  cliente?: {
    nombre: string
  }
}

export default function EquiposPage() {
  const { hasPermission } = useAuth()
  const { user } = useAuth()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const searchId = searchParams.get('id')

  const [searchTerm, setSearchTerm] = useState("")
  const [filterBrand, setFilterBrand] = useState("all")
  const [isFormOpen, setIsFormOpen] = useState(false)

  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [loadingEquipos, setLoadingEquipos] = useState(true)

  if (!hasPermission("equipos")) {
    return (
      <>
        <DashboardHeader title="Equipos" />
        <AccessDenied />
      </>
    )
  }

  useEffect(() => {
    loadEquipos()
  }, [])

  const loadEquipos = async () => {
    try {
      setLoadingEquipos(true)
      const res = await fetch('/api/equipos')
      const data = await res.json()
      setEquipos(data)
    } catch (error) {
      console.error('Error al cargar equipos:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los equipos",
        variant: "destructive"
      })
    } finally {
      setLoadingEquipos(false)
    }
  }

  const filteredEquipments = equipos.filter((equipment) => {
    if (searchId) {
      return equipment.id === searchId
    }

    const clienteNombre = equipment.cliente?.nombre || ''
    const matchesSearch =
      clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (equipment.numeroSerie || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBrand = filterBrand === "all" || equipment.marca === filterBrand

    return matchesSearch && matchesBrand
  })




  return (
    <>
      <DashboardHeader title="Equipos" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <Card className="bg-slate-900/50 border-slate-800/50 p-6 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Buscar por cliente, marca, modelo o número de serie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                {/* Botón Registrar equipo - Solo para Admin y Recepción */}
                {user?.role !== "Técnico" && (
                  <Button
                    onClick={() => {
                      setIsFormOpen(true)
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar equipo
                  </Button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <Select value={filterBrand} onValueChange={setFilterBrand}>
                  <SelectTrigger className="w-[200px] bg-slate-800/50 border-slate-700/50 text-slate-300">
                    <SelectValue placeholder="Marca" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">Todas las marcas</SelectItem>
                    <SelectItem value="HP">HP</SelectItem>
                    <SelectItem value="Apple">Apple</SelectItem>
                    <SelectItem value="Dell">Dell</SelectItem>
                    <SelectItem value="Lenovo">Lenovo</SelectItem>
                  </SelectContent>
                </Select>

                {filterBrand !== "all" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilterBrand("all")}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableHead className="text-slate-400 font-semibold">Cliente</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Tipo</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Marca</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Modelo</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Número de serie</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Color</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingEquipos ? (
                    <TableRow className="border-slate-800">
                      <TableCell colSpan={7} className="text-center text-slate-400 py-12">
                        Cargando equipos...
                      </TableCell>
                    </TableRow>
                  ) : filteredEquipments.length === 0 ? (
                    <TableRow className="border-slate-800">
                      <TableCell colSpan={7} className="text-center text-slate-400 py-12">
                        {equipos.length === 0 ? 'No hay equipos registrados' : 'No se encontraron equipos con esos filtros'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEquipments.map((equipment, idx) => (
                      <TableRow
                        key={equipment.id}
                        className={`border-slate-800 hover:bg-slate-800/30 transition-colors ${idx % 2 === 0 ? "bg-slate-900/30" : ""
                          }`}
                      >
                        <TableCell className="font-medium text-slate-200">
                          {equipment.cliente?.nombre || 'Cliente desconocido'}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {equipment.tipo}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {equipment.marca}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {equipment.modelo}
                        </TableCell>
                        <TableCell className="text-slate-400 font-mono text-sm">
                          {equipment.numeroSerie || '-'}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {equipment.color || '-'}
                        </TableCell>
                        <TableCell>
                          {hasPermission("configuracion") && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar equipo?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-slate-400">
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el equipo y podría afectar a órdenes de servicio asociadas.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700">Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={async () => {
                                      try {
                                        const res = await fetch(`/api/equipos/${equipment.id}`, {
                                          method: 'DELETE'
                                        })
                                        if (res.ok) {
                                          toast({
                                            title: "Equipo eliminado",
                                            description: "El equipo ha sido eliminado correctamente",
                                          })
                                          loadEquipos()
                                        } else {
                                          toast({
                                            title: "Error",
                                            description: "No se pudo eliminar el equipo",
                                            variant: "destructive"
                                          })
                                        }
                                      } catch (error) {
                                        console.error("Error deleting equipment", error)
                                        toast({
                                          title: "Error",
                                          description: "Ocurrió un error al eliminar el equipo",
                                          variant: "destructive"
                                        })
                                      }
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white border-0"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </main>

      <NewEquipmentDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={loadEquipos}
      />


    </>
  )
}
