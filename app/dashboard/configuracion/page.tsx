"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Settings, Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mockSystemConfig } from "@/lib/data/config-mock"
import type { Branch, OrderStatus, NotificationTemplate } from "@/lib/types/config"
import { BranchFormDialog } from "@/components/config/branch-form-dialog"
import { StatusFormDialog } from "@/components/config/status-form-dialog"
import { NotificationTemplateEditor } from "@/components/config/notification-template-editor"

export default function ConfiguracionPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()

  const [config, setConfig] = useState(mockSystemConfig)
  const [isBranchFormOpen, setIsBranchFormOpen] = useState(false)
  const [isStatusFormOpen, setIsStatusFormOpen] = useState(false)
  const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null)

  if (!hasPermission("configuracion")) {
    return (
      <>
        <DashboardHeader title="Configuración" />
        <AccessDenied />
      </>
    )
  }

  const handleSaveGeneral = () => {
    toast({
      title: "Configuración guardada",
      description: "Los datos generales se han guardado correctamente.",
    })
  }

  const handleSavePolicies = () => {
    toast({
      title: "Políticas guardadas",
      description: "Las políticas del negocio se han actualizado correctamente.",
    })
  }

  return (
    <>
      <DashboardHeader title="Configuración" />
      <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Header Card */}
          <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-600 p-2">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-100">Configuración del Sistema</h2>
                <p className="text-sm text-slate-400">Administra los parámetros generales de RepairSuite</p>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-900/60 backdrop-blur-sm border-white/5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="sucursales">Sucursales</TabsTrigger>
              <TabsTrigger value="estados">Estados de OS</TabsTrigger>
              <TabsTrigger value="politicas">Políticas</TabsTrigger>
              <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
            </TabsList>

            {/* Tab 1: General */}
            <TabsContent value="general" className="mt-6">
              <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-6">Datos del Taller</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombreComercial" className="text-slate-200">
                        Nombre Comercial
                      </Label>
                      <Input
                        id="nombreComercial"
                        value={config.nombreComercial}
                        onChange={(e) => setConfig({ ...config, nombreComercial: e.target.value })}
                        className="bg-slate-800/40 border-slate-700 text-slate-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="razonSocial" className="text-slate-200">
                        Razón Social
                      </Label>
                      <Input
                        id="razonSocial"
                        value={config.razonSocial}
                        onChange={(e) => setConfig({ ...config, razonSocial: e.target.value })}
                        className="bg-slate-800/40 border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rfc" className="text-slate-200">
                        RFC
                      </Label>
                      <Input
                        id="rfc"
                        value={config.rfc}
                        onChange={(e) => setConfig({ ...config, rfc: e.target.value })}
                        className="bg-slate-800/40 border-slate-700 text-slate-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono" className="text-slate-200">
                        Teléfono
                      </Label>
                      <Input
                        id="telefono"
                        value={config.telefono}
                        onChange={(e) => setConfig({ ...config, telefono: e.target.value })}
                        className="bg-slate-800/40 border-slate-700 text-slate-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-200">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={config.email}
                        onChange={(e) => setConfig({ ...config, email: e.target.value })}
                        className="bg-slate-800/40 border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sitioWeb" className="text-slate-200">
                      Sitio Web
                    </Label>
                    <Input
                      id="sitioWeb"
                      value={config.sitioWeb || ""}
                      onChange={(e) => setConfig({ ...config, sitioWeb: e.target.value })}
                      className="bg-slate-800/40 border-slate-700 text-slate-100"
                      placeholder="https://ejemplo.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="formatoFolio" className="text-slate-200">
                        Formato de Folio
                      </Label>
                      <Input
                        id="formatoFolio"
                        value={config.formatoFolio}
                        onChange={(e) => setConfig({ ...config, formatoFolio: e.target.value })}
                        className="bg-slate-800/40 border-slate-700 text-slate-100"
                      />
                      <p className="text-xs text-slate-500">Usa {"{numero}"} para el número secuencial</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siguienteFolio" className="text-slate-200">
                        Siguiente Folio
                      </Label>
                      <Input
                        id="siguienteFolio"
                        type="number"
                        value={config.siguienteFolio}
                        onChange={(e) =>
                          setConfig({ ...config, siguienteFolio: parseInt(e.target.value) })
                        }
                        className="bg-slate-800/40 border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveGeneral} className="bg-indigo-600 hover:bg-indigo-500 mt-6">
                    Guardar Configuración General
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Tab 2: Sucursales */}
            <TabsContent value="sucursales" className="mt-6">
              <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5">
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-200">Sucursales</h3>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedBranch(null)
                        setIsBranchFormOpen(true)
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar Sucursal
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Nombre
                        </TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Dirección
                        </TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Teléfono
                        </TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Encargado
                        </TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Prefijo
                        </TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Estado
                        </TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {config.sucursales.map((branch, index) => (
                        <TableRow
                          key={branch.id}
                          className="border-white/5 hover:bg-white/[0.02] text-slate-300"
                        >
                          <TableCell className="text-[13px] font-medium text-slate-200">
                            {branch.nombre}
                          </TableCell>
                          <TableCell className="text-[12px] text-slate-400">
                            {branch.direccion.calle}, {branch.direccion.colonia}
                          </TableCell>
                          <TableCell className="text-[12px] text-slate-400 font-mono">
                            {branch.telefono}
                          </TableCell>
                          <TableCell className="text-[12px] text-slate-400">{branch.encargado}</TableCell>
                          <TableCell>
                            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs font-mono">
                              {branch.prefijoFolios}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {branch.activa ? (
                              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Activa
                              </Badge>
                            ) : (
                              <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactiva
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedBranch(branch)
                                  setIsBranchFormOpen(true)
                                }}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            {/* Tab 3: Estados de OS */}
            <TabsContent value="estados" className="mt-6">
              <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5">
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-200">Estados de Órdenes de Servicio</h3>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedStatus(null)
                        setIsStatusFormOpen(true)
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar Estado
                    </Button>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  {config.estadosOS.map((status, index) => (
                    <div
                      key={status.id}
                      className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-slate-200">{status.nombre}</span>
                              <Badge className="bg-slate-700/50 text-slate-300 text-[10px] px-1.5 py-0">
                                {status.tipo}
                              </Badge>
                              {status.locked && (
                                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-[10px] px-1.5 py-0">
                                  Bloqueado
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-400">
                              {status.notificarCliente && <span>✓ Notifica cliente</span>}
                              {status.cambiarEstadoPago && <span>✓ Cambia estado pago</span>}
                              {status.cerrarOrden && <span>✓ Cierra orden</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedStatus(status)
                              setIsStatusFormOpen(true)
                            }}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          {!status.locked && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Tab 4: Políticas */}
            <TabsContent value="politicas" className="mt-6">
              <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-6">Políticas del Negocio</h3>
                <div className="space-y-6">
                  {/* Almacenamiento */}
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <h4 className="text-sm font-semibold text-slate-300 mb-4">Almacenamiento y Abandono</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-xs">Días máximo almacenamiento</Label>
                        <Input
                          type="number"
                          value={config.politicas.diasMaximoAlmacenamiento}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              politicas: {
                                ...config.politicas,
                                diasMaximoAlmacenamiento: parseInt(e.target.value),
                              },
                            })
                          }
                          className="bg-slate-800/40 border-slate-700 text-slate-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-xs">Días abandono potencial</Label>
                        <Input
                          type="number"
                          value={config.politicas.diasAbandonoPotencial}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              politicas: {
                                ...config.politicas,
                                diasAbandonoPotencial: parseInt(e.target.value),
                              },
                            })
                          }
                          className="bg-slate-800/40 border-slate-700 text-slate-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-xs">Días equipo abandonado</Label>
                        <Input
                          type="number"
                          value={config.politicas.diasEquipoAbandonado}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              politicas: {
                                ...config.politicas,
                                diasEquipoAbandonado: parseInt(e.target.value),
                              },
                            })
                          }
                          className="bg-slate-800/40 border-slate-700 text-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Garantías */}
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <h4 className="text-sm font-semibold text-slate-300 mb-4">Garantías</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-xs">Garantía servicios (días)</Label>
                        <Input
                          type="number"
                          value={config.politicas.garantiaEstandarServicios}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              politicas: {
                                ...config.politicas,
                                garantiaEstandarServicios: parseInt(e.target.value),
                              },
                            })
                          }
                          className="bg-slate-800/40 border-slate-700 text-slate-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-xs">Garantía refacciones (días)</Label>
                        <Input
                          type="number"
                          value={config.politicas.garantiaEstandarRefacciones}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              politicas: {
                                ...config.politicas,
                                garantiaEstandarRefacciones: parseInt(e.target.value),
                              },
                            })
                          }
                          className="bg-slate-800/40 border-slate-700 text-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pagos */}
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <h4 className="text-sm font-semibold text-slate-300 mb-4">Pagos</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-xs">% Mínimo anticipo</Label>
                        <Input
                          type="number"
                          value={config.politicas.porcentajeMinimoAnticipo}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              politicas: {
                                ...config.politicas,
                                porcentajeMinimoAnticipo: parseInt(e.target.value),
                              },
                            })
                          }
                          className="bg-slate-800/40 border-slate-700 text-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSavePolicies} className="bg-indigo-600 hover:bg-indigo-500">
                    Guardar Políticas
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Tab 5: Notificaciones */}
            <TabsContent value="notificaciones" className="mt-6">
              <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5">
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-200">Plantillas de Notificaciones</h3>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(null)
                        setIsTemplateFormOpen(true)
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Nueva Plantilla
                    </Button>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  {config.plantillasNotificaciones.map((template, index) => (
                    <div
                      key={template.id}
                      className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-slate-200">{template.nombre}</span>
                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] px-1.5 py-0">
                              {template.tipo}
                            </Badge>
                            <Badge className="bg-slate-700/50 text-slate-300 text-[10px] px-1.5 py-0">
                              {template.evento}
                            </Badge>
                            {template.activo ? (
                              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px] px-1.5 py-0">
                                Activo
                              </Badge>
                            ) : (
                              <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-[10px] px-1.5 py-0">
                                Inactivo
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{template.mensaje}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedTemplate(template)
                              setIsTemplateFormOpen(true)
                            }}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Form Dialogs */}
      <BranchFormDialog
        open={isBranchFormOpen}
        onOpenChange={setIsBranchFormOpen}
        branch={selectedBranch}
        onSave={(branch) => {
          console.log("Branch saved:", branch)
        }}
      />

      <StatusFormDialog
        open={isStatusFormOpen}
        onOpenChange={setIsStatusFormOpen}
        status={selectedStatus}
        onSave={(status) => {
          console.log("Status saved:", status)
        }}
      />

      <NotificationTemplateEditor
        open={isTemplateFormOpen}
        onOpenChange={setIsTemplateFormOpen}
        template={selectedTemplate}
        onSave={(template) => {
          console.log("Template saved:", template)
        }}
      />
    </>
  )
}
