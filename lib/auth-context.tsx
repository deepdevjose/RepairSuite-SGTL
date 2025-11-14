"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from 'next/navigation'

type UserRole = "Administrador" | "Recepción" | "Técnico"

interface User {
  email: string
  role: UserRole
  name: string
  sucursal: string
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

const getRoleFromEmail = (email: string): UserRole => {
  // Check for specific demo emails first
  if (email === "demo.admin@repairsuite.com") {
    return "Administrador"
  }
  if (email === "demo.recepcion@repairsuite.com") {
    return "Recepción"
  }
  if (email === "demo.tecnico@repairsuite.com") {
    return "Técnico"
  }
  
  // Fallback to pattern matching for other emails
  if (email.includes("admin") || email.includes("director") || email.includes("gerente")) {
    return "Administrador"
  }
  if (email.includes("recepcion") || email.includes("reception") || email.includes("front")) {
    return "Recepción"
  }
  return "Técnico"
}

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
    // Simulate login - in real app, this would be an API call
    if (email && password.length >= 6) {
      const role = getRoleFromEmail(email)
      const userData: User = {
        email,
        role,
        name: email.split("@")[0],
        sucursal: "Sede A",
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
