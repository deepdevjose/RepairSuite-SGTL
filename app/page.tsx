"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Lock, Shield, Sparkles, User, FileText, Wrench } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const validateEmail = (value: string) => {
    if (!value) {
      return "El correo es obligatorio"
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      return "El correo no es válido"
    }
    return ""
  }

  const validatePassword = (value: string) => {
    if (!value) {
      return "La contraseña es obligatoria"
    }
    if (value.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres"
    }
    return ""
  }

  const handleEmailBlur = () => {
    setTouched({ ...touched, email: true })
    const error = validateEmail(email)
    setErrors({ ...errors, email: error })
  }

  const handlePasswordBlur = () => {
    setTouched({ ...touched, password: true })
    const error = validatePassword(password)
    setErrors({ ...errors, password: error })
  }

  useEffect(() => {
    if (touched.email) {
      const error = validateEmail(email)
      setErrors((prev) => ({ ...prev, email: error }))
    }
  }, [email, touched.email])

  useEffect(() => {
    if (touched.password) {
      const error = validatePassword(password)
      setErrors((prev) => ({ ...prev, password: error }))
    }
  }, [password, touched.password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError })
      setTouched({ email: true, password: true })
      return
    }

    setIsLoading(true)
    const success = await login(email, password)
    setIsLoading(false)

    if (success) {
      router.push("/dashboard")
    } else {
      setErrors({ general: "Error al iniciar sesión. Verifica tus credenciales." })
    }
  }

  const handleAutofill = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setTouched({})
    setErrors({})
  }

  const isFormValid = email && password && !errors.email && !errors.password

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Left Column */}
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
          <div className="flex items-center gap-4 mb-12">
            <img
              src="/images/logo-no-background.png"
              alt="RepairSuite Logo"
              className="h-24 w-24 object-contain drop-shadow-[0_0_35px_rgba(139,92,246,0.7)]"
            />
            <div>
              <h1 className="text-3xl font-bold text-slate-100">RepairSuite</h1>
              <p className="text-sm text-indigo-400 font-semibold tracking-wider">SGTL</p>
            </div>
          </div>

          <div className="space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-slate-100 leading-tight">
              RepairSuite — SGTL
            </h2>
            <p className="text-lg text-slate-300">
              Sistema profesional para gestión integral de talleres de reparación
            </p>
          </div>

          <div className="space-y-4 mb-12">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-indigo-400/70 flex-shrink-0 mt-0.5 stroke-[1.5]" />
              <p className="text-slate-300 text-base">Gestión de órdenes centralizada</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-indigo-400/70 flex-shrink-0 mt-0.5 stroke-[1.5]" />
              <p className="text-slate-300 text-base">Inventario en tiempo real</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-indigo-400/70 flex-shrink-0 mt-0.5 stroke-[1.5]" />
              <p className="text-slate-300 text-base">Diagnóstico, cotización y reparación optimizados</p>
            </div>
          </div>

          <div className="mb-12 p-6 rounded-xl bg-gradient-to-br from-indigo-950/40 to-purple-950/30 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">Funciones principales del sistema</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-2" />
                <span>Registrar y dar seguimiento a órdenes de servicio</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-2" />
                <span>Gestionar clientes, equipos y garantías</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-2" />
                <span>Controlar inventario de piezas y repuestos</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-2" />
                <span>Generar reportes y estadísticas del taller</span>
              </li>
            </ul>
          </div>

          <div className="inline-flex flex-col bg-indigo-950/40 border border-indigo-500/20 rounded-lg px-6 py-4">
            <span className="text-4xl font-bold text-indigo-400">+120</span>
            <span className="text-slate-400 text-sm mt-1">Órdenes procesadas mensualmente en promedio</span>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 lg:p-12 bg-slate-950">
        <div className={`w-full max-w-[480px] transition-all duration-700 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="mb-10 lg:hidden">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img
                src="/images/logo-no-background.png"
                alt="RepairSuite Logo"
                className="h-20 w-20 object-contain drop-shadow-[0_0_30px_rgba(139,92,246,0.7)]"
              />
              <div>
                <h1 className="text-2xl font-bold text-slate-100">RepairSuite</h1>
                <p className="text-xs text-indigo-400 font-semibold">SGTL</p>
              </div>
            </div>
          </div>

          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800 p-10 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-100 mb-2">Iniciar sesión</h2>
              <p className="text-slate-400 text-sm">Accede con tus credenciales asignadas por JLaboratories</p>
            </div>

            <div className="mb-6 flex items-start gap-3 rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-3">
              <Shield className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-green-400 font-semibold mb-0.5">Conexión cifrada (TLS 1.3)</p>
                <p className="text-green-400/80">Acceso seguro únicamente para personal autorizado</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200 text-sm font-medium">
                  Correo electrónico <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  placeholder="tu@email.com"
                  className={`h-12 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    errors.email && touched.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                  }`}
                />
                {errors.email && touched.email && (
                  <p className="text-sm text-red-400 flex items-center gap-1.5 animate-fade-in">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200 text-sm font-medium">
                  Contraseña <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordBlur}
                  placeholder="••••••••"
                  className={`h-12 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    errors.password && touched.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                  }`}
                />
                {errors.password && touched.password && (
                  <p className="text-sm text-red-400 flex items-center gap-1.5 animate-fade-in">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white text-base font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-600/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4 animate-pulse" />
                    Verificando credenciales...
                  </span>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 rounded-lg px-5 py-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-indigo-200 mb-1">Demo rápida (solo lectura)</p>
                    <p className="text-xs text-slate-400">
                      Prueba el sistema con cualquiera de estas cuentas de demostración:
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Administrador */}
                  <div className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-4 hover:border-indigo-500/40 transition-colors group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                          <Shield className="h-4 w-4 text-indigo-400 stroke-[1.5]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm font-semibold text-slate-200">Administrador</p>
                            <span className="px-2 py-0.5 text-[10px] font-medium bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                              ADMIN
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-xs text-slate-400 truncate">
                              <span className="text-slate-500">Email:</span>{" "}
                              <code className="text-slate-300 font-mono">demo.admin@repairsuite.com</code>
                            </p>
                            <p className="text-xs text-slate-400">
                              <span className="text-slate-500">Contraseña:</span>{" "}
                              <code className="text-slate-300 font-mono">admin123</code>
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAutofill("demo.admin@repairsuite.com", "admin123")}
                        className="flex-shrink-0 h-8 px-3 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-medium shadow-sm hover:shadow-md transition-all"
                      >
                        Autocompletar
                      </Button>
                    </div>
                  </div>

                  {/* Recepción */}
                  <div className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-4 hover:border-blue-500/40 transition-colors group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                          <FileText className="h-4 w-4 text-blue-400 stroke-[1.5]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm font-semibold text-slate-200">Recepción</p>
                            <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                              FRONT
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-xs text-slate-400 truncate">
                              <span className="text-slate-500">Email:</span>{" "}
                              <code className="text-slate-300 font-mono">demo.recepcion@repairsuite.com</code>
                            </p>
                            <p className="text-xs text-slate-400">
                              <span className="text-slate-500">Contraseña:</span>{" "}
                              <code className="text-slate-300 font-mono">recep123</code>
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAutofill("demo.recepcion@repairsuite.com", "recep123")}
                        className="flex-shrink-0 h-8 px-3 bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-medium shadow-sm hover:shadow-md transition-all"
                      >
                        Autocompletar
                      </Button>
                    </div>
                  </div>

                  {/* Técnico */}
                  <div className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-4 hover:border-purple-500/40 transition-colors group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                          <Wrench className="h-4 w-4 text-purple-400 stroke-[1.5]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm font-semibold text-slate-200">Técnico</p>
                            <span className="px-2 py-0.5 text-[10px] font-medium bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                              TECH
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-xs text-slate-400 truncate">
                              <span className="text-slate-500">Email:</span>{" "}
                              <code className="text-slate-300 font-mono">demo.tecnico@repairsuite.com</code>
                            </p>
                            <p className="text-xs text-slate-400">
                              <span className="text-slate-500">Contraseña:</span>{" "}
                              <code className="text-slate-300 font-mono">tech123</code>
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAutofill("demo.tecnico@repairsuite.com", "tech123")}
                        className="flex-shrink-0 h-8 px-3 bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-medium shadow-sm hover:shadow-md transition-all"
                      >
                        Autocompletar
                      </Button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 text-center mt-4 leading-relaxed">
                  Estas cuentas son solo para pruebas de interfaz. No representan datos reales.
                </p>
              </div>
            </div>
          </Card>

          <p className="text-center text-xs text-slate-600 mt-6">
            Sistema interno de JLaboratories — RepairSuite 2025
          </p>
        </div>
      </div>
    </div>
  )
}
