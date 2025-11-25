"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Wrench, Cpu, Package } from "lucide-react"
import type { ServiceCategory, ComplexityLevel, EquipmentType } from "@/lib/types/catalog"

interface NewProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (product: any) => void
}

export function NewProductDialog({ open, onOpenChange, onSave }: NewProductDialogProps) {
  const { toast } = useToast()
  const [productType, setProductType] = useState<"servicio" | "refaccion" | "paquete">("servicio")

  // Service form data
  const [serviceData, setServiceData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "" as ServiceCategory | "",
    precioBase: "",
    tiempoEstimadoMinutos: "",
    nivelComplejidad: "" as ComplexityLevel | "",
    garantiaDias: "90",
    equiposCompatibles: [] as EquipmentType[],
    requiereDiagnostico: false,
  })

  // Part form data
  const [partData, setPartData] = useState({
    nombre: "",
    descripcion: "",
    marca: "",
    modelo: "",
    costoProveedor: "",
    precioVenta: "",
    garantiaClienteDias: "90",
    garantiaProveedorDias: "180",
  })

  // Package form data
  const [packageData, setPackageData] = useState({
    nombre: "",
    descripcion: "",
    precioPaquete: "",
    garantiaDias: "90",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) {
      // Reset all forms
      setServiceData({
        nombre: "",
        descripcion: "",
        categoria: "",
        precioBase: "",
        tiempoEstimadoMinutos: "",
        nivelComplejidad: "",
        garantiaDias: "90",
        equiposCompatibles: [],
        requiereDiagnostico: false,
      })
      setPartData({
        nombre: "",
        descripcion: "",
        marca: "",
        modelo: "",
        costoProveedor: "",
        precioVenta: "",
        garantiaClienteDias: "90",
        garantiaProveedorDias: "180",
      })
      setPackageData({
        nombre: "",
        descripcion: "",
        precioPaquete: "",
        garantiaDias: "90",
      })
      setErrors({})
      setProductType("servicio")
    }
  }, [open])

  const validateService = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!serviceData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
    if (!serviceData.descripcion.trim()) newErrors.descripcion = "La descripción es requerida"
    if (!serviceData.categoria) newErrors.categoria = "La categoría es requerida"
    if (!serviceData.precioBase || parseFloat(serviceData.precioBase) <= 0)
      newErrors.precioBase = "El precio debe ser mayor a 0"
    if (!serviceData.tiempoEstimadoMinutos || parseInt(serviceData.tiempoEstimadoMinutos) <= 0)
      newErrors.tiempoEstimadoMinutos = "El tiempo estimado es requerido"
    if (!serviceData.nivelComplejidad) newErrors.nivelComplejidad = "El nivel de complejidad es requerido"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePart = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!partData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
    if (!partData.descripcion.trim()) newErrors.descripcion = "La descripción es requerida"
    if (!partData.marca.trim()) newErrors.marca = "La marca es requerida"
    if (!partData.costoProveedor || parseFloat(partData.costoProveedor) <= 0)
      newErrors.costoProveedor = "El costo debe ser mayor a 0"
    if (!partData.precioVenta || parseFloat(partData.precioVenta) <= 0)
      newErrors.precioVenta = "El precio de venta debe ser mayor a 0"
    if (
      partData.costoProveedor &&
      partData.precioVenta &&
      parseFloat(partData.precioVenta) <= parseFloat(partData.costoProveedor)
    ) {
      newErrors.precioVenta = "El precio de venta debe ser mayor al costo"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePackage = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!packageData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
    if (!packageData.descripcion.trim()) newErrors.descripcion = "La descripción es requerida"
    if (!packageData.precioPaquete || parseFloat(packageData.precioPaquete) <= 0)
      newErrors.precioPaquete = "El precio debe ser mayor a 0"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    let isValid = false

    if (productType === "servicio") {
      isValid = validateService()
    } else if (productType === "refaccion") {
      isValid = validatePart()
    } else {
      isValid = validatePackage()
    }

    if (!isValid) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    // Generate SKU based on type
    const timestamp = Date.now()
    let sku = ""
    let newProduct: any = {}

    if (productType === "servicio") {
      sku = `SRV-${timestamp}`
      newProduct = {
        id: sku,
        sku,
        tipo: "Servicio",
        ...serviceData,
        precioBase: parseFloat(serviceData.precioBase),
        tiempoEstimadoMinutos: parseInt(serviceData.tiempoEstimadoMinutos),
        garantiaDias: parseInt(serviceData.garantiaDias),
        materialesNecesarios: [],
        desglose: {
          incluyeLimpieza: false,
          incluyeFormateo: false,
          incluyeDrivers: false,
          incluyePruebasHardware: false,
          incluyeRespaldo: false,
          incluyeOptimizacion: false,
          incluyeActualizacionBIOS: false,
        },
        activo: true,
        creadoPor: "Usuario Actual",
        fechaCreacion: new Date().toISOString(),
      }
    } else if (productType === "refaccion") {
      sku = `PRT-${timestamp}`
      const costo = parseFloat(partData.costoProveedor)
      const precio = parseFloat(partData.precioVenta)
      const margen = ((precio - costo) / precio) * 100

      newProduct = {
        id: sku,
        sku,
        tipo: "Refacción",
        ...partData,
        costoProveedor: costo,
        precioVenta: precio,
        margen,
        garantiaClienteDias: parseInt(partData.garantiaClienteDias),
        garantiaProveedorDias: parseInt(partData.garantiaProveedorDias),
        compatibilidad: {
          marcas: [],
          modelos: [],
        },
        proveedor: {
          id: "PROV-001",
          nombre: "Proveedor Genérico",
          tiempoEntregaDias: 7,
        },
        tiempoEntregaProveedorDias: 7,
        activo: true,
        creadoPor: "Usuario Actual",
        fechaCreacion: new Date().toISOString(),
      }
    } else {
      sku = `PKG-${timestamp}`
      newProduct = {
        id: sku,
        sku,
        tipo: "Paquete",
        ...packageData,
        precioPaquete: parseFloat(packageData.precioPaquete),
        garantiaDias: parseInt(packageData.garantiaDias),
        serviciosIncluidos: [],
        precioIndividualTotal: 0,
        ahorro: 0,
        porcentajeDescuento: 0,
        tiempoEstimadoTotalMinutos: 0,
        popularidad: 0,
        activo: true,
        creadoPor: "Usuario Actual",
        fechaCreacion: new Date().toISOString(),
      }
    }

    console.log("Nuevo producto creado:", newProduct)
    onSave?.(newProduct)

    toast({
      title: "Producto creado exitosamente",
      description: `${newProduct.tipo}: ${newProduct.nombre}`,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Nuevo Producto</DialogTitle>
        </DialogHeader>

        <Tabs value={productType} onValueChange={(value: any) => setProductType(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/40">
            <TabsTrigger value="servicio" className="data-[state=active]:bg-blue-600">
              <Wrench className="h-4 w-4 mr-2" />
              Servicio
            </TabsTrigger>
            <TabsTrigger value="refaccion" className="data-[state=active]:bg-purple-600">
              <Cpu className="h-4 w-4 mr-2" />
              Refacción
            </TabsTrigger>
            <TabsTrigger value="paquete" className="data-[state=active]:bg-orange-600">
              <Package className="h-4 w-4 mr-2" />
              Paquete
            </TabsTrigger>
          </TabsList>

          {/* Service Form */}
          <TabsContent value="servicio" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="service-nombre" className="text-slate-200">
                Nombre del Servicio *
              </Label>
              <Input
                id="service-nombre"
                value={serviceData.nombre}
                onChange={(e) => setServiceData({ ...serviceData, nombre: e.target.value })}
                className="bg-slate-800/40 border-slate-700 text-slate-100"
                placeholder="Ej: Formateo e instalación de Windows"
              />
              {errors.nombre && <p className="text-xs text-red-400">{errors.nombre}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-descripcion" className="text-slate-200">
                Descripción *
              </Label>
              <Textarea
                id="service-descripcion"
                value={serviceData.descripcion}
                onChange={(e) => setServiceData({ ...serviceData, descripcion: e.target.value })}
                className="bg-slate-800/40 border-slate-700 text-slate-100 min-h-[80px]"
                placeholder="Describe el servicio en detalle..."
              />
              {errors.descripcion && <p className="text-xs text-red-400">{errors.descripcion}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-categoria" className="text-slate-200">
                  Categoría *
                </Label>
                <Select
                  value={serviceData.categoria}
                  onValueChange={(value: ServiceCategory) => setServiceData({ ...serviceData, categoria: value })}
                >
                  <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100">
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="Hardware">Hardware</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="Seguridad">Seguridad</SelectItem>
                    <SelectItem value="Datos">Datos</SelectItem>
                    <SelectItem value="Diagnóstico">Diagnóstico</SelectItem>
                    <SelectItem value="Reparación">Reparación</SelectItem>
                    <SelectItem value="Upgrade">Upgrade</SelectItem>
                  </SelectContent>
                </Select>
                {errors.categoria && <p className="text-xs text-red-400">{errors.categoria}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-complejidad" className="text-slate-200">
                  Complejidad *
                </Label>
                <Select
                  value={serviceData.nivelComplejidad}
                  onValueChange={(value: ComplexityLevel) =>
                    setServiceData({ ...serviceData, nivelComplejidad: value })
                  }
                >
                  <SelectTrigger className="bg-slate-800/40 border-slate-700 text-slate-100">
                    <SelectValue placeholder="Selecciona nivel" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="Básico">Básico</SelectItem>
                    <SelectItem value="Intermedio">Intermedio</SelectItem>
                    <SelectItem value="Avanzado">Avanzado</SelectItem>
                    <SelectItem value="Experto">Experto</SelectItem>
                  </SelectContent>
                </Select>
                {errors.nivelComplejidad && <p className="text-xs text-red-400">{errors.nivelComplejidad}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-precio" className="text-slate-200">
                  Precio Base *
                </Label>
                <Input
                  id="service-precio"
                  type="number"
                  step="0.01"
                  value={serviceData.precioBase}
                  onChange={(e) => setServiceData({ ...serviceData, precioBase: e.target.value })}
                  className="bg-slate-800/40 border-slate-700 text-slate-100"
                  placeholder="0.00"
                />
                {errors.precioBase && <p className="text-xs text-red-400">{errors.precioBase}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-tiempo" className="text-slate-200">
                  Tiempo (min) *
                </Label>
                <Input
                  id="service-tiempo"
                  type="number"
                  value={serviceData.tiempoEstimadoMinutos}
                  onChange={(e) => setServiceData({ ...serviceData, tiempoEstimadoMinutos: e.target.value })}
                  className="bg-slate-800/40 border-slate-700 text-slate-100"
                  placeholder="60"
                />
                {errors.tiempoEstimadoMinutos && <p className="text-xs text-red-400">{errors.tiempoEstimadoMinutos}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-garantia" className="text-slate-200">
                  Garantía (días)
                </Label>
                <Input
                  id="service-garantia"
                  type="number"
                  value={serviceData.garantiaDias}
                  onChange={(e) => setServiceData({ ...serviceData, garantiaDias: e.target.value })}
                  className="bg-slate-800/40 border-slate-700 text-slate-100"
                  placeholder="90"
                />
              </div>
            </div>
          </TabsContent>

          {/* Part Form */}
          <TabsContent value="refaccion" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="part-nombre" className="text-slate-200">
                Nombre de la Refacción *
              </Label>
              <Input
                id="part-nombre"
                value={partData.nombre}
                onChange={(e) => setPartData({ ...partData, nombre: e.target.value })}
                className="bg-slate-800/40 border-slate-700 text-slate-100"
                placeholder="Ej: Disco Duro SSD 240GB"
              />
              {errors.nombre && <p className="text-xs text-red-400">{errors.nombre}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="part-descripcion" className="text-slate-200">
                Descripción *
              </Label>
              <Textarea
                id="part-descripcion"
                value={partData.descripcion}
                onChange={(e) => setPartData({ ...partData, descripcion: e.target.value })}
                className="bg-slate-800/40 border-slate-700 text-slate-100 min-h-[80px]"
                placeholder="Describe la refacción en detalle..."
              />
              {errors.descripcion && <p className="text-xs text-red-400">{errors.descripcion}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="part-marca" className="text-slate-200">
                  Marca *
                </Label>
                <Input
                  id="part-marca"
                  value={partData.marca}
                  onChange={(e) => setPartData({ ...partData, marca: e.target.value })}
                  className="bg-slate-800/40 border-slate-700 text-slate-100"
                  placeholder="Ej: Kingston"
                />
                {errors.marca && <p className="text-xs text-red-400">{errors.marca}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="part-modelo" className="text-slate-200">
                  Modelo
                </Label>
                <Input
                  id="part-modelo"
                  value={partData.modelo}
                  onChange={(e) => setPartData({ ...partData, modelo: e.target.value })}
                  className="bg-slate-800/40 border-slate-700 text-slate-100"
                  placeholder="Ej: A400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="part-costo" className="text-slate-200">
                  Costo Proveedor *
                </Label>
                <Input
                  id="part-costo"
                  type="number"
                  step="0.01"
                  value={partData.costoProveedor}
                  onChange={(e) => setPartData({ ...partData, costoProveedor: e.target.value })}
                  className="bg-slate-800/40 border-slate-700 text-slate-100"
                  placeholder="0.00"
                />
                {errors.costoProveedor && <p className="text-xs text-red-400">{errors.costoProveedor}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="part-precio" className="text-slate-200">
                  Precio Venta *
                </Label>
                <Input
                  id="part-precio"
                  type="number"
                  step="0.01"
                  value={partData.precioVenta}
                  onChange={(e) => setPartData({ ...partData, precioVenta: e.target.value })}
                  className="bg-slate-800/40 border-slate-700 text-slate-100"
                  placeholder="0.00"
                />
                {errors.precioVenta && <p className="text-xs text-red-400">{errors.precioVenta}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="part-garantia-cliente" className="text-slate-200">
                  Garantía Cliente (días)
                </Label>
                <Input
                  id="part-garantia-cliente"
                  type="number"
                  value={partData.garantiaClienteDias}
                  onChange={(e) => setPartData({ ...partData, garantiaClienteDias: e.target.value })}
                  className="bg-slate-800/40 border-slate-700 text-slate-100"
                  placeholder="90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="part-garantia-proveedor" className="text-slate-200">
                  Garantía Proveedor (días)
                </Label>
                <Input
                  id="part-garantia-proveedor"
                  type="number"
                  value={partData.garantiaProveedorDias}
                  onChange={(e) => setPartData({ ...partData, garantiaProveedorDias: e.target.value })}
                  className="bg-slate-800/40 border-slate-700 text-slate-100"
                  placeholder="180"
                />
              </div>
            </div>

            {partData.costoProveedor && partData.precioVenta && (
              <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-400">
                  Margen:{" "}
                  <span className="text-green-400 font-semibold">
                    {(
                      ((parseFloat(partData.precioVenta) - parseFloat(partData.costoProveedor)) /
                        parseFloat(partData.precioVenta)) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </p>
              </div>
            )}
          </TabsContent>

          {/* Package Form */}
          <TabsContent value="paquete" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="package-nombre" className="text-slate-200">
                Nombre del Paquete *
              </Label>
              <Input
                id="package-nombre"
                value={packageData.nombre}
                onChange={(e) => setPackageData({ ...packageData, nombre: e.target.value })}
                className="bg-slate-800/40 border-slate-700 text-slate-100"
                placeholder="Ej: Paquete Mantenimiento Completo"
              />
              {errors.nombre && <p className="text-xs text-red-400">{errors.nombre}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="package-descripcion" className="text-slate-200">
                Descripción *
              </Label>
              <Textarea
                id="package-descripcion"
                value={packageData.descripcion}
                onChange={(e) => setPackageData({ ...packageData, descripcion: e.target.value })}
                className="bg-slate-800/40 border-slate-700 text-slate-100 min-h-[80px]"
                placeholder="Describe el paquete en detalle..."
              />
              {errors.descripcion && <p className="text-xs text-red-400">{errors.descripcion}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="package-precio" className="text-slate-200">
                  Precio del Paquete *
                </Label>
                <Input
                  id="package-precio"
                  type="number"
                  step="0.01"
                  value={packageData.precioPaquete}
                  onChange={(e) => setPackageData({ ...packageData, precioPaquete: e.target.value })}
                  className="bg-slate-800/40 border-slate-700 text-slate-100"
                  placeholder="0.00"
                />
                {errors.precioPaquete && <p className="text-xs text-red-400">{errors.precioPaquete}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="package-garantia" className="text-slate-200">
                  Garantía (días)
                </Label>
                <Input
                  id="package-garantia"
                  type="number"
                  value={packageData.garantiaDias}
                  onChange={(e) => setPackageData({ ...packageData, garantiaDias: e.target.value })}
                  className="bg-slate-800/40 border-slate-700 text-slate-100"
                  placeholder="90"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-400">
                💡 Nota: Después de crear el paquete, podrás agregar los servicios incluidos desde la página de
                detalles.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-300">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-500">
            Crear Producto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
