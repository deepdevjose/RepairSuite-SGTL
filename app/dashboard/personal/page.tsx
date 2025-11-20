"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { EmployeeRoleBadge } from "@/components/staff/employee-role-badge"
import { EmployeeStatusBadge } from "@/components/staff/employee-status-badge"
import { SpecialtyBadge } from "@/components/staff/specialty-badge"
import { SystemRoleBadge } from "@/components/staff/system-role-badge"
import { EmployeeFormDialog } from "@/components/staff/employee-form-dialog"
import { UserFormDialog } from "@/components/staff/user-form-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, Pencil, Users, UserCheck, Shield, Wrench, CheckCircle, XCircle } from "lucide-react"
import { mockEmployees, mockUsers } from "@/lib/data/staff-mock"
import { formatDate } from "@/lib/utils/sales-helpers"

export default function PersonalPage() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [sucursalFilter, setSucursalFilter] = useState("all")
  const [rolFilter, setRolFilter] = useState("all")
  const [estadoFilter, setEstadoFilter] = useState("all")
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false)
  const [isUserFormOpen, setIsUserFormOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<typeof mockEmployees[0] | null>(null)
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null)

  if (!hasPermission("personal")) {
    return (
      <>
        <DashboardHeader title="Personal" />
        <AccessDenied />
      </>
    )
  }

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter((emp) => {
      const matchesSearch =
        emp.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.correoInterno.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSucursal = sucursalFilter === "all" || emp.sucursalAsignada === sucursalFilter
      const matchesRol = rolFilter === "all" || emp.rolOperativo === rolFilter
      const matchesEstado = estadoFilter === "all" || emp.estado === estadoFilter

      return matchesSearch && matchesSucursal && matchesRol && matchesEstado
    })
  }, [searchTerm, sucursalFilter, rolFilter, estadoFilter])

  // Calculate stats
  const stats = useMemo(() => {
    const total = mockEmployees.length
    const activos = mockEmployees.filter((e) => e.estado === "Activo").length
    const conUsuario = mockEmployees.filter((e) => e.tieneUsuario).length
    const tecnicos = mockEmployees.filter((e) => e.rolOperativo === "Técnico").length

    return { total, activos, conUsuario, tecnicos }
  }, [])

  return (
    <>
      <DashboardHeader title="Personal" />
      <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl group-hover:from-indigo-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Total Empleados</div>
                  <div className="p-2 rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20">
                    <Users className="h-4 w-4 text-indigo-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">{stats.total}</div>
                <div className="text-xs text-slate-500 font-medium">En el sistema</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl group-hover:from-green-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Activos</div>
                  <div className="p-2 rounded-lg bg-green-500/10 ring-1 ring-green-500/20">
                    <UserCheck className="h-4 w-4 text-green-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">{stats.activos}</div>
                <div className="text-xs text-slate-500 font-medium">Trabajando</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:from-purple-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Con Usuario</div>
                  <div className="p-2 rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                    <Shield className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">{stats.conUsuario}</div>
                <div className="text-xs text-slate-500 font-medium">Acceso al sistema</div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border-white/5 p-5 hover:bg-slate-900/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl group-hover:from-blue-500/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Técnicos</div>
                  <div className="p-2 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                    <Wrench className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">{stats.tecnicos}</div>
                <div className="text-xs text-slate-500 font-medium">Reparando equipos</div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="empleados" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-900/60 backdrop-blur-sm border-white/5">
              <TabsTrigger value="empleados">Empleados</TabsTrigger>
              <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            </TabsList>

            {/* Tab: Empleados */}
            <TabsContent value="empleados" className="mt-6">
              <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5">
                <div className="p-6 border-b border-white/5">
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        placeholder="Buscar por nombre o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-800/40 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Select value={sucursalFilter} onValueChange={setSucursalFilter}>
                        <SelectTrigger className="h-9 w-[130px] bg-slate-800/40 border-slate-700 text-slate-300 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          <SelectItem value="all" className="text-slate-300 text-xs">
                            Todas
                          </SelectItem>
                          <SelectItem value="Sede A" className="text-slate-300 text-xs">
                            Sede A
                          </SelectItem>
                          <SelectItem value="Sede B" className="text-slate-300 text-xs">
                            Sede B
                          </SelectItem>
                          <SelectItem value="Sede C" className="text-slate-300 text-xs">
                            Sede C
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={rolFilter} onValueChange={setRolFilter}>
                        <SelectTrigger className="h-9 w-[130px] bg-slate-800/40 border-slate-700 text-slate-300 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          <SelectItem value="all" className="text-slate-300 text-xs">
                            Todos los roles
                          </SelectItem>
                          <SelectItem value="Técnico" className="text-slate-300 text-xs">
                            Técnico
                          </SelectItem>
                          <SelectItem value="Recepción" className="text-slate-300 text-xs">
                            Recepción
                          </SelectItem>
                          <SelectItem value="Administrador" className="text-slate-300 text-xs">
                            Administrador
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                        <SelectTrigger className="h-9 w-[120px] bg-slate-800/40 border-slate-700 text-slate-300 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          <SelectItem value="all" className="text-slate-300 text-xs">
                            Todos
                          </SelectItem>
                          <SelectItem value="Activo" className="text-slate-300 text-xs">
                            Activo
                          </SelectItem>
                          <SelectItem value="Inactivo" className="text-slate-300 text-xs">
                            Inactivo
                          </SelectItem>
                          <SelectItem value="Vacaciones" className="text-slate-300 text-xs">
                            Vacaciones
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedEmployee(null)
                          setIsEmployeeFormOpen(true)
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Empleado
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Empleado
                        </TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Rol
                        </TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Sucursal
                        </TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Especialidades
                        </TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Estado
                        </TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Usuario
                        </TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider text-right">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((emp, index) => (
                        <TableRow
                          key={emp.id}
                          className="border-white/5 hover:bg-white/[0.02] text-slate-300 transition-all duration-150"
                          style={{
                            animation: "fadeInUp 0.3s ease-out forwards",
                            animationDelay: `${index * 30}ms`,
                            opacity: 0,
                          }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                                {emp.nombre[0]}
                                {emp.apellidos[0]}
                              </div>
                              <div>
                                <div className="text-[13px] font-medium text-slate-200">{emp.nombreCompleto}</div>
                                <div className="text-[11px] text-slate-500">{emp.correoInterno}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <EmployeeRoleBadge rol={emp.rolOperativo} />
                          </TableCell>
                          <TableCell className="text-[12px] text-slate-400">{emp.sucursalAsignada}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {emp.especialidades.slice(0, 2).map((esp) => (
                                <SpecialtyBadge key={esp} especialidad={esp} />
                              ))}
                              {emp.especialidades.length > 2 && (
                                <Badge className="bg-slate-700/10 text-slate-500 border-slate-700/20 text-[10px] px-1.5 py-0">
                                  +{emp.especialidades.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <EmployeeStatusBadge estado={emp.estado} />
                          </TableCell>
                          <TableCell>
                            {emp.tieneUsuario ? (
                              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Sí
                              </Badge>
                            ) : (
                              <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                                <XCircle className="h-3 w-3 mr-1" />
                                No
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`/dashboard/personal/${emp.id}`}>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                                  title="Ver detalles"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
                                title="Editar"
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

                {/* Results count */}
                {filteredEmployees.length > 0 && (
                  <div className="border-t border-white/5 px-6 py-4">
                    <p className="text-xs text-slate-500">
                      Mostrando <span className="font-semibold text-slate-400">{filteredEmployees.length}</span> empleados
                    </p>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Tab: Usuarios */}
            <TabsContent value="usuarios" className="mt-6">
              <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5">
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-200">Cuentas de Usuario</h3>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedUser(null)
                        setIsUserFormOpen(true)
                      }}
                      className="bg-purple-600 hover:bg-purple-500 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Crear Usuario
                    </Button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Empleado
                        </TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Correo Login
                        </TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Rol Sistema
                        </TableHead>
                        <TableHead className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          Último Acceso
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
                      {mockUsers.map((user, index) => {
                        const empleado = mockEmployees.find((e) => e.id === user.empleadoId)
                        if (!empleado) return null

                        return (
                          <TableRow
                            key={user.id}
                            className="border-white/5 hover:bg-white/[0.02] text-slate-300 transition-all duration-150"
                            style={{
                              animation: "fadeInUp 0.3s ease-out forwards",
                              animationDelay: `${index * 30}ms`,
                              opacity: 0,
                            }}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                                  {empleado.nombre[0]}
                                  {empleado.apellidos[0]}
                                </div>
                                <div className="text-[13px] font-medium text-slate-200">{empleado.nombreCompleto}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-[12px] text-slate-400 font-mono">{user.correoLogin}</TableCell>
                            <TableCell>
                              <SystemRoleBadge rol={user.rolSistema} />
                            </TableCell>
                            <TableCell className="text-[12px] text-slate-400">
                              {user.ultimoAcceso ? formatDate(user.ultimoAcceso) : "Nunca"}
                            </TableCell>
                            <TableCell>
                              {user.activo ? (
                                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Activo
                                </Badge>
                              ) : (
                                <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Inactivo
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
                                  title="Editar permisos"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Results count */}
                <div className="border-t border-white/5 px-6 py-4">
                  <p className="text-xs text-slate-500">
                    Mostrando <span className="font-semibold text-slate-400">{mockUsers.length}</span> usuarios
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Employee Form Dialog */}
      <EmployeeFormDialog
        open={isEmployeeFormOpen}
        onOpenChange={setIsEmployeeFormOpen}
        employee={selectedEmployee}
        onSave={(employee) => {
          console.log("Employee saved:", employee)
          // Aquí se actualizaría la lista de empleados
        }}
      />

      {/* User Form Dialog */}
      <UserFormDialog
        open={isUserFormOpen}
        onOpenChange={setIsUserFormOpen}
        user={selectedUser}
        onSave={(user) => {
          console.log("User saved:", user)
          // Aquí se actualizaría la lista de usuarios
        }}
      />
    </>
  )
}
