"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Package, 
  ClipboardList, 
  Repeat,
  Edit,
  Plus,
  FileText,
  Wrench
} from 'lucide-react'

interface Equipment {
  id: number
  marca: string
  modelo: string
  serie: string
}

interface Client {
  id: number
  nombre: string
  telefono: string
  correo: string
  fecha_registro: string
  num_equipos: number
  ultimo_servicio: string | null
  ordenes_activas: number
  es_recurrente: boolean
  equipos: Equipment[]
}

interface ClientDetailsDialogProps {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientDetailsDialog({ client, open, onOpenChange }: ClientDetailsDialogProps) {
  if (!client) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-100 text-2xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <User className="h-6 w-6 text-violet-400" />
            </div>
            {client.nombre}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Client Status Badges */}
          <div className="flex flex-wrap gap-2">
            {client.es_recurrente && (
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20">
                <Repeat className="h-3 w-3 mr-1" />
                Cliente recurrente
              </Badge>
            )}
            {client.ordenes_activas > 0 && (
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20">
                <ClipboardList className="h-3 w-3 mr-1" />
                {client.ordenes_activas} {client.ordenes_activas === 1 ? 'orden activa' : 'órdenes activas'}
              </Badge>
            )}
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
              <Package className="h-3 w-3 mr-1" />
              {client.num_equipos} {client.num_equipos === 1 ? 'equipo' : 'equipos'}
            </Badge>
          </div>

          {/* Contact Information */}
          <Card className="bg-slate-800/50 border-slate-700/50 p-5">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-violet-400" />
              Información de contacto
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Teléfono</p>
                <p className="text-sm text-slate-200 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {client.telefono}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Correo electrónico</p>
                <p className="text-sm text-slate-200 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {client.correo}
                </p>
              </div>
            </div>
          </Card>

          {/* Service History */}
          <Card className="bg-slate-800/50 border-slate-700/50 p-5">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-400" />
              Historial de servicio
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Fecha de registro</p>
                <p className="text-sm text-slate-200">{client.fecha_registro}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Último servicio</p>
                <p className="text-sm text-slate-200">
                  {client.ultimo_servicio || 'Sin servicios previos'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Órdenes activas</p>
                <p className="text-sm text-slate-200">{client.ordenes_activas}</p>
              </div>
            </div>
          </Card>

          {/* Equipment List */}
          <Card className="bg-slate-800/50 border-slate-700/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <Package className="h-5 w-5 text-violet-400" />
                Equipos registrados
              </h3>
              <Badge className="bg-slate-700/50 text-slate-300">
                {client.equipos.length} {client.equipos.length === 1 ? 'equipo' : 'equipos'}
              </Badge>
            </div>
            
            {client.equipos.length > 0 ? (
              <div className="space-y-3">
                {client.equipos.map((equipo) => (
                  <div
                    key={equipo.id}
                    className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-violet-500/40 hover:bg-slate-900/70 transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-100 mb-2">
                          {equipo.marca} {equipo.modelo}
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-slate-500">Marca</p>
                            <p className="text-xs text-slate-300">{equipo.marca}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Modelo</p>
                            <p className="text-xs text-slate-300">{equipo.modelo}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Serie</p>
                            <p className="text-xs text-slate-300 font-mono">{equipo.serie}</p>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 font-mono bg-slate-800/50 px-2 py-1 rounded">
                        #{equipo.id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-3 text-slate-600" />
                <p className="text-sm text-slate-400">No hay equipos registrados</p>
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800/50">
            <Button
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all"
              onClick={() => {
                console.log('[ClientDetails] Editar cliente:', client.id)
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar cliente
            </Button>
            <Button
              variant="outline"
              className="border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
              onClick={() => {
                console.log('[ClientDetails] Agregar equipo para cliente:', client.id)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar equipo
            </Button>
            <Button
              variant="outline"
              className="border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
              onClick={() => {
                console.log('[ClientDetails] Nueva orden de servicio para cliente:', client.id)
              }}
            >
              <Wrench className="h-4 w-4 mr-2" />
              Nueva orden de servicio
            </Button>
            <Button
              variant="outline"
              className="border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
              onClick={() => {
                console.log('[ClientDetails] Ver historial completo:', client.id)
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Ver historial completo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
