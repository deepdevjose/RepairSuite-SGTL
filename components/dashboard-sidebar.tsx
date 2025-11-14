"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { LayoutDashboard, Users, Laptop, ClipboardList, Package, BookOpen, Truck, UserCog, DollarSign, Shield, Settings } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  permission: string
  section: string
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard", section: "Actividad" },
  { title: "Clientes", href: "/dashboard/clientes", icon: Users, permission: "clientes", section: "Actividad" },
  { title: "Equipos", href: "/dashboard/equipos", icon: Laptop, permission: "equipos", section: "Actividad" },
  {
    title: "Órdenes de Servicio",
    href: "/dashboard/ordenes",
    icon: ClipboardList,
    permission: "ordenes",
    section: "Actividad",
  },
  { title: "Inventario", href: "/dashboard/inventario", icon: Package, permission: "inventario", section: "Operación" },
  { title: "Catálogo", href: "/dashboard/catalogo", icon: BookOpen, permission: "catalogo", section: "Operación" },
  {
    title: "Proveedores",
    href: "/dashboard/proveedores",
    icon: Truck,
    permission: "proveedores",
    section: "Operación",
  },
  { title: "Ventas y Pagos", href: "/dashboard/ventas", icon: DollarSign, permission: "ventas", section: "Operación" },
  { title: "Garantías", href: "/dashboard/garantias", icon: Shield, permission: "garantias", section: "Operación" },
  { title: "Personal", href: "/dashboard/personal", icon: UserCog, permission: "personal", section: "Administración" },
  {
    title: "Configuración",
    href: "/dashboard/configuracion",
    icon: Settings,
    permission: "configuracion",
    section: "Administración",
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { hasPermission } = useAuth()

  const groupedItems = navItems.reduce(
    (acc, item) => {
      if (!hasPermission(item.permission)) return acc
      if (!acc[item.section]) acc[item.section] = []
      acc[item.section].push(item)
      return acc
    },
    {} as Record<string, NavItem[]>,
  )

  const getBadgeCount = (title: string): number | null => {
    if (title === "Órdenes de Servicio") return 8 // Pending approvals
    if (title === "Inventario") return 5 // Critical items
    return null
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950/80 backdrop-blur-xl border-r border-white/5 flex flex-col">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
        <img
          src="/images/logo-no-background.png"
          alt="RepairSuite Logo"
          className="h-7 w-7 object-contain drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]"
        />
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            RepairSuite
          </h1>
          <p className="text-xs text-indigo-400/80">SGTL</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} className="mb-6">
            <div className="px-3 mb-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{section}</h3>
            </div>
            <div className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                const badgeCount = getBadgeCount(item.title)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-out group relative",
                      isActive
                        ? "bg-white/5 text-slate-100 shadow-lg shadow-indigo-500/10 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:rounded-r-full before:bg-gradient-to-b before:from-indigo-500 before:to-violet-500"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5 hover:scale-[1.01]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0 transition-all duration-200",
                        isActive
                          ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                          : "text-slate-500 group-hover:text-slate-400 opacity-60 group-hover:opacity-100",
                      )}
                    />
                    <span className="truncate flex-1">{item.title}</span>
                    {badgeCount !== null && (
                      <Badge
                        variant="secondary"
                        className="h-5 min-w-5 px-1.5 bg-red-500/20 text-red-300 border-red-500/30 text-[10px] font-semibold"
                      >
                        {badgeCount}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="text-xs text-slate-500 text-center font-medium">JLaboratories © 2025</div>
      </div>
    </aside>
  )
}
