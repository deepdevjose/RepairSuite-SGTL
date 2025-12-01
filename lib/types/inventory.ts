// Inventory Module Types for RepairSuite SGTL

export type StockStatus = "OK" | "Bajo" | "Crítico"

export type MovementType =
  | "Entrada"
  | "Salida"
  | "Transferencia"
  | "Reserva OS"
  | "Ajuste"
  | "Merma"

export type TransferStatus = "Pendiente" | "En tránsito" | "Recibida" | "Cancelada"

export type ProductCategory =
  | "RAM"
  | "SSD"
  | "HDD"
  | "Batería"
  | "Pantalla"
  | "Teclado"
  | "Cargador"
  | "Servicio"
  | "Software"
  | "Otro"

export type SalidaType = "OS" | "Merma" | "Ajuste" | "Otro"

export interface InventoryItem {
  id: string
  sku: string
  nombre: string
  categoria: ProductCategory
  marca?: string
  compatibilidad?: string
  especificaciones?: string
  imagen?: string
  stockTotal: number
  stockReservado: number
  stockMinimo: number
  precioVenta: number
  costoProveedor: number
  ubicacion: string
  ultimoMovimiento: string // ISO date string
  activo: boolean
  garantiaMeses: number
  proveedor?: {
    id: string
    nombre: string
  }
}

export interface InventoryMovement {
  id: string
  sku: string
  tipo: MovementType
  cantidad: number
  fecha: string // ISO date string
  usuario: string
  ordenServicioId?: string // Para salidas/reservas vinculadas a OS
  proveedor?: string // Para entradas
  costoUnitario?: number // Para entradas
  factura?: string // Para entradas
  lote?: string // Para entradas
  notas?: string
  evidencia?: string // URL de imagen/documento
}

export interface StockReservation {
  id: string
  sku: string
  ordenServicioId: string
  folioOS: string
  cliente: string
  cantidadReservada: number
  fechaReserva: string // ISO date string
  fechaEstimadaUso: string // ISO date string
  estado: "Activa" | "Utilizada" | "Liberada"
  usuario: string
}

// TransferOrder interface removed - not needed for single location

export interface PurchaseOrder {
  id: string
  sku: string
  cantidadSolicitada: number
  proveedor: string
  costoEstimado: number
  estado: "Pendiente" | "Enviada" | "Recibida" | "Cancelada"
  fechaSolicitud: string // ISO date string
  fechaEstimadaEntrega?: string // ISO date string
  usuarioSolicita: string
  notas?: string
}

export interface InventoryAlert {
  id: string
  tipo: "stock_bajo" | "stock_critico" | "reserva_pendiente" | "compra_urgente"
  sku: string
  mensaje: string
  prioridad: "alta" | "media" | "baja"
  fecha: string // ISO date string
  leida: boolean
}

export interface InventoryFilters {
  searchTerm: string
  estado: "all" | "OK" | "Bajo" | "Crítico"
  categoria: "all" | ProductCategory
}
