"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { StockBadge } from "@/components/inventory/stock-badge"
import { ProductThumbnail } from "@/components/inventory/product-thumbnail"
import { Separator } from "@/components/ui/separator"
import { Package, Hash, Layers, Calendar, TrendingUp, Lock, CheckCircle } from "lucide-react"
import type { InventoryItem } from "@/lib/types/inventory"
import { getStockStatus, calculateAvailableStock, formatRelativeTime } from "@/lib/utils/inventory-helpers"

interface ProductDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: InventoryItem | null
}

export function ProductDetailsDialog({ open, onOpenChange, product }: ProductDetailsDialogProps) {
  if (!product) return null

  const status = getStockStatus(product.stockTotal, product.stockMinimo)
  const disponible = calculateAvailableStock(product.stockTotal, product.stockReservado)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Detalles del Producto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Image and Basic Info */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <ProductThumbnail 
                categoria={product.categoria} 
                imagen={product.imagen} 
                nombre={product.nombre}
                size="lg"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold text-slate-100">{product.nombre}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
                  {product.categoria}
                </Badge>
                <StockBadge status={status} />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Hash className="h-4 w-4" />
                <span className="font-mono text-indigo-400">{product.sku}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Stock Information Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Package className="h-3.5 w-3.5" />
                <span>Stock Total</span>
              </div>
              <div className="text-2xl font-bold text-slate-100">{product.stockTotal}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Lock className="h-3.5 w-3.5" />
                <span>Reservado</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{product.stockReservado}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Disponible</span>
              </div>
              <div className="text-2xl font-bold text-green-400">{disponible}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Stock Mínimo</span>
              </div>
              <div className="text-2xl font-bold text-amber-400">{product.stockMinimo}</div>
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-400" />
                Información General
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Categoría:</span>
                  <span className="text-slate-300 font-medium">{product.categoria}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SKU:</span>
                  <span className="text-indigo-400 font-mono">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estado:</span>
                  <StockBadge status={status} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                Actividad Reciente
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Último Movimiento:</span>
                  <span className="text-slate-300 font-medium">{formatRelativeTime(product.ultimoMovimiento)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ubicación:</span>
                  <span className="text-slate-300 font-medium">{product.ubicacion || "No especificada"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Status Alert */}
          {status === "Crítico" && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-red-300 mb-1">Stock Crítico</h5>
                  <p className="text-xs text-red-400/80">
                    El stock está por debajo del mínimo requerido. Se recomienda generar una orden de compra urgente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === "Bajo" && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-yellow-300 mb-1">Stock Bajo</h5>
                  <p className="text-xs text-yellow-400/80">
                    El stock se está agotando. Considera reponerlo pronto para evitar faltantes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
