"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import type { User, SystemRole, UserPermissions } from "@/lib/types/staff"
import { ADMIN_PERMISSIONS, RECEPCION_PERMISSIONS, TECNICO_PERMISSIONS, SOLO_LECTURA_PERMISSIONS } from "@/lib/utils/permission-templates"
import { mockEmployees, getEmployeesWithoutUser } from "@/lib/data/staff-mock"
import { AlertCircle, Shield, UserCircle, Wrench, Eye } from "lucide-react"

interface UserFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: User | null
    onSave?: (user: Partial<User>) => void
}

export function UserFormDialog({ open, onOpenChange, user, onSave }: UserFormDialogProps) {
    const { toast } = useToast()
    const isEditing = !!user

    const [formData, setFormData] = useState({
        empleadoId: "",
        correoLogin: "",
        rolSistema: "Técnico" as SystemRole,
        activo: true,
        permisos: TECNICO_PERMISSIONS,
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (user) {
            const empleado = mockEmployees.find((e) => e.id === user.empleadoId)
            setFormData({
                empleadoId: user.empleadoId,
                correoLogin: user.correoLogin,
                rolSistema: user.rolSistema,
                activo: user.activo,
                permisos: user.permisos,
            })
        } else {
            setFormData({
                empleadoId: "",
                correoLogin: "",
                rolSistema: "Técnico",
                activo: true,
                permisos: TECNICO_PERMISSIONS,
            })
        }
        setErrors({})
    }, [user, open])

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.empleadoId) {
            newErrors.empleadoId = "Selecciona un empleado"
        }
        if (!formData.correoLogin.trim()) {
            newErrors.correoLogin = "El correo es requerido"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoLogin)) {
            newErrors.correoLogin = "Formato de correo inválido"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (!validate()) return

        const userData: Partial<User> = {
            ...formData,
            fechaCreacion: new Date().toISOString(),
            requiereCambioPassword: !isEditing,
        }

        onSave?.(userData)

        const empleado = mockEmployees.find((e) => e.id === formData.empleadoId)
        toast({
            title: isEditing ? "Usuario actualizado" : "Usuario creado",
            description: `Usuario para ${empleado?.nombreCompleto} ha sido ${isEditing ? "actualizado" : "creado"} correctamente.`,
        })

        onOpenChange(false)
    }

    const applyTemplate = (template: UserPermissions, rolName: string) => {
        setFormData({ ...formData, permisos: template })
        toast({
            title: "Template aplicado",
            description: `Permisos de ${rolName} aplicados correctamente.`,
        })
    }

    const togglePermiso = (key: keyof UserPermissions) => {
        setFormData({
            ...formData,
            permisos: {
                ...formData.permisos,
                [key]: !formData.permisos[key],
            },
        })
    }

    const empleadosSinUsuario = getEmployeesWithoutUser()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-slate-100 text-xl">
                        {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="acceso" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                        <TabsTrigger value="acceso">Datos de Acceso</TabsTrigger>
                        <TabsTrigger value="permisos">Permisos</TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Access Data */}
                    <TabsContent value="acceso" className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="empleadoId" className="text-slate-200">
                                Empleado <span className="text-red-400">*</span>
                            </Label>
                            <Select
                                value={formData.empleadoId}
                                onValueChange={(value) => {
                                    const emp = mockEmployees.find((e) => e.id === value)
                                    setFormData({
                                        ...formData,
                                        empleadoId: value,
                                        correoLogin: emp?.correoInterno || "",
                                    })
                                }}
                                disabled={isEditing}
                            >
                                <SelectTrigger
                                    className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.empleadoId ? "border-red-500" : ""
                                        }`}
                                >
                                    <SelectValue placeholder="Selecciona un empleado" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    {(isEditing ? mockEmployees : empleadosSinUsuario).map((emp) => (
                                        <SelectItem key={emp.id} value={emp.id} className="text-slate-300">
                                            {emp.nombreCompleto} - {emp.rolOperativo}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.empleadoId && (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.empleadoId}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="correoLogin" className="text-slate-200">
                                Correo de Login <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="correoLogin"
                                type="email"
                                value={formData.correoLogin}
                                onChange={(e) => setFormData({ ...formData, correoLogin: e.target.value })}
                                className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.correoLogin ? "border-red-500" : ""
                                    }`}
                                placeholder="usuario@repairsuite.com"
                            />
                            {errors.correoLogin && (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.correoLogin}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rolSistema" className="text-slate-200">
                                Rol del Sistema <span className="text-red-400">*</span>
                            </Label>
                            <Select
                                value={formData.rolSistema}
                                onValueChange={(value: SystemRole) => setFormData({ ...formData, rolSistema: value })}
                            >
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    <SelectItem value="Administrador" className="text-slate-300">
                                        Administrador
                                    </SelectItem>
                                    <SelectItem value="Recepción" className="text-slate-300">
                                        Recepción
                                    </SelectItem>
                                    <SelectItem value="Técnico" className="text-slate-300">
                                        Técnico
                                    </SelectItem>
                                    <SelectItem value="Solo Lectura" className="text-slate-300">
                                        Solo Lectura
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="activo"
                                checked={formData.activo}
                                onCheckedChange={(checked) => setFormData({ ...formData, activo: checked as boolean })}
                                className="border-slate-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                            <label htmlFor="activo" className="text-sm text-slate-300 cursor-pointer">
                                Usuario activo
                            </label>
                        </div>
                    </TabsContent>

                    {/* Tab 2: Permissions */}
                    <TabsContent value="permisos" className="space-y-4 mt-4">
                        {/* Permission Templates */}
                        <div className="space-y-2">
                            <Label className="text-slate-200">Templates de Permisos</Label>
                            <div className="grid grid-cols-4 gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => applyTemplate(ADMIN_PERMISSIONS, "Administrador")}
                                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                                >
                                    <Shield className="h-3 w-3 mr-1" />
                                    Admin
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => applyTemplate(RECEPCION_PERMISSIONS, "Recepción")}
                                    className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                                >
                                    <UserCircle className="h-3 w-3 mr-1" />
                                    Recepción
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => applyTemplate(TECNICO_PERMISSIONS, "Técnico")}
                                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                                >
                                    <Wrench className="h-3 w-3 mr-1" />
                                    Técnico
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => applyTemplate(SOLO_LECTURA_PERMISSIONS, "Solo Lectura")}
                                    className="border-slate-500/30 text-slate-400 hover:bg-slate-500/10"
                                >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Lectura
                                </Button>
                            </div>
                        </div>

                        {/* Permissions Groups */}
                        <div className="space-y-4">
                            {/* Ventas y Pagos */}
                            <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                <h4 className="text-sm font-semibold text-slate-300 mb-2">Ventas y Pagos</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="registrarPagos"
                                            checked={formData.permisos.registrarPagos}
                                            onCheckedChange={() => togglePermiso("registrarPagos")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="registrarPagos" className="text-xs text-slate-400 cursor-pointer">
                                            Registrar pagos
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="verMetricasFinancieras"
                                            checked={formData.permisos.verMetricasFinancieras}
                                            onCheckedChange={() => togglePermiso("verMetricasFinancieras")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="verMetricasFinancieras" className="text-xs text-slate-400 cursor-pointer">
                                            Ver métricas financieras
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="verUtilidades"
                                            checked={formData.permisos.verUtilidades}
                                            onCheckedChange={() => togglePermiso("verUtilidades")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="verUtilidades" className="text-xs text-slate-400 cursor-pointer">
                                            Ver utilidades
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Catálogo */}
                            <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                <h4 className="text-sm font-semibold text-slate-300 mb-2">Catálogo</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="cambiarPrecios"
                                            checked={formData.permisos.cambiarPrecios}
                                            onCheckedChange={() => togglePermiso("cambiarPrecios")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="cambiarPrecios" className="text-xs text-slate-400 cursor-pointer">
                                            Cambiar precios
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="editarCatalogo"
                                            checked={formData.permisos.editarCatalogo}
                                            onCheckedChange={() => togglePermiso("editarCatalogo")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="editarCatalogo" className="text-xs text-slate-400 cursor-pointer">
                                            Editar catálogo
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Órdenes de Servicio */}
                            <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                <h4 className="text-sm font-semibold text-slate-300 mb-2">Órdenes de Servicio</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="crearOrdenes"
                                            checked={formData.permisos.crearOrdenes}
                                            onCheckedChange={() => togglePermiso("crearOrdenes")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="crearOrdenes" className="text-xs text-slate-400 cursor-pointer">
                                            Crear órdenes
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="aprobarCotizaciones"
                                            checked={formData.permisos.aprobarCotizaciones}
                                            onCheckedChange={() => togglePermiso("aprobarCotizaciones")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="aprobarCotizaciones" className="text-xs text-slate-400 cursor-pointer">
                                            Aprobar cotizaciones
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="cancelarOrdenes"
                                            checked={formData.permisos.cancelarOrdenes}
                                            onCheckedChange={() => togglePermiso("cancelarOrdenes")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="cancelarOrdenes" className="text-xs text-slate-400 cursor-pointer">
                                            Cancelar órdenes
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="reasignarTecnicos"
                                            checked={formData.permisos.reasignarTecnicos}
                                            onCheckedChange={() => togglePermiso("reasignarTecnicos")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="reasignarTecnicos" className="text-xs text-slate-400 cursor-pointer">
                                            Reasignar técnicos
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Inventario */}
                            <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                <h4 className="text-sm font-semibold text-slate-300 mb-2">Inventario</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="ajustarInventario"
                                            checked={formData.permisos.ajustarInventario}
                                            onCheckedChange={() => togglePermiso("ajustarInventario")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="ajustarInventario" className="text-xs text-slate-400 cursor-pointer">
                                            Ajustar inventario
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="crearTransferencias"
                                            checked={formData.permisos.crearTransferencias}
                                            onCheckedChange={() => togglePermiso("crearTransferencias")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="crearTransferencias" className="text-xs text-slate-400 cursor-pointer">
                                            Crear transferencias
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="verCostos"
                                            checked={formData.permisos.verCostos}
                                            onCheckedChange={() => togglePermiso("verCostos")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="verCostos" className="text-xs text-slate-400 cursor-pointer">
                                            Ver costos
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Proveedores y Clientes */}
                            <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                <h4 className="text-sm font-semibold text-slate-300 mb-2">Proveedores y Clientes</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="gestionarProveedores"
                                            checked={formData.permisos.gestionarProveedores}
                                            onCheckedChange={() => togglePermiso("gestionarProveedores")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="gestionarProveedores" className="text-xs text-slate-400 cursor-pointer">
                                            Gestionar proveedores
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="crearOrdenesCompra"
                                            checked={formData.permisos.crearOrdenesCompra}
                                            onCheckedChange={() => togglePermiso("crearOrdenesCompra")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="crearOrdenesCompra" className="text-xs text-slate-400 cursor-pointer">
                                            Crear órdenes de compra
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="editarClientes"
                                            checked={formData.permisos.editarClientes}
                                            onCheckedChange={() => togglePermiso("editarClientes")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="editarClientes" className="text-xs text-slate-400 cursor-pointer">
                                            Editar clientes
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="verHistorialCompleto"
                                            checked={formData.permisos.verHistorialCompleto}
                                            onCheckedChange={() => togglePermiso("verHistorialCompleto")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="verHistorialCompleto" className="text-xs text-slate-400 cursor-pointer">
                                            Ver historial completo
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Personal, Reportes y Sistema */}
                            <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                <h4 className="text-sm font-semibold text-slate-300 mb-2">Personal, Reportes y Sistema</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="gestionarPersonal"
                                            checked={formData.permisos.gestionarPersonal}
                                            onCheckedChange={() => togglePermiso("gestionarPersonal")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="gestionarPersonal" className="text-xs text-slate-400 cursor-pointer">
                                            Gestionar personal
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="verNomina"
                                            checked={formData.permisos.verNomina}
                                            onCheckedChange={() => togglePermiso("verNomina")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="verNomina" className="text-xs text-slate-400 cursor-pointer">
                                            Ver nómina
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="verReportesAvanzados"
                                            checked={formData.permisos.verReportesAvanzados}
                                            onCheckedChange={() => togglePermiso("verReportesAvanzados")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="verReportesAvanzados" className="text-xs text-slate-400 cursor-pointer">
                                            Ver reportes avanzados
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="exportarDatos"
                                            checked={formData.permisos.exportarDatos}
                                            onCheckedChange={() => togglePermiso("exportarDatos")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="exportarDatos" className="text-xs text-slate-400 cursor-pointer">
                                            Exportar datos
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="configurarSistema"
                                            checked={formData.permisos.configurarSistema}
                                            onCheckedChange={() => togglePermiso("configurarSistema")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="configurarSistema" className="text-xs text-slate-400 cursor-pointer">
                                            Configurar sistema
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="verAuditoria"
                                            checked={formData.permisos.verAuditoria}
                                            onCheckedChange={() => togglePermiso("verAuditoria")}
                                            className="border-slate-600"
                                        />
                                        <label htmlFor="verAuditoria" className="text-xs text-slate-400 cursor-pointer">
                                            Ver auditoría
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-500 text-white">
                        {isEditing ? "Actualizar" : "Crear"} Usuario
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
