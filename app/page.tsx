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
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 py-16 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/50 relative overflow-hidden">
        {/* Animated floating blobs - Apple wallpaper style */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Blob 1 - Purple */}
          <div
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-full blur-3xl animate-blob-1"
            style={{ willChange: "transform" }}
          />
          {/* Blob 2 - Blue */}
          <div
            className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/25 to-indigo-600/25 rounded-full blur-3xl animate-blob-2"
            style={{ willChange: "transform" }}
          />
          {/* Blob 3 - Indigo */}
          <div
            className="absolute bottom-1/4 left-1/3 w-[550px] h-[550px] bg-gradient-to-br from-indigo-600/20 to-violet-600/20 rounded-full blur-3xl animate-blob-3"
            style={{ willChange: "transform" }}
          />
        </div>

        <div className="relative z-10 max-w-lg">
          {/* Logo and name - cleaner design */}
          <div className="flex items-center gap-3 mb-12">
            <div className="rounded-lg bg-indigo-600 p-2.5">
              <Wrench className="h-7 w-7 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">RepairSuite</h1>
              <p className="text-xs text-indigo-400 font-semibold tracking-wider">SGTL</p>
            </div>
          </div>

          {/* Title and subtitle */}
          <div className="space-y-3 mb-12">
            <h2 className="text-4xl font-bold text-slate-100 leading-tight">Sistema de Gestión de Taller de Laptops</h2>
            <p className="text-lg text-slate-400">Plataforma profesional para JLaboratories</p>
          </div>

          {/* 3 simple bullets - no cards, just clean list */}
          <div className="space-y-4 mb-10">
            <div className="flex items-start gap-3">
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              <p className="text-slate-300 text-base">Órdenes de servicio centralizadas</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              <p className="text-slate-300 text-base">Control de inventario en tiempo real</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              <p className="text-slate-300 text-base">Flujo por roles (Admin, Recepción, Técnico)</p>
            </div>
          </div>

          {/* ONE strong metric */}
          <div className="inline-flex items-baseline gap-2 bg-indigo-950/40 border border-indigo-500/20 rounded-lg px-5 py-3">
            <span className="text-4xl font-bold text-indigo-400">+120</span>
            <span className="text-slate-400 text-sm">órdenes procesadas mensualmente</span>
          </div>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 lg:p-12 bg-slate-950">
        <div className="w-full max-w-[460px]">
          {/* Mobile branding - compact */}
          <div className="mb-10 lg:hidden">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="rounded-lg bg-indigo-600 p-2">
                <Wrench className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100">RepairSuite</h1>
                <p className="text-xs text-indigo-400 font-semibold">SGTL</p>
              </div>
            </div>
            <p className="text-center text-sm text-slate-400">Sistema de Gestión de Taller de Laptops</p>
          </div>

          <Card className="bg-slate-900 border-slate-800 p-10 shadow-2xl">
            {/* Header - larger title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-100 mb-2">Iniciar sesión</h2>
              <p className="text-slate-400">Ingresa tus credenciales para continuar</p>
            </div>

            {errors.general && (
              <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200 text-sm font-medium">
                  Correo electrónico <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className={`h-12 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 ${
                    errors.email ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200 text-sm font-medium">
                  Contraseña <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`h-12 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 ${
                    errors.password ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.password && (
                  <p className="text-sm text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-200 text-sm font-medium">
                  Rol <span className="text-red-400">*</span>
                </Label>
                <Select value={role} onValueChange={(value: any) => setRole(value)}>
                  <SelectTrigger className="h-12 bg-slate-800 border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="Administrador" className="text-slate-100">
                      Administrador
                    </SelectItem>
                    <SelectItem value="Recepción" className="text-slate-100">
                      Recepción
                    </SelectItem>
                    <SelectItem value="Técnico" className="text-slate-100">
                      Técnico
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white text-base font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:shadow-indigo-600/30"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>

              <div className="text-center">
                <button type="button" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="bg-slate-950/50 rounded-lg px-4 py-3">
                <p className="text-xs text-slate-500 mb-1.5">Demo rápida:</p>
                <p className="text-xs text-slate-400 font-mono">admin@repairsuite.com / admin123</p>
              </div>
            </div>
          </Card>

          {/* Footer text */}
          <p className="text-center text-xs text-slate-600 mt-6">Solo para personal autorizado de JLaboratories</p>
        </div>
      </div>
    </div>
  )
}
