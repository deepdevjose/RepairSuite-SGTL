"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { EmployeeRoleBadge } from "@/components/staff/employee-role-badge"
import { EmployeeStatusBadge } from "@/components/staff/employee-status-badge"
import { SpecialtyBadge } from "@/components/staff/specialty-badge"
import { SystemRoleBadge } from "@/components/staff/system-role-badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, Calendar, Clock, Award, TrendingUp, CheckCircle } from "lucide-react"
import { mockEmployees, getUserByEmployeeId, getEmployeeMetrics } from "@/lib/data/staff-mock"
import { formatDate } from "@/lib/utils/sales-helpers"

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
    const employee = mockEmployees.find((e) => e.id === params.id)
    const user = getUserByEmployeeId(params.id)
    const metrics = getEmployeeMetrics(params.id, "2025-01")

    if (!employee) {
        notFound()
    }

    return (
        <>
            <DashboardHeader title={employee.nombreCompleto} />
            <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="max-w-[1200px] mx-auto space-y-6">
                    {/* Back Button */}
                    <Link href="/dashboard/personal">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver a Personal
                        </Button>
                    </Link>

                    {/* Header Card */}
                    <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                                {employee.nombre[0]}
                                {employee.apellidos[0]}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-100 mb-2">{employee.nombreCompleto}</h2>
                                        <div className="flex items-center gap-3 mb-3">
                                            <EmployeeRoleBadge rol={employee.rolOperativo} />
                                            <EmployeeStatusBadge estado={employee.estado} />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                        <Mail className="h-4 w-4" />
                                        {employee.correoInterno}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                        <Phone className="h-4 w-4" />
                                        {employee.telefono}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* General Information */}
                        <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
                            <h3 className="text-lg font-semibold text-slate-200 mb-4">Información General</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-slate-800">
                                    <span className="text-slate-400 text-sm">Sucursal</span>
                                    <span className="text-slate-200 text-sm font-medium">{employee.sucursalAsignada}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-800">
                                    <span className="text-slate-400 text-sm">Fecha de Alta</span>
                                    <span className="text-slate-200 text-sm font-medium">{formatDate(employee.fechaAlta)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-800">
                                    <span className="text-slate-400 text-sm">Horario</span>
                                    <span className="text-slate-200 text-sm font-medium">{employee.horarioTrabajo || "No definido"}</span>
                                </div>
                                <div className="py-2">
                                    <span className="text-slate-400 text-sm block mb-2">Especialidades</span>
                                    <div className="flex flex-wrap gap-2">
                                        {employee.especialidades.map((esp) => (
                                            <SpecialtyBadge key={esp} especialidad={esp} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* User Account */}
                        <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
                            <h3 className="text-lg font-semibold text-slate-200 mb-4">Cuenta de Usuario</h3>
                            {user ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-slate-800">
                                        <span className="text-slate-400 text-sm">Correo de Login</span>
                                        <span className="text-slate-200 text-sm font-medium font-mono">{user.correoLogin}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-800">
                                        <span className="text-slate-400 text-sm">Rol del Sistema</span>
                                        <SystemRoleBadge rol={user.rolSistema} />
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-800">
                                        <span className="text-slate-400 text-sm">Estado</span>
                                        {user.activo ? (
                                            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Activo
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">Inactivo</Badge>
                                        )}
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-slate-400 text-sm">Último Acceso</span>
                                        <span className="text-slate-200 text-sm font-medium">
                                            {user.ultimoAcceso ? formatDate(user.ultimoAcceso) : "Nunca"}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-slate-500 text-sm">Este empleado no tiene cuenta de usuario</p>
                                    <Button size="sm" className="mt-4 bg-purple-600 hover:bg-purple-500">
                                        Crear Usuario
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Performance Metrics (only for technicians) */}
                    {employee.rolOperativo === "Técnico" && metrics && (
                        <Card className="bg-slate-900/60 backdrop-blur-sm border-white/5 p-6">
                            <h3 className="text-lg font-semibold text-slate-200 mb-4">Métricas de Desempeño - Enero 2025</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                                        <Calendar className="h-3 w-3" />
                                        Órdenes Atendidas
                                    </div>
                                    <div className="text-2xl font-bold text-slate-100">{metrics.ordenesAtendidas}</div>
                                </div>
                                <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                                        <CheckCircle className="h-3 w-3" />
                                        Completadas
                                    </div>
                                    <div className="text-2xl font-bold text-green-400">{metrics.ordenesCompletadas}</div>
                                </div>
                                <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                                        <Clock className="h-3 w-3" />
                                        Tiempo Promedio
                                    </div>
                                    <div className="text-2xl font-bold text-blue-400">{metrics.tiempoPromedioReparacion}h</div>
                                </div>
                                <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                                        <Award className="h-3 w-3" />
                                        Calificación
                                    </div>
                                    <div className="text-2xl font-bold text-yellow-400">{metrics.calificacionPromedio}/5</div>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                                        <TrendingUp className="h-3 w-3" />
                                        Ingresos Generados
                                    </div>
                                    <div className="text-xl font-bold text-emerald-400">
                                        ${metrics.ingresosGenerados.toLocaleString()}
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                                        <Award className="h-3 w-3" />
                                        Especialidad Más Usada
                                    </div>
                                    <SpecialtyBadge especialidad={metrics.especialidadMasUsada} />
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </main>
        </>
    )
}
