// Catalog Module Types for RepairSuite SGTL

export type CatalogItemType = "Servicio" | "Refacción" | "Paquete"

export type ServiceCategory =
    | "Hardware"
    | "Software"
    | "Mantenimiento"
    | "Seguridad"
    | "Datos"
    | "Diagnóstico"
    | "Reparación"
    | "Upgrade"

export type ComplexityLevel = "Básico" | "Intermedio" | "Avanzado" | "Experto"

export type EquipmentType =
    | "Laptop"
    | "Desktop"
    | "All-in-One"
    | "Tablet"
    | "Servidor"
    | "Impresora"
    | "Otro"

// Service Breakdown - what's included in the service
export interface ServiceBreakdown {
    incluyeLimpieza: boolean
    incluyeFormateo: boolean
    incluyeDrivers: boolean
    incluyePruebasHardware: boolean
    incluyeRespaldo: boolean
    incluyeOptimizacion: boolean
    incluyeActualizacionBIOS: boolean
    otrosIncluidos?: string
}

// Material needed for a service
export interface ServiceMaterial {
    inventarioSKU: string
    nombre: string
    cantidadNecesaria: number
    costoUnitario: number
}

// Complete Service Item
export interface ServiceItem {
    id: string
    sku: string
    tipo: "Servicio"
    nombre: string
    descripcion: string
    categoria: ServiceCategory
    desglose: ServiceBreakdown
    tiempoEstimadoMinutos: number
    nivelComplejidad: ComplexityLevel
    requiereDiagnostico: boolean
    instruccionesTecnico?: string
    materialesNecesarios: ServiceMaterial[]
    precioBase: number
    garantiaDias: number
    equiposCompatibles: EquipmentType[]
    activo: boolean
    creadoPor: string
    fechaCreacion: string
    modificadoPor?: string
    fechaModificacion?: string
}

// Part/Refacción compatibility
export interface PartCompatibility {
    marcas: string[]
    modelos: string[]
    descripcion?: string
}

// Supplier information (basic, for use in PartItem)
export interface SupplierInfo {
    id: string
    nombre: string
    contacto?: string
    telefono?: string
    email?: string
    tiempoEntregaDias: number
}

// Supplier address
export interface SupplierAddress {
    calle: string
    colonia: string
    municipio: string
    estado: string
    pais: string
    codigoPostal: string
}

// Product associated with supplier
export interface SupplierProduct {
    catalogoSKU: string
    nombreProducto: string
    costoProveedor: number
    garantiaProveedorDias: number
    minimoPedido?: number
    ultimaCompra?: string
    notas?: string
}

// Complete Supplier (full entity)
export interface Supplier {
    // Información general
    id: string
    nombreComercial: string
    razonSocial: string
    rfc: string

    // Contacto
    contactoPrincipal: string
    telefono: string
    email: string
    sitioWeb?: string

    // Dirección fiscal
    direccion: SupplierAddress

    // Logística
    tiempoEntregaPromedioDias: number
    metodoEnvio: "Paquetería" | "Entrega local" | "Recolección"
    costoPromedioEnvio?: number
    condicionesPago: "Contado" | "15 días" | "30 días" | "Crédito especial"

    // Productos
    productosAsociados: SupplierProduct[]

    // Estado
    activo: boolean
    notas?: string

    // Metadata
    fechaCreacion: string
    creadoPor: string
    fechaModificacion?: string
    modificadoPor?: string
}

// Purchase Order Item
export interface PurchaseOrderItem {
    catalogoSKU: string
    nombreProducto: string
    cantidad: number
    costoUnitario: number
    subtotal: number
}

// Purchase Order
export interface PurchaseOrder {
    id: string
    proveedorId: string
    proveedorNombre: string
    fecha: string
    productos: PurchaseOrderItem[]
    subtotal: number
    envio: number
    total: number
    estado: "Pendiente" | "En tránsito" | "Recibida" | "Cancelada"
    numeroFactura?: string
    numeroRemision?: string
    lote?: string
    fechaEstimadaEntrega?: string
    fechaRecepcion?: string
    notas?: string
    creadoPor: string
    sucursalDestino: string
}

// Complete Part/Refacción Item
export interface PartItem {
    id: string
    sku: string
    tipo: "Refacción"
    nombre: string
    descripcion: string
    marca?: string
    modelo?: string
    compatibilidad: PartCompatibility
    especificaciones?: string
    proveedor: SupplierInfo
    codigoProveedor?: string
    costoProveedor: number
    precioVenta: number
    margen: number // Calculated: ((precioVenta - costoProveedor) / precioVenta) * 100
    tiempoEntregaProveedorDias: number
    inventarioSKU?: string // Link to inventory
    stockMinimo?: number
    stockMaximo?: number
    garantiaClienteDias: number
    garantiaProveedorDias: number
    activo: boolean
    creadoPor: string
    fechaCreacion: string
    modificadoPor?: string
    fechaModificacion?: string
}

// Service included in a package
export interface PackageService {
    servicioSKU: string
    nombre: string
    precioIndividual: number
}

// Complete Package/Combo Item
export interface PackageItem {
    id: string
    sku: string
    tipo: "Paquete"
    nombre: string
    descripcion: string
    serviciosIncluidos: PackageService[]
    precioIndividualTotal: number // Sum of all services
    precioPaquete: number
    ahorro: number // precioIndividualTotal - precioPaquete
    porcentajeDescuento: number // (ahorro / precioIndividualTotal) * 100
    tiempoEstimadoTotalMinutos: number
    garantiaDias: number
    activo: boolean
    popularidad: number // Number of times sold
    creadoPor: string
    fechaCreacion: string
    modificadoPor?: string
    fechaModificacion?: string
}

// Union type for all catalog items
export type CatalogItem = ServiceItem | PartItem | PackageItem

// Price history for auditing
export interface PriceHistory {
    id: string
    catalogoSKU: string
    campoModificado: "precioBase" | "precioVenta" | "costoProveedor" | "precioPaquete"
    valorAnterior: number
    valorNuevo: number
    motivo?: string
    usuario: string
    fecha: string
}

// General change log for catalog items
export interface CatalogChangeLog {
    id: string
    catalogoSKU: string
    campoModificado: string
    valorAnterior: string
    valorNuevo: string
    motivo?: string
    usuario: string
    fecha: string
}

// Filters for catalog
export interface CatalogFilters {
    searchTerm: string
    tipo: "all" | CatalogItemType
    categoria: "all" | ServiceCategory
    marca: "all" | string
    proveedor: "all" | string
    stockStatus: "all" | "OK" | "Bajo" | "Crítico" | "Sin Stock"
    activo: "all" | "true" | "false"
}

// Stock status for parts linked to inventory
export interface PartStockStatus {
    sku: string
    stockTotal: number
    stockDisponible: number
    stockReservado: number
    estado: "OK" | "Bajo" | "Crítico" | "Sin Stock"
}
