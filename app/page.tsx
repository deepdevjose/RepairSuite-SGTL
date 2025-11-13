"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Wrench, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"Administrador" | "Recepción" | "Técnico">("Administrador")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email) {
      newErrors.email = "El correo es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El correo no es válido"
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    const success = await login(email, password, role)
    setIsLoading(false)

    if (success) {
      router.push("/dashboard")
    } else {
      setErrors({ general: "Error al iniciar sesión. Verifica tus credenciales." })
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="space-y-6 max-w-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-600 p-3">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">RepairSuite</h1>
              <p className="text-sm text-indigo-400">SGTL</p>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-100 leading-tight">Sistema de Gestión de Taller de Laptops</h2>
            <p className="text-lg text-slate-400">Plataforma profesional para la gestión integral de JLaboratories</p>
            <p className="text-sm text-slate-500">Acceso exclusivo para personal autorizado del taller</p>
          </div>
          <div className="pt-6 space-y-3 border-t border-slate-800">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />
              <span>Gestión de órdenes de servicio</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="h-2 w-2 rounded-full bg-violet-500" />
              <span>Control de inventario en tiempo real</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Administración de clientes y equipos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <Card className="w-full max-w-md bg-slate-900 border-slate-800 p-8 shadow-2xl">
          <div className="mb-8 text-center lg:hidden">
            <div className="mb-4 flex justify-center">
              <div className="rounded-lg bg-indigo-600 p-3">
                <Wrench className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">RepairSuite</h1>
            <p className="text-sm text-slate-400">Sistema de Gestión de Taller</p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-100">Iniciar sesión</h2>
            <p className="text-sm text-slate-400 mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          {errors.general && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Correo electrónico <span className="text-red-400">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className={`bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Contraseña <span className="text-red-400">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-200">
                Rol <span className="text-red-400">*</span>
              </Label>
              <Select value={role} onValueChange={(value: any) => setRole(value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Recepción">Recepción</SelectItem>
                  <SelectItem value="Técnico">Técnico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>

            <div className="text-center">
              <button type="button" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-500 text-center">Demo: admin@repairsuite.com / admin123</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
