"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  LayoutDashboard,
  Users,
  Laptop,
  ClipboardList,
  Package,
  BookOpen,
  Truck,
  UserCog,
  DollarSign,
  Shield,
  Settings,
  Wrench,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  permission: string
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard" },
  { title: "Clientes", href: "/dashboard/clientes", icon: Users, permission: "clientes" },
  { title: "Equipos", href: "/dashboard/equipos", icon: Laptop, permission: "equipos" },
  {
    title: "Órdenes de Servicio",
    href: "/dashboard/ordenes",
    icon: ClipboardList,
    permission: "ordenes",
  },
  { title: "Inventario", href: "/dashboard/inventario", icon: Package, permission: "inventario" },
  { title: "Catálogo", href: "/dashboard/catalogo", icon: BookOpen, permission: "catalogo" },
  {
    title: "Proveedores",
    href: "/dashboard/proveedores",
    icon: Truck,
    permission: "proveedores",
  },
  { title: "Personal", href: "/dashboard/personal", icon: UserCog, permission: "personal" },
  { title: "Ventas y Pagos", href: "/dashboard/ventas", icon: DollarSign, permission: "ventas" },
  { title: "Garantías", href: "/dashboard/garantias", icon: Shield, permission: "garantias" },
  {
    title: "Configuración",
    href: "/dashboard/configuracion",
    icon: Settings,
    permission: "configuracion",
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { hasPermission } = useAuth()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="rounded-lg bg-indigo-600 p-2">
          <Wrench className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100">RepairSuite</h1>
          <p className="text-xs text-indigo-400">SGTL</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            if (!hasPermission(item.permission)) return null

            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-slate-800 text-slate-100 border-l-2 border-indigo-500 pl-[10px]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-400",
                  )}
                />
                <span className="truncate">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 text-center">JLaboratories © 2025</div>
      </div>
    </aside>
  )
}
