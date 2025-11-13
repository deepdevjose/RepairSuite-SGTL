"use client"

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
import { Bell, Search, MapPin, LogOut, User, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DashboardHeaderProps {
  title: string
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="h-14 bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 gap-4">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar órdenes, clientes, equipos..."
            className="pl-10 h-9 bg-slate-800/40 backdrop-blur-sm border-white/5 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all duration-200"
          />
        </div>
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
          className="relative h-9 w-9 text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-red-500 rounded-full ring-2 ring-slate-900" />
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
  )
}
