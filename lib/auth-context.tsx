"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from 'next/navigation'

type UserRole = "Administrador" | "Recepción" | "Técnico"

interface User {
  id: string
  email: string
  role: UserRole
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  hasPermission: (module: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Permission mapping for each role
const rolePermissions: Record<UserRole, string[]> = {
  Administrador: [
    "dashboard",
    "clientes",
    "equipos",
    "ordenes",
    "inventario",
    "catalogo",
    "proveedores",
    "personal",
    "ventas",
    "garantias",
    "configuracion",
  ],
  Recepción: ["dashboard", "clientes", "equipos", "ordenes", "ventas"],
  Técnico: ["dashboard", "ordenes", "equipos", "inventario", "garantias"],
}

// JLaboratories users database
const JLAB_USERS = [
  {
    id: "user-admin-001",
    email: "admin@jlaboratories.com",
    password: "JoseAdmin",
    name: "Jose Manuel Cortes Ceron",
    role: "Administrador" as UserRole,
  },
  {
    id: "user-tech-001",
    email: "jose.tecnico@jlaboratories.com",
    password: "JoseTech",
    name: "Jose Manuel Cortes Ceron",
    role: "Técnico" as UserRole,
  },
  {
    id: "user-tech-002",
    email: "kevis.salas@jlaboratories.com",
    password: "KevinTech",
    name: "Kevis Salas Jimenez",
    role: "Técnico" as UserRole,
  },
  {
    id: "user-recep-001",
    email: "adriana.ceron@jlaboratories.com",
    password: "Adri123",
    name: "Adriana Ceron Madrigal",
    role: "Recepción" as UserRole,
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("repairsuite_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Validate against JLaboratories user database
    const user = JLAB_USERS.find(u => u.email === email && u.password === password)

    if (user) {
      const userData: User = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      }
      setUser(userData)
      localStorage.setItem("repairsuite_user", JSON.stringify(userData))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("repairsuite_user")
    router.push("/")
  }

  const hasPermission = (module: string): boolean => {
    if (!user) return false
    return rolePermissions[user.role].includes(module)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
