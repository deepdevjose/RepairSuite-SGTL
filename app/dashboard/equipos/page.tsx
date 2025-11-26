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
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, History, FileText, ShieldCheck, Pencil, Upload, X, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

const mockEquipments: any[] = []

const accessoriesList = ["Cargador", "Mouse", "Estuche", "Base de enfriamiento", "Batería adicional", "Cable HDMI"]

export default function EquiposPage() {
  const { hasPermission } = useAuth()
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterBrand, setFilterBrand] = useState("all")
  const [filterWarranty, setFilterWarranty] = useState("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [confirmCreateOS, setConfirmCreateOS] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    // Datos del equipo
    cliente: "",
    marca: "",
    modelo: "",
    color: "",
    numero_serie: "",
    fecha_ingreso: new Date().toISOString().split("T")[0],
    
    // Estado físico
    estado_fisico: {
      golpes: false,
      bisagra_suelta: false,
      teclado_no_funciona: false,
      pantalla_rota: false,
      bateria_inflada: false,
      derrame_liquido: false,
      rayones: false,
      puertos_danados: false,
    },
    
    // Accesorios
    accesorios_texto: "",
    accesorios_chips: [] as string[],
    
    // Diagnóstico inicial
    enciende: "",
    tiene_contrasena: false,
    contrasena: "",
    no_proporciono_contrasena: false,
    
    // Archivos
    fotos: [] as File[],
    
    // Notas
    notas_generales: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serialDuplicate, setSerialDuplicate] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState({
    equipmentData: false,
    physicalState: false,
    accessories: false,
    diagnosis: false,
    photos: false,
    notes: false,
  })

  if (!hasPermission("equipos")) {
    return (
      <>
        <DashboardHeader title="Equipos" />
        <AccessDenied />
      </>
    )
  }

  const checkSerialDuplicate = (serial: string) => {
    const exists = mockEquipments.some((eq) => eq.numero_serie.toLowerCase() === serial.toLowerCase())
    setSerialDuplicate(exists)
    return exists
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cliente) newErrors.cliente = "El cliente es obligatorio"
    if (!formData.marca.trim()) newErrors.marca = "La marca es obligatoria"
    if (!formData.modelo.trim()) newErrors.modelo = "El modelo es obligatorio"
    if (!formData.numero_serie.trim()) newErrors.numero_serie = "El número de serie es obligatorio"
    else if (serialDuplicate) newErrors.numero_serie = "Este número de serie ya está registrado"

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
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      cliente: "",
      marca: "",
      modelo: "",
      color: "",
      numero_serie: "",
      fecha_ingreso: new Date().toISOString().split("T")[0],
      estado_fisico: {
        golpes: false,
        bisagra_suelta: false,
        teclado_no_funciona: false,
        pantalla_rota: false,
        bateria_inflada: false,
        derrame_liquido: false,
        rayones: false,
        puertos_danados: false,
      },
      accesorios_texto: "",
      accesorios_chips: [],
      enciende: "",
      tiene_contrasena: false,
      contrasena: "",
      no_proporciono_contrasena: false,
      fotos: [],
      notas_generales: "",
    })
    setErrors({})
    setSerialDuplicate(false)
  }

  const filteredEquipments = mockEquipments.filter((equipment) => {
    const matchesSearch =
      equipment.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.numero_serie.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || equipment.estado_orden === filterStatus
    const matchesBrand = filterBrand === "all" || equipment.marca === filterBrand
    const matchesWarranty = filterWarranty === "all" || equipment.garantia === filterWarranty

    return matchesSearch && matchesStatus && matchesBrand && matchesWarranty
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Diagnóstico: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      "En revisión": "bg-purple-500/20 text-purple-400 border-purple-500/50",
      "En espera de aprobación": "bg-amber-500/20 text-amber-400 border-amber-500/50",
      "En proceso": "bg-indigo-500/20 text-indigo-400 border-indigo-500/50",
      Listo: "bg-green-500/20 text-green-400 border-green-500/50",
      Completado: "bg-slate-500/20 text-slate-400 border-slate-500/50",
    }
    return (
      <Badge className={`${statusConfig[status as keyof typeof statusConfig] || ""} border`}>{status}</Badge>
    )
  }

  const handleCreateOS = (equipmentId: number) => {
    setConfirmCreateOS(equipmentId)
  }

  const confirmCreateOSAction = () => {
    toast({
      title: "Orden de servicio creada",
      description: "Se ha creado una nueva orden de servicio para este equipo.",
    })
    setConfirmCreateOS(null)
  }

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleAccessory = (accessory: string) => {
    setFormData((prev) => ({
      ...prev,
      accesorios_chips: prev.accesorios_chips.includes(accessory)
        ? prev.accesorios_chips.filter((a) => a !== accessory)
        : [...prev.accesorios_chips, accessory],
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        fotos: [...prev.fotos, ...Array.from(e.target.files || [])],
      }))
    }
  }

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
    }))
  }

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
                      resetForm()
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
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[200px] bg-slate-800/50 border-slate-700/50 text-slate-300">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="Diagnóstico">Diagnóstico</SelectItem>
                    <SelectItem value="En revisión">En revisión</SelectItem>
                    <SelectItem value="En espera de aprobación">En espera de aprobación</SelectItem>
                    <SelectItem value="En proceso">En proceso</SelectItem>
                    <SelectItem value="Listo">Listo</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>

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

                <Select value={filterWarranty} onValueChange={setFilterWarranty}>
                  <SelectTrigger className="w-[200px] bg-slate-800/50 border-slate-700/50 text-slate-300">
                    <SelectValue placeholder="Garantía" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Activa">Activa</SelectItem>
                    <SelectItem value="Expirada">Expirada</SelectItem>
                  </SelectContent>
                </Select>

                {(filterStatus !== "all" || filterBrand !== "all" || filterWarranty !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilterStatus("all")
                      setFilterBrand("all")
                      setFilterWarranty("all")
                    }}
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
                    <TableHead className="text-slate-400 font-semibold">Equipo</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Número de serie</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Última OS</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Estado actual</TableHead>
                    {user?.role !== "Técnico" && (
                      <TableHead className="text-slate-400 font-semibold">Técnico asignado</TableHead>
                    )}
                    <TableHead className="text-slate-400 font-semibold">Garantía</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipments.length === 0 ? (
                    <TableRow className="border-slate-800">
                      <TableCell colSpan={user?.role === "Técnico" ? 6 : 7} className="text-center text-slate-400 py-12">
                        No se encontraron equipos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEquipments.map((equipment, idx) => (
                      <TableRow
                        key={equipment.id}
                        className={`border-slate-800 hover:bg-slate-800/30 transition-colors ${
                          idx % 2 === 0 ? "bg-slate-900/30" : ""
                        }`}
                      >
                        <TableCell className="font-medium text-slate-200">{equipment.cliente}</TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="text-slate-200 font-medium">{equipment.marca}</div>
                            <div className="text-sm text-slate-400">{equipment.modelo}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-slate-300">{equipment.numero_serie}</TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="text-slate-300 font-medium">{equipment.ultima_orden}</div>
                            <div className="text-xs text-slate-500">{equipment.fecha_ultima_orden}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(equipment.estado_orden)}</TableCell>
                        {user?.role !== "Técnico" && (
                          <TableCell className="text-slate-300">{equipment.tecnico}</TableCell>
                        )}
                        <TableCell>
                          <div className="space-y-0.5">
                            <Badge
                              className={`${
                                equipment.garantia === "Activa"
                                  ? "bg-green-500/20 text-green-400 border-green-500/50"
                                  : "bg-red-500/20 text-red-400 border-red-500/50"
                              } border`}
                            >
                              {equipment.garantia}
                            </Badge>
                            <div className="text-xs text-slate-500">
                              {equipment.garantia === "Activa" ? "Expira: " : "Expiró: "}
                              {equipment.fecha_expira_garantia}
                            </div>
                          </div>
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-slate-100 flex items-center gap-2">
              <Plus className="h-6 w-6 text-indigo-400" />
              Registrar nuevo equipo
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Equipment Data */}
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("equipmentData")}
                className="w-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-4 flex items-center justify-between hover:from-indigo-600/30 hover:to-purple-600/30 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-200">1. Datos del equipo</span>
                {collapsedSections.equipmentData ? (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                )}
              </button>
              {!collapsedSections.equipmentData && (
                <div className="p-4 space-y-4 bg-slate-900/50">
                  <div className="space-y-2">
                    <Label htmlFor="cliente" className="text-slate-200">
                      Cliente <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.cliente}
                      onValueChange={(value) => setFormData({ ...formData, cliente: value })}
                    >
                      <SelectTrigger
                        className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.cliente ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="1">Juan Pérez García</SelectItem>
                        <SelectItem value="2">María González López</SelectItem>
                        <SelectItem value="3">Pedro Ramírez Sánchez</SelectItem>
                        <SelectItem value="4">Ana Martínez Cruz</SelectItem>
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
                        placeholder="HP, Dell, Apple..."
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
                        placeholder="Pavilion 15, XPS 13..."
                        className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.modelo ? "border-red-500" : ""}`}
                      />
                      {errors.modelo && <p className="text-xs text-red-400">{errors.modelo}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="color" className="text-slate-200">
                        Color
                      </Label>
                      <Input
                        id="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="Negro, plata..."
                        className="bg-slate-800 border-slate-700 text-slate-100"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="numero_serie" className="text-slate-200">
                        Número de serie <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="numero_serie"
                        value={formData.numero_serie}
                        onChange={(e) => {
                          setFormData({ ...formData, numero_serie: e.target.value })
                          if (e.target.value.trim()) {
                            checkSerialDuplicate(e.target.value)
                          } else {
                            setSerialDuplicate(false)
                          }
                        }}
                        placeholder="Número único del equipo"
                        className={`bg-slate-800 border-slate-700 text-slate-100 font-mono ${
                          errors.numero_serie || serialDuplicate ? "border-red-500" : ""
                        }`}
                      />
                      {serialDuplicate && (
                        <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/30">
                          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <span>Este número de serie ya existe en el sistema</span>
                        </div>
                      )}
                      {errors.numero_serie && <p className="text-xs text-red-400">{errors.numero_serie}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha_ingreso" className="text-slate-200">
                      Fecha de ingreso
                    </Label>
                    <Input
                      id="fecha_ingreso"
                      type="date"
                      value={formData.fecha_ingreso}
                      onChange={(e) => setFormData({ ...formData, fecha_ingreso: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Physical State */}
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("physicalState")}
                className="w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 flex items-center justify-between hover:from-purple-600/30 hover:to-pink-600/30 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-200">2. Estado físico</span>
                {collapsedSections.physicalState ? (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                )}
              </button>
              {!collapsedSections.physicalState && (
                <div className="p-4 bg-slate-900/50">
                  <div className="grid gap-3 md:grid-cols-2">
                    {Object.entries(formData.estado_fisico).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              estado_fisico: { ...formData.estado_fisico, [key]: checked === true },
                            })
                          }
                          className="border-slate-600 data-[state=checked]:bg-purple-600"
                        />
                        <Label
                          htmlFor={key}
                          className="text-slate-300 cursor-pointer capitalize font-normal"
                        >
                          {key.replace(/_/g, " ")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Accessories */}
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("accessories")}
                className="w-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-4 flex items-center justify-between hover:from-blue-600/30 hover:to-cyan-600/30 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-200">3. Accesorios recibidos</span>
                {collapsedSections.accessories ? (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                )}
              </button>
              {!collapsedSections.accessories && (
                <div className="p-4 space-y-4 bg-slate-900/50">
                  <div className="space-y-2">
                    <Label className="text-slate-200">Accesorios comunes</Label>
                    <div className="flex flex-wrap gap-2">
                      {accessoriesList.map((accessory) => (
                        <button
                          key={accessory}
                          type="button"
                          onClick={() => toggleAccessory(accessory)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            formData.accesorios_chips.includes(accessory)
                              ? "bg-blue-600 text-white"
                              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          {accessory}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accesorios_texto" className="text-slate-200">
                      Otros accesorios (texto libre)
                    </Label>
                    <Textarea
                      id="accesorios_texto"
                      value={formData.accesorios_texto}
                      onChange={(e) => setFormData({ ...formData, accesorios_texto: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-slate-100 min-h-[80px]"
                      placeholder="Describe otros accesorios no listados..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Initial Diagnosis */}
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("diagnosis")}
                className="w-full bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-4 flex items-center justify-between hover:from-green-600/30 hover:to-emerald-600/30 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-200">4. Diagnóstico inicial</span>
                {collapsedSections.diagnosis ? (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                )}
              </button>
              {!collapsedSections.diagnosis && (
                <div className="p-4 space-y-4 bg-slate-900/50">
                  <div className="space-y-2">
                    <Label className="text-slate-200">¿El equipo enciende?</Label>
                    <Select value={formData.enciende} onValueChange={(value) => setFormData({ ...formData, enciende: value })}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="si">Sí</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="intermitente">Intermitente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tiene_contrasena"
                        checked={formData.tiene_contrasena}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, tiene_contrasena: checked === true })
                        }
                        className="border-slate-600 data-[state=checked]:bg-green-600"
                      />
                      <Label htmlFor="tiene_contrasena" className="text-slate-300 cursor-pointer">
                        ¿El equipo trae contraseña?
                      </Label>
                    </div>

                    {formData.tiene_contrasena && (
                      <>
                        <Input
                          placeholder="Contraseña proporcionada"
                          value={formData.contrasena}
                          onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                          disabled={formData.no_proporciono_contrasena}
                          className="bg-slate-800 border-slate-700 text-slate-100"
                        />
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="no_proporciono"
                            checked={formData.no_proporciono_contrasena}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, no_proporciono_contrasena: checked === true, contrasena: "" })
                            }
                            className="border-slate-600 data-[state=checked]:bg-amber-600"
                          />
                          <Label htmlFor="no_proporciono" className="text-slate-400 cursor-pointer text-sm">
                            El cliente no proporcionó la contraseña
                          </Label>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Photos */}
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("photos")}
                className="w-full bg-gradient-to-r from-amber-600/20 to-orange-600/20 p-4 flex items-center justify-between hover:from-amber-600/30 hover:to-orange-600/30 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-200">
                  5. Archivos multimedia <span className="text-sm text-slate-400">(mínimo 3 fotos sugeridas)</span>
                </span>
                {collapsedSections.photos ? (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                )}
              </button>
              {!collapsedSections.photos && (
                <div className="p-4 space-y-4 bg-slate-900/50">
                  <div className="space-y-2">
                    <Label htmlFor="photos" className="text-slate-200">
                      Subir fotos del equipo
                    </Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="photos"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-750 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-slate-400" />
                          <p className="text-sm text-slate-400">
                            <span className="font-semibold">Click para subir</span> o arrastra y suelta
                          </p>
                          <p className="text-xs text-slate-500">PNG, JPG hasta 10MB</p>
                        </div>
                        <input
                          id="photos"
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    </div>
                  </div>

                  {formData.fotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {formData.fotos.map((foto, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                            <span className="text-xs text-slate-400">{foto.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section 6: General Notes */}
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("notes")}
                className="w-full bg-gradient-to-r from-slate-600/20 to-slate-700/20 p-4 flex items-center justify-between hover:from-slate-600/30 hover:to-slate-700/30 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-200">6. Notas generales</span>
                {collapsedSections.notes ? (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                )}
              </button>
              {!collapsedSections.notes && (
                <div className="p-4 bg-slate-900/50">
                  <Textarea
                    value={formData.notas_generales}
                    onChange={(e) => setFormData({ ...formData, notas_generales: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100 min-h-[120px]"
                    placeholder="Observaciones adicionales, comentarios del cliente, detalles relevantes..."
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsFormOpen(false)
                  resetForm()
                }}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
              >
                Registrar equipo
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmCreateOS !== null} onOpenChange={() => setConfirmCreateOS(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Crear orden de servicio</DialogTitle>
          </DialogHeader>
          <p className="text-slate-300">
            ¿Deseas crear una nueva orden de servicio para este equipo? Serás redirigido al formulario de creación.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmCreateOS(null)}
              className="border-slate-700 text-slate-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmCreateOSAction}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
            >
              Crear orden
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
