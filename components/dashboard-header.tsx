"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Search, MapPin, LogOut, User, ChevronDown, X } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  title: string
}

interface Notificacion {
  id: string
  titulo: string
  descripcion: string
  tipo: string
  leida: boolean
  createdAt: string
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)

  const searchResults = searchQuery.length > 0
    ? [
        { type: "Orden", label: "RS-OS-1024", subtitle: "Juan Pérez - HP Pavilion 15" },
        { type: "Cliente", label: "Juan Pérez", subtitle: "Tels: 555-1234" },
        { type: "Equipo", label: "HP Pavilion 15", subtitle: "S/N: HPV15-2024-001" },
        { type: "SKU", label: "RAM-DDR4-8GB", subtitle: "Stock: 12 unidades" },
        { type: "Técnico", label: "Carlos Gómez", subtitle: "15 órdenes activas" },
      ].filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  // Obtener notificaciones de la base de datos
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        const response = await fetch(`/api/notificaciones?usuarioId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setNotifications(data)
        }
      } catch (error) {
        console.error("Error al cargar notificaciones:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
    
    // Actualizar notificaciones cada 30 segundos
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [user?.id])

  const marcarComoLeida = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notificaciones/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leida: true })
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, leida: true } : n)
        )
      }
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return "Hace un momento"
    if (diffMins < 60) return `Hace ${diffMins} min`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
    
    const diffDays = Math.floor(diffHours / 24)
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
  }

  const unreadCount = notifications.filter((n) => !n.leida).length

  return (
    <>
      <header className="h-14 bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 gap-4">
        <div className="flex-1 max-w-md relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Buscar órdenes, clientes, equipos, SKU..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSearchResults(e.target.value.length > 0)
              }}
              className="pl-10 pr-8 h-9 bg-slate-800/40 backdrop-blur-sm border-white/5 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setShowSearchResults(false)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-lg shadow-xl backdrop-blur-xl z-50 overflow-hidden">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                  onClick={() => {
                    setSearchQuery("")
                    setShowSearchResults(false)
                  }}
                >
                  <Badge
                    variant="secondary"
                    className="mt-0.5 bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px]"
                  >
                    {result.type}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-200">{result.label}</div>
                    <div className="text-xs text-slate-500">{result.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Select defaultValue="sede-a">
            <SelectTrigger className="h-9 w-[130px] bg-slate-800/40 backdrop-blur-sm border-white/5 text-slate-100 text-sm hover:bg-slate-800/60 transition-all duration-200">
              <MapPin className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 backdrop-blur-xl">
              <SelectItem value="sede-a" className="text-slate-300 focus:bg-white/5">
                Sede A
              </SelectItem>
              <SelectItem value="sede-b" className="text-slate-300 focus:bg-white/5">
                Sede B
              </SelectItem>
              <SelectItem value="sede-c" className="text-slate-300 focus:bg-white/5">
                Sede C
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNotificationsOpen(true)}
            className="relative h-9 w-9 text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 rounded-full ring-2 ring-slate-900 flex items-center justify-center text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-9 px-2 hover:bg-white/5 transition-all duration-200 rounded-full"
              >
                <Avatar className="h-7 w-7 bg-gradient-to-br from-indigo-600 to-violet-600 ring-2 ring-white/10">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-xs font-semibold">
                    {user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-medium text-slate-100">{user?.name}</div>
                  <div className="text-[10px] text-slate-500">{user?.role}</div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500 hidden lg:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-white/10 backdrop-blur-xl">
              <DropdownMenuLabel className="text-slate-100">Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem className="text-slate-300 hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <SheetContent className="bg-slate-950/95 backdrop-blur-xl border-white/10 w-[400px]">
          <SheetHeader>
            <SheetTitle className="text-slate-100">Notificaciones</SheetTitle>
            <SheetDescription className="text-slate-400">
              Tienes {unreadCount} {unreadCount === 1 ? "notificación nueva" : "notificaciones nuevas"}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            {loading ? (
              <p className="text-slate-400 text-sm text-center py-8">Cargando notificaciones...</p>
            ) : notifications.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No tienes notificaciones</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:bg-white/5 cursor-pointer ${
                    !notification.leida
                      ? "bg-indigo-500/5 border-indigo-500/20"
                      : "bg-slate-900/50 border-white/5"
                  }`}
                  onClick={() => marcarComoLeida(notification.id)}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-slate-200">{notification.titulo}</h4>
                    {!notification.leida && (
                      <div className="h-2 w-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{notification.descripcion}</p>
                  <p className="text-[10px] text-slate-500">{getTimeAgo(notification.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
