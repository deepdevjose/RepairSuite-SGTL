import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClientForm } from "@/components/client-form"
import { NewEquipmentDialog } from "@/components/dashboard/new-equipment-dialog"
import { NewServiceOrderDialog } from "@/components/dashboard/new-service-order-dialog"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  Repeat,
  Edit,
  Plus,
  Wrench,
  Trash2,
  Laptop
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

interface Equipment {
  id: string
  tipo: string
  marca: string
  modelo: string
  numeroSerie: string | null
}

interface ClientDetailsDialogProps {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onClientUpdated?: (client?: any) => void
}

export function ClientDetailsDialog({ client, open, onOpenChange, onClientUpdated }: ClientDetailsDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isNewEquipmentOpen, setIsNewEquipmentOpen] = useState(false)
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
  const [equipos, setEquipos] = useState<Equipment[]>([])
  const [loadingEquipos, setLoadingEquipos] = useState(false)

  // Fetch equipments when dialog opens
  useEffect(() => {
    if (open && client) {
      fetchEquipos()
    }
  }, [open, client])

  const fetchEquipos = async () => {
    if (!client) return
    try {
      setLoadingEquipos(true)
      const res = await fetch(`/api/equipos?clienteId=${client.id}`)
      if (res.ok) {
        const data = await res.json()
        setEquipos(data)
      }
    } catch (error) {
      console.error("Error fetching equipments:", error)
    } finally {
      setLoadingEquipos(false)
    }
  }

  const handleDeleteClient = async () => {
    if (!client) return
    try {
      const res = await fetch(`/api/clientes/${client.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast({
          title: "Cliente eliminado",
          description: "El cliente ha sido eliminado correctamente.",
        })
        onClientUpdated?.(null) // Signal deletion
        onOpenChange(false)
      } else {
        throw new Error("Error al eliminar cliente")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteEquipment = async (equipmentId: string) => {
    try {
      const res = await fetch(`/api/equipos/${equipmentId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast({
          title: "Equipo eliminado",
          description: "El equipo ha sido eliminado correctamente.",
        })
        fetchEquipos() // Refresh list
      } else {
        throw new Error("Error al eliminar equipo")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el equipo.",
        variant: "destructive"
      })
    }
  }

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

  const isAdmin = user?.role === "Administrador"

  return (
    <>
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

            {/* Equipos Registrados */}
            <Card className="bg-slate-800/50 border-slate-700/50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Laptop className="h-5 w-5 text-violet-400" />
                  Equipos Registrados
                </h3>
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 border-slate-700 text-slate-300 hover:bg-slate-800"
                    onClick={() => setIsNewEquipmentOpen(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Agregar
                  </Button>
                )}
              </div>

              {loadingEquipos ? (
                <p className="text-sm text-slate-500">Cargando equipos...</p>
              ) : equipos.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No hay equipos registrados.</p>
              ) : (
                <div className="space-y-3">
                  {equipos.map((equipo) => (
                    <div key={equipo.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                      <div>
                        <p className="text-sm font-medium text-slate-200">{equipo.tipo} {equipo.marca} {equipo.modelo}</p>
                        {equipo.numeroSerie && <p className="text-xs text-slate-500 font-mono">SN: {equipo.numeroSerie}</p>}
                      </div>
                      {isAdmin && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar equipo?</AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-400">
                                Esta acción no se puede deshacer. Se eliminará el equipo permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700">Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteEquipment(equipo.id)} className="bg-red-600 hover:bg-red-700 text-white border-0">Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800/50 justify-between">
              <div className="flex gap-3">
                <Button
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all"
                  onClick={() => setIsEditOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar cliente
                </Button>

                {!isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      className="border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
                      onClick={() => setIsNewEquipmentOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar equipo
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
                      onClick={() => setIsNewOrderOpen(true)}
                    >
                      <Wrench className="h-4 w-4 mr-2" />
                      Nueva orden de servicio
                    </Button>
                  </>
                )}
              </div>

              {isAdmin && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar Cliente
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        Esta acción desactivará al cliente. No se perderán sus datos históricos pero ya no aparecerá en las listas activas.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700">Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteClient} className="bg-red-600 hover:bg-red-700 text-white border-0">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* Edit Client Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <ClientForm
            initialData={{
              ...client,
              nombre2: client.nombre2 || "",
              apellidoMaterno: client.apellidoMaterno || "",
              email: client.email || "",
              calle: client.calle || "",
              numero: client.numero || "",
              colonia: client.colonia || "",
              municipio: client.municipio || "",
              estado: client.estado || "",
              sexo: client.sexo || "",
              edad: client.edad?.toString() || "",
              rfc: client.rfc || "",
              tipoCliente: client.tipoCliente || "",
              notas: client.notas || ""
            }}
            onClose={() => setIsEditOpen(false)}
            onSuccess={(updatedClient) => {
              setIsEditOpen(false)
              onClientUpdated?.(updatedClient)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* New Equipment Dialog */}
      <NewEquipmentDialog
        open={isNewEquipmentOpen}
        onOpenChange={setIsNewEquipmentOpen}
        initialClientId={client.id}
      />

      {/* New Service Order Dialog */}
      <NewServiceOrderDialog
        open={isNewOrderOpen}
        onOpenChange={setIsNewOrderOpen}
        initialClientId={client.id}
      />
    </>
  )
}
