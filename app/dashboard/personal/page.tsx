"use client"

import { useState, useMemo, useEffect } from "react"
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
import { Search, Plus, Eye, Pencil, Users, UserCheck, Shield, Wrench, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/utils/sales-helpers"
import { useToast } from "@/hooks/use-toast"
import type { Employee, User } from "@/lib/types/staff"

export default function PersonalPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [sucursalFilter, setSucursalFilter] = useState("all")
  const [rolFilter, setRolFilter] = useState("all")
  const [estadoFilter, setEstadoFilter] = useState("all")
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false)
  const [isUserFormOpen, setIsUserFormOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [employees, setEmployees] = useState<Employee[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [empRes, userRes] = await Promise.all([
        fetch('/api/empleados'),
        fetch('/api/usuarios')
      ])

      if (empRes.ok && userRes.ok) {
        const empData = await empRes.json()
        const userData = await userRes.json()

        // Map API data to Employee type
        const mappedEmployees: Employee[] = empData.map((e: any) => ({
          id: e.id,
          nombre: e.nombre,
          apellidos: e.apellidos,
          nombreCompleto: e.nombreCompleto || `${e.nombre} ${e.apellidos}`,
          rolOperativo: e.rolOperativo,
          telefono: e.telefono || "",
          correoInterno: e.correoInterno || "",
          estado: e.estado,
          fechaAlta: e.createdAt,
          horarioTrabajo: e.horarioTrabajo,
          especialidades: e.especialidades ? JSON.parse(e.especialidades) : [],
          tieneUsuario: e.usuarios && e.usuarios.length > 0,
          usuarioId: e.usuarios && e.usuarios.length > 0 ? e.usuarios[0].id : undefined,
          avatar: e.avatar
        }))

        // Map API data to User type
        const mappedUsers: User[] = userData.map((u: any) => ({
          id: u.id,
          empleadoId: u.empleadoId || "", // This might be missing if we don't fetch it in /api/usuarios, need to check
          correoLogin: u.email,
          rolSistema: u.rol,
          permisos: {} as any, // Permissions are not yet in DB, using empty object or default
          activo: u.activo,
          ultimoAcceso: u.updatedAt, // Using updatedAt as proxy for now
          fechaCreacion: u.createdAt,
          requiereCambioPassword: false
        }))

        setEmployees(mappedEmployees)
        setUsers(mappedUsers)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar la información del personal",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasPermission("personal")) {
      loadData()
    }
  }, [hasPermission])

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
    return employees.filter((emp) => {
      const matchesSearch =
        emp.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.correoInterno.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSucursal = sucursalFilter === "all" || "Sede A" === sucursalFilter // Hardcoded for now as sucursal is not fully implemented
      const matchesRol = rolFilter === "all" || emp.rolOperativo === rolFilter
      const matchesEstado = estadoFilter === "all" || emp.estado === estadoFilter

      return matchesSearch && matchesSucursal && matchesRol && matchesEstado
    })
  }, [searchTerm, sucursalFilter, rolFilter, estadoFilter, employees])

  // Calculate stats
  const stats = useMemo(() => {
    const total = employees.length
    const activos = employees.filter((e) => e.estado === "Activo").length
    const conUsuario = employees.filter((e) => e.tieneUsuario).length
    const tecnicos = employees.filter((e) => e.rolOperativo === "Técnico").length

    return { total, activos, conUsuario, tecnicos }
  }, [employees])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

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
                      {filteredEmployees.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                            No se encontraron empleados
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredEmployees.map((emp, index) => (
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
                                  onClick={() => {
                                    setSelectedEmployee(emp)
                                    setIsEmployeeFormOpen(true)
                                  }}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
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
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                            No se encontraron usuarios
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user, index) => {
                          const empleado = employees.find((e) => e.id === user.empleadoId)

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
                                    {empleado ? empleado.nombre[0] : "?"}
                                    {empleado ? empleado.apellidos[0] : "?"}
                                  </div>
                                  <div className="text-[13px] font-medium text-slate-200">
                                    {empleado ? empleado.nombreCompleto : "Usuario sin empleado"}
                                  </div>
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
                                    onClick={() => {
                                      setSelectedUser(user)
                                      setIsUserFormOpen(true)
                                    }}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Results count */}
                <div className="border-t border-white/5 px-6 py-4">
                  <p className="text-xs text-slate-500">
                    Mostrando <span className="font-semibold text-slate-400">{users.length}</span> usuarios
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
          loadData() // Reload data after save
          setIsEmployeeFormOpen(false)
        }}
      />

      {/* User Form Dialog */}
      <UserFormDialog
        open={isUserFormOpen}
        onOpenChange={setIsUserFormOpen}
        user={selectedUser}
        employees={employees}
        onSave={(user) => {
          loadData() // Reload data after save
          setIsUserFormOpen(false)
        }}
      />
    </>
  )
}
