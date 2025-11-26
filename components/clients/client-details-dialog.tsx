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

interface Client {
  id: string
  nombre1: string
  nombre2: string | null
  apellidoPaterno: string
  apellidoMaterno: string | null
  telefono: string
  email: string | null
  calle: string | null
  numero: string | null
  colonia: string | null
  municipio: string | null
  estado: string | null
  pais: string
  sexo: string | null
  edad: number | null
  rfc: string | null
  tipoCliente: string | null
  notas: string | null
  activo: boolean
  createdAt: string
  updatedAt: string
}

interface ClientDetailsDialogProps {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientDetailsDialog({ client, open, onOpenChange }: ClientDetailsDialogProps) {
  if (!client) return null

  const nombreCompleto = `${client.nombre1}${client.nombre2 ? ' ' + client.nombre2 : ''} ${client.apellidoPaterno}${client.apellidoMaterno ? ' ' + client.apellidoMaterno : ''}`
  const direccionCompleta = [client.calle, client.numero, client.colonia, client.municipio, client.estado, client.pais]
    .filter(Boolean)
    .join(', ')

  const tipoClienteLabel = {
    'publico_general': 'Público General',
    'empresa': 'Empresa',
    'recurrente': 'Recurrente'
  }[client.tipoCliente || ''] || 'No especificado'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-100 text-2xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <User className="h-6 w-6 text-violet-400" />
            </div>
            {nombreCompleto}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Client Status Badges */}
          <div className="flex flex-wrap gap-2">
            {client.tipoCliente === 'recurrente' && (
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20">
                <Repeat className="h-3 w-3 mr-1" />
                Cliente recurrente
              </Badge>
            )}
            {client.tipoCliente === 'empresa' && (
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20">
                <Package className="h-3 w-3 mr-1" />
                Empresa
              </Badge>
            )}
            {client.activo ? (
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                Activo
              </Badge>
            ) : (
              <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">
                Inactivo
              </Badge>
            )}
          </div>

          {/* Personal Information */}
          <Card className="bg-slate-800/50 border-slate-700/50 p-5">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-violet-400" />
              Información Personal
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Nombre completo</p>
                <p className="text-sm text-slate-200">{nombreCompleto}</p>
              </div>
              {client.sexo && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Sexo</p>
                  <p className="text-sm text-slate-200">
                    {client.sexo === 'M' ? 'Masculino' : client.sexo === 'F' ? 'Femenino' : 'Otro'}
                  </p>
                </div>
              )}
              {client.edad && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Edad</p>
                  <p className="text-sm text-slate-200">{client.edad} años</p>
                </div>
              )}
              {client.rfc && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">RFC</p>
                  <p className="text-sm text-slate-200 font-mono">{client.rfc}</p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Tipo de Cliente</p>
                <p className="text-sm text-slate-200">{tipoClienteLabel}</p>
              </div>
            </div>
          </Card>

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
                  {client.email || '—'}
                </p>
              </div>
              {direccionCompleta && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-xs text-slate-500 font-medium">Dirección</p>
                  <p className="text-sm text-slate-200 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {direccionCompleta}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="bg-slate-800/50 border-slate-700/50 p-5">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-400" />
              Información adicional
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Fecha de registro</p>
                <p className="text-sm text-slate-200">
                  {new Date(client.createdAt).toLocaleDateString('es-MX', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Última actualización</p>
                <p className="text-sm text-slate-200">
                  {new Date(client.updatedAt).toLocaleDateString('es-MX', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              {client.notas && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-xs text-slate-500 font-medium">Notas internas</p>
                  <p className="text-sm text-slate-200 bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
                    {client.notas}
                  </p>
                </div>
              )}
            </div>
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
